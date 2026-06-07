import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AuthPageOverhaul } from "@/components/auth/auth-page-overhaul"
import { buildAppUrl } from "@/lib/site-url"

export default async function SignUpPage() {
  const session = await auth()

  if (session) {
    redirect(buildAppUrl("/dashboard"))
  }

  return (
    <AuthPageOverhaul defaultIsSignUp />
  )
}
