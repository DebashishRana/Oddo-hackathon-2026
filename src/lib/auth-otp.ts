import { buildAppUrl, buildAuthApiUrl } from "./site-url"

export type OtpVerificationData = {
  token: string
  tokenType: string
  expiresIn: string
}

export type OtpApiResponse<T = unknown> = {
  success: boolean
  message: string
  data?: T
  error?: {
    code: string
    details?: unknown
  }
}

export type OtpApiError = Error & {
  status?: number
  code?: string
  details?: unknown
}

type OtpAction = "send-otp" | "resend-otp" | "verify-otp"

function getErrorMessage(payload: OtpApiResponse | undefined, fallback: string) {
  if (!payload) return fallback
  return payload.message || fallback
}

async function postOtpRequest<T>(action: OtpAction, body: Record<string, unknown>): Promise<OtpApiResponse<T>> {
  const response = await fetch(buildAuthApiUrl(`/auth/${action}`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body),
    cache: "no-store"
  })

  let payload: OtpApiResponse<T> | undefined
  try {
    payload = (await response.json()) as OtpApiResponse<T>
  } catch {
    payload = undefined
  }

  if (!response.ok || !payload?.success) {
    const error = new Error(getErrorMessage(payload, "Unable to process verification request")) as OtpApiError
    error.status = response.status
    error.code = payload?.error?.code || "REQUEST_FAILED"
    error.details = payload?.error?.details
    throw error
  }

  return payload
}

export async function requestOtpEmail(email: string) {
  return postOtpRequest("send-otp", { email })
}

export async function resendOtpEmail(email: string) {
  return postOtpRequest("resend-otp", { email })
}

export async function verifyOtpEmail(email: string, otp: string) {
  return postOtpRequest<OtpVerificationData>("verify-otp", { email, otp })
}

export function buildVerifyEmailUrl(email: string, params?: Record<string, string | undefined>) {
  const url = new URL(buildAppUrl("/auth/verify-email"))
  url.searchParams.set("email", email)

  for (const [key, value] of Object.entries(params || {})) {
    if (value) {
      url.searchParams.set(key, value)
    }
  }

  return url.toString()
}
