import Google from "next-auth/providers/google"

type NextAuthInitParam = Parameters<typeof import("next-auth").default>[0]
type NextAuthConfigObject = Exclude<NextAuthInitParam, (request: never) => unknown>

export const authConfig: NextAuthConfigObject = {
  // Required for production deployments (especially non-Vercel platforms)
  trustHost: true,
  // Explicitly set the secret (NextAuth v5 uses AUTH_SECRET, but NEXTAUTH_SECRET also works)
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile, user }) {
      if (account?.provider === "google") {
        token.accessToken = account.access_token ?? undefined
        token.id = profile?.sub ?? undefined
      } else if (user) {
        // For credentials provider
        token.id = user.id
      }
      
      if (user) {
        token.email = user.email ?? undefined
        token.name = user.name ?? undefined
        token.picture = user.image ?? undefined
      }
      return token
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token and user id from a provider.
      if (token.accessToken) {
        session.accessToken = token.accessToken as string
      }
      if (token.id) {
        session.user.id = token.id as string
      }
      if (token.email) {
        session.user.email = token.email as string
      }
      if (token.name) {
        session.user.name = token.name as string
      }
      if (token.picture) {
        session.user.image = token.picture as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
}
