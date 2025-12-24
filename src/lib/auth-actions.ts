"use server"

import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "@/lib/auth"
import { createUserWithPassword, getUserByEmail } from "@/lib/database"
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
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." }
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
    if (error instanceof AuthError) {
      throw error
    }
    console.error("Signup error:", error)
    return { error: "Failed to create account" }
  }
}
