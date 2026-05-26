import type { RiskScore, VerificationStatus } from './types'

export function determineInitialStatus(confidence: number): VerificationStatus {
  if (confidence >= 0.85) return 'pending'
  if (confidence < 0.6) return 'flagged'
  return 'pending'
}

export function calculateInitialRisk(confidence: number): RiskScore {
  if (confidence >= 0.85) return 'Medium'
  if (confidence >= 0.6) return 'Medium'
  return 'High'
}

export function calculateFinalStatus(verified: boolean, confidence: number): VerificationStatus {
  if (verified && confidence >= 0.75) return 'verified'
  if (verified) return 'pending'
  return 'flagged'
}

export function calculateFinalRisk(verified: boolean, confidence: number): RiskScore {
  if (verified && confidence >= 0.85) return 'Low'
  if (verified || confidence >= 0.75) return 'Medium'
  return 'High'
}

export function validateConfidence(confidence: unknown): confidence is number {
  return typeof confidence === 'number' && Number.isFinite(confidence) && confidence >= 0 && confidence <= 1
}
