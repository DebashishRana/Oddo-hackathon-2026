import Navigation from "@/components/landing/navigation"
import Footer from "@/components/landing/footer"
import { PricingContent } from "./pricing-content"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <PricingContent />
      <Footer />
    </div>
  )
}
