"use client"

import { useState } from "react"
import { Check, Minus, ChevronDown, ChevronUp, Info } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { PricingClient } from "@/components/landing/pricing-client"

// Plans matching the landing page pricing component
const plans = [
  {
    id: "starter",
    badge: "STARTER",
    name: "Free Trial",
    price: { monthly: "Free Trial", yearly: "Free Trial" },
    period: "",
    billedLabel: "",
    description: "For those just getting started with verification",
    sections: [
      {
        title: null,
        features: [
          { text: "Dectra subdomain", info: true },
          { text: "An entry-level site", info: false },
          { text: "2 pages", info: false },
          { text: "15 documents", info: false },
          { text: "50 verifications (lifetime)", info: false },
        ],
      },
      {
        title: "Limited traffic",
        features: [
          { text: "1 GB bandwidth", info: false },
          { text: "1k visitors", info: false },
          { text: "Standard speeds", info: false },
        ],
      },
    ],
    cta: "Start for free",
    ctaHref: "/auth/signup",
    action: "signin" as const,
    highlighted: false,
  },
  {
    id: "basic",
    badge: "BASIC",
    name: "Basic",
    price: { monthly: "₹2200", yearly: "₹29,999" },
    period: "/mo",
    billedLabel: "billed yearly",
    description: "For relatively simple, static sites",
    sections: [
      {
        title: null,
        features: [
          { text: "Custom domain", info: true },
          { text: "A basic site", info: false },
          { text: "150 pages", info: false },
          { text: "500 documents", info: false },
          { text: "500 verifications (monthly)", info: false },
        ],
      },
      {
        title: "Moderate traffic",
        features: [
          { text: "50 GB bandwidth", info: false },
          { text: "250k visitors", info: false },
          { text: "Blazing fast speeds", info: false },
        ],
      },
    ],
    cta: "Add Site plan",
    ctaHref: "/auth/signup",
    action: "checkout" as const,
    checkoutPlan: "basic",
    highlighted: false,
  },
  {
    id: "business",
    badge: "BUSINESS",
    name: "Business",
    price: { monthly: "₹3,400", yearly: "₹43,999" },
    period: "/mo",
    billedLabel: "billed yearly",
    description: "For blogs or other content-driven sites",
    sections: [
      {
        title: null,
        features: [
          { text: "Custom domain", info: true },
          { text: "A content-rich site", info: false },
          { text: "150 pages", info: false },
          { text: "2k documents", info: false },
          { text: "1k verifications (monthly)", info: false },
          { text: "3 Content editors", info: false },
          { text: "Site search", info: false },
        ],
      },
      {
        title: "Generous traffic",
        features: [
          { text: "200 GB bandwidth", info: false },
          { text: "250k visitors", info: false },
          { text: "Blazing fast speeds", info: false },
        ],
      },
    ],
    cta: "Add Site plan",
    ctaHref: "/auth/signup",
    action: "checkout" as const,
    checkoutPlan: "pro",
    highlighted: true,
  },
  {
    id: "organization",
    badge: "ORGANIZATIONZ",
    name: "Organization",
    price: { monthly: "₹6,999", yearly: "₹96,000" },
    period: "/mo",
    billedLabel: "billed yearly",
    description: "For larger sites",
    sections: [
      {
        title: null,
        features: [
          { text: "Custom domain", info: true },
          { text: "A business site", info: false },
          { text: "150 pages", info: false },
          { text: "10k documents", info: false },
          { text: "2.5k verifications (monthly)", info: false },
          { text: "10 Content editors", info: false },
          { text: "Site search", info: false },
          { text: "Form file upload", info: false },
        ],
      },
      {
        title: "Expanded traffic",
        features: [
          { text: "400 GB bandwidth", info: false },
          { text: "300k visitors", info: false },
          { text: "Accelerated speeds", info: true },
        ],
      },
    ],
    cta: "Add Site plan",
    ctaHref: "/auth/signup",
    action: "checkout" as const,
    checkoutPlan: "business",
    highlighted: false,
  },
  {
    id: "enterprise",
    badge: "ENTERPRISE",
    name: "Enterprise",
    price: { monthly: "Contact us", yearly: "Contact us" },
    period: "",
    billedLabel: "",
    description: "For those needing an enterprise-grade solution",
    sections: [
      {
        title: null,
        features: [
          { text: "Unlimited users", info: true },
          { text: "Enterprise-ready scale", info: true },
          { text: "Advanced collaboration", info: true },
          { text: "Guaranteed SLA", info: true },
          { text: "Enterprise security", info: true },
          { text: "Customer success", info: true },
        ],
      },
    ],
    cta: "Contact sales",
    ctaHref: "/contact",
    action: "contact" as const,
    contactEmail: "support@dectra.com",
    highlighted: false,
  },
]

