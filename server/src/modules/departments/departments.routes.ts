import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth";
import { departmentsController } from "./departments.controller";

export const departmentsRoutes = Router();

departmentsRoutes.get("/", requireAuth, (req, res, next) => {
  departmentsController.list(req, res).catch(next);
});

departmentsRoutes.post("/", requireAuth, requireRole("admin"), (req, res, next) => {
  departmentsController.create(req, res).catch(next);
});

departmentsRoutes.patch("/:id", requireAuth, requireRole("admin"), (req, res, next) => {
  departmentsController.update(req, res).catch(next);
});
