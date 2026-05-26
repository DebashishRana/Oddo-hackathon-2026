import type { Queue } from 'bullmq'
import type { VerificationJob } from './types'

export const CROSS_VERIFICATION_QUEUE = 'dectra.cross-verification'

let queuePromise: Promise<Queue<VerificationJob> | null> | null = null

async function getQueue(): Promise<Queue<VerificationJob> | null> {
  if (!process.env.REDIS_URL) return null

  if (!queuePromise) {
    queuePromise = Promise.all([import('bullmq'), import('ioredis')]).then(([bullmq, ioredis]) => {
      const connection = new ioredis.default(process.env.REDIS_URL!, {
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
      })

      return new bullmq.Queue<VerificationJob>(CROSS_VERIFICATION_QUEUE, {
        connection,
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 3000,
          },
          removeOnComplete: {
            age: 60 * 60 * 24,
            count: 5000,
          },
          removeOnFail: {
            age: 60 * 60 * 24 * 7,
            count: 10000,
          },
        },
      })
    })
  }

  return queuePromise
}

export async function enqueueCrossVerification(job: VerificationJob): Promise<'queued' | 'inline'> {
  const queue = await getQueue()
  if (!queue) {
    const { runCrossVerification, markVerificationFailed } = await import('./orchestrator')
    runCrossVerification(job).catch((err) => {
      console.error('[CrossVerificationQueue] Inline verification failed', err)
      markVerificationFailed(job, err).catch((markErr) => {
        console.error('[CrossVerificationQueue] Failed to mark event failed', markErr)
      })
    })
    return 'inline'
  }

  await queue.add('cross-verify', job, {
    jobId: `cross-verify:${job.event_id}`,
  })

  return 'queued'
}
