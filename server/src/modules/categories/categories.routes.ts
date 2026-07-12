import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth";
import { categoriesController } from "./categories.controller";

export const categoriesRoutes = Router();

categoriesRoutes.get("/", requireAuth, (req, res, next) => {
  categoriesController.list(req, res).catch(next);
});

categoriesRoutes.post("/", requireAuth, requireRole("admin"), (req, res, next) => {
  categoriesController.create(req, res).catch(next);
});

categoriesRoutes.patch("/:id", requireAuth, requireRole("admin"), (req, res, next) => {
  categoriesController.update(req, res).catch(next);
});
