import validator from "validator";
import { normalizeEmail } from "../utils/normalize";
import { AppError } from "../utils/errors";

export type SendOtpInput = {
  email: string;
};

export type VerifyOtpInput = {
  email: string;
  otp: string;
};

export const parseEmailInput = (body: unknown): SendOtpInput => {
  const email = typeof (body as { email?: unknown })?.email === "string" ? normalizeEmail((body as { email: string }).email) : "";
  if (!validator.isEmail(email, { allow_utf8_local_part: false })) {
    throw new AppError("Invalid email", 400, "INVALID_EMAIL", "Please provide a valid email address.");
  }
  return { email };
};

export const parseVerifyOtpInput = (body: unknown): VerifyOtpInput => {
  const { email } = parseEmailInput(body);
  const otp = typeof (body as { otp?: unknown })?.otp === "string" ? (body as { otp: string }).otp.trim() : "";

  if (!/^\d{6}$/.test(otp)) {
    throw new AppError("Invalid OTP format", 400, "INVALID_OTP", "Unable to verify code.");
  }

  return { email, otp };
};
