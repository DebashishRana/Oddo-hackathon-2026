import { pool } from '@/lib/database'
import { createCompliantMetadata, maskDocumentId } from '@/lib/pii-utils'
import { appendAuditEvent } from './audit'
import { verifyDocumentWithProvider } from './providers'
import { calculateFinalRisk, calculateFinalStatus } from './scoring'
import type { VerificationJob, VerificationVerdict } from './types'

function asMetadata(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return fallback
}

export async function runCrossVerification(job: VerificationJob): Promise<VerificationVerdict> {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const eventResult = await client.query(
      'SELECT id, document_type, metadata FROM verification_events WHERE id = $1 FOR UPDATE',
      [job.event_id]
    )

    if (eventResult.rows.length === 0) {
      throw new Error(`Verification event ${job.event_id} not found`)
    }

    const currentMetadata = appendAuditEvent(asMetadata(eventResult.rows[0].metadata), {
      type: 'cross_verification_started',
      actor: 'verification-orchestrator',
      details: {
        source: 'queue',
      },
    })

    await client.query(
      `UPDATE verification_events
       SET metadata = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [JSON.stringify({ ...currentMetadata, status: 'pending' }), job.event_id]
    )

    await client.query('COMMIT')
  } catch (err) {
    await client.query('ROLLBACK')
    client.release()
    throw err
  }

  client.release()

  const providerResult = await verifyDocumentWithProvider({
    documentType: job.document_type,
    documentId: job.document_id,
  })

  const confidence = toNumber(job.confidence)
  const status = calculateFinalStatus(providerResult.verified, confidence)
  const riskScore = calculateFinalRisk(providerResult.verified, confidence)
  const maskedInfo = maskDocumentId(job.document_id || '', job.document_type)

  const verdict: VerificationVerdict = {
    status,
    cross_verified: providerResult.verified,
    risk_score: riskScore,
    api_source: providerResult.source,
    reason_codes: providerResult.reason_codes,
    verification_timestamp: providerResult.timestamp,
    masked_document_id: maskedInfo.masked_id,
    last_4_digits: maskedInfo.last_4_digits,
  }

  const updateClient = await pool.connect()
  try {
    await updateClient.query('BEGIN')

    const eventResult = await updateClient.query(
      'SELECT metadata FROM verification_events WHERE id = $1 FOR UPDATE',
      [job.event_id]
    )

    if (eventResult.rows.length === 0) {
      throw new Error(`Verification event ${job.event_id} not found`)
    }

    const originalMetadata = asMetadata(eventResult.rows[0].metadata)
    const compliantMetadata = createCompliantMetadata(originalMetadata, {
      cross_verified: verdict.cross_verified,
      api_source: verdict.api_source,
      verification_timestamp: verdict.verification_timestamp,
    })

    const eventType = verdict.status === 'verified' ? 'cross_verification_succeeded' : 'document_flagged'
    const auditedMetadata = appendAuditEvent(
      {
        ...compliantMetadata,
        status: verdict.status,
        risk_score: verdict.risk_score,
        masked_document_id: verdict.masked_document_id,
        last_4_digits: verdict.last_4_digits,
        reason_codes: verdict.reason_codes,
        provider_evidence: providerResult.evidence || null,
        action_required: verdict.status === 'flagged' ? 'admin_review_required' : null,
        action_history: Array.isArray(originalMetadata.action_history) ? originalMetadata.action_history : [],
      },
      {
        type: eventType,
        actor: 'verification-orchestrator',
        details: {
          api_source: verdict.api_source,
          reason_codes: verdict.reason_codes,
          risk_score: verdict.risk_score,
        },
      }
    )

    const finalMetadata =
      verdict.status === 'flagged'
        ? appendAuditEvent(auditedMetadata, {
            type: 'admin_review_required',
            actor: 'verification-orchestrator',
            details: {
              reason_codes: verdict.reason_codes,
            },
          })
        : auditedMetadata

    await updateClient.query(
      `UPDATE verification_events
       SET metadata = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [JSON.stringify(finalMetadata), job.event_id]
    )

    await updateClient.query('COMMIT')
    return verdict
  } catch (err) {
    await updateClient.query('ROLLBACK')
    throw err
  } finally {
    updateClient.release()
  }
}

export async function markVerificationFailed(job: VerificationJob, error: unknown): Promise<void> {
  const client = await pool.connect()
  try {
    const eventResult = await client.query('SELECT metadata FROM verification_events WHERE id = $1', [job.event_id])
    if (eventResult.rows.length === 0) return

    const metadata = appendAuditEvent(
      {
        ...asMetadata(eventResult.rows[0].metadata),
        status: 'failed',
        risk_score: 'High',
        action_required: 'admin_review_required',
        reason_codes: ['provider_error'],
      },
      {
        type: 'cross_verification_failed',
        actor: 'verification-orchestrator',
        details: {
          error: error instanceof Error ? error.message : 'unknown_error',
        },
      }
    )

    await client.query(
      `UPDATE verification_events
       SET metadata = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [JSON.stringify(metadata), job.event_id]
    )
  } finally {
    client.release()
  }
}
