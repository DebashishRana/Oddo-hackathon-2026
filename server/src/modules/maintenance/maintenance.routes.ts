import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth";
import { maintenanceController } from "./maintenance.controller";

export const maintenanceRoutes = Router();

maintenanceRoutes.get("/", requireAuth, (req, res, next) => {
  maintenanceController.list(req, res).catch(next);
});

maintenanceRoutes.post("/", requireAuth, (req, res, next) => {
  maintenanceController.create(req, res).catch(next);
});

maintenanceRoutes.post("/:id/approve", requireAuth, requireRole("admin", "asset_manager"), (req, res, next) => {
  maintenanceController.approve(req, res).catch(next);
});

maintenanceRoutes.post("/:id/reject", requireAuth, requireRole("admin", "asset_manager"), (req, res, next) => {
  maintenanceController.reject(req, res).catch(next);
});

maintenanceRoutes.post("/:id/assign", requireAuth, requireRole("admin", "asset_manager"), (req, res, next) => {
  maintenanceController.assign(req, res).catch(next);
});

maintenanceRoutes.post("/:id/start", requireAuth, requireRole("admin", "asset_manager"), (req, res, next) => {
  maintenanceController.start(req, res).catch(next);
});

maintenanceRoutes.post("/:id/resolve", requireAuth, requireRole("admin", "asset_manager"), (req, res, next) => {
  maintenanceController.resolve(req, res).catch(next);
});
