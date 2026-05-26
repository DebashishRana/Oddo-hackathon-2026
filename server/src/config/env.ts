import dotenv from "dotenv";

dotenv.config({ path: process.env.ENV_FILE || "server/.env" });
dotenv.config();

const required = ["REDIS_URL", "JWT_SECRET", "MAIL_FROM"] as const;

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 4000),
  apiBaseUrl: process.env.API_BASE_URL || "http://localhost:4000",
  redisUrl: process.env.REDIS_URL!,
  resendApiKey: process.env.RESEND_API_KEY || "",
  mailFrom: process.env.MAIL_FROM!,
  emailProvider: process.env.EMAIL_PROVIDER || "resend",
  jwtSecret: process.env.JWT_SECRET!,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "15m",
  corsOrigins: (process.env.CORS_ORIGINS || "").split(",").map((origin) => origin.trim()).filter(Boolean),
  logLevel: process.env.LOG_LEVEL || "info"
};
