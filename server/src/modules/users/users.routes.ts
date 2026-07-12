import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth";
import { usersController } from "./users.controller";

export const usersRoutes = Router();

usersRoutes.get("/me", requireAuth, (req, res, next) => {
  usersController.me(req, res).catch(next);
});

usersRoutes.patch("/me", requireAuth, (req, res, next) => {
  usersController.updateMe(req, res).catch(next);
});

usersRoutes.get("/", requireAuth, requireRole("admin"), (req, res, next) => {
  usersController.listUsers(req, res).catch(next);
});
