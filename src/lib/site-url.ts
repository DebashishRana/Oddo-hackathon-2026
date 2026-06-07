function normalizeSiteUrl(siteUrl: string) {
  return siteUrl.replace(/\/+$/, "")
}

function resolveUrl(value: string | undefined, fallback: string) {
  const explicitSiteUrl = value || fallback

  if (explicitSiteUrl.startsWith("http://") || explicitSiteUrl.startsWith("https://")) {
    return normalizeSiteUrl(explicitSiteUrl)
  }

  return `https://${normalizeSiteUrl(explicitSiteUrl)}`
}

export function getAppBaseUrl() {
  return resolveUrl(
    process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXTAUTH_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      process.env.VERCEL_URL,
    "http://localhost:3000"
  )
}

export function getMarketingBaseUrl() {
  return resolveUrl(
    process.env.NEXT_PUBLIC_SITE_URL,
    typeof window !== "undefined" ? window.location.origin : getAppBaseUrl()
  )
}

export function getCookieDomain() {
  const cookieDomain = process.env.NEXTAUTH_COOKIE_DOMAIN?.trim()
  return cookieDomain ? (cookieDomain.startsWith(".") ? cookieDomain : `.${cookieDomain}`) : undefined
}

export function getEnvironmentSiteUrl() {
  return getAppBaseUrl()
}

export function getClientSiteUrl() {
  return getMarketingBaseUrl()
}

export function buildAppUrl(pathname: string, baseUrl = getAppBaseUrl()) {
  return new URL(pathname, normalizeSiteUrl(baseUrl)).toString()
}

export function buildMarketingUrl(pathname: string, baseUrl = getMarketingBaseUrl()) {
  return new URL(pathname, normalizeSiteUrl(baseUrl)).toString()
}

export function buildAbsoluteUrl(pathname: string, baseUrl = getAppBaseUrl()) {
  return new URL(pathname, normalizeSiteUrl(baseUrl)).toString()
}
