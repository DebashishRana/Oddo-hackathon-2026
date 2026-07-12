import { Request, Response } from "express";
import { ok } from "../../utils/apiResponse";
import { AppError } from "../../utils/errors";
import { auditsService } from "./audits.service";

export class AuditsController {
  async list(_req: Request, res: Response) {
    const cycles = await auditsService.list();
    return ok(res, "Audit cycles retrieved.", { cycles });
  }

  async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id) throw new AppError("Invalid audit cycle id", 400, "VALIDATION_ERROR", "Invalid audit cycle id.");
    const cycle = await auditsService.getById(id);
    return ok(res, "Audit cycle retrieved.", { cycle });
  }

  async create(req: Request, res: Response) {
    const { name, departmentId, location, startsOn, endsOn, auditorIds } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      throw new AppError("Name is required", 400, "VALIDATION_ERROR", "Audit cycle name is required.");
    }
    if (!startsOn) throw new AppError("startsOn is required", 400, "VALIDATION_ERROR", "Start date is required.");
    if (!endsOn) throw new AppError("endsOn is required", 400, "VALIDATION_ERROR", "End date is required.");

    const cycle = await auditsService.create(
      {
        name: name.trim(),
        departmentId: departmentId ? Number(departmentId) : null,
        location: location ?? null,
        startsOn: new Date(startsOn),
        endsOn: new Date(endsOn),
        auditorIds: Array.isArray(auditorIds) ? auditorIds.map(Number) : [],
      },
      req.user?.id
    );
    return ok(res, "Audit cycle created.", { cycle });
  }

  async markItem(req: Request, res: Response) {
    const cycleId = Number(req.params.id);
    const assetId = Number(req.params.assetId);
    if (!cycleId || !assetId) throw new AppError("Invalid ids", 400, "VALIDATION_ERROR", "Invalid cycle or asset id.");

    const { result, notes } = req.body;
    if (!["verified", "missing", "damaged"].includes(result)) {
      throw new AppError("Result must be verified, missing, or damaged", 400, "VALIDATION_ERROR", "Invalid result value.");
    }

    const item = await auditsService.markItem(cycleId, assetId, result, notes ?? null, req.user!.id, req.user!.role);
    return ok(res, "Audit item marked.", { item });
  }

  async close(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id) throw new AppError("Invalid audit cycle id", 400, "VALIDATION_ERROR", "Invalid audit cycle id.");

    const result = await auditsService.closeCycle(id, req.user!.id);
    return ok(res, "Audit cycle closed.", result);
  }
}

export const auditsController = new AuditsController();
