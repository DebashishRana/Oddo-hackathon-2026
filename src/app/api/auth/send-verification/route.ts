import { NextResponse } from "next/server"
import { requestOtpEmail } from "@/lib/auth-otp"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: unknown }
    const email = typeof body.email === "string" ? body.email.trim() : ""

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
    }

    const result = await requestOtpEmail(email)
    return NextResponse.json({
      success: true,
      message: result.message
    })
  } catch (error) {
    const otpError = error as { status?: number; message?: string; code?: string }
    return NextResponse.json(
      {
        success: false,
        error: otpError.message || "Unable to request verification code",
        code: otpError.code || "REQUEST_FAILED"
      },
      { status: otpError.status || 500 }
    )
  }
}
