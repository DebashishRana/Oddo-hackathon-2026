import crypto from 'crypto'
import { NextRequest } from 'next/server'

const replayCache = new Map<string, number>()
const FIVE_MINUTES_MS = 5 * 60 * 1000

export type ScannerSignatureResult =
  | { ok: true; timestamp: string; nonce: string }
  | { ok: false; reason: string }

let redisPromise: Promise<import('ioredis').default | null> | null = null

async function getRedis() {
  if (!process.env.REDIS_URL) return null
  if (!redisPromise) {
    redisPromise = import('ioredis').then((module) => {
      return new module.default(process.env.REDIS_URL!, {
        maxRetriesPerRequest: 1,
        enableReadyCheck: false,
      })
    })
  }
  return redisPromise
}

function timingSafeEqualString(a: string, b: string): boolean {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  if (left.length !== right.length) return false
  return crypto.timingSafeEqual(left, right)
}

function pruneReplayCache() {
  const now = Date.now()
  for (const [key, expiresAt] of replayCache.entries()) {
    if (expiresAt <= now) replayCache.delete(key)
  }
}

export function verifyScannerSignature(request: NextRequest, rawBody: string): ScannerSignatureResult {
  const secret = process.env.SCANNER_SIGNING_SECRET
  const timestamp = request.headers.get('x-dectra-timestamp')
  const nonce = request.headers.get('x-dectra-nonce')
  const signature = request.headers.get('x-dectra-signature')

  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      return { ok: false, reason: 'missing_scanner_signing_secret' }
    }
    return { ok: true, timestamp: timestamp || new Date().toISOString(), nonce: nonce || 'dev-unsigned' }
  }

  if (!timestamp || !nonce || !signature) {
    return { ok: false, reason: 'missing_signature_headers' }
  }

  const requestTime = Date.parse(timestamp)
  if (!Number.isFinite(requestTime) || Math.abs(Date.now() - requestTime) > FIVE_MINUTES_MS) {
    return { ok: false, reason: 'stale_or_invalid_timestamp' }
  }

  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}.${nonce}.${rawBody}`)
    .digest('hex')

  if (!timingSafeEqualString(signature, expected)) {
    return { ok: false, reason: 'invalid_signature' }
  }

  return { ok: true, timestamp, nonce }
}

export async function verifyScannerReplayNonce(timestamp: string, nonce: string): Promise<ScannerSignatureResult> {
  if (!process.env.SCANNER_SIGNING_SECRET) {
    return { ok: true, timestamp, nonce }
  }

  const replayKey = `${timestamp}:${nonce}`
  const redis = await getRedis()

  if (redis) {
    const stored = await redis.set(`scanner_replay:${replayKey}`, '1', 'EX', 5 * 60, 'NX')
    if (stored !== 'OK') {
      return { ok: false, reason: 'replay_detected' }
    }
    return { ok: true, timestamp, nonce }
  }

  pruneReplayCache()
  if (replayCache.has(replayKey)) {
    return { ok: false, reason: 'replay_detected' }
  }
  replayCache.set(replayKey, Date.now() + FIVE_MINUTES_MS)

  return { ok: true, timestamp, nonce }
}

export function validateScannerBearer(authHeader: string | null): boolean {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false
  const expectedToken = process.env.SCANNER_TOKEN
  if (!expectedToken) return process.env.NODE_ENV !== 'production'
  const token = authHeader.substring(7)
  return timingSafeEqualString(token, expectedToken)
}
