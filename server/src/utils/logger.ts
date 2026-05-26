import fs from "fs";
import path from "path";
import winston from "winston";
import { env } from "../config/env";

const logDir = path.resolve(process.cwd(), "server/src/logs");
fs.mkdirSync(logDir, { recursive: true });

const redact = winston.format((info) => {
  for (const key of ["otp", "token", "authorization", "password"]) {
    if (key in info) info[key] = "[REDACTED]";
  }
  return info;
});

export const logger = winston.createLogger({
  level: env.logLevel,
  defaultMeta: { service: "dectra-email-verification", environment: env.nodeEnv },
  format: winston.format.combine(
    redact(),
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: path.join(logDir, "combined.log") }),
    new winston.transports.File({ filename: path.join(logDir, "security.log"), level: "warn" })
  ]
});

if (env.nodeEnv !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple())
    })
  );
}

export const securityLog = (event: string, meta: Record<string, unknown>) => {
  logger.warn(event, { audit_type: "security", ...meta });
};
