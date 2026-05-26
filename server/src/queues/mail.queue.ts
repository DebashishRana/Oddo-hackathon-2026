import { Queue, QueueEvents } from "bullmq";
import { createRedisConnection } from "../config/redis";
import { MailJob } from "../types/jobs";
import { logger } from "../utils/logger";

export const MAIL_QUEUE_NAME = "dectra.mail";
export const MAIL_DLQ_NAME = "dectra.mail.dlq";

export const mailQueue = new Queue<MailJob>(MAIL_QUEUE_NAME, {
  connection: createRedisConnection(),
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5_000
    },
    removeOnComplete: { age: 60 * 60 * 24, count: 5000 },
    removeOnFail: { age: 60 * 60 * 24 * 7, count: 10000 }
  }
});

export const mailDeadLetterQueue = new Queue<MailJob>(MAIL_DLQ_NAME, {
  connection: createRedisConnection()
});

export const mailQueueEvents = new QueueEvents(MAIL_QUEUE_NAME, {
  connection: createRedisConnection()
});

mailQueueEvents.on("completed", ({ jobId }) => {
  logger.info("mail_job_completed", { jobId, queue: MAIL_QUEUE_NAME });
});

mailQueueEvents.on("failed", ({ jobId, failedReason }) => {
  logger.error("mail_job_failed", { jobId, queue: MAIL_QUEUE_NAME, failedReason });
});

export const enqueueVerifyEmail = async (job: MailJob) =>
  mailQueue.add("verify_email", job, {
    jobId: `verify:${job.email}:${job.requestId}`
  });
