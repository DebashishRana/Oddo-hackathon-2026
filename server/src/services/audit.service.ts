import { logger } from "../utils/logger";
import { sha256 } from "../utils/crypto";
import { RequestContext } from "../types/api";

export type AuditEvent =
  | "otp_requested"
  | "otp_resent"
  | "otp_verified"
  | "otp_failed"
  | "otp_locked"
  | "email_delivery_succeeded"
  | "email_delivery_failed"
  | "suspicious_activity";

export class AuditService {
  record(event: AuditEvent, context: Partial<RequestContext> & Record<string, unknown>) {
    const email = typeof context.email === "string" ? context.email : undefined;
    const { email: _email, ...rest } = context;

    logger.info(event, {
      audit_type: "auth",
      event,
      email_hash: email ? sha256(email) : undefined,
      ...rest
    });
  }

  warn(event: AuditEvent, context: Partial<RequestContext> & Record<string, unknown>) {
    const email = typeof context.email === "string" ? context.email : undefined;
    const { email: _email, ...rest } = context;

    logger.warn(event, {
      audit_type: "security",
      event,
      email_hash: email ? sha256(email) : undefined,
      ...rest
    });
  }
}

export const auditService = new AuditService();
