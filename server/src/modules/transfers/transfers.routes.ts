import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth";
import { transfersController } from "./transfers.controller";

export const transfersRoutes = Router();

transfersRoutes.get("/", requireAuth, (req, res, next) => {
  transfersController.list(req, res).catch(next);
});

transfersRoutes.post("/", requireAuth, (req, res, next) => {
  transfersController.request(req, res).catch(next);
});

transfersRoutes.post("/:id/approve", requireAuth, requireRole("admin", "asset_manager", "department_head"), (req, res, next) => {
  transfersController.approve(req, res).catch(next);
});

transfersRoutes.post("/:id/reject", requireAuth, requireRole("admin", "asset_manager", "department_head"), (req, res, next) => {
  transfersController.reject(req, res).catch(next);
});
