"use server"

import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "@/lib/auth"
import { createUserWithPassword, getPasswordAuthSchemaStatus, getUserByEmail, isEmailVerified, markEmailVerified } from "@/lib/database"
import { hashPassword } from "@/lib/auth-utils"
import { buildAppUrl, buildMarketingUrl } from "@/lib/site-url"
import { buildVerifyEmailUrl, requestOtpEmail, verifyOtpEmail } from "@/lib/auth-otp"

type NextAuthErrorLike = {
  type?: string
}

function getNextAuthErrorType(error: unknown): string | null {
  if (!error || typeof error !== "object") return null

  const maybe = error as NextAuthErrorLike
  return typeof maybe.type === "string" ? maybe.type : null
}

export async function signInAction() {
  await nextAuthSignIn("google", { redirectTo: buildAppUrl("/dashboard") })
}

export async function signOutAction() {
  await nextAuthSignOut({ redirectTo: buildMarketingUrl("/") })
}

interface AuthActionState {
  error?: string
  success?: boolean
  redirectTo?: string
}

interface VerifyEmailActionState extends AuthActionState {
  verified?: boolean
}

export async function signInWithCredentialsAction(prevState: AuthActionState | null, formData: FormData) {
  try {
    const email = formData.get("email") as string

    // Check if email is verified before attempting sign-in
    if (email) {
      const user = await getUserByEmail(email)
      if (user && user.password_hash) {
        const verified = await isEmailVerified(email)
        if (!verified) {
          return {
            error: "Please verify your email before signing in.",
            redirectTo: buildVerifyEmailUrl(email, { source: "signin", delivery: "pending" })
          }
        }
      }
    }

    await nextAuthSignIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: buildAppUrl("/dashboard")
    })
    return { success: true }
  } catch (error) {
    // Let NextAuth redirects pass through
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error
    }

    const authErrorType = getNextAuthErrorType(error)
    if (authErrorType) {
      switch (authErrorType) {
        case "CredentialsSignin":
          return { error: "Invalid email or password." }
        default:
          return { error: "Something went wrong." }
      }
    }
    throw error
  }
}

export async function signUpAction(prevState: AuthActionState | null, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  try {
    // Helpful preflight: most common cause of "Failed to create account" is missing DB migration
    // (password_hash column and/or google_id still NOT NULL).
    const schemaStatus = await getPasswordAuthSchemaStatus()
    if (!schemaStatus.hasPasswordHashColumn || schemaStatus.googleIdIsNullable === false) {
      return {
        error:
          "Database is missing password-auth migration. Run sql-queries/08-add-password-auth.sql and restart the server."
      }
    }

    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return { error: "User already exists" }
    }

    const passwordHash = await hashPassword(password)
    await createUserWithPassword(email, passwordHash, name)

    try {
      await requestOtpEmail(email)
      return {
        success: true,
        redirectTo: buildVerifyEmailUrl(email, { source: "signup", delivery: "sent" })
      }
    } catch (emailError) {
      console.error("[Signup] Failed to request verification OTP:", emailError)
      return {
        success: true,
        redirectTo: buildVerifyEmailUrl(email, { source: "signup", delivery: "failed" })
      }
    }
  } catch (error) {
    // Let NextAuth redirects pass through (NEXT_REDIRECT indicates successful signup+signin)
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error
    }

    const authErrorType = getNextAuthErrorType(error)
    if (authErrorType) throw error
    console.error("Signup error:", error)

    const pgError = error as { code?: string; message?: unknown }
    const code = pgError?.code

    // Provide actionable, non-sensitive messages for common DB misconfigurations.
    if (code === "42703") {
      return {
        error:
          "Database schema is out of date (missing password_hash column). Run sql-queries/08-add-password-auth.sql."
      }
    }

    if (code === "23502") {
      return {
        error:
          "Database schema is out of date (google_id is still required). Run sql-queries/08-add-password-auth.sql."
      }
    }

    if (code === "23505") {
      return { error: "User already exists" }
    }

    if (process.env.NODE_ENV !== "production") {
      const safeMessage = typeof pgError?.message === "string" ? pgError.message : "Unknown error"
      return { error: `Failed to create account: ${safeMessage}` }
    }

    return { error: "Failed to create account" }
  }
}

export async function verifyEmailAction(prevState: VerifyEmailActionState | null, formData: FormData) {
  const email = formData.get("email") as string
  const otp = formData.get("otp") as string

  if (!email || !otp) {
    return { error: "Email and verification code are required" }
  }

  try {
    const result = await verifyOtpEmail(email, otp)
    try {
      await markEmailVerified(email)
    } catch (markError) {
      console.error("[VerifyEmail] Failed to update account verification state:", markError)
      return {
        error: "The code was accepted, but we could not update your account yet. Please request a new code and try again."
      }
    }

    return {
      success: true,
      verified: true,
      data: result.data
    }
  } catch (error) {
    const otpError = error as { code?: string; message?: string }
    if (otpError?.code === "OTP_LOCKED") {
      return { error: "Too many attempts. Please request a new code." }
    }

    if (otpError?.code === "OTP_COOLDOWN") {
      return { error: "Please wait before requesting another code." }
    }

    return { error: "Unable to verify code. Please try again." }
  }
}