// Compare features data
const compareCategories = [
  {
    name: "Verification",
    features: [
      {
        name: "Verification limit",
        starter: "50 (lifetime)",
        basic: "500/mo",
        business: "1k/mo",
        organization: "2.5k/mo",
        enterprise: "Unlimited",
      },
      {
        name: "Document storage",
        starter: "15",
        basic: "500",
        business: "2k",
        organization: "10k",
        enterprise: "Unlimited",
      },
      {
        name: "Pages",
        starter: "2",
        basic: "150",
        business: "150",
        organization: "150",
        enterprise: "Unlimited",
      },
      {
        name: "Custom domain",
        starter: false,
        basic: true,
        business: true,
        organization: true,
        enterprise: true,
      },
      {
        name: "Content editors",
        starter: false,
        basic: false,
        business: "3",
        organization: "10",
        enterprise: "Unlimited",
      },
      {
        name: "Site search",
        starter: false,
        basic: false,
        business: true,
        organization: true,
        enterprise: true,
      },
      {
        name: "Form file upload",
        starter: false,
        basic: false,
        business: false,
        organization: true,
        enterprise: true,
      },
    ],
  },
  {
    name: "Traffic & Performance",
    features: [
      {
        name: "Bandwidth",
        starter: "1 GB",
        basic: "50 GB",
        business: "200 GB",
        organization: "400 GB",
        enterprise: "Unlimited",
      },
      {
        name: "Monthly visitors",
        starter: "1k",
        basic: "250k",
        business: "250k",
        organization: "300k",
        enterprise: "Unlimited",
      },
      {
        name: "Speed tier",
        starter: "Standard",
        basic: "Blazing fast",
        business: "Blazing fast",
        organization: "Accelerated",
        enterprise: "Accelerated",
      },
      {
        name: "CDN",
        starter: false,
        basic: true,
        business: true,
        organization: true,
        enterprise: true,
      },
      {
        name: "DDoS protection",
        starter: false,
        basic: true,
        business: true,
        organization: true,
        enterprise: true,
      },
    ],
  },
  {
    name: "Support & Services",
    features: [
      {
        name: "Email support",
        starter: true,
        basic: true,
        business: true,
        organization: true,
        enterprise: true,
      },
      {
        name: "Priority support",
        starter: false,
        basic: false,
        business: true,
        organization: true,
        enterprise: true,
      },
      {
        name: "Dedicated account manager",
        starter: false,
        basic: false,
        business: false,
        organization: false,
        enterprise: true,
      },
      {
        name: "Custom onboarding",
        starter: false,
        basic: false,
        business: false,
        organization: false,
        enterprise: true,
      },
      {
        name: "SLA guarantee",
        starter: false,
        basic: false,
        business: false,
        organization: false,
        enterprise: true,
      },
    ],
  },
  {
    name: "Security & Compliance",
    features: [
      {
        name: "SSL certificate",
        starter: true,
        basic: true,
        business: true,
        organization: true,
        enterprise: true,
      },
      {
        name: "Role-based access",
        starter: false,
        basic: false,
        business: true,
        organization: true,
        enterprise: true,
      },
      {
        name: "Audit logs",
        starter: false,
        basic: false,
        business: false,
        organization: true,
        enterprise: true,
      },
      {
        name: "SSO / SAML",
        starter: false,
        basic: false,
        business: false,
        organization: false,
        enterprise: true,
      },
      {
        name: "Enterprise security",
        starter: false,
        basic: false,
        business: false,
        organization: false,
        enterprise: true,
      },
    ],
  },
]

type FeatureRow = {
  name: string;
  starter: boolean | string;
  basic: boolean | string;
  business: boolean | string;
  organization: boolean | string;
  enterprise: boolean | string;
}

function FeatureValue({ value }: { value: boolean | string }) {
  if (typeof value === "string") {
    return <span className="text-sm text-muted-foreground">{value}</span>
  }
  if (value) {
    return <Check className="h-5 w-5 text-[#d4854e]" />
  }
  return <Minus className="h-5 w-5 text-muted-foreground/30" />
}

