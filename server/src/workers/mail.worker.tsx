import React from "react";
import { render } from "@react-email/render";
import { Job, Worker } from "bullmq";
import { createRedisConnection } from "../config/redis";
import { MAIL_DLQ_NAME, MAIL_QUEUE_NAME, mailDeadLetterQueue } from "../queues/mail.queue";
import { createEmailProvider } from "../providers/email/email.provider";
import { MailJob } from "../types/jobs";
import VerifyEmail, { verifyEmailText } from "../templates/VerifyEmail";
import { decryptSecret } from "../utils/crypto";
import { logger } from "../utils/logger";
import { auditService } from "../services/audit.service";

const provider = createEmailProvider();
const concurrency = Number(process.env.MAIL_WORKER_CONCURRENCY || 5);

const processMailJob = async (job: Job<MailJob>) => {
  if (job.data.type !== "verify_email") {
    throw new Error(`Unsupported mail job type: ${(job.data as { type?: string }).type}`);
  }

  const otp = decryptSecret(job.data.encryptedOtp);
  const requestContext =
    "requestContext" in job.data && job.data.requestContext
      ? job.data.requestContext
      : {
          requestId: (job.data as MailJob & { requestId?: string }).requestId || job.id?.toString() || "unknown",
          ip: "unknown"
        };
  logger.info("mail_worker_processing_verify_email", {
    jobId: job.id,
    requestId: requestContext.requestId,
    email: job.data.email,
    queue: MAIL_QUEUE_NAME,
    metadata: job.data.metadata
  });
  const html = await render(<VerifyEmail otp={otp} />);
  const text = verifyEmailText({ otp });

  const result = await provider.send({
    to: job.data.email,
    subject: "Verify your Dectra email",
    html,
    text,
    tags: {
      category: "auth",
      workflow: "email_verification",
      request_id: requestContext.requestId
    }
  });

  auditService.record("email_delivery_succeeded", {
    requestId: requestContext.requestId,
    email: job.data.email,
    provider: result.provider,
    messageId: result.messageId,
    jobId: job.id,
    metadata: job.data.metadata
  });

  return result;
};

const worker = new Worker<MailJob>(MAIL_QUEUE_NAME, processMailJob, {
  connection: createRedisConnection(),
  concurrency
});

worker.on("ready", () => {
  logger.info("mail_worker_ready", { queue: MAIL_QUEUE_NAME, concurrency, provider: provider.name });
});

worker.on("failed", async (job, error) => {
  logger.error("mail_worker_job_failed", {
    queue: MAIL_QUEUE_NAME,
    jobId: job?.id,
    attemptsMade: job?.attemptsMade,
    error: error.message
  });

  if (job && job.attemptsMade >= (job.opts.attempts || 1)) {
    const failedRequestContext =
      "requestContext" in job.data && job.data.requestContext
        ? job.data.requestContext
        : {
            requestId: (job.data as MailJob & { requestId?: string }).requestId || job.id?.toString() || "unknown",
            ip: "unknown"
          };

    await mailDeadLetterQueue.add("mail_failed", job.data, {
      jobId: `${MAIL_DLQ_NAME}:${job.id}`,
      removeOnComplete: { age: 60 * 60 * 24 * 30 }
    });

    auditService.warn("email_delivery_failed", {
      requestId: failedRequestContext.requestId,
      email: job.data.email,
      jobId: job.id,
      error: error.message,
      metadata: job.data.metadata
    });
  }
});

const shutdown = async (signal: string) => {
  logger.info("mail_worker_shutdown_started", { signal });
  await worker.close();
  await mailDeadLetterQueue.close();
  logger.info("mail_worker_shutdown_complete");
  process.exit(0);
};

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});
