import { NextResponse } from "next/server"
import { verifyEmailCode } from "@/lib/database"

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and verification code are required" },
        { status: 400 }
      )
    }

    // Validate code format (6 digits)
    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { error: "Invalid code format" },
        { status: 400 }
      )
    }

    const verified = await verifyEmailCode(email, code)

    if (!verified) {
      return NextResponse.json(
        { error: "Invalid or expired verification code" },
        { status: 400 }
      )
    }

    console.log(`[Verify] Email verified successfully: ${email}`)
    return NextResponse.json({ success: true, verified: true })
  } catch (error) {
    console.error("[Verify] Error verifying email:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
