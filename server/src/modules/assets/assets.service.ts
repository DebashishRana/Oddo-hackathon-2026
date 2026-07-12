import { assetRepository, type CreateAssetInput, type UpdateAssetInput, type AssetFilters } from "../../db/repositories/asset.repository";
import { allocationRepository } from "../../db/repositories/allocation.repository";
import { maintenanceRepository } from "../../db/repositories/maintenance.repository";
import { AppError } from "../../utils/errors";
import { activityService } from "../../services/activity.service";
import type { AssetStatus } from "../../db/models";

const VALID_TRANSITIONS: Record<AssetStatus, AssetStatus[]> = {
  available: ["allocated", "reserved", "under_maintenance", "lost", "retired", "disposed"],
  allocated: ["available", "under_maintenance", "lost", "retired", "disposed"],
  reserved: ["available", "allocated", "under_maintenance", "lost", "retired", "disposed"],
  under_maintenance: ["available", "retired", "disposed"],
  lost: ["available"],
  retired: ["disposed"],
  disposed: [],
};

export const assetsService = {
  async list(filters: AssetFilters) {
    return assetRepository.list(filters);
  },

  async getById(id: number) {
    const asset = await assetRepository.findById(id);
    if (!asset) throw new AppError("Asset not found", 404, "NOT_FOUND", "Asset not found.");

    const allocationHistory = await allocationRepository.list({ assetId: id, limit: 20 });
    const maintenanceHistory = await maintenanceRepository.list({ assetId: id, limit: 20 });
    const statusHistory = await assetRepository.getStatusHistory(id);

    return { ...asset, allocationHistory, maintenanceHistory, statusHistory };
  },

  async create(input: CreateAssetInput, actorId?: number) {
    const asset = await assetRepository.create(input);
    await assetRepository.addStatusHistory(asset.id, null, "available", actorId ?? null, "Asset registered");
    await activityService.log({
      actorId,
      action: "asset.created",
      entityType: "asset",
      entityId: asset.id,
      metadata: { tag: asset.asset_tag, name: asset.name },
    });
    return asset;
  },

  async update(id: number, input: UpdateAssetInput, actorId?: number) {
    const existing = await assetRepository.findById(id);
    if (!existing) throw new AppError("Asset not found", 404, "NOT_FOUND", "Asset not found.");

    const updated = await assetRepository.update(id, input);
    await activityService.log({
      actorId,
      action: "asset.updated",
      entityType: "asset",
      entityId: id,
      metadata: { changes: input },
    });
    return updated;
  },

  async transitionStatus(id: number, toStatus: AssetStatus, actorId?: number, reason?: string) {
    const asset = await assetRepository.findById(id);
    if (!asset) throw new AppError("Asset not found", 404, "NOT_FOUND", "Asset not found.");

    const allowed = VALID_TRANSITIONS[asset.status];
    if (!allowed.includes(toStatus)) {
      throw new AppError(
        `Cannot transition from ${asset.status} to ${toStatus}`,
        400,
        "INVALID_TRANSITION",
        `Status transition from "${asset.status}" to "${toStatus}" is not allowed.`
      );
    }

    const updated = await assetRepository.update(id, { status: toStatus });
    await assetRepository.addStatusHistory(id, asset.status, toStatus, actorId ?? null, reason ?? null);
    await activityService.log({
      actorId,
      action: "asset.status_changed",
      entityType: "asset",
      entityId: id,
      metadata: { from: asset.status, to: toStatus, reason },
    });
    return updated;
  },
};
