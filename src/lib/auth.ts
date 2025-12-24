import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { getUserByEmail } from "./database"
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
          return null
        }

        const email = credentials.email as string
        const user = await getUserByEmail(email)

        if (!user || !user.password_hash) {
          // User not found or has no password (maybe Google only)
          return null
        }

        const isValid = await verifyPassword(credentials.password as string, user.password_hash)

        if (!isValid) {
          return null
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          image: user.image_url,
        }
      },
    }),
  ],
})
