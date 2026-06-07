function normalizeSiteUrl(siteUrl: string) {
  return siteUrl.replace(/\/+$/, "")
}

export function getEnvironmentSiteUrl() {
  const explicitSiteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXTAUTH_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL

  if (!explicitSiteUrl) {
    return "http://localhost:3000"
  }

  if (explicitSiteUrl.startsWith("http://") || explicitSiteUrl.startsWith("https://")) {
    return normalizeSiteUrl(explicitSiteUrl)
  }

  return `https://${normalizeSiteUrl(explicitSiteUrl)}`
}

export function getClientSiteUrl() {
  if (typeof window !== "undefined" && window.location.origin) {
    return normalizeSiteUrl(window.location.origin)
  }

  return getEnvironmentSiteUrl()
}

export function buildAbsoluteUrl(pathname: string, baseUrl = getEnvironmentSiteUrl()) {
  return new URL(pathname, normalizeSiteUrl(baseUrl)).toString()
}
