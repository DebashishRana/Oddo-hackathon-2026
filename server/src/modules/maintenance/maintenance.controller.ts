import { Request, Response } from "express";
import { ok } from "../../utils/apiResponse";
import { AppError } from "../../utils/errors";
import { maintenanceService } from "./maintenance.service";

export class MaintenanceController {
  async list(req: Request, res: Response) {
    const { assetId, status, requestedBy, limit, offset } = req.query;
    const filters: Record<string, unknown> = {};

    if (assetId) filters.assetId = Number(assetId);
    if (status) filters.status = status;
    if (requestedBy) filters.requestedBy = Number(requestedBy);
    if (limit) filters.limit = Number(limit);
    if (offset) filters.offset = Number(offset);

    const requests = await maintenanceService.list(filters);
    return ok(res, "Maintenance requests retrieved.", { requests });
  }

  async create(req: Request, res: Response) {
    const { assetId, description, priority, photoUrl } = req.body;

    if (!assetId) throw new AppError("assetId is required", 400, "VALIDATION_ERROR", "Asset id is required.");
    if (!description || typeof description !== "string" || !description.trim()) {
      throw new AppError("Description is required", 400, "VALIDATION_ERROR", "Maintenance description is required.");
    }

    const request = await maintenanceService.create(
      {
        assetId: Number(assetId),
        requestedBy: req.user!.id,
        description: description.trim(),
        priority: priority || "medium",
        photoUrl: photoUrl ?? null,
      },
      req.user?.id
    );
    return ok(res, "Maintenance request created.", { request });
  }

  async approve(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id) throw new AppError("Invalid id", 400, "VALIDATION_ERROR", "Invalid maintenance request id.");
    const request = await maintenanceService.approve(id, req.user!.id);
    return ok(res, "Maintenance request approved.", { request });
  }

  async reject(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id) throw new AppError("Invalid id", 400, "VALIDATION_ERROR", "Invalid maintenance request id.");
    const request = await maintenanceService.reject(id, req.user!.id, req.body.rejectionReason);
    return ok(res, "Maintenance request rejected.", { request });
  }

  async assign(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id) throw new AppError("Invalid id", 400, "VALIDATION_ERROR", "Invalid maintenance request id.");
    const { technicianName } = req.body;
    const request = await maintenanceService.assignTechnician(id, technicianName, req.user!.id);
    return ok(res, "Technician assigned.", { request });
  }

  async start(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id) throw new AppError("Invalid id", 400, "VALIDATION_ERROR", "Invalid maintenance request id.");
    const request = await maintenanceService.start(id, req.user!.id);
    return ok(res, "Maintenance started.", { request });
  }

  async resolve(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id) throw new AppError("Invalid id", 400, "VALIDATION_ERROR", "Invalid maintenance request id.");
    const request = await maintenanceService.resolve(id, req.user!.id);
    return ok(res, "Maintenance resolved.", { request });
  }
}

export const maintenanceController = new MaintenanceController();
