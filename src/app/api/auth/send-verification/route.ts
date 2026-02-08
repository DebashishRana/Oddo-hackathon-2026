import { NextResponse } from "next/server"
import { setVerificationCode, getUserByEmail } from "@/lib/database"
import { sendEmail, createVerificationEmail } from "@/lib/resend"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Check user exists
    const user = await getUserByEmail(email)
    if (!user) {
      // Don't reveal that the user doesn't exist
      return NextResponse.json({ success: true })
    }

    // Already verified?
    if (user.email_verified) {
      return NextResponse.json({ error: "Email is already verified" }, { status: 400 })
    }

    // Generate code and save to DB
    const code = await setVerificationCode(email)

    // Send the email
    const emailData = createVerificationEmail(email, code)
    const result = await sendEmail(emailData)

    if (!result.success) {
      console.error("[Verify] Failed to send verification email:", result.error)
      return NextResponse.json(
        { error: "Failed to send verification email. Please try again." },
        { status: 500 }
      )
    }

    console.log(`[Verify] Verification code sent to ${email}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Verify] Error sending verification code:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
