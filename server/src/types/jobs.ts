export type VerifyEmailJob = {
  type: "verify_email";
  email: string;
  encryptedOtp: string;
  requestId: string;
  requestedAt: string;
};

export type MailJob = VerifyEmailJob;
