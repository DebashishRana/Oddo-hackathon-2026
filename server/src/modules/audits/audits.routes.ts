import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth";
import { auditsController } from "./audits.controller";

export const auditsRoutes = Router();

auditsRoutes.get("/", requireAuth, (req, res, next) => {
  auditsController.list(req, res).catch(next);
});

auditsRoutes.post("/", requireAuth, requireRole("admin"), (req, res, next) => {
  auditsController.create(req, res).catch(next);
});

auditsRoutes.get("/:id", requireAuth, (req, res, next) => {
  auditsController.getById(req, res).catch(next);
});

auditsRoutes.post("/:id/items/:assetId/mark", requireAuth, (req, res, next) => {
  auditsController.markItem(req, res).catch(next);
});

auditsRoutes.post("/:id/close", requireAuth, requireRole("admin", "asset_manager"), (req, res, next) => {
  auditsController.close(req, res).catch(next);
});
