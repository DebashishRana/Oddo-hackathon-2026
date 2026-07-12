import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth";
import { allocationsController } from "./allocations.controller";

export const allocationsRoutes = Router();

allocationsRoutes.get("/overdue", requireAuth, (req, res, next) => {
  allocationsController.listOverdue(req, res).catch(next);
});

allocationsRoutes.get("/", requireAuth, (req, res, next) => {
  allocationsController.list(req, res).catch(next);
});

allocationsRoutes.post("/", requireAuth, requireRole("admin", "asset_manager"), (req, res, next) => {
  allocationsController.allocate(req, res).catch(next);
});

allocationsRoutes.post("/:id/return", requireAuth, requireRole("admin", "asset_manager"), (req, res, next) => {
  allocationsController.returnAllocation(req, res).catch(next);
});
