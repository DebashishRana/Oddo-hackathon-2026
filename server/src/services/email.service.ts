import { Resend } from "resend";
import { env } from "../config/env";
import { logger } from "../utils/logger";

const resend = env.resendApiKey ? new Resend(env.resendApiKey) : null;

export const emailService = {
  async sendVerificationEmail(email: string, verifyUrl: string) {
    if (!resend) {
      logger.warn("resend_unavailable", { email, reason: "missing_api_key" });
      return;
    }

    await resend.emails.send({
      from: env.resendFrom,
      to: [email],
      subject: "Verify your AssetFlow account",
      html: `
        <div style="font-family: Inter, Arial, sans-serif; line-height: 1.6; color: #0f172a;">
          <h1 style="font-size: 24px; margin-bottom: 16px;">Verify your email</h1>
          <p>Click the link below to activate your Employee account.</p>
          <p style="margin: 24px 0;">
            <a href="${verifyUrl}" style="display:inline-block;background:#3d38f5;color:#fff;text-decoration:none;padding:12px 18px;border-radius:999px;font-weight:600;">Verify email</a>
          </p>
          <p style="font-size: 14px; color: #475569;">This link expires in ${env.emailVerificationTtlMinutes} minutes.</p>
          <p style="font-size: 14px; color: #475569;">If you did not request this account, you can ignore this email.</p>
        </div>
      `,
    });
  },

  async sendPasswordResetEmail(email: string, resetUrl: string) {
    if (!resend) {
      logger.warn("resend_unavailable", { email, reason: "missing_api_key" });
      return;
    }

    await resend.emails.send({
      from: env.resendFrom,
      to: [email],
      subject: "Reset your AssetFlow password",
      html: `
        <div style="font-family: Inter, Arial, sans-serif; line-height: 1.6; color: #0f172a;">
          <h1 style="font-size: 24px; margin-bottom: 16px;">Reset your password</h1>
          <p>Use the secure link below to choose a new password for your account.</p>
          <p style="margin: 24px 0;">
            <a href="${resetUrl}" style="display:inline-block;background:#111827;color:#fff;text-decoration:none;padding:12px 18px;border-radius:999px;font-weight:600;">Reset password</a>
          </p>
          <p style="font-size: 14px; color: #475569;">This link expires in ${env.passwordResetTtlMinutes} minutes.</p>
          <p style="font-size: 14px; color: #475569;">If you did not request this reset, you can safely ignore this email.</p>
        </div>
      `,
    });
  },
};
