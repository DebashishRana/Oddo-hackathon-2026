import dotenv from "dotenv";

dotenv.config({ path: process.env.ENV_FILE || "server/.env" });
dotenv.config();

const required = ["DATABASE_URL", "JWT_SECRET", "APP_URL"] as const;

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  appName: process.env.APP_NAME || "AssetFlow API",
  port: Number(process.env.PORT || 4000),
  databaseUrl: process.env.DATABASE_URL!,
  jwtSecret: process.env.JWT_SECRET!,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  appUrl: process.env.APP_URL!,
  corsOrigins: (process.env.CORS_ORIGINS || "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  cookieName: process.env.COOKIE_NAME || "assetflow_session",
  cookieDomain: process.env.COOKIE_DOMAIN || undefined,
  cookieSecure: process.env.COOKIE_SECURE === "true",
  logLevel: process.env.LOG_LEVEL || "info",
  dbSsl: process.env.DATABASE_SSL === "true",
  resendApiKey: process.env.RESEND_API_KEY || "",
  resendFrom: process.env.RESEND_FROM || "AssetFlow <no-reply@assetflow.app>",
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  googleRedirectUri: process.env.GOOGLE_REDIRECT_URI || `${process.env.APP_URL}/api/auth/google/callback`,
  emailVerificationTtlMinutes: Number(process.env.EMAIL_VERIFICATION_TTL_MINUTES || 30),
  passwordResetTtlMinutes: Number(process.env.PASSWORD_RESET_TTL_MINUTES || 30),
  tempLoginEmail: process.env.TEMP_LOGIN_EMAIL || "temp@local.dev",
  tempLoginPassword: process.env.TEMP_LOGIN_PASSWORD || "Temp1234!",
};
