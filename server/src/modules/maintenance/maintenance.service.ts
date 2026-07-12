import { maintenanceRepository, type CreateMaintenanceInput } from "../../db/repositories/maintenance.repository";
import { assetRepository } from "../../db/repositories/asset.repository";
import { AppError } from "../../utils/errors";
import { activityService } from "../../services/activity.service";

export const maintenanceService = {
  async list(filters: Parameters<typeof maintenanceRepository.list>[0] = {}) {
    return maintenanceRepository.list(filters);
  },

  async create(input: CreateMaintenanceInput, actorId?: number) {
    const asset = await assetRepository.findById(input.assetId);
    if (!asset) throw new AppError("Asset not found", 404, "NOT_FOUND", "Asset not found.");

    const request = await maintenanceRepository.create(input);
    await activityService.log({
      actorId,
      action: "maintenance.requested",
      entityType: "maintenance",
      entityId: request.id,
      metadata: { assetId: input.assetId, priority: input.priority },
    });

    await activityService.notifyRoles(
      ["admin", "asset_manager"],
      {
        type: "maintenance_requested",
        title: "Maintenance request raised",
        body: `${asset.name} (${asset.asset_tag}): ${input.description.slice(0, 120)}`,
        entityType: "maintenance",
        entityId: request.id,
      },
      actorId
    );

    return request;
  },

  async approve(id: number, approvedBy: number) {
    const req = await maintenanceRepository.findById(id);
    if (!req) throw new AppError("Maintenance request not found", 404, "NOT_FOUND", "Maintenance request not found.");
    if (req.status !== "pending") throw new AppError("Cannot approve in current state", 400, "INVALID_STATE", "Request is not pending.");

    const updated = await maintenanceRepository.updateStatus(id, "approved", { approvedBy });

    // Set asset to under_maintenance
    const asset = await assetRepository.findById(req.asset_id);
    if (asset && asset.status !== "under_maintenance") {
      await assetRepository.update(req.asset_id, { status: "under_maintenance" });
      await assetRepository.addStatusHistory(req.asset_id, asset.status, "under_maintenance", approvedBy, `Maintenance #${id} approved`);
    }

    await activityService.log({
      actorId: approvedBy,
      action: "maintenance.approved",
      entityType: "maintenance",
      entityId: id,
      metadata: {},
    });

    await activityService.notifyIfUser(req.requested_by, {
      type: "maintenance_approved",
      title: "Maintenance approved",
      body: `Your maintenance request for ${req.asset_name ?? `asset #${req.asset_id}`} was approved. The asset is now under maintenance.`,
      entityType: "maintenance",
      entityId: id,
    });

    return updated;
  },

  async reject(id: number, approvedBy: number, rejectionReason?: string) {
    const req = await maintenanceRepository.findById(id);
    if (!req) throw new AppError("Maintenance request not found", 404, "NOT_FOUND", "Maintenance request not found.");
    if (req.status !== "pending") throw new AppError("Cannot reject in current state", 400, "INVALID_STATE", "Request is not pending.");

    const updated = await maintenanceRepository.updateStatus(id, "rejected", { approvedBy, rejectionReason: rejectionReason ?? null });
    await activityService.log({
      actorId: approvedBy,
      action: "maintenance.rejected",
      entityType: "maintenance",
      entityId: id,
      metadata: { reason: rejectionReason },
    });

    await activityService.notifyIfUser(req.requested_by, {
      type: "maintenance_rejected",
      title: "Maintenance rejected",
      body: rejectionReason
        ? `Your maintenance request was rejected: ${rejectionReason}`
        : "Your maintenance request was rejected.",
      entityType: "maintenance",
      entityId: id,
    });

    return updated;
  },

  async assignTechnician(id: number, technicianName: string, actorId: number) {
    const req = await maintenanceRepository.findById(id);
    if (!req) throw new AppError("Maintenance request not found", 404, "NOT_FOUND", "Maintenance request not found.");
    if (req.status !== "approved") throw new AppError("Cannot assign in current state", 400, "INVALID_STATE", "Request must be approved first.");

    if (!technicianName?.trim()) throw new AppError("Technician name required", 400, "VALIDATION_ERROR", "Technician name is required.");

    const updated = await maintenanceRepository.updateStatus(id, "technician_assigned", { technicianName: technicianName.trim() });
    await activityService.log({
      actorId,
      action: "maintenance.technician_assigned",
      entityType: "maintenance",
      entityId: id,
      metadata: { technicianName },
    });

    await activityService.notifyIfUser(req.requested_by, {
      type: "maintenance_assigned",
      title: "Technician assigned",
      body: `${technicianName.trim()} was assigned to your maintenance request.`,
      entityType: "maintenance",
      entityId: id,
    });

    return updated;
  },

  async start(id: number, actorId: number) {
    const req = await maintenanceRepository.findById(id);
    if (!req) throw new AppError("Maintenance request not found", 404, "NOT_FOUND", "Maintenance request not found.");
    if (req.status !== "technician_assigned") throw new AppError("Cannot start in current state", 400, "INVALID_STATE", "Technician must be assigned first.");

    const updated = await maintenanceRepository.updateStatus(id, "in_progress");
    await activityService.log({
      actorId,
      action: "maintenance.started",
      entityType: "maintenance",
      entityId: id,
      metadata: {},
    });
    return updated;
  },

  async resolve(id: number, actorId: number) {
    const req = await maintenanceRepository.findById(id);
    if (!req) throw new AppError("Maintenance request not found", 404, "NOT_FOUND", "Maintenance request not found.");
    if (req.status !== "in_progress") throw new AppError("Cannot resolve in current state", 400, "INVALID_STATE", "Request must be in progress.");

    const updated = await maintenanceRepository.updateStatus(id, "resolved", { resolvedAt: new Date() });

    // Return asset to available if it was under_maintenance
    const asset = await assetRepository.findById(req.asset_id);
    if (asset && asset.status === "under_maintenance") {
      await assetRepository.update(req.asset_id, { status: "available" });
      await assetRepository.addStatusHistory(req.asset_id, "under_maintenance", "available", actorId, `Maintenance #${id} resolved`);
    }

    await activityService.log({
      actorId,
      action: "maintenance.resolved",
      entityType: "maintenance",
      entityId: id,
      metadata: {},
    });

    await activityService.notifyIfUser(req.requested_by, {
      type: "maintenance_resolved",
      title: "Maintenance resolved",
      body: `Maintenance for ${req.asset_name ?? `asset #${req.asset_id}`} is resolved. The asset is available again.`,
      entityType: "maintenance",
      entityId: id,
    });

    return updated;
  },
};
