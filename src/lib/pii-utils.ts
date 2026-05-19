/**
 * PII Masking and Compliance Utilities
 * Handles sensitive data redaction for compliance (UIDAI, DigiLocker, etc.)
 */

export interface MaskedDocumentInfo {
  masked_id: string // Last 4 digits: XXXX-XXXX-1234
  document_type: string
  last_4_digits: string
  full_id?: string // Optional: only in non-compliant mode
}

interface CompliantMetadataInput {
  status?: string
  document_type?: string
  confidence?: number
  risk_score?: string
  masked_document_id?: string
  scanner_version?: string
  received_at?: string
  scanner_timestamp?: string
  [key: string]: unknown
}

interface CrossVerificationResult {
  cross_verified: boolean
  api_source?: string
  verification_timestamp?: string
}

/**
 * Extract last 4 digits and mask the rest of a document ID
 * Aadhaar: 123456789012 → XXXX-XXXX-9012
 * PAN: ABCDE1234F → XXXX-1234F
 * Passport: A1234567 → XXXX-4567
 */
export function maskDocumentId(documentId: string, docType: string): MaskedDocumentInfo {
  if (!documentId) {
    return {
      masked_id: 'UNKNOWN',
      document_type: docType,
      last_4_digits: '',
    }
  }

  const cleaned = documentId.replace(/[-\s]/g, '').toUpperCase()
  const length = cleaned.length

  let masked = ''
  let last4 = ''

  if (docType.toLowerCase() === 'aadhaar') {
    // Aadhaar: XXXX-XXXX-1234
    last4 = cleaned.slice(-4)
    masked = `XXXX-XXXX-${last4}`
  } else if (docType.toLowerCase() === 'pan') {
    // PAN: XXXX-1234F
    last4 = cleaned.slice(-4)
    masked = `XXXX-${last4}`
  } else if (docType.toLowerCase() === 'passport') {
    // Passport: XXXX-4567
    last4 = cleaned.slice(-4)
    masked = `XXXX-${last4}`
  } else {
    // Default: show last 4 only
    last4 = cleaned.slice(-4)
    masked = `${cleaned.slice(0, length - 4).replace(/./g, 'X')}${last4}`
  }

  return {
    masked_id: masked,
    document_type: docType,
    last_4_digits: last4,
    full_id: documentId, // For testing only, should be deleted in production
  }
}

/**
 * Create compliance-safe metadata by removing all PII
 * Keeps only verification facts
 */
export function createCompliantMetadata(
  originalMetadata: CompliantMetadataInput,
  crossVerificationResult: CrossVerificationResult
): Record<string, unknown> {
  return {
    // Core verification facts (keep)
    status: originalMetadata.status,
    document_type: originalMetadata.document_type,
    confidence: originalMetadata.confidence,
    risk_score: originalMetadata.risk_score,
    masked_document_id: originalMetadata.masked_document_id,
    scanner_version: originalMetadata.scanner_version,

    // Cross-verification results (new)
    cross_verified: crossVerificationResult.cross_verified,
    api_source: crossVerificationResult.api_source || null,
    api_verification_timestamp: crossVerificationResult.verification_timestamp || null,

    // Audit timestamps (keep for compliance)
    received_at_server: originalMetadata.received_at,
    scanner_timestamp: originalMetadata.scanner_timestamp,

    // Soft delete flag
    pii_deleted: true,
    pii_deleted_at: new Date().toISOString(),

    // Legacy (deprecated)
    cleaned_up: false,
  }
}

/**
 * Extract last 4 digits for cross-verification
 * Used to query UIDAI/DigiLocker APIs
 */
export function extractLast4(documentId: string): string {
  if (!documentId) return ''
  return documentId.replace(/[-\s]/g, '').slice(-4)
}

/**
 * Validate Aadhaar format (12 digits)
 */
export function isValidAadhaarFormat(id: string): boolean {
  const cleaned = id.replace(/[-\s]/g, '')
  return /^\d{12}$/.test(cleaned)
}

/**
 * Validate PAN format (10 characters)
 */
export function isValidPANFormat(id: string): boolean {
  const cleaned = id.replace(/[-\s]/g, '').toUpperCase()
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(cleaned)
}

/**
 * Validate Passport format (alphanumeric, typically 8-9 chars)
 */
export function isValidPassportFormat(id: string): boolean {
  const cleaned = id.replace(/[-\s]/g, '').toUpperCase()
  return /^[A-Z0-9]{8,9}$/.test(cleaned)
}
