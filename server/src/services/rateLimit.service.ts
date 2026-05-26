import { redis } from "../config/redis";
import { RATE_LIMITS } from "../config/security";
import { sha256 } from "../utils/crypto";
import { AppError } from "../utils/errors";

export class RateLimitService {
  async assertEmailAllowed(email: string, action: "send" | "resend" | "verify") {
    const key = `ratelimit:email:${action}:${sha256(email)}`;
    const count = await redis.incr(key);
    if (count === 1) {
      await redis.expire(key, RATE_LIMITS.authEmailWindowSeconds);
    }

    if (count > RATE_LIMITS.authEmailMaxRequests) {
      throw new AppError("Email rate limited", 429, "RATE_LIMITED", "Too many requests. Please try again later.");
    }
  }
}

export const rateLimitService = new RateLimitService();
