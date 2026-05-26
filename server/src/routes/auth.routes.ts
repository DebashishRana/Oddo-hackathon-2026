import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { resendOtpLimiter, sendOtpLimiter, verifyOtpLimiter } from "../middleware/rateLimit";

export const authRoutes = Router();

authRoutes.post("/send-otp", sendOtpLimiter, (req, res, next) => {
  authController.sendOtp(req, res).catch(next);
});

authRoutes.post("/resend-otp", resendOtpLimiter, (req, res, next) => {
  authController.resendOtp(req, res).catch(next);
});

authRoutes.post("/verify-otp", verifyOtpLimiter, (req, res, next) => {
  authController.verifyOtp(req, res).catch(next);
});
