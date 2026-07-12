import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { dashboardController } from "./dashboard.controller";

export const dashboardRoutes = Router();

dashboardRoutes.get("/kpis", requireAuth, (req, res, next) => {
  dashboardController.kpis(req, res).catch(next);
});
