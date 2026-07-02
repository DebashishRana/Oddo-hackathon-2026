import { NextResponse } from "next/server"
import { markEmailVerified } from "@/lib/database"
import { verifyOtpEmail } from "@/lib/auth-otp"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: unknown; otp?: unknown; code?: unknown }
    const email = typeof body.email === "string" ? body.email.trim() : ""
    const otp = typeof body.otp === "string" ? body.otp.trim() : typeof body.code === "string" ? body.code.trim() : ""

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: "Email and verification code are required" },
        { status: 400 }
      )
    }

    const result = await verifyOtpEmail(email, otp)
    try {
      await markEmailVerified(email)
    } catch (markError) {
      console.error("[VerifyEmail] Failed to update account verification state:", markError)
      return NextResponse.json(
        {
          success: false,
          error: "The code was accepted, but we could not update your account yet. Please request a new code and try again.",
          code: "VERIFY_STATE_UPDATE_FAILED"
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      verified: true,
      message: result.message,
      data: result.data
    })
  } catch (error) {
    const otpError = error as { status?: number; message?: string; code?: string }
    return NextResponse.json(
      {
        success: false,
        error: otpError.message || "Unable to verify code",
        code: otpError.code || "REQUEST_FAILED"
      },
      { status: otpError.status || 500 }
    )
  }
}
