"use server"

import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "@/lib/auth"
import { createUserWithPassword, getPasswordAuthSchemaStatus, getUserByEmail, setVerificationCode, isEmailVerified } from "@/lib/database"
import { hashPassword } from "@/lib/auth-utils"
import { sendEmail, createVerificationEmail } from "@/lib/resend"
import { buildAppUrl, buildMarketingUrl } from "@/lib/site-url"

type NextAuthErrorLike = {
  type?: string;
};

function getNextAuthErrorType(error: unknown): string | null {
  if (!error || typeof error !== "object") return null;

  const maybe = error as NextAuthErrorLike;
  return typeof maybe.type === "string" ? maybe.type : null;
}

export async function signInAction() {
  await nextAuthSignIn("google", { redirectTo: buildAppUrl("/dashboard") })
}

export async function signOutAction() {
  await nextAuthSignOut({ redirectTo: buildMarketingUrl("/") })
}

interface AuthActionState {
  error?: string;
  success?: boolean;
  redirectTo?: string;
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
            redirectTo: `/auth/verify-email?email=${encodeURIComponent(email)}`
          }
        }
      }
    }

    await nextAuthSignIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: buildAppUrl("/dashboard"),
    })
    return { success: true }
  } catch (error) {
    // Let NextAuth redirects pass through
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error
    }
    
    const authErrorType = getNextAuthErrorType(error);
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
          "Database is missing password-auth migration. Run sql-queries/08-add-password-auth.sql and restart the server.",
      }
    }

    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return { error: "User already exists" }
    }

    const passwordHash = await hashPassword(password)
    await createUserWithPassword(email, passwordHash, name)
    
    // Send verification email instead of signing in immediately
    try {
      const code = await setVerificationCode(email)
      const emailData = createVerificationEmail(email, code)
      await sendEmail(emailData)
    } catch (emailError) {
      console.error("[Signup] Failed to send verification email:", emailError)
      // Account was created, but email failed — they can resend from the verification page
    }

    // Return redirect info (the component will handle the redirect)
    return { success: true, redirectTo: `/auth/verify-email?email=${encodeURIComponent(email)}` }
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
          "Database schema is out of date (missing password_hash column). Run sql-queries/08-add-password-auth.sql.",
      }
    }

    if (code === "23502") {
      return {
        error:
          "Database schema is out of date (google_id is still required). Run sql-queries/08-add-password-auth.sql.",
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
