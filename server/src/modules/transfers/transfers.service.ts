import { transferRepository, type CreateTransferInput } from "../../db/repositories/transfer.repository";
import { allocationRepository } from "../../db/repositories/allocation.repository";
import { assetRepository } from "../../db/repositories/asset.repository";
import { AppError } from "../../utils/errors";
import { activityService } from "../../services/activity.service";

export const transfersService = {
  async list(filters: Parameters<typeof transferRepository.list>[0] = {}) {
    return transferRepository.list(filters);
  },

  async request(input: CreateTransferInput) {
    const asset = await assetRepository.findById(input.assetId);
    if (!asset) throw new AppError("Asset not found", 404, "NOT_FOUND", "Asset not found.");

    if (!["allocated", "available"].includes(asset.status)) {
      throw new AppError(
        `Asset cannot be transferred in status: ${asset.status}`,
        400,
        "INVALID_STATE",
        `Asset cannot be transferred while it is ${asset.status}.`
      );
    }

    if (!input.toUserId && !input.toDepartmentId) {
      throw new AppError("Must specify to_user_id or to_department_id", 400, "VALIDATION_ERROR", "Transfer destination required.");
    }

    const transfer = await transferRepository.create(input);
    await activityService.log({
      actorId: input.requestedBy,
      action: "transfer.requested",
      entityType: "transfer",
      entityId: transfer.id,
      metadata: { assetId: input.assetId },
    });

    await activityService.notifyRoles(
      ["admin", "asset_manager", "department_head"],
      {
        type: "transfer_requested",
        title: "Transfer request pending",
        body: `Transfer requested for ${asset.name} (${asset.asset_tag}).`,
        entityType: "transfer",
        entityId: transfer.id,
      },
      input.requestedBy
    );

    return transfer;
  },

  async approve(id: number, approvedBy: number) {
    const transfer = await transferRepository.findById(id);
    if (!transfer) throw new AppError("Transfer request not found", 404, "NOT_FOUND", "Transfer request not found.");
    if (transfer.status !== "requested") throw new AppError("Transfer is not pending", 400, "INVALID_STATE", "Transfer is not in requested state.");

    const asset = await assetRepository.findById(transfer.asset_id);
    if (!asset) throw new AppError("Asset not found", 404, "NOT_FOUND", "Asset not found.");

    // Mark existing active allocation as transferred
    if (transfer.from_allocation_id) {
      await allocationRepository.markTransferred(transfer.from_allocation_id);
    } else {
      const activeAllocation = await allocationRepository.findActiveByAsset(transfer.asset_id);
      if (activeAllocation) {
        await allocationRepository.markTransferred(activeAllocation.id);
      }
    }

    // Create new allocation for recipient
    const newAllocation = await allocationRepository.create({
      assetId: transfer.asset_id,
      allocatedToUserId: transfer.to_user_id,
      allocatedToDepartmentId: transfer.to_department_id,
      allocatedBy: approvedBy,
    });

    // Ensure asset stays allocated
    await assetRepository.update(transfer.asset_id, { status: "allocated" });
    await assetRepository.addStatusHistory(transfer.asset_id, asset.status, "allocated", approvedBy, `Transfer approved - new allocation #${newAllocation.id}`);

    const updated = await transferRepository.updateStatus(id, "completed", approvedBy);
    await activityService.log({
      actorId: approvedBy,
      action: "transfer.completed",
      entityType: "transfer",
      entityId: id,
      metadata: { assetId: transfer.asset_id, newAllocationId: newAllocation.id },
    });

    await activityService.notifyIfUser(transfer.requested_by, {
      type: "transfer_approved",
      title: "Transfer approved",
      body: `Your transfer request for ${asset.name} (${asset.asset_tag}) was approved.`,
      entityType: "transfer",
      entityId: id,
    });

    await activityService.notifyIfUser(transfer.to_user_id, {
      type: "asset_assigned",
      title: "Asset transferred to you",
      body: `${asset.name} (${asset.asset_tag}) has been transferred to you.`,
      entityType: "transfer",
      entityId: id,
    });

    return updated;
  },

  async reject(id: number, approvedBy: number, reason?: string) {
    const transfer = await transferRepository.findById(id);
    if (!transfer) throw new AppError("Transfer request not found", 404, "NOT_FOUND", "Transfer request not found.");
    if (transfer.status !== "requested") throw new AppError("Transfer is not pending", 400, "INVALID_STATE", "Transfer is not in requested state.");

    const updated = await transferRepository.updateStatus(id, "rejected", approvedBy);
    await activityService.log({
      actorId: approvedBy,
      action: "transfer.rejected",
      entityType: "transfer",
      entityId: id,
      metadata: { reason },
    });

    await activityService.notifyIfUser(transfer.requested_by, {
      type: "transfer_rejected",
      title: "Transfer rejected",
      body: reason
        ? `Your transfer request was rejected: ${reason}`
        : "Your transfer request was rejected.",
      entityType: "transfer",
      entityId: id,
    });

    return updated;
  },
};
