"use client"

import { useState } from "react"
import { Info } from "lucide-react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import { PricingClient } from "./pricing-client"

interface PricingProps {
  isAuthenticated?: boolean;
}

const plans = [
  {
    badge: "STARTER",
    name: "Free",
    price: { monthly: "Free", yearly: "Free" },
    period: "",
    billedLabel: "",
    description: "For hobby and staging sites",
    sections: [
      {
        title: null,
        features: [
          { text: "Dectra subdomain", info: true },
          { text: "An entry-level site", info: false },
          { text: "2 pages", info: false },
          { text: "50 documents", info: false },
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
    popular: false,
    highlighted: false,
    action: "signin" as const,
  },
  {
    badge: "BASIC",
    name: "$14",
    price: { monthly: "$18", yearly: "$14" },
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
    popular: false,
    highlighted: false,
    action: "checkout" as const,
    checkoutPlan: "basic",
  },
  {
    badge: "CMS",
    name: "$23",
    price: { monthly: "$29", yearly: "$23" },
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
    popular: true,
    highlighted: true,
    action: "checkout" as const,
    checkoutPlan: "pro",
  },
  {
    badge: "BUSINESS",
    name: "$39",
    price: { monthly: "$49", yearly: "$39" },
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
    popular: false,
    highlighted: false,
    action: "checkout" as const,
    checkoutPlan: "business",
  },
  {
    badge: "ENTERPRISE",
    name: "Contact us",
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
    popular: false,
    highlighted: false,
    action: "contact" as const,
    contactEmail: "support@dectra.com",
  },
]

const Pricing = ({ isAuthenticated = false }: PricingProps) => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly")

  return (
    <section id="pricing" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Site plans
              </h2>
              <p className="mt-4 text-base text-muted-foreground max-w-xl">
                Our site plans provide easy 1-click publishing and hosting, right from inside our powerful visual designer.
              </p>
            </div>

            {/* Billing toggle */}
            <div className="flex items-center gap-3 shrink-0">
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
        </motion.div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {plans.map((plan, index) => {
            const displayPrice = plan.price[billingCycle]
            const isContact = displayPrice === "Contact us"
            const isFree = displayPrice === "Free"

            return (
              <motion.div
                key={plan.badge}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true }}
                className={cn(
                  "relative flex flex-col rounded-2xl border p-6",
                  plan.highlighted
                    ? "border-[#d4854e]/50 bg-gradient-to-b from-[#d4854e]/10 to-transparent"
                    : "border-border/40 bg-card/20"
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

                {plan.billedLabel && (
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
                    name: plan.badge,
                    popular: plan.highlighted,
                    variant: plan.highlighted ? "default" : "outline",
                    cta: plan.cta,
                    action: plan.action,
                    checkoutPlan: (plan as { checkoutPlan?: string }).checkoutPlan,
                    contactEmail: (plan as { contactEmail?: string }).contactEmail,
                  }}
                  isAuthenticated={isAuthenticated}
                  highlighted={plan.highlighted}
                />
              </motion.div>
            )
          })}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <p className="text-sm text-muted-foreground">
            All prices are in USD and charged per site with applicable taxes added at checkout.
          </p>
          <button className="mt-4 inline-flex items-center gap-1 rounded-full border border-border/40 px-5 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors">
            View all plan features
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
        </motion.div>
      </div>
    </section>
  )
}

export default Pricing
