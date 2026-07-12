import { Request, Response } from "express";
import { ok } from "../../utils/apiResponse";
import { AppError } from "../../utils/errors";
import { departmentsService } from "./departments.service";

export class DepartmentsController {
  async list(req: Request, res: Response) {
    const onlyActive = req.query.active === "true";
    const departments = await departmentsService.list(onlyActive);
    return ok(res, "Departments retrieved.", { departments });
  }

  async create(req: Request, res: Response) {
    const { name, code, parentDepartmentId, headUserId, status } = req.body;
    if (!name || typeof name !== "string" || !name.trim()) {
      throw new AppError("Name is required", 400, "VALIDATION_ERROR", "Department name is required.");
    }

    const dept = await departmentsService.create(
      {
        name: name.trim(),
        code: typeof code === "string" ? code.trim() || null : null,
        parentDepartmentId: parentDepartmentId != null ? Number(parentDepartmentId) : null,
        headUserId: headUserId != null ? Number(headUserId) : null,
        status: status === "inactive" ? "inactive" : "active",
      },
      req.user?.id
    );
    return ok(res, "Department created.", { department: dept });
  }

  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id) throw new AppError("Invalid department id", 400, "VALIDATION_ERROR", "Invalid department id.");

    const { name, code, parentDepartmentId, headUserId, status } = req.body;
    const input: Record<string, unknown> = {};

    if (name !== undefined) input.name = typeof name === "string" ? name.trim() : name;
    if (code !== undefined) input.code = typeof code === "string" ? code.trim() || null : null;
    if (parentDepartmentId !== undefined) input.parentDepartmentId = parentDepartmentId != null ? Number(parentDepartmentId) : null;
    if (headUserId !== undefined) input.headUserId = headUserId != null ? Number(headUserId) : null;
    if (status !== undefined) input.status = status;

    const dept = await departmentsService.update(id, input, req.user?.id);
    return ok(res, "Department updated.", { department: dept });
  }
}

export const departmentsController = new DepartmentsController();
