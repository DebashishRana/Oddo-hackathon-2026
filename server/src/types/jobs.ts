import type { RequestContext } from "./api";

export type VerifyEmailJob = {
  type: "verify_email";
  email: string;
  encryptedOtp: string;
  requestContext: RequestContext;
  requestedAt: string;
  metadata: {
    otpLength: number;
    expirySeconds: number;
    resendCooldownSeconds: number;
    maxAttempts: number;
  };
};

export type MailJob = VerifyEmailJob;
