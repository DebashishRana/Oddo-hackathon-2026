import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AuthPageOverhaul } from "@/components/auth/auth-page-overhaul"
import { buildAppUrl } from "@/lib/site-url"

export default async function SignInPage(props: { searchParams: Promise<{ callbackUrl?: string; email?: string }> }) {
  const session = await auth()
  const searchParams = await props.searchParams
  const initialEmail = searchParams.email || ""

  if (session) {
    // If there's a callback URL, redirect to it instead of dashboard
    if (searchParams.callbackUrl) {
      redirect(new URL(searchParams.callbackUrl, buildAppUrl("/")).toString())
    }
    redirect(buildAppUrl("/dashboard"))
  }

  return (
    <AuthPageOverhaul initialEmail={initialEmail} />
  )
}
