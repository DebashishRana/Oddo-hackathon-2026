import { Request, Response } from "express";
import { ok } from "../../utils/apiResponse";
import { AppError } from "../../utils/errors";
import { transfersService } from "./transfers.service";

export class TransfersController {
  async list(req: Request, res: Response) {
    const { assetId, requestedBy, status, limit, offset } = req.query;
    const filters: Record<string, unknown> = {};

    if (assetId) filters.assetId = Number(assetId);
    if (requestedBy) filters.requestedBy = Number(requestedBy);
    if (status) filters.status = status;
    if (limit) filters.limit = Number(limit);
    if (offset) filters.offset = Number(offset);

    const transfers = await transfersService.list(filters);
    return ok(res, "Transfer requests retrieved.", { transfers });
  }

  async request(req: Request, res: Response) {
    const { assetId, fromAllocationId, toUserId, toDepartmentId, notes } = req.body;

    if (!assetId) throw new AppError("assetId is required", 400, "VALIDATION_ERROR", "Asset id is required.");

    const transfer = await transfersService.request({
      assetId: Number(assetId),
      fromAllocationId: fromAllocationId ? Number(fromAllocationId) : null,
      requestedBy: req.user!.id,
      toUserId: toUserId ? Number(toUserId) : null,
      toDepartmentId: toDepartmentId ? Number(toDepartmentId) : null,
      notes: notes ?? null,
    });
    return ok(res, "Transfer request created.", { transfer });
  }

  async approve(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id) throw new AppError("Invalid transfer id", 400, "VALIDATION_ERROR", "Invalid transfer id.");

    const transfer = await transfersService.approve(id, req.user!.id);
    return ok(res, "Transfer approved.", { transfer });
  }

  async reject(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id) throw new AppError("Invalid transfer id", 400, "VALIDATION_ERROR", "Invalid transfer id.");

    const { reason } = req.body;
    const transfer = await transfersService.reject(id, req.user!.id, reason);
    return ok(res, "Transfer rejected.", { transfer });
  }
}

export const transfersController = new TransfersController();
