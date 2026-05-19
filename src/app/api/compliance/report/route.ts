/**
 * Compliance Report Generator
 * 
 * Generates audit-trail reports for regulatory compliance
 * All PII is masked/removed - only verification facts are included
 * 
 * Endpoints:
 * GET /api/compliance/report?format=json|csv&start_date=...&end_date=...&status=verified|flagged|pending
 */

import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/database'

export const runtime = 'nodejs'

interface ComplianceEvent {
  event_id: number
  document_type: string
  masked_document_id: string
  confidence: number
  risk_score: string
  status: string
  cross_verified: boolean
  api_source: string | null
  received_at: string
  created_at: string
  pii_deleted: boolean
}

interface ComplianceReport {
  report_id: string
  generated_at: string
  period: {
    start_date: string
    end_date: string
  }
  summary: {
    total_events: number
    verified_count: number
    flagged_count: number
    pending_count: number
    cross_verified_count: number
    high_risk_count: number
  }
  events: ComplianceEvent[]
  compliance_notice: string
}

/**
 * Convert report to CSV format
 */
function generateCSV(events: ComplianceEvent[]): string {
  const headers = [
    'Event ID',
    'Document Type',
    'Masked ID',
    'Confidence',
    'Risk Score',
    'Status',
    'Cross-Verified',
    'API Source',
    'Received At',
  ]

  const rows = events.map((evt) => [
    evt.event_id,
    evt.document_type,
    evt.masked_document_id,
    evt.confidence.toFixed(2),
    evt.risk_score,
    evt.status,
    evt.cross_verified ? 'Yes' : 'No',
    evt.api_source || 'N/A',
    new Date(evt.received_at).toISOString(),
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n')

  return csvContent
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const format = searchParams.get('format') || 'json' // json or csv
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')
    const statusFilter = searchParams.get('status') // verified, flagged, pending, or null for all

    // Validate format
    if (!['json', 'csv'].includes(format)) {
      return NextResponse.json({ error: 'Invalid format. Use json or csv' }, { status: 400 })
    }

    const client = await pool.connect()
    try {
      // Build query with optional filters
      const whereConditions = ["metadata->>'pii_deleted' = 'true'"] // Only fetch PII-deleted events
      const params: string[] = []

      if (startDate) {
        whereConditions.push('created_at >= $' + (params.length + 1))
        params.push(new Date(startDate).toISOString())
      }

      if (endDate) {
        whereConditions.push('created_at <= $' + (params.length + 1))
        params.push(new Date(endDate).toISOString())
      }

      if (statusFilter) {
        whereConditions.push("metadata->>'status' = $" + (params.length + 1))
        params.push(statusFilter)
      }

      const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : ''

      const query = `
        SELECT
          id as event_id,
          document_type,
          metadata->>'masked_document_id' as masked_document_id,
          (metadata->>'confidence')::float as confidence,
          metadata->>'risk_score' as risk_score,
          metadata->>'status' as status,
          (metadata->>'cross_verified')::boolean as cross_verified,
          metadata->>'api_source' as api_source,
          received_at,
          created_at,
          (metadata->>'pii_deleted')::boolean as pii_deleted
        FROM verification_events
        ${whereClause}
        ORDER BY created_at DESC
      `

      const result = await client.query(query, params)
      const events = result.rows as ComplianceEvent[]

      // Calculate summary statistics
      const summary = {
        total_events: events.length,
        verified_count: events.filter((e) => e.status === 'verified').length,
        flagged_count: events.filter((e) => e.status === 'flagged').length,
        pending_count: events.filter((e) => e.status === 'pending').length,
        cross_verified_count: events.filter((e) => e.cross_verified).length,
        high_risk_count: events.filter((e) => e.risk_score === 'High').length,
      }

      if (format === 'csv') {
        const csv = generateCSV(events)
        return new NextResponse(csv, {
          status: 200,
          headers: {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition':
              `attachment; filename="compliance-report-${new Date().toISOString().split('T')[0]}.csv"`,
          },
        })
      }

      // JSON format (default)
      const report: ComplianceReport = {
        report_id: `RPT-${Date.now()}`,
        generated_at: new Date().toISOString(),
        period: {
          start_date: startDate || 'All time',
          end_date: endDate || 'Present',
        },
        summary,
        events,
        compliance_notice:
          'This report contains only PII-masked verification events for audit purposes. ' +
          'All sensitive user information has been deleted from the source database. ' +
          'Document IDs show only the last 4 digits for regulatory compliance.',
      }

      return NextResponse.json(report, { status: 200 })
    } finally {
      client.release()
    }
  } catch (err) {
    console.error('[ComplianceReport] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
