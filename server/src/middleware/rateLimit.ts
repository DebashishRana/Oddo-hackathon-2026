import rateLimit from "express-rate-limit";
import { RATE_LIMITS } from "../config/security";
import { securityLog } from "../utils/logger";

const buildLimiter = (event: string, windowMs: number, max: number) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      securityLog(event, {
        requestId: req.context?.requestId,
        ip: req.context?.ip,
        path: req.path,
        userAgent: req.context?.userAgent
      });
      res.status(429).json({
        success: false,
        message: "Too many requests. Please try again later.",
        error: { code: "RATE_LIMITED" }
      });
    }
  });

export const sendOtpLimiter = buildLimiter(
  "send_otp_ip_rate_limited",
  RATE_LIMITS.sendOtpPerIp.windowMs,
  RATE_LIMITS.sendOtpPerIp.max
);

export const verifyOtpLimiter = buildLimiter(
  "verify_otp_ip_rate_limited",
  RATE_LIMITS.verifyOtpPerIp.windowMs,
  RATE_LIMITS.verifyOtpPerIp.max
);

export const resendOtpLimiter = buildLimiter(
  "resend_otp_ip_rate_limited",
  RATE_LIMITS.resendOtpPerIp.windowMs,
  RATE_LIMITS.resendOtpPerIp.max
);
