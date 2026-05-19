/**
 * Cross-Verification Endpoint
 * 
 * Verifies document authenticity against official APIs:
 * - UIDAI (Aadhaar)
 * - DigiLocker (General documents)
 * - Income Tax (PAN)
 * 
 * Returns verification status and masks sensitive data
 */

import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/database'
import {
  maskDocumentId,
  createCompliantMetadata,
  extractLast4,
  isValidAadhaarFormat,
  isValidPANFormat,
  isValidPassportFormat,
} from '@/lib/pii-utils'

export const runtime = 'nodejs'

interface CrossVerifyRequest {
  event_id: number
  document_type: string
  document_id?: string
  confidence: number
}

interface CrossVerifyResponse {
  event_id: number
  cross_verified: boolean
  api_source: string
  verification_timestamp: string
  masked_document_id: string
  risk_assessment: 'Low' | 'Medium' | 'High'
  message: string
}

/**
 * Mock UIDAI Verification
 * In production, this would call the real UIDAI API with proper credentials
 */
async function verifyWithUIDAI(last4: string): Promise<{
  verified: boolean
  source: string
  timestamp: string
}> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 200))

  console.log(`[CrossVerify] UIDAI: Verifying Aadhaar ending with ${last4}`)

  // Mock verification logic
  // In production: POST to actual UIDAI endpoint with proper authentication
  const isValid = /^\d{4}$/.test(last4) && parseInt(last4) > 0

  return {
    verified: isValid,
    source: 'UIDAI',
    timestamp: new Date().toISOString(),
  }
}

/**
 * Mock DigiLocker Verification
 * In production, this would call the real DigiLocker API
 */
async function verifyWithDigiLocker(
  docType: string,
  last4: string
): Promise<{
  verified: boolean
  source: string
  timestamp: string
}> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 150))

  console.log(`[CrossVerify] DigiLocker: Verifying ${docType} ending with ${last4}`)

  // Mock verification logic
  // In production: POST to actual DigiLocker endpoint
  const isValid = /^[A-Z0-9]{4}$/.test(last4.toUpperCase())

  return {
    verified: isValid,
    source: 'DigiLocker',
    timestamp: new Date().toISOString(),
  }
}

/**
 * Main cross-verification orchestrator
 */
export async function POST(request: NextRequest) {
  try {
    const payload: CrossVerifyRequest = await request.json()

    // Validate payload
    if (!payload.event_id || !payload.document_type || !payload.document_id) {
      return NextResponse.json(
        { error: 'Missing required fields: event_id, document_type, document_id' },
        { status: 400 }
      )
    }

    const docType = payload.document_type.toLowerCase()
    const documentId = payload.document_id
    const last4 = extractLast4(documentId)

    if (!last4) {
      return NextResponse.json(
        { error: 'Unable to extract document identifier' },
        { status: 400 }
      )
    }

    // Mask the document ID for compliance
    const maskedInfo = maskDocumentId(documentId, payload.document_type)

    let verificationResult = {
      verified: false,
      source: 'UNKNOWN',
      timestamp: new Date().toISOString(),
    }

    // Route to appropriate verification API based on document type
    if (docType === 'aadhaar') {
      // Validate Aadhaar format
      if (!isValidAadhaarFormat(documentId)) {
        return NextResponse.json(
          { error: 'Invalid Aadhaar format (must be 12 digits)' },
          { status: 400 }
        )
      }
      verificationResult = await verifyWithUIDAI(last4)
    } else if (docType === 'pan') {
      // Validate PAN format
      if (!isValidPANFormat(documentId)) {
        return NextResponse.json(
          { error: 'Invalid PAN format (must be ABCDE1234F)' },
          { status: 400 }
        )
      }
      verificationResult = await verifyWithDigiLocker(docType, last4)
    } else if (docType === 'passport') {
      // Validate Passport format
      if (!isValidPassportFormat(documentId)) {
        return NextResponse.json(
          { error: 'Invalid Passport format (must be 8-9 alphanumeric characters)' },
          { status: 400 }
        )
      }
      verificationResult = await verifyWithDigiLocker(docType, last4)
    } else {
      return NextResponse.json(
        { error: `Unsupported document type: ${docType}` },
        { status: 400 }
      )
    }

    // Assess risk based on verification result and confidence
    let riskAssessment: 'Low' | 'Medium' | 'High' = 'High'
    if (verificationResult.verified && payload.confidence >= 0.85) {
      riskAssessment = 'Low'
    } else if (verificationResult.verified || payload.confidence >= 0.75) {
      riskAssessment = 'Medium'
    }

    // Update the verification event in database with:
    // 1. Cross-verification result
    // 2. Masked document ID
    // 3. Compliance-safe metadata
    const client = await pool.connect()
    try {
      // Fetch original event
      const fetchQuery = 'SELECT metadata FROM verification_events WHERE id = $1'
      const fetchResult = await client.query(fetchQuery, [payload.event_id])

      if (fetchResult.rows.length === 0) {
        return NextResponse.json({ error: 'Event not found' }, { status: 404 })
      }

      const originalMetadata = fetchResult.rows[0].metadata

      // Create compliant metadata (removes PII)
      const compliantMetadata = createCompliantMetadata(originalMetadata, {
        cross_verified: verificationResult.verified,
        api_source: verificationResult.source,
        verification_timestamp: verificationResult.timestamp,
      })

      // Add masked document ID to metadata
      compliantMetadata.masked_document_id = maskedInfo.masked_id
      compliantMetadata.last_4_digits = maskedInfo.last_4_digits

      // Update event with compliant metadata
      const updateQuery = `
        UPDATE verification_events
        SET 
          metadata = $1,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING id
      `

      await client.query(updateQuery, [JSON.stringify(compliantMetadata), payload.event_id])

      console.log('[CrossVerify] Event updated', {
        event_id: payload.event_id,
        cross_verified: verificationResult.verified,
        api_source: verificationResult.source,
        masked_id: maskedInfo.masked_id,
      })

      const response: CrossVerifyResponse = {
        event_id: payload.event_id,
        cross_verified: verificationResult.verified,
        api_source: verificationResult.source,
        verification_timestamp: verificationResult.timestamp,
        masked_document_id: maskedInfo.masked_id,
        risk_assessment: riskAssessment,
        message: verificationResult.verified
          ? `✓ Document verified via ${verificationResult.source}`
          : `✗ Could not verify document via ${verificationResult.source}`,
      }

      return NextResponse.json(response, { status: 200 })
    } finally {
      client.release()
    }
  } catch (err) {
    console.error('[CrossVerify] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * GET endpoint to check cross-verification status of an event
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const eventId = searchParams.get('event_id')

    if (!eventId) {
      return NextResponse.json(
        { error: 'Missing required query parameter: event_id' },
        { status: 400 }
      )
    }

    const client = await pool.connect()
    try {
      const query = `
        SELECT 
          id,
          document_type,
          metadata->>'cross_verified' as cross_verified,
          metadata->>'api_source' as api_source,
          metadata->>'masked_document_id' as masked_document_id,
          metadata->>'confidence' as confidence,
          created_at
        FROM verification_events
        WHERE id = $1
      `

      const result = await client.query(query, [eventId])

      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Event not found' }, { status: 404 })
      }

      return NextResponse.json(result.rows[0], { status: 200 })
    } finally {
      client.release()
    }
  } catch (err) {
    console.error('[CrossVerify] GET Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
