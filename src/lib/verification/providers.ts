import {
  extractLast4,
  isValidAadhaarFormat,
  isValidPANFormat,
  isValidPassportFormat,
} from '@/lib/pii-utils'
import { normalizeDocumentType } from './normalization'
import type { NormalizedDocumentType, VerificationProviderResult } from './types'

type ProviderAdapter = {
  name: string
  supports: (documentType: NormalizedDocumentType) => boolean
  verify: (input: {
    documentType: NormalizedDocumentType
    documentId: string
  }) => Promise<VerificationProviderResult>
}

const now = () => new Date().toISOString()

const fallbackRegistryProvider: ProviderAdapter = {
  name: 'FallbackRegistry',
  supports: (documentType) => ['aadhaar', 'pan', 'passport'].includes(documentType),
  async verify({ documentType, documentId }) {
    const last4 = extractLast4(documentId)
    const validFormat =
      documentType === 'aadhaar'
        ? isValidAadhaarFormat(documentId)
        : documentType === 'pan'
          ? isValidPANFormat(documentId)
          : isValidPassportFormat(documentId)

    return {
      verified: validFormat && Boolean(last4),
      provider: this.name,
      source: documentType === 'aadhaar' ? 'UIDAI_FORMAT_FALLBACK' : 'DIGILOCKER_FALLBACK',
      timestamp: now(),
      reason_codes: validFormat ? ['format_match', 'fallback_source'] : ['format_mismatch', 'fallback_source'],
      evidence: {
        checked_last4: Boolean(last4),
        provider_mode: 'temporary_fallback',
      },
    }
  },
}

export async function verifyDocumentWithProvider(input: {
  documentType: string
  documentId?: string
}): Promise<VerificationProviderResult> {
  const normalizedDocumentType = normalizeDocumentType(input.documentType)

  if (!input.documentId) {
    return {
      verified: false,
      provider: 'DectraOrchestrator',
      source: 'NO_DOCUMENT_ID',
      timestamp: now(),
      reason_codes: ['missing_document_id'],
    }
  }

  if (normalizedDocumentType === 'unknown') {
    return {
      verified: false,
      provider: 'DectraOrchestrator',
      source: 'UNSUPPORTED_DOCUMENT_TYPE',
      timestamp: now(),
      reason_codes: ['unsupported_document_type'],
    }
  }

  const provider = fallbackRegistryProvider
  if (!provider.supports(normalizedDocumentType)) {
    return {
      verified: false,
      provider: provider.name,
      source: 'UNSUPPORTED_DOCUMENT_TYPE',
      timestamp: now(),
      reason_codes: ['unsupported_document_type'],
    }
  }

  return provider.verify({
    documentType: normalizedDocumentType,
    documentId: input.documentId,
  })
}
