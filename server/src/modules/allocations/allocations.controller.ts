import { Request, Response } from "express";
import { ok } from "../../utils/apiResponse";
import { AppError } from "../../utils/errors";
import { allocationsService } from "./allocations.service";

export class AllocationsController {
  async list(req: Request, res: Response) {
    const { assetId, userId, departmentId, status, limit, offset } = req.query;
    const filters: Record<string, unknown> = {};

    if (assetId) filters.assetId = Number(assetId);
    if (userId) filters.userId = Number(userId);
    if (departmentId) filters.departmentId = Number(departmentId);
    if (status) filters.status = status;
    if (limit) filters.limit = Number(limit);
    if (offset) filters.offset = Number(offset);

    const allocations = await allocationsService.list(filters);
    return ok(res, "Allocations retrieved.", { allocations });
  }

  async allocate(req: Request, res: Response) {
    const { assetId, allocatedToUserId, allocatedToDepartmentId, expectedReturnDate } = req.body;

    if (!assetId || typeof assetId !== "number") {
      throw new AppError("assetId is required", 400, "VALIDATION_ERROR", "Asset id is required.");
    }

    if (!allocatedToUserId && !allocatedToDepartmentId) {
      throw new AppError("Either allocatedToUserId or allocatedToDepartmentId is required", 400, "VALIDATION_ERROR", "Must specify a user or department to allocate to.");
    }

    const allocation = await allocationsService.allocate({
      assetId,
      allocatedToUserId: allocatedToUserId ?? null,
      allocatedToDepartmentId: allocatedToDepartmentId ?? null,
      allocatedBy: req.user?.id ?? undefined,
      expectedReturnDate: expectedReturnDate ? new Date(expectedReturnDate) : null,
    });
    return ok(res, "Asset allocated.", { allocation });
  }

  async returnAllocation(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id) throw new AppError("Invalid allocation id", 400, "VALIDATION_ERROR", "Invalid allocation id.");

    const { notes } = req.body;
    const allocation = await allocationsService.returnAllocation(id, notes ?? null, req.user?.id);
    return ok(res, "Asset returned.", { allocation });
  }

  async listOverdue(_req: Request, res: Response) {
    const allocations = await allocationsService.getOverdue();
    return ok(res, "Overdue allocations retrieved.", { allocations });
  }
}

export const allocationsController = new AllocationsController();
