import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/database'
import { runCrossVerification } from '@/lib/verification/orchestrator'
import type { VerificationJob } from '@/lib/verification/types'

export const runtime = 'nodejs'

function isValidJob(payload: unknown): payload is VerificationJob {
  if (!payload || typeof payload !== 'object') return false
  const body = payload as Partial<VerificationJob>
  return (
    typeof body.event_id === 'number' &&
    typeof body.document_type === 'string' &&
    typeof body.confidence === 'number' &&
    (!body.document_id || typeof body.document_id === 'string')
  )
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as unknown
    if (!isValidJob(payload)) {
      return NextResponse.json(
        { success: false, message: 'Invalid cross-verification payload', error: { code: 'INVALID_PAYLOAD' } },
        { status: 400 }
      )
    }

    const verdict = await runCrossVerification(payload)

    return NextResponse.json({
      success: true,
      message:
        verdict.status === 'verified'
          ? `Document verified via ${verdict.api_source}`
          : `Document requires review after ${verdict.api_source}`,
      data: {
        event_id: payload.event_id,
        ...verdict,
      },
    })
  } catch (err) {
    console.error('[CrossVerify] Error', err)
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: { code: 'INTERNAL_ERROR' } },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const eventId = request.nextUrl.searchParams.get('event_id')
    if (!eventId) {
      return NextResponse.json(
        { success: false, message: 'Missing required query parameter: event_id', error: { code: 'INVALID_QUERY' } },
        { status: 400 }
      )
    }

    const client = await pool.connect()
    try {
      const result = await client.query(
        `SELECT
           id,
           document_type,
           metadata->>'status' as status,
           metadata->>'cross_verified' as cross_verified,
           metadata->>'api_source' as api_source,
           metadata->>'masked_document_id' as masked_document_id,
           metadata->>'confidence' as confidence,
           metadata->>'risk_score' as risk_score,
           metadata->'reason_codes' as reason_codes,
           metadata->'audit_trail' as audit_trail,
           created_at,
           updated_at
         FROM verification_events
         WHERE id = $1`,
        [eventId]
      )

      if (result.rows.length === 0) {
        return NextResponse.json(
          { success: false, message: 'Event not found', error: { code: 'NOT_FOUND' } },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Verification status loaded.',
        data: result.rows[0],
      })
    } finally {
      client.release()
    }
  } catch (err) {
    console.error('[CrossVerify] GET error', err)
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: { code: 'INTERNAL_ERROR' } },
      { status: 500 }
    )
  }
}
