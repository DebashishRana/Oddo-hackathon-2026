import { enqueueVerifyEmail } from "../queues/mail.queue";
import {
  OTP_LENGTH,
  OTP_EXPIRY_SECONDS,
  OTP_MAX_ATTEMPTS,
  OTP_RESEND_COOLDOWN_SECONDS
} from "../config/security";
import { redis } from "../config/redis";
import { RequestContext } from "../types/api";
import { AppError } from "../utils/errors";
import { encryptSecret, generateOtp, hashOtp, sha256, verifyOtpHash } from "../utils/crypto";
import { signSessionToken } from "../utils/jwt";
import { auditService } from "./audit.service";
import { rateLimitService } from "./rateLimit.service";

type OtpRecord = {
  hash: string;
  issuedAt: string;
  purpose: "email_verification";
};

const otpKey = (email: string) => `otp:${sha256(email)}`;
const attemptsKey = (email: string) => `otp_attempts:${sha256(email)}`;
const cooldownKey = (email: string) => `otp_cooldown:${sha256(email)}`;

export class AuthService {
  async sendOtp(email: string, context: RequestContext) {
    await rateLimitService.assertEmailAllowed(email, "send");
    await this.issueOtp(email, context, "otp_requested");
  }

  async resendOtp(email: string, context: RequestContext) {
    await rateLimitService.assertEmailAllowed(email, "resend");

    const cooldown = await redis.get(cooldownKey(email));
    if (cooldown) {
      auditService.warn("suspicious_activity", {
        ...context,
        email,
        reason: "otp_resend_cooldown"
      });
      throw new AppError("Resend cooldown active", 429, "OTP_COOLDOWN", "Please wait before requesting another code.");
    }

    await this.issueOtp(email, context, "otp_resent");
  }

  async verifyOtp(email: string, otp: string, context: RequestContext) {
    await rateLimitService.assertEmailAllowed(email, "verify");

    const attempts = Number((await redis.get(attemptsKey(email))) || "0");
    if (attempts >= OTP_MAX_ATTEMPTS) {
      auditService.warn("otp_locked", { ...context, email });
      throw new AppError("OTP attempts exhausted", 429, "OTP_LOCKED", "Unable to verify code.");
    }

    const recordRaw = await redis.get(otpKey(email));
    if (!recordRaw) {
      await this.incrementAttempts(email);
      auditService.warn("otp_failed", { ...context, email, reason: "missing_or_expired" });
      throw new AppError("OTP missing or expired", 400, "INVALID_OTP", "Unable to verify code.");
    }

    const record = JSON.parse(recordRaw) as OtpRecord;
    const valid = await verifyOtpHash(otp, record.hash);
    if (!valid) {
      const currentAttempts = await this.incrementAttempts(email);
      auditService.warn("otp_failed", { ...context, email, attempts: currentAttempts, reason: "mismatch" });
      throw new AppError("OTP mismatch", 400, "INVALID_OTP", "Unable to verify code.");
    }

    await redis.del(otpKey(email), attemptsKey(email), cooldownKey(email));
    const token = signSessionToken(email);

    auditService.record("otp_verified", { ...context, email });

    return {
      token,
      tokenType: "Bearer",
      expiresIn: process.env.JWT_EXPIRES_IN || "15m"
    };
  }

  private async issueOtp(email: string, context: RequestContext, event: "otp_requested" | "otp_resent") {
    const otp = generateOtp();
    const record: OtpRecord = {
      hash: await hashOtp(otp),
      issuedAt: new Date().toISOString(),
      purpose: "email_verification"
    };

    await redis
      .multi()
      .set(otpKey(email), JSON.stringify(record), "EX", OTP_EXPIRY_SECONDS)
      .del(attemptsKey(email))
      .set(cooldownKey(email), "1", "EX", OTP_RESEND_COOLDOWN_SECONDS)
      .exec();

    await enqueueVerifyEmail({
      type: "verify_email",
      email,
      encryptedOtp: encryptSecret(otp),
      requestContext: context,
      requestedAt: new Date().toISOString(),
      metadata: {
        otpLength: OTP_LENGTH,
        expirySeconds: OTP_EXPIRY_SECONDS,
        resendCooldownSeconds: OTP_RESEND_COOLDOWN_SECONDS,
        maxAttempts: OTP_MAX_ATTEMPTS
      }
    });

    auditService.record(event, { ...context, email });
  }

  private async incrementAttempts(email: string) {
    const key = attemptsKey(email);
    const attempts = await redis.incr(key);
    if (attempts === 1) {
      await redis.expire(key, OTP_EXPIRY_SECONDS);
    }

    return attempts;
  }
}

export const authService = new AuthService();
