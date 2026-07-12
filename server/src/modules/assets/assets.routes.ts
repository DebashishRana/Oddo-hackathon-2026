import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth";
import { assetsController } from "./assets.controller";

export const assetsRoutes = Router();

assetsRoutes.get("/", requireAuth, (req, res, next) => {
  assetsController.list(req, res).catch(next);
});

assetsRoutes.get("/:id", requireAuth, (req, res, next) => {
  assetsController.getById(req, res).catch(next);
});

assetsRoutes.post("/", requireAuth, requireRole("admin", "asset_manager"), (req, res, next) => {
  assetsController.create(req, res).catch(next);
});

assetsRoutes.patch("/:id", requireAuth, requireRole("admin", "asset_manager"), (req, res, next) => {
  assetsController.update(req, res).catch(next);
});

assetsRoutes.post("/:id/status", requireAuth, requireRole("admin", "asset_manager"), (req, res, next) => {
  assetsController.transitionStatus(req, res).catch(next);
});
