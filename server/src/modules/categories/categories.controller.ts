import { Request, Response } from "express";
import { ok } from "../../utils/apiResponse";
import { AppError } from "../../utils/errors";
import { categoriesService } from "./categories.service";

export class CategoriesController {
  async list(_req: Request, res: Response) {
    const categories = await categoriesService.list();
    return ok(res, "Categories retrieved.", { categories });
  }

  async create(req: Request, res: Response) {
    const { name, description, customFields } = req.body;
    if (!name || typeof name !== "string" || !name.trim()) {
      throw new AppError("Name is required", 400, "VALIDATION_ERROR", "Category name is required.");
    }

    const cat = await categoriesService.create(
      {
        name: name.trim(),
        description: typeof description === "string" ? description.trim() || null : null,
        customFields: customFields && typeof customFields === "object" ? customFields : {},
      },
      req.user?.id
    );
    return ok(res, "Category created.", { category: cat });
  }

  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id) throw new AppError("Invalid category id", 400, "VALIDATION_ERROR", "Invalid category id.");

    const { name, description, customFields } = req.body;
    const input: Record<string, unknown> = {};

    if (name !== undefined) input.name = typeof name === "string" ? name.trim() : name;
    if (description !== undefined) input.description = typeof description === "string" ? description.trim() || null : null;
    if (customFields !== undefined) input.customFields = customFields;

    const cat = await categoriesService.update(id, input, req.user?.id);
    return ok(res, "Category updated.", { category: cat });
  }
}

export const categoriesController = new CategoriesController();
