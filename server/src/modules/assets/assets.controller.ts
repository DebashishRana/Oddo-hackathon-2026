import { Request, Response } from "express";
import { ok } from "../../utils/apiResponse";
import { AppError } from "../../utils/errors";
import { assetsService } from "./assets.service";
import type { AssetStatus } from "../../db/models";

const VALID_STATUSES: AssetStatus[] = ["available", "allocated", "reserved", "under_maintenance", "lost", "retired", "disposed"];

export class AssetsController {
  async list(req: Request, res: Response) {
    const { q, tag, serial, categoryId, status, departmentId, location, bookable, limit, offset } = req.query;

    const filters: Record<string, unknown> = {};
    if (typeof q === "string" && q.trim()) filters.q = q.trim();
    if (typeof tag === "string" && tag.trim()) filters.tag = tag.trim();
    if (typeof serial === "string" && serial.trim()) filters.serial = serial.trim();
    if (categoryId) filters.categoryId = Number(categoryId);
    if (status && VALID_STATUSES.includes(status as AssetStatus)) filters.status = status as AssetStatus;
    if (departmentId) filters.departmentId = Number(departmentId);
    if (typeof location === "string" && location.trim()) filters.location = location.trim();
    if (bookable !== undefined) filters.bookable = bookable === "true";
    if (limit) filters.limit = Number(limit);
    if (offset) filters.offset = Number(offset);

    const result = await assetsService.list(filters);
    return ok(res, "Assets retrieved.", result);
  }

  async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id) throw new AppError("Invalid asset id", 400, "VALIDATION_ERROR", "Invalid asset id.");

    const asset = await assetsService.getById(id);
    return ok(res, "Asset retrieved.", { asset });
  }

  async create(req: Request, res: Response) {
    const { name, serialNumber, categoryId, departmentId, condition, location, acquisitionDate, acquisitionCost, isSharedBookable, photoUrl, documentUrl, notes } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      throw new AppError("Asset name is required", 400, "VALIDATION_ERROR", "Asset name is required.");
    }

    const asset = await assetsService.create(
      {
        name: name.trim(),
        serialNumber: serialNumber || null,
        categoryId: categoryId ? Number(categoryId) : null,
        departmentId: departmentId ? Number(departmentId) : null,
        condition: condition || "good",
        location: location || null,
        acquisitionDate: acquisitionDate ? new Date(acquisitionDate) : null,
        acquisitionCost: acquisitionCost != null ? Number(acquisitionCost) : null,
        isSharedBookable: Boolean(isSharedBookable),
        photoUrl: photoUrl || null,
        documentUrl: documentUrl || null,
        notes: notes || null,
        createdBy: req.user?.id ?? null,
      },
      req.user?.id
    );
    return ok(res, "Asset created.", { asset });
  }

  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id) throw new AppError("Invalid asset id", 400, "VALIDATION_ERROR", "Invalid asset id.");

    const { name, serialNumber, categoryId, departmentId, condition, location, acquisitionDate, acquisitionCost, isSharedBookable, photoUrl, documentUrl, notes } = req.body;
    const input: Record<string, unknown> = {};

    if (name !== undefined) input.name = typeof name === "string" ? name.trim() : name;
    if (serialNumber !== undefined) input.serialNumber = serialNumber || null;
    if (categoryId !== undefined) input.categoryId = categoryId ? Number(categoryId) : null;
    if (departmentId !== undefined) input.departmentId = departmentId ? Number(departmentId) : null;
    if (condition !== undefined) input.condition = condition;
    if (location !== undefined) input.location = location || null;
    if (acquisitionDate !== undefined) input.acquisitionDate = acquisitionDate ? new Date(acquisitionDate) : null;
    if (acquisitionCost !== undefined) input.acquisitionCost = acquisitionCost != null ? Number(acquisitionCost) : null;
    if (isSharedBookable !== undefined) input.isSharedBookable = Boolean(isSharedBookable);
    if (photoUrl !== undefined) input.photoUrl = photoUrl || null;
    if (documentUrl !== undefined) input.documentUrl = documentUrl || null;
    if (notes !== undefined) input.notes = notes || null;

    const asset = await assetsService.update(id, input, req.user?.id);
    return ok(res, "Asset updated.", { asset });
  }

  async transitionStatus(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id) throw new AppError("Invalid asset id", 400, "VALIDATION_ERROR", "Invalid asset id.");

    const { status, reason } = req.body;
    if (!status || !VALID_STATUSES.includes(status as AssetStatus)) {
      throw new AppError("Invalid status value", 400, "VALIDATION_ERROR", `Status must be one of: ${VALID_STATUSES.join(", ")}`);
    }

    const asset = await assetsService.transitionStatus(id, status as AssetStatus, req.user?.id, reason);
    return ok(res, "Asset status updated.", { asset });
  }
}

export const assetsController = new AssetsController();
