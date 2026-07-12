import { categoryRepository, type CreateCategoryInput, type UpdateCategoryInput } from "../../db/repositories/category.repository";
import { AppError } from "../../utils/errors";
import { activityService } from "../../services/activity.service";

export const categoriesService = {
  async list() {
    return categoryRepository.list();
  },

  async getById(id: number) {
    const cat = await categoryRepository.findById(id);
    if (!cat) throw new AppError("Category not found", 404, "NOT_FOUND", "Category not found.");
    return cat;
  },

  async create(input: CreateCategoryInput, actorId?: number) {
    const existing = await categoryRepository.findByName(input.name);
    if (existing) throw new AppError("Category name already exists", 409, "DUPLICATE", "A category with this name already exists.");

    const cat = await categoryRepository.create(input);
    await activityService.log({ actorId, action: "category.created", entityType: "category", entityId: cat.id, metadata: { name: cat.name } });
    return cat;
  },

  async update(id: number, input: UpdateCategoryInput, actorId?: number) {
    const existing = await categoryRepository.findById(id);
    if (!existing) throw new AppError("Category not found", 404, "NOT_FOUND", "Category not found.");

    if (input.name && input.name !== existing.name) {
      const duplicate = await categoryRepository.findByName(input.name);
      if (duplicate && duplicate.id !== id) throw new AppError("Category name already exists", 409, "DUPLICATE", "A category with this name already exists.");
    }

    const cat = await categoryRepository.update(id, input);
    await activityService.log({ actorId, action: "category.updated", entityType: "category", entityId: id, metadata: { changes: input } });
    return cat;
  },
};
