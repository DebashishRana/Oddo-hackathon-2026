import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { authController } from "./auth.controller";

export const authRoutes = Router();

authRoutes.post("/register", (req, res, next) => {
  authController.register(req, res).catch(next);
});

authRoutes.post("/login", (req, res, next) => {
  authController.login(req, res).catch(next);
});

authRoutes.post("/logout", (req, res, next) => {
  authController.logout(req, res).catch(next);
});

authRoutes.get("/me", requireAuth, (req, res, next) => {
  authController.me(req, res).catch(next);
});

authRoutes.get("/google/start", (req, res, next) => {
  authController.googleStart(req, res).catch(next);
});

authRoutes.get("/google/callback", (req, res, next) => {
  authController.googleCallback(req, res).catch(next);
});

authRoutes.post("/email/send-verification", (req, res, next) => {
  authController.sendVerification(req, res).catch(next);
});

authRoutes.post("/email/verify", (req, res, next) => {
  authController.verifyEmail(req, res).catch(next);
});

authRoutes.post("/forgot-password", (req, res, next) => {
  authController.forgotPassword(req, res).catch(next);
});

authRoutes.post("/reset-password", (req, res, next) => {
  authController.resetPassword(req, res).catch(next);
});
