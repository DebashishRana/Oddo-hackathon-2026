import Navigation from "@/components/landing/navigation"
import Footer from "@/components/landing/footer"
import { PricingContent } from "./pricing-content"
import { auth } from "@/lib/auth"

export default async function PricingPage() {
  const session = await auth()
  const isAuthenticated = !!session

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <PricingContent isAuthenticated={isAuthenticated} />
      <Footer />
    </div>
  )
}
