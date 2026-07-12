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

// Lightweight picker list for allocation/transfer/audit forms (all authenticated roles)
usersRoutes.get("/options", requireAuth, (req, res, next) => {
  usersController.options(req, res).catch(next);
});

usersRoutes.get("/directory", requireAuth, requireRole("admin", "asset_manager"), (req, res, next) => {
  usersController.directory(req, res).catch(next);
});

usersRoutes.patch("/:id/role", requireAuth, requireRole("admin"), (req, res, next) => {
  usersController.updateRole(req, res).catch(next);
});

usersRoutes.patch("/:id/status", requireAuth, requireRole("admin"), (req, res, next) => {
  usersController.updateStatus(req, res).catch(next);
});

usersRoutes.patch("/:id", requireAuth, requireRole("admin"), (req, res, next) => {
  usersController.updateUser(req, res).catch(next);
});
