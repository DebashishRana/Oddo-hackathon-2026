import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/database'
import { maskDocumentId } from '@/lib/pii-utils'

export const runtime = 'nodejs'

interface VerificationEventPayload {
  document_type: string
  user_name: string
  confidence: number
  image_url: string
  user_email?: string
  document_id?: string
  scanner_version?: string
  method?: string
  scanner_timestamp?: string
  extracted_fields?: Record<string, unknown>
  ocr_data?: Record<string, unknown>
}

interface VerificationEventResponse {
  event_id: number
  status: 'pending' | 'verified' | 'flagged'
  confidence: number
  risk_score: 'Low' | 'Medium' | 'High'
  created_at: string
}

function validateBearerToken(authHeader: string | null): boolean {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false
  }

  const token = authHeader.substring(7)
  const expectedToken = process.env.SCANNER_TOKEN

  if (!expectedToken) {
    console.error('[VerificationIngest] SCANNER_TOKEN environment variable not set')
    return false
  }

  return token === expectedToken
}

function determineStatus(confidence: number): 'pending' | 'verified' | 'flagged' {
  if (confidence >= 0.85) {
    return 'verified'
  }
  if (confidence < 0.6) {
    return 'flagged'
  }
  return 'pending'
}

function calculateRiskScore(confidence: number): 'Low' | 'Medium' | 'High' {
  if (confidence >= 0.85) {
    return 'Low'
  }
  if (confidence >= 0.6) {
    return 'Medium'
  }
  return 'High'
}

function validateConfidence(confidence: unknown): confidence is number {
  return typeof confidence === 'number' && confidence >= 0 && confidence <= 1
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')

    if (!validateBearerToken(authHeader)) {
      console.warn('[VerificationIngest] POST: Unauthorized access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let payload: VerificationEventPayload
    try {
      payload = await request.json()
    } catch (err) {
      console.error('[VerificationIngest] POST: Invalid JSON', err)
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
    }

    // Validate required fields
    if (!payload.document_type || typeof payload.document_type !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid required field: document_type' },
        { status: 400 }
      )
    }

    if (!payload.user_name || typeof payload.user_name !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid required field: user_name' },
        { status: 400 }
      )
    }

    if (!validateConfidence(payload.confidence)) {
      return NextResponse.json(
        { error: 'Invalid required field: confidence must be a number between 0 and 1' },
        { status: 400 }
      )
    }

    if (!payload.image_url || typeof payload.image_url !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid required field: image_url' },
        { status: 400 }
      )
    }

    const status = determineStatus(payload.confidence)
    const riskScore = calculateRiskScore(payload.confidence)

    // Mask sensitive document ID (keep last 4 digits only)
    const maskedInfo = maskDocumentId(payload.document_id || '', payload.document_type)

    const metadata = {
      status,
      document_type: payload.document_type,
      // PII fields (to be deleted after cross-verification)
      user_name: payload.user_name,
      user_email: payload.user_email || null,
      document_id: payload.document_id || null, // Full ID temporarily stored
      // Masked ID for compliance
      masked_document_id: maskedInfo.masked_id,
      last_4_digits: maskedInfo.last_4_digits,
      // Verification fields
      confidence: payload.confidence,
      risk_score: riskScore,
      image_url: payload.image_url,
      scanner_version: payload.scanner_version || null,
      method: payload.method || null,
      scanner_timestamp: payload.scanner_timestamp || new Date().toISOString(),
      extracted_fields: payload.extracted_fields || null,
      ocr_data: payload.ocr_data || null,
      // Cross-verification (to be populated by /api/cross-verify)
      cross_verified: false,
      api_source: null,
      api_verification_timestamp: null,
      // Compliance tracking
      pii_deleted: false,
      pii_deleted_at: null,
      cleaned_up: false,
    }

    const client = await pool.connect()
    try {
      const insertQuery = `
        INSERT INTO verification_events (document_type, metadata, received_at, created_at, updated_at)
        VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING id, created_at
      `

      const result = await client.query(insertQuery, [payload.document_type, JSON.stringify(metadata)])

      const eventId = result.rows[0].id
      const createdAt = result.rows[0].created_at

      console.log('[VerificationIngest] POST: Event created', {
        event_id: eventId,
        document_type: payload.document_type,
        confidence: payload.confidence,
        status,
        risk_score: riskScore,
        masked_id: maskedInfo.masked_id,
      })

      // Trigger cross-verification in background (non-blocking)
      if (payload.document_id && payload.document_type) {
        triggerCrossVerification(eventId, payload.document_type, payload.document_id).catch((err) => {
          console.error('[VerificationIngest] Background cross-verify failed:', err)
        })
      }

      const response: VerificationEventResponse = {
        event_id: eventId,
        status,
        confidence: payload.confidence,
        risk_score: riskScore,
        created_at: createdAt.toISOString(),
      }

      return NextResponse.json(response, { status: 200 })
    } finally {
      client.release()
    }
  } catch (err) {
    console.error('[VerificationIngest] POST: Database error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * Trigger cross-verification in the background without blocking the response
 */
async function triggerCrossVerification(
  eventId: number,
  documentType: string,
  documentId: string
): Promise<void> {
  try {
    // Get base URL (works in both dev and production)
    const baseUrl =
      process.env.NEXTAUTH_URL || process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL || process.env.NEXTAUTH_URL}`
        : 'http://localhost:3000'

    const response = await fetch(`${baseUrl}/api/cross-verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_id: eventId,
        document_type: documentType,
        document_id: documentId,
        confidence: 0.85, // Will be read from DB in a real implementation
      }),
    })

    if (!response.ok) {
      console.warn('[VerificationIngest] Cross-verify request failed:', response.status)
      return
    }

    const result = await response.json()
    console.log('[VerificationIngest] Cross-verification triggered:', {
      event_id: eventId,
      cross_verified: result.cross_verified,
      api_source: result.api_source,
    })
  } catch (err) {
    console.error('[VerificationIngest] Cross-verification background task failed:', err)
  }
}

interface DeletePayload {
  event_id: number
}

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')

    if (!validateBearerToken(authHeader)) {
      console.warn('[VerificationIngest] DELETE: Unauthorized access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let payload: DeletePayload
    try {
      payload = await request.json()
    } catch (err) {
      console.error('[VerificationIngest] DELETE: Invalid JSON', err)
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
    }

    if (!payload.event_id || typeof payload.event_id !== 'number') {
      return NextResponse.json(
        { error: 'Missing or invalid required field: event_id' },
        { status: 400 }
      )
    }

    const client = await pool.connect()
    try {
      // Soft delete: mark as cleaned_up in metadata
      const updateQuery = `
        UPDATE verification_events
        SET metadata = jsonb_set(metadata, '{cleaned_up}', 'true'), updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING id, metadata
      `

      const result = await client.query(updateQuery, [payload.event_id])

      if (result.rows.length === 0) {
        console.warn('[VerificationIngest] DELETE: Event not found', { event_id: payload.event_id })
        return NextResponse.json({ error: 'Event not found' }, { status: 404 })
      }

      console.log('[VerificationIngest] DELETE: Event cleaned up', { event_id: payload.event_id })

      return NextResponse.json(
        { event_id: payload.event_id, cleaned_up: true },
        { status: 200 }
      )
    } finally {
      client.release()
    }
  } catch (err) {
    console.error('[VerificationIngest] DELETE: Database error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
