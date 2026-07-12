import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { analyticsController } from "./analytics.controller";

export const analyticsRoutes = Router();

analyticsRoutes.get("/assets/utilization", requireAuth, (req, res, next) => {
  analyticsController.utilization(req, res).catch(next);
});

analyticsRoutes.get("/assets/maintenance", requireAuth, (req, res, next) => {
  analyticsController.maintenance(req, res).catch(next);
});

analyticsRoutes.get("/assets/departments", requireAuth, (req, res, next) => {
  analyticsController.departments(req, res).catch(next);
});

analyticsRoutes.get("/bookings/heatmap", requireAuth, (req, res, next) => {
  analyticsController.bookings(req, res).catch(next);
});

