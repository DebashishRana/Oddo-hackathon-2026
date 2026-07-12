import { allocationRepository, type CreateAllocationInput } from "../../db/repositories/allocation.repository";
import { assetRepository } from "../../db/repositories/asset.repository";
import { AppError } from "../../utils/errors";
import { activityService } from "../../services/activity.service";

export const allocationsService = {
  async list(filters: Parameters<typeof allocationRepository.list>[0] = {}) {
    return allocationRepository.list(filters);
  },

  async getOverdue() {
    return allocationRepository.listOverdue();
  },

  async allocate(input: CreateAllocationInput & { allocatedBy?: number }) {
    const asset = await assetRepository.findById(input.assetId);
    if (!asset) throw new AppError("Asset not found", 404, "NOT_FOUND", "Asset not found.");

    if (asset.status !== "available") {
      const existing = await allocationRepository.findActiveByAsset(input.assetId);
      const holderName = existing?.user_name ?? "another party";
      throw new AppError(
        `Asset already allocated`,
        409,
        "ASSET_UNAVAILABLE",
        `This asset is currently held by ${holderName}. Use Transfer Request instead of allocating again.`
      );
    }

    const allocation = await allocationRepository.create(input);
    await assetRepository.update(input.assetId, { status: "allocated" });
    await assetRepository.addStatusHistory(input.assetId, "available", "allocated", input.allocatedBy ?? null, "Allocated to user/department");

    await activityService.log({
      actorId: input.allocatedBy,
      action: "allocation.created",
      entityType: "allocation",
      entityId: allocation.id,
      metadata: { assetId: input.assetId, toUserId: input.allocatedToUserId, toDeptId: input.allocatedToDepartmentId },
    });

    return allocation;
  },

  async returnAllocation(id: number, notes: string | null, actorId?: number) {
    const allocation = await allocationRepository.findById(id);
    if (!allocation) throw new AppError("Allocation not found", 404, "NOT_FOUND", "Allocation not found.");
    if (allocation.status !== "active") throw new AppError("Allocation is not active", 400, "INVALID_STATE", "This allocation is not active.");

    const returned = await allocationRepository.markReturned(id, notes);
    await assetRepository.update(allocation.asset_id, { status: "available" });
    await assetRepository.addStatusHistory(allocation.asset_id, "allocated", "available", actorId ?? null, notes ?? "Returned");

    await activityService.log({
      actorId,
      action: "allocation.returned",
      entityType: "allocation",
      entityId: id,
      metadata: { assetId: allocation.asset_id, notes },
    });

    return returned;
  },
};
