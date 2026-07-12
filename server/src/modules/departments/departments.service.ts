import { departmentRepository, type CreateDepartmentInput, type UpdateDepartmentInput } from "../../db/repositories/department.repository";
import { AppError } from "../../utils/errors";
import { activityService } from "../../services/activity.service";

export const departmentsService = {
  async list(onlyActive = false) {
    return departmentRepository.list(onlyActive);
  },

  async getById(id: number) {
    const dept = await departmentRepository.findById(id);
    if (!dept) throw new AppError("Department not found", 404, "NOT_FOUND", "Department not found.");
    return dept;
  },

  async create(input: CreateDepartmentInput, actorId?: number) {
    const existing = await departmentRepository.findByName(input.name);
    if (existing) throw new AppError("Department name already exists", 409, "DUPLICATE", "A department with this name already exists.");

    const dept = await departmentRepository.create(input);
    await activityService.log({ actorId, action: "department.created", entityType: "department", entityId: dept.id, metadata: { name: dept.name } });
    return dept;
  },

  async update(id: number, input: UpdateDepartmentInput, actorId?: number) {
    const existing = await departmentRepository.findById(id);
    if (!existing) throw new AppError("Department not found", 404, "NOT_FOUND", "Department not found.");

    if (input.name && input.name !== existing.name) {
      const duplicate = await departmentRepository.findByName(input.name);
      if (duplicate && duplicate.id !== id) throw new AppError("Department name already exists", 409, "DUPLICATE", "A department with this name already exists.");
    }

    const dept = await departmentRepository.update(id, input);
    await activityService.log({ actorId, action: "department.updated", entityType: "department", entityId: id, metadata: { changes: input } });
    return dept;
  },
};