export function PricingContent({ isAuthenticated = false }: { isAuthenticated?: boolean }) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    compareCategories.map((c) => c.name)
  )

  const toggleCategory = (name: string) => {
    setExpandedCategories((prev) =>
      prev.includes(name)
        ? prev.filter((c) => c !== name)
        : [...prev, name]
    )
  }

  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold tracking-tight leading-tight"
          >
            Site plans
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Our site plans provide easy 1-click publishing and hosting, right from inside our powerful visual designer.
          </motion.p>
        </div>
      </section>

      {/* Billing Toggle */}
      <section className="pb-8 px-6">
        <div className="max-w-7xl mx-auto flex justify-center md:justify-end">
          <div className="flex items-center gap-3">
            <span className={cn("text-sm", billingCycle === "monthly" ? "text-foreground" : "text-muted-foreground")}>
              Billed monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
              className={cn(
                "relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
                billingCycle === "yearly" ? "bg-[#d4854e]" : "bg-muted"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
                  billingCycle === "yearly" ? "translate-x-5" : "translate-x-0"
                )}
              />
            </button>
            <div className="flex flex-col">
              <span className={cn("text-sm font-medium", billingCycle === "yearly" ? "text-foreground" : "text-muted-foreground")}>
                Billed yearly
              </span>
              {billingCycle === "yearly" && (
                <span className="text-xs text-[#d4854e]">(Save up to 22%)</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {plans.map((plan, index) => {
              const displayPrice = plan.price[billingCycle]
              const isContact = displayPrice === "Contact us"
              const isFree = displayPrice === "Free Trial"

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  className={cn(
                    "relative flex flex-col rounded-2xl border p-6 transition-shadow duration-300",
                    plan.highlighted
                      ? "border-[#d4854e]/50 bg-gradient-to-b from-[#d4854e]/10 to-transparent hover:shadow-xl hover:shadow-[#d4854e]/10"
                      : "border-border/40 bg-card/20 hover:shadow-lg hover:shadow-black/20"
                  )}
                >
                  {/* Badge */}
                  <div className="mb-4">
                    <span
                      className={cn(
                        "inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider",
                        plan.highlighted
                          ? "bg-[#d4854e] text-white"
                          : "bg-muted text-muted-foreground border border-border/40"
                      )}
                    >
                      {plan.badge}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mb-1">
                    {isContact || isFree ? (
                      <span className="text-3xl font-bold tracking-tight">{displayPrice}</span>
                    ) : (
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-3xl font-bold tracking-tight">{displayPrice}</span>
                        <span className="text-sm text-muted-foreground">{plan.period}</span>
                      </div>
                    )}
                  </div>

                  {plan.billedLabel && billingCycle === "yearly" && (
                    <p className="text-xs text-muted-foreground mb-3">{plan.billedLabel}</p>
                  )}

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed min-h-[40px]">
                    {plan.description}
                  </p>

                  {/* Feature sections */}
                  <div className="flex-1 space-y-5 mb-6">
                    {plan.sections.map((section, si) => (
                      <div key={si}>
                        {section.title && (
                          <h4 className="text-sm font-semibold text-foreground mb-2">{section.title}</h4>
                        )}
                        <ul className="space-y-2">
                          {section.features.map((feat, fi) => (
                            <li key={fi} className="flex items-start justify-between gap-2">
                              <span className="text-xs text-muted-foreground leading-relaxed">{feat.text}</span>
                              {feat.info && (
                                <Info className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40 mt-0.5" />
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <PricingClient
                    plan={{
                      name: plan.name,
                      popular: plan.highlighted,
                      variant: plan.highlighted ? "default" : "outline",
                      cta: plan.cta,
                      action: plan.action,
                      checkoutPlan: plan.checkoutPlan,
                      contactEmail: plan.contactEmail,
                    }}
                    isAuthenticated={isAuthenticated}
                    highlighted={plan.highlighted}
                  />
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Compare Features Section */}
      <section className="py-20 px-6 border-t border-border/40">
        <div className="max-w-7xl mx-auto">
          {/* Header row */}
          <div className="grid grid-cols-6 gap-4 mb-8 items-end">
            <div>
              <h2 className="text-4xl font-bold">Compare</h2>
              <p className="text-4xl font-bold">Features</p>
            </div>
            {plans.map((plan) => (
              <div key={plan.id} className="text-center">
                <h3 className="text-sm font-semibold mb-3">{plan.name}</h3>
                <PricingClient
                  plan={{
                    name: plan.name,
                    popular: plan.highlighted,
                    variant: plan.highlighted ? "default" : "outline",
                    cta: plan.cta,
                    action: plan.action,
                    checkoutPlan: plan.checkoutPlan,
                    contactEmail: plan.contactEmail,
                  }}
                  isAuthenticated={isAuthenticated}
                  highlighted={plan.highlighted}
                />
              </div>
            ))}
          </div>

          {/* Feature Categories */}
          <div className="space-y-0">
            {compareCategories.map((category) => (
              <div key={category.name} className="border-t border-border/40">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.name)}
                  className="w-full py-4 flex items-center justify-between text-left hover:bg-muted/20 transition-colors rounded-lg px-2"
                >
                  <h4 className="text-base font-semibold">{category.name}</h4>
                  {expandedCategories.includes(category.name) ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>

                {/* Features List */}
                <AnimatePresence>
                  {expandedCategories.includes(category.name) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      {category.features.map((feature: FeatureRow, idx: number) => (
                        <div
                          key={feature.name}
                          className={cn(
                            "grid grid-cols-6 gap-4 py-3 px-2 items-center",
                            idx !== category.features.length - 1 && "border-b border-border/20"
                          )}
                        >
                          <div className="text-sm text-muted-foreground">
                            {feature.name}
                          </div>
                          <div className="flex justify-center">
                            <FeatureValue value={feature.starter} />
                          </div>
                          <div className="flex justify-center">
                            <FeatureValue value={feature.basic} />
                          </div>
                          <div className="flex justify-center">
                            <FeatureValue value={feature.business} />
                          </div>
                          <div className="flex justify-center">
                            <FeatureValue value={feature.organization} />
                          </div>
                          <div className="flex justify-center">
                            <FeatureValue value={feature.enterprise} />
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-6 border-t border-border/40">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of teams using Dectra to streamline their verification workflows.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/auth/signup"
              className="bg-[#d4854e] hover:bg-[#c5773f] text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Start for free
            </Link>
            <Link
              href="/contact"
              className="bg-foreground text-background px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-colors"
            >
              Contact sales
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
