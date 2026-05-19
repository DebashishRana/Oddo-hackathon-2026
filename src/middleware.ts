import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config"

// Use a separate auth instance for middleware to avoid Edge Runtime issues with pg
const { auth } = NextAuth(authConfig)

export default auth((req) => {
  // Define protected routes
  const protectedPaths = ['/dashboard']
  const isProtectedPath = protectedPaths.some(path =>
    req.nextUrl.pathname.startsWith(path)
  )

  // Allow access to protected routes only if user has a session
  if (isProtectedPath && !req.auth) {
    const newUrl = new URL('/auth/signin', req.nextUrl.origin)
    return Response.redirect(newUrl)
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|api/auth|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
