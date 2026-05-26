import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/database'

export const runtime = 'nodejs'

// GET /api/logs?limit=100&offset=0&status=verified&document_type=Aadhaar&sort=latest
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '100', 10), 500)
    const offset = parseInt(searchParams.get('offset') || '0', 10)
    const status = searchParams.get('status')
    const documentType = searchParams.get('document_type')
    const source = searchParams.get('source')
    const risk = searchParams.get('risk')
    const sort = searchParams.get('sort') || 'latest'

    const client = await pool.connect()
    try {
      // Build main query
      let query = `SELECT * FROM verification_events`
      const conditions = []
      const values = []

      if (status) {
        conditions.push(`metadata->>'status' = $${conditions.length + 1}`)
        values.push(status)
      }
      if (documentType) {
        conditions.push(`metadata->>'document_type' = $${conditions.length + 1}`)
        values.push(documentType)
      }
      if (source) {
        conditions.push(`COALESCE(metadata->>'api_source', 'Pending') = $${conditions.length + 1}`)
        values.push(source)
      }
      if (risk) {
        conditions.push(`metadata->>'risk_score' = $${conditions.length + 1}`)
        values.push(risk)
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ')
      }

      // Sort order
      const orderClause = sort === 'oldest' ? 'ASC' : 'DESC'
      query += ` ORDER BY received_at ${orderClause}`

      // Pagination
      query += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`
      values.push(limit, offset)

      // Get logs
      const result = await client.query(query, values)
      const logs = result.rows

      // Get stats
      const statsQuery = `
        SELECT
          COUNT(*) as total,
          COUNT(CASE WHEN metadata->>'status' = 'verified' THEN 1 END) as verified,
          COUNT(CASE WHEN metadata->>'status' = 'flagged' THEN 1 END) as flagged,
          COUNT(CASE WHEN metadata->>'status' = 'pending' THEN 1 END) as pending,
          COUNT(CASE WHEN metadata->>'status' = 'failed' THEN 1 END) as failed,
          COUNT(CASE WHEN metadata->>'risk_score' = 'High' THEN 1 END) as high_risk
        FROM verification_events
      `
      const statsResult = await client.query(statsQuery)
      const stats = statsResult.rows[0]

      return NextResponse.json({
        logs,
        stats: {
          total: parseInt(stats.total),
          verified: parseInt(stats.verified),
          flagged: parseInt(stats.flagged),
          pending: parseInt(stats.pending),
          failed: parseInt(stats.failed),
          high_risk: parseInt(stats.high_risk),
        },
        pagination: {
          limit,
          offset,
          total: parseInt(stats.total),
        },
      })
    } finally {
      client.release()
    }
  } catch (err) {
    console.error('[Logs] GET error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
