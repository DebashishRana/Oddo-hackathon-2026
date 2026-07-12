import { auditRepository, type CreateAuditCycleInput } from "../../db/repositories/audit.repository";
import { assetRepository } from "../../db/repositories/asset.repository";
import { AppError } from "../../utils/errors";
import { activityService } from "../../services/activity.service";

export const auditsService = {
  async list() {
    return auditRepository.list();
  },

  async getById(id: number) {
    const cycle = await auditRepository.findById(id);
    if (!cycle) throw new AppError("Audit cycle not found", 404, "NOT_FOUND", "Audit cycle not found.");

    const items = await auditRepository.getItems(id);
    return { ...cycle, items };
  },

  async create(input: CreateAuditCycleInput, actorId?: number) {
    const cycle = await auditRepository.create({ ...input, createdBy: actorId ?? null });
    await activityService.log({
      actorId,
      action: "audit.created",
      entityType: "audit_cycle",
      entityId: cycle.id,
      metadata: { name: cycle.name },
    });

    if (input.auditorIds?.length) {
      await activityService.notifyMany(
        input.auditorIds.map((userId) => ({
          userId,
          type: "audit_assigned",
          title: "Audit cycle assigned",
          body: `You were assigned as an auditor for "${cycle.name}".`,
          entityType: "audit_cycle",
          entityId: cycle.id,
        }))
      );
    }

    return cycle;
  },

  async markItem(cycleId: number, assetId: number, result: "verified" | "missing" | "damaged", notes: string | null, userId: number, userRole: string) {
    const cycle = await auditRepository.findById(cycleId);
    if (!cycle) throw new AppError("Audit cycle not found", 404, "NOT_FOUND", "Audit cycle not found.");
    if (cycle.status === "closed") throw new AppError("Audit cycle is closed", 400, "INVALID_STATE", "Cannot mark items on a closed audit cycle.");

    const isAuditor = await auditRepository.isAuditor(cycleId, userId);
    if (!isAuditor && !["admin", "asset_manager"].includes(userRole)) {
      throw new AppError("Not authorized to mark this audit", 403, "FORBIDDEN", "You are not assigned as an auditor for this cycle.");
    }

    const item = await auditRepository.markItem(cycleId, assetId, result, notes, userId);
    if (!item) throw new AppError("Audit item not found", 404, "NOT_FOUND", "Asset is not in this audit cycle.");

    await activityService.log({
      actorId: userId,
      action: "audit.item_marked",
      entityType: "audit_item",
      entityId: item.id,
      metadata: { cycleId, assetId, result },
    });

    if (result === "missing" || result === "damaged") {
      await activityService.notifyRoles(
        ["admin", "asset_manager"],
        {
          type: "audit_discrepancy",
          title: "Audit discrepancy flagged",
          body: `Asset #${assetId} marked ${result} in audit "${cycle.name}".`,
          entityType: "audit_cycle",
          entityId: cycleId,
        },
        userId
      );
    }

    return item;
  },

  async closeCycle(id: number, actorId: number) {
    const cycle = await auditRepository.findById(id);
    if (!cycle) throw new AppError("Audit cycle not found", 404, "NOT_FOUND", "Audit cycle not found.");
    if (cycle.status === "closed") throw new AppError("Already closed", 400, "INVALID_STATE", "Audit cycle is already closed.");

    // Mark missing assets as lost
    const missingItems = await auditRepository.getMissingItems(id);
    for (const item of missingItems) {
      const asset = await assetRepository.findById(item.asset_id);
      if (asset && asset.status !== "lost") {
        await assetRepository.update(item.asset_id, { status: "lost" });
        await assetRepository.addStatusHistory(item.asset_id, asset.status, "lost", actorId, `Marked lost during audit cycle #${id}`);
      }
    }

    const closed = await auditRepository.closeCycle(id);
    const allItems = await auditRepository.getItems(id);

    // Discrepancy list = missing + damaged
    const discrepancies = allItems.filter((i) => i.result === "missing" || i.result === "damaged");

    await activityService.log({
      actorId,
      action: "audit.closed",
      entityType: "audit_cycle",
      entityId: id,
      metadata: { missingCount: missingItems.length, discrepancyCount: discrepancies.length },
    });

    await activityService.notifyRoles(
      ["admin", "asset_manager"],
      {
        type: "audit_closed",
        title: "Audit cycle closed",
        body: `"${cycle.name}" closed with ${discrepancies.length} discrepancy(ies). Missing assets marked Lost.`,
        entityType: "audit_cycle",
        entityId: id,
      },
      actorId
    );

    return { cycle: closed, discrepancies };
  },
};
