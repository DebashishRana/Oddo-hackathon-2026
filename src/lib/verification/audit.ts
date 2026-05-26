import crypto from 'crypto'
import type { VerificationAuditEvent } from './types'

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value)
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`

  return `{${Object.keys(value as Record<string, unknown>)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify((value as Record<string, unknown>)[key])}`)
    .join(',')}}`
}

export function appendAuditEvent(
  metadata: Record<string, unknown>,
  event: Omit<VerificationAuditEvent, 'previous_hash' | 'hash' | 'at'>
): Record<string, unknown> {
  const existingTrail = Array.isArray(metadata.audit_trail)
    ? (metadata.audit_trail as VerificationAuditEvent[])
    : []
  const previousHash = existingTrail.at(-1)?.hash
  const at = new Date().toISOString()
  const unsignedEvent = {
    ...event,
    at,
    previous_hash: previousHash,
  }

  const hash = crypto
    .createHash('sha256')
    .update(`${previousHash || 'genesis'}:${stableStringify(unsignedEvent)}`)
    .digest('hex')

  return {
    ...metadata,
    audit_trail: [
      ...existingTrail,
      {
        ...unsignedEvent,
        hash,
      },
    ],
  }
}
