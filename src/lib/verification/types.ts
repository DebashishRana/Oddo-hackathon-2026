export type VerificationStatus = 'pending' | 'verified' | 'flagged' | 'failed'

export type RiskScore = 'Low' | 'Medium' | 'High'

export type NormalizedDocumentType = 'aadhaar' | 'pan' | 'passport' | 'unknown'

export type ScannerPayload = {
  event_id?: string
  document_type: string
  document_id?: string
  user_name?: string
  user_email?: string
  confidence: number
  image_url?: string
  source_app?: string
  scanner_version?: string
  method?: string
  timestamp?: string
  scanner_timestamp?: string
  extracted_fields?: Record<string, unknown>
  ocr_data?: Record<string, unknown>
}

export type VerificationProviderResult = {
  verified: boolean
  provider: string
  source: string
  timestamp: string
  reason_codes: string[]
  evidence?: Record<string, unknown>
}

export type VerificationVerdict = {
  status: VerificationStatus
  cross_verified: boolean
  risk_score: RiskScore
  api_source: string
  reason_codes: string[]
  verification_timestamp: string
  masked_document_id: string
  last_4_digits: string
}

export type VerificationAuditEvent = {
  type:
    | 'verification_received'
    | 'cross_verification_queued'
    | 'cross_verification_started'
    | 'cross_verification_succeeded'
    | 'cross_verification_failed'
    | 'document_flagged'
    | 'admin_review_required'
    | 'verification_cleaned_up'
  at: string
  actor: string
  details?: Record<string, unknown>
  previous_hash?: string
  hash: string
}

export type VerificationJob = {
  event_id: number
  document_type: string
  document_id?: string
  confidence: number
}
