import { NextRequest, NextResponse } from 'next/server'
import { checkAdminAccess } from '@/lib/admin-auth'
import { pool } from '@/lib/database'

export const runtime = 'nodejs'

type FilterValue = {
  clause: string
  value: string
}

function pushFilter(filters: FilterValue[], clause: string, value: string | null) {
  if (value && value !== 'all') {
    filters.push({ clause, value })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { isAdmin } = await checkAdminAccess()
    if (!isAdmin && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized', error: { code: 'UNAUTHORIZED' } },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = Math.min(Number(searchParams.get('limit') || 50), 100)
    const status = searchParams.get('status')
    const documentType = searchParams.get('document_type')
    const source = searchParams.get('source')
    const risk = searchParams.get('risk')

    const filters: FilterValue[] = []
    pushFilter(filters, "metadata->>'status' = $IDX", status)
    pushFilter(filters, "metadata->>'document_type' = $IDX", documentType)
    pushFilter(filters, "COALESCE(metadata->>'api_source', 'Pending') = $IDX", source)
    pushFilter(filters, "metadata->>'risk_score' = $IDX", risk)

    const values = filters.map((filter) => filter.value)
    const whereClause =
      filters.length > 0
        ? `WHERE ${filters
            .map((filter, index) => filter.clause.replace('$IDX', `$${index + 1}`))
            .join(' AND ')}`
        : ''

    const client = await pool.connect()
    try {
      const rows = await client.query(
        `SELECT
           id,
           document_type,
           metadata,
           received_at,
           created_at,
           updated_at
         FROM verification_events
         ${whereClause}
         ORDER BY updated_at DESC
         LIMIT $${values.length + 1}`,
        [...values, limit]
      )

      const statsResult = await client.query(
        `SELECT
           COUNT(*)::int as total,
           COUNT(CASE WHEN metadata->>'status' = 'verified' THEN 1 END)::int as verified,
           COUNT(CASE WHEN metadata->>'status' = 'flagged' THEN 1 END)::int as flagged,
           COUNT(CASE WHEN metadata->>'status' = 'pending' THEN 1 END)::int as pending,
           COUNT(CASE WHEN metadata->>'status' = 'failed' THEN 1 END)::int as failed,
           COUNT(CASE WHEN metadata->>'risk_score' = 'High' THEN 1 END)::int as high_risk
         FROM verification_events`
      )

      const trendResult = await client.query(
        `SELECT
           TO_CHAR(received_at, 'Mon DD') as date,
           COUNT(CASE WHEN metadata->>'status' = 'verified' THEN 1 END)::int as verified,
           COUNT(CASE WHEN metadata->>'status' = 'flagged' THEN 1 END)::int as flagged,
           COUNT(CASE WHEN metadata->>'status' = 'pending' THEN 1 END)::int as pending,
           COUNT(CASE WHEN metadata->>'status' = 'failed' THEN 1 END)::int as failed
         FROM verification_events
         WHERE received_at >= CURRENT_DATE - INTERVAL '6 days'
         GROUP BY DATE(received_at), TO_CHAR(received_at, 'Mon DD')
         ORDER BY DATE(received_at) ASC`
      )

      return NextResponse.json({
        success: true,
        message: 'Verification queue loaded.',
        data: {
          verifications: rows.rows.map((row) => {
            const metadata = row.metadata || {}
            return {
              id: Number(row.id),
              document_type: metadata.document_type || row.document_type || 'Unknown',
              status: metadata.status || 'pending',
              risk_score: metadata.risk_score || 'Medium',
              confidence: metadata.confidence || null,
              source: metadata.api_source || 'Pending',
              masked_document_id: metadata.masked_document_id || 'UNKNOWN',
              scanner_event_id: metadata.scanner_event_id || null,
              source_app: metadata.source_app || 'scanner',
              scanner_version: metadata.scanner_version || null,
              scanner_timestamp: metadata.scanner_timestamp || null,
              reason_codes: metadata.reason_codes || [],
              action_required: metadata.action_required || null,
              action_history: metadata.action_history || [],
              audit_trail: metadata.audit_trail || [],
              created_at: row.created_at,
              updated_at: row.updated_at,
              received_at: row.received_at,
            }
          }),
          stats: statsResult.rows[0],
          trends: trendResult.rows,
        },
      })
    } finally {
      client.release()
    }
  } catch (err) {
    console.error('[AdminVerifications] GET error', err)
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: { code: 'INTERNAL_ERROR' } },
      { status: 500 }
    )
  }
}
