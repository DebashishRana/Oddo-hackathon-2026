import Navigation from "@/components/landing/navigation"
import Hero from "@/components/landing/hero"
import Features from "@/components/landing/features"
import Showcase from "@/components/landing/showcase"
import Insights from "@/components/landing/insights"
import Foundations from "@/components/landing/foundations"
import Pricing from "@/components/landing/pricing"
import Testimonials from "@/components/landing/testimonials"
import CustomerStories from "@/components/landing/customer-stories"
import Footer from "@/components/landing/footer"
import { SmoothScroll } from "@/components/ui/smooth-scroll"
import { ScrollToTop } from "@/components/ui/scroll-to-top"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Landing-only background treatment (keeps dashboards/admin unchanged) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_50%_-10%,rgba(255,255,255,0.10),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(700px_420px_at_80%_20%,rgba(99,102,241,0.18),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(700px_420px_at_20%_10%,rgba(34,211,238,0.10),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.00),rgba(0,0,0,0.35))]" />
      </div>
      <SmoothScroll />
      <Navigation />
      <Hero />
      <Features />
      <Showcase />
      <CustomerStories />
      <Insights />
      <Foundations />
      <Pricing />
      <Testimonials />
      <Footer />
      <ScrollToTop />
    </div>
  )
}
