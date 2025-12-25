"use server"

import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "@/lib/auth"
import { createUserWithPassword, getPasswordAuthSchemaStatus, getUserByEmail } from "@/lib/database"
import { hashPassword } from "@/lib/auth-utils"
import { AuthError } from "next-auth"

export async function signInAction() {
  await nextAuthSignIn("google", { redirectTo: "/dashboard" })
}

export async function signOutAction() {
  await nextAuthSignOut({ redirectTo: "/" })
}

export async function signInWithCredentialsAction(prevState: any, formData: FormData) {
  try {
    await nextAuthSignIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/dashboard",
    })
    return { success: true }
  } catch (error) {
    // Let NextAuth redirects pass through
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error
    }
    
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password." }
        default:
          return { error: "Something went wrong." }
      }
    }
    throw error
  }
}

export async function signUpAction(prevState: any, formData: FormData) {
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
    
    // Sign in immediately after signup
    await nextAuthSignIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    })
    return { success: true }
  } catch (error) {
    // Let NextAuth redirects pass through (NEXT_REDIRECT indicates successful signup+signin)
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error
    }
    
    if (error instanceof AuthError) {
      throw error
    }
    console.error("Signup error:", error)

    const pgError = error as any
    const code = pgError?.code as string | undefined

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
