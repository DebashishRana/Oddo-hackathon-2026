import 'dotenv/config'
import { Worker } from 'bullmq'
import IORedis from 'ioredis'
import { CROSS_VERIFICATION_QUEUE } from '../src/lib/verification/queue'
import { markVerificationFailed, runCrossVerification } from '../src/lib/verification/orchestrator'
import type { VerificationJob } from '../src/lib/verification/types'

if (!process.env.REDIS_URL) {
  throw new Error('REDIS_URL is required to run the verification worker')
}

const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
})

const worker = new Worker<VerificationJob>(
  CROSS_VERIFICATION_QUEUE,
  async (job) => {
    return runCrossVerification(job.data)
  },
  {
    connection,
    concurrency: Number(process.env.CROSS_VERIFICATION_WORKER_CONCURRENCY || 5),
  }
)

worker.on('completed', (job) => {
  console.log('[VerificationWorker] Completed job', { jobId: job.id, event_id: job.data.event_id })
})

worker.on('failed', (job, error) => {
  console.error('[VerificationWorker] Failed job', {
    jobId: job?.id,
    event_id: job?.data.event_id,
    attemptsMade: job?.attemptsMade,
    error: error.message,
  })

  if (job && job.attemptsMade >= (job.opts.attempts || 1)) {
    markVerificationFailed(job.data, error).catch((err) => {
      console.error('[VerificationWorker] Failed to mark verification failed', err)
    })
  }
})

async function shutdown(signal: string) {
  console.log('[VerificationWorker] Shutting down', { signal })
  await worker.close()
  await connection.quit()
  process.exit(0)
}

process.on('SIGINT', () => {
  void shutdown('SIGINT')
})

process.on('SIGTERM', () => {
  void shutdown('SIGTERM')
})
