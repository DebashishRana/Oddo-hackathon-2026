import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AuthPageOverhaul } from "@/components/auth/auth-page-overhaul"

export default async function SignUpPage() {
  const session = await auth()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <AuthPageOverhaul defaultIsSignUp />
  )
}
