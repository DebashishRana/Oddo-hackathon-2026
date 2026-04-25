import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/database'

export const runtime = 'nodejs'

// GET /api/logs?limit=50&offset=0&document_type=Aadhaar&status=verified
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)
    const documentType = searchParams.get('document_type')
    const status = searchParams.get('status')

    let query = `SELECT * FROM verification_events`
    const conditions = []
    const values = []

    if (documentType) {
      conditions.push(`metadata->>'document_type' = $${conditions.length + 1}`)
      values.push(documentType)
    }
    if (status) {
      conditions.push(`metadata->>'status' = $${conditions.length + 1}`)
      values.push(status)
    }
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ')
    }
    query += ` ORDER BY received_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`
    values.push(limit, offset)

    const client = await pool.connect()
    try {
      const result = await client.query(query, values)
      return NextResponse.json({ logs: result.rows })
    } finally {
      client.release()
    }
  } catch (err) {
    console.error('[Logs] GET error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
