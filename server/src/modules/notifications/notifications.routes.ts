import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth";
import { notificationsController } from "./notifications.controller";

export const notificationsRoutes = Router();

notificationsRoutes.get("/activity", requireAuth, requireRole("admin", "asset_manager"), (req, res, next) => {
  notificationsController.activityLogs(req, res).catch(next);
});

notificationsRoutes.get("/", requireAuth, (req, res, next) => {
  notificationsController.list(req, res).catch(next);
});

notificationsRoutes.post("/read-all", requireAuth, (req, res, next) => {
  notificationsController.markAllRead(req, res).catch(next);
});

notificationsRoutes.post("/:id/read", requireAuth, (req, res, next) => {
  notificationsController.markRead(req, res).catch(next);
});
