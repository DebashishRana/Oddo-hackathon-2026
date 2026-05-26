import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/database'
import { appendAuditEvent } from '@/lib/verification/audit'
import { displayDocumentType } from '@/lib/verification/normalization'
import { enqueueCrossVerification } from '@/lib/verification/queue'
import { calculateInitialRisk, determineInitialStatus, validateConfidence } from '@/lib/verification/scoring'
import { validateScannerBearer, verifyScannerReplayNonce, verifyScannerSignature } from '@/lib/verification/signature'
import type { ScannerPayload } from '@/lib/verification/types'
import { maskDocumentId } from '@/lib/pii-utils'

export const runtime = 'nodejs'

type VerificationEventResponse = {
  success: boolean
  message: string
  data: {
    event_id: number
    scanner_event_id?: string
    status: string
    queue_mode: 'queued' | 'inline' | 'not_queued'
    confidence: number
    risk_score: string
    created_at: string
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function parsePayload(rawBody: string): ScannerPayload {
  const payload = JSON.parse(rawBody) as unknown
  if (!isObject(payload)) {
    throw new Error('Payload must be an object')
  }

  return payload as ScannerPayload
}

function validatePayload(payload: ScannerPayload): string | null {
  if (!payload.document_type || typeof payload.document_type !== 'string') {
    return 'Missing or invalid required field: document_type'
  }

  if (!validateConfidence(payload.confidence)) {
    return 'Invalid required field: confidence must be a number between 0 and 1'
  }

  if (payload.document_id && typeof payload.document_id !== 'string') {
    return 'Invalid field: document_id'
  }

  if (payload.timestamp && Number.isNaN(Date.parse(payload.timestamp))) {
    return 'Invalid field: timestamp'
  }

  return null
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text()

  try {
    const authHeader = request.headers.get('authorization')
    if (!validateScannerBearer(authHeader)) {
      console.warn('[VerificationIngest] Unauthorized scanner request')
      return NextResponse.json(
        { success: false, message: 'Unauthorized', error: { code: 'UNAUTHORIZED' } },
        { status: 401 }
      )
    }

    const signatureResult = verifyScannerSignature(request, rawBody)
    if (!signatureResult.ok) {
      console.warn('[VerificationIngest] Scanner signature rejected', { reason: signatureResult.reason })
      return NextResponse.json(
        { success: false, message: 'Invalid scanner signature', error: { code: 'INVALID_SIGNATURE' } },
        { status: 401 }
      )
    }

    const replayResult = await verifyScannerReplayNonce(signatureResult.timestamp, signatureResult.nonce)
    if (!replayResult.ok) {
      console.warn('[VerificationIngest] Scanner replay rejected', { reason: replayResult.reason })
      return NextResponse.json(
        { success: false, message: 'Replay detected', error: { code: 'REPLAY_DETECTED' } },
        { status: 409 }
      )
    }

    let payload: ScannerPayload
    try {
      payload = parsePayload(rawBody)
    } catch (err) {
      console.error('[VerificationIngest] Invalid JSON', err)
      return NextResponse.json(
        { success: false, message: 'Invalid JSON payload', error: { code: 'INVALID_JSON' } },
        { status: 400 }
      )
    }

    const validationError = validatePayload(payload)
    if (validationError) {
      return NextResponse.json(
        { success: false, message: validationError, error: { code: 'INVALID_PAYLOAD' } },
        { status: 400 }
      )
    }

    const documentType = displayDocumentType(payload.document_type)
    const status = determineInitialStatus(payload.confidence)
    const riskScore = calculateInitialRisk(payload.confidence)
    const maskedInfo = maskDocumentId(payload.document_id || '', documentType)

    const receivedMetadata = appendAuditEvent(
      {
        scanner_event_id: payload.event_id || null,
        status,
        document_type: documentType,
        user_name: payload.user_name || null,
        user_email: payload.user_email || null,
        document_id: payload.document_id || null,
        masked_document_id: maskedInfo.masked_id,
        last_4_digits: maskedInfo.last_4_digits,
        confidence: payload.confidence,
        risk_score: riskScore,
        image_url: payload.image_url || null,
        source_app: payload.source_app || 'scanner',
        scanner_version: payload.scanner_version || null,
        method: payload.method || 'qr_scan',
        scanner_timestamp: payload.scanner_timestamp || payload.timestamp || new Date().toISOString(),
        request_timestamp: signatureResult.timestamp,
        request_nonce: signatureResult.nonce,
        extracted_fields: payload.extracted_fields || null,
        ocr_data: payload.ocr_data || null,
        cross_verified: false,
        api_source: null,
        api_verification_timestamp: null,
        pii_deleted: false,
        pii_deleted_at: null,
        cleaned_up: false,
        action_required: status === 'flagged' ? 'admin_review_required' : null,
        action_history: [],
      },
      {
        type: 'verification_received',
        actor: payload.source_app || 'scanner',
        details: {
          scanner_event_id: payload.event_id || null,
          document_type: documentType,
          confidence: payload.confidence,
          risk_score: riskScore,
        },
      }
    )

    const client = await pool.connect()
    try {
      const result = await client.query(
        `INSERT INTO verification_events (document_type, metadata, received_at, created_at, updated_at)
         VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         RETURNING id, created_at`,
        [documentType, JSON.stringify(receivedMetadata)]
      )

      const eventId = Number(result.rows[0].id)
      const createdAt = result.rows[0].created_at as Date
      let queueMode: 'queued' | 'inline' | 'not_queued' = 'not_queued'

      if (payload.document_id) {
        queueMode = process.env.REDIS_URL ? 'queued' : 'inline'

        const queuedMetadata = appendAuditEvent(receivedMetadata, {
          type: 'cross_verification_queued',
          actor: 'verification-ingest',
          details: {
            queue_mode: queueMode,
          },
        })

        await client.query(
          `UPDATE verification_events
           SET metadata = $1, updated_at = CURRENT_TIMESTAMP
           WHERE id = $2`,
          [JSON.stringify(queuedMetadata), eventId]
        )

        queueMode = await enqueueCrossVerification({
          event_id: eventId,
          document_type: documentType,
          document_id: payload.document_id,
          confidence: payload.confidence,
        })
      }

      const response: VerificationEventResponse = {
        success: true,
        message: payload.document_id
          ? 'Verification accepted and queued for cross-check.'
          : 'Verification accepted. Admin review is required because no document identifier was provided.',
        data: {
          event_id: eventId,
          scanner_event_id: payload.event_id,
          status,
          queue_mode: queueMode,
          confidence: payload.confidence,
          risk_score: riskScore,
          created_at: createdAt.toISOString(),
        },
      }

      return NextResponse.json(response, { status: 202 })
    } finally {
      client.release()
    }
  } catch (err) {
    console.error('[VerificationIngest] Error', err)
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: { code: 'INTERNAL_ERROR' } },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!validateScannerBearer(request.headers.get('authorization'))) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized', error: { code: 'UNAUTHORIZED' } },
        { status: 401 }
      )
    }

    const payload = (await request.json()) as { event_id?: number }
    if (!payload.event_id || typeof payload.event_id !== 'number') {
      return NextResponse.json(
        { success: false, message: 'Missing or invalid required field: event_id', error: { code: 'INVALID_PAYLOAD' } },
        { status: 400 }
      )
    }

    const client = await pool.connect()
    try {
      const eventResult = await client.query('SELECT metadata FROM verification_events WHERE id = $1', [
        payload.event_id,
      ])

      if (eventResult.rows.length === 0) {
        return NextResponse.json(
          { success: false, message: 'Event not found', error: { code: 'NOT_FOUND' } },
          { status: 404 }
        )
      }

      const metadata = appendAuditEvent(
        {
          ...(eventResult.rows[0].metadata as Record<string, unknown>),
          cleaned_up: true,
        },
        {
          type: 'verification_cleaned_up',
          actor: 'scanner',
        }
      )

      await client.query(
        `UPDATE verification_events
         SET metadata = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2`,
        [JSON.stringify(metadata), payload.event_id]
      )

      return NextResponse.json({
        success: true,
        message: 'Verification event cleaned up.',
        data: { event_id: payload.event_id, cleaned_up: true },
      })
    } finally {
      client.release()
    }
  } catch (err) {
    console.error('[VerificationIngest] DELETE error', err)
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: { code: 'INTERNAL_ERROR' } },
      { status: 500 }
    )
  }
}
