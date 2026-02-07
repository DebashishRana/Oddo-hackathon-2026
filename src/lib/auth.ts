import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { getUserByEmail, upsertUser } from "./database"
import { verifyPassword } from "./auth-utils"
import { authConfig } from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    ...authConfig.providers,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          console.log("[Auth] Missing email or password")
          return null
        }

        const email = credentials.email as string
        const user = await getUserByEmail(email)

        if (!user) {
          console.log("[Auth] User not found:", email)
          return null
        }

        if (!user.password_hash) {
          console.log("[Auth] User has no password (Google-only account):", email)
          return null
        }

        const isValid = await verifyPassword(credentials.password as string, user.password_hash)

        if (!isValid) {
          console.log("[Auth] Invalid password for:", email)
          return null
        }

        console.log("[Auth] Login successful:", email)
        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          image: user.image_url,
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account, profile }) {
      // Sync Google users to database on sign-in
      if (account?.provider === "google" && user.email) {
        try {
          await upsertUser({
            google_id: profile?.sub || account.providerAccountId,
            email: user.email,
            name: user.name || undefined,
            image_url: user.image || undefined,
          })
          console.log("[Auth] Google user synced to database:", user.email)
        } catch (error) {
          console.error("[Auth] Failed to sync Google user to database:", error)
          // Don't block sign-in if DB sync fails, but log the error
        }
      }
      return true
    },
  },
})
