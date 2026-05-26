import crypto from "crypto";
import bcrypt from "bcryptjs";
import { OTP_LENGTH } from "../config/security";
import { env } from "../config/env";

export const generateOtp = () => {
  const max = 10 ** OTP_LENGTH;
  const value = crypto.randomInt(0, max);
  return value.toString().padStart(OTP_LENGTH, "0");
};

export const hashOtp = async (otp: string) => bcrypt.hash(otp, 12);

export const verifyOtpHash = async (otp: string, hash: string) => bcrypt.compare(otp, hash);

export const sha256 = (value: string) => crypto.createHash("sha256").update(value).digest("hex");

const encryptionKey = () => crypto.createHash("sha256").update(env.jwtSecret).digest();

export const encryptSecret = (value: string) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return Buffer.concat([iv, tag, encrypted]).toString("base64url");
};

export const decryptSecret = (payload: string) => {
  const raw = Buffer.from(payload, "base64url");
  const iv = raw.subarray(0, 12);
  const tag = raw.subarray(12, 28);
  const encrypted = raw.subarray(28);
  const decipher = crypto.createDecipheriv("aes-256-gcm", encryptionKey(), iv);
  decipher.setAuthTag(tag);

  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
};
