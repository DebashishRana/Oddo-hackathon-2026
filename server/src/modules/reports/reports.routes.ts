import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { analyticsController } from "../analytics/analytics.controller";

export const reportsRoutes = Router();

reportsRoutes.get("/:type.csv", requireAuth, (req, res, next) => {
  analyticsController.report(req, res).catch(next);
});

