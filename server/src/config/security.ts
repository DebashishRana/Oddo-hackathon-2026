export const OTP_EXPIRY_SECONDS = 5 * 60;
export const OTP_RESEND_COOLDOWN_SECONDS = 60;
export const OTP_MAX_ATTEMPTS = 5;
export const OTP_LENGTH = 6;

export const RATE_LIMITS = {
  sendOtpPerIp: { windowMs: 15 * 60 * 1000, max: 20 },
  verifyOtpPerIp: { windowMs: 15 * 60 * 1000, max: 40 },
  resendOtpPerIp: { windowMs: 15 * 60 * 1000, max: 20 },
  authEmailWindowSeconds: 15 * 60,
  authEmailMaxRequests: 5
};
