import type { NormalizedDocumentType } from './types'

export function normalizeDocumentType(documentType: string): NormalizedDocumentType {
  const normalized = documentType.trim().toLowerCase()
  if (['aadhaar', 'aadhar', 'uidai'].includes(normalized)) return 'aadhaar'
  if (['pan', 'pan_card', 'pancard'].includes(normalized)) return 'pan'
  if (['passport'].includes(normalized)) return 'passport'
  return 'unknown'
}

export function displayDocumentType(documentType: string): string {
  const normalized = normalizeDocumentType(documentType)
  if (normalized === 'aadhaar') return 'Aadhaar'
  if (normalized === 'pan') return 'PAN'
  if (normalized === 'passport') return 'Passport'
  return documentType.trim() || 'Unknown'
}
