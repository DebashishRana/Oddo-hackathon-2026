import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth";
import { sampleEntityController } from "./sample-entity.controller";

export const sampleEntityRoutes = Router();

sampleEntityRoutes.get("/", requireAuth, (req, res, next) => {
  sampleEntityController.list(req, res).catch(next);
});

sampleEntityRoutes.post("/", requireAuth, requireRole("admin", "employee"), (req, res, next) => {
  sampleEntityController.create(req, res).catch(next);
});
