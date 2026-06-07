import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config"
import { buildAppUrl } from "@/lib/site-url"

// Use a separate auth instance for middleware to avoid Edge Runtime issues with pg
const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const canonicalAppOrigin = new URL(buildAppUrl("/")).origin
  const requestOrigin = req.nextUrl.origin
  const requestPath = `${req.nextUrl.pathname}${req.nextUrl.search}`
  const isAppHost = requestOrigin === canonicalAppOrigin

  // Keep dashboard/auth flows on the app subdomain so the session behaves consistently.
  const isAppRoute = req.nextUrl.pathname.startsWith("/dashboard") || req.nextUrl.pathname.startsWith("/auth")
  if (!isAppHost && isAppRoute) {
    return Response.redirect(new URL(requestPath, canonicalAppOrigin))
  }

  // Define protected routes
  const protectedPaths = ['/dashboard']
  const isProtectedPath = protectedPaths.some(path =>
    req.nextUrl.pathname.startsWith(path)
  )

  // Allow access to protected routes only if user has a session
  if (isProtectedPath && !req.auth) {
    const newUrl = new URL('/auth/signin', canonicalAppOrigin)
    newUrl.searchParams.set("callbackUrl", new URL(requestPath, canonicalAppOrigin).toString())
    return Response.redirect(newUrl)
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|api/auth|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
