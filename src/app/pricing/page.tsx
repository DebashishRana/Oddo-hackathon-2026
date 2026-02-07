"use client"

import { useState } from "react"
import { Check, Minus, ChevronDown, ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import Link from "next/link"
import { cn } from "@/lib/utils"

// Pricing tiers data
const pricingTiers = [
  {
    id: "free",
    badge: "AI-assisted",
    badgeStyle: "bg-white border border-gray-300 text-gray-700",
    name: "Free",
    price: "$0",
    priceNote: "/mo/user",
    description: "Best for smaller teams who want to simplify verification.",
    cta: "Get started for free",
    ctaStyle: "bg-gray-100 hover:bg-gray-200 text-gray-900",
    features: {
      title: "Key features:",
      categories: [
        {
          name: "Verification",
          items: [
            "50 verifications/month",
            "Basic document checks",
          ],
        },
        {
          name: "Analytics",
          items: [
            "Basic reports",
            "7-day data retention",
          ],
        },
        {
          name: "Support",
          items: [
            "Email support",
            "Community access",
          ],
        },
      ],
    },
    highlighted: false,
  },
  {
    id: "plus",
    badge: "AI-powered",
    badgeStyle: "bg-[#D4F903] border-[#D4F903] text-gray-900",
    name: "Plus",
    price: "$15",
    priceNote: "/mo/user",
    priceSubnote: "+ Platform fee based on team size",
    savings: "Save 20% with annual billing",
    description: "Perfect for teams who want to use AI-driven automation to eliminate busywork.",
    cta: "Get started for free",
    ctaStyle: "bg-[#D4F903] hover:bg-[#c5e802] text-gray-900",
    features: {
      title: "All the features of Free, and:",
      categories: [
        {
          name: "Advanced Verification",
          items: [
            "AI-driven verification reviews",
            "Automated fraud detection",
            "Priority processing",
          ],
        },
        {
          name: "Analytics & Automation",
          items: [
            "Custom reports and insights",
            "Automated workflows",
            "API access",
          ],
        },
        {
          name: "Global Coverage",
          items: [
            "Multi-region support",
            "International document types",
            "Localized compliance",
          ],
        },
      ],
    },
    highlighted: true,
  },
  {
    id: "enterprise",
    badge: "AI-tailored",
    badgeStyle: "bg-gray-900 text-white",
    name: "Enterprise",
    price: "Custom",
    priceNote: "Annual billing",
    description: "Specifically made for teams who need full customization.",
    cta: "Contact sales",
    ctaStyle: "bg-gray-900 hover:bg-gray-800 text-white",
    features: {
      title: "All the features of Plus, and:",
      categories: [
        {
          name: "Implementation Services",
          items: [
            "Custom implementation scoping",
            "Integration setup and testing",
            "Employee training",
          ],
        },
        {
          name: "Enterprise Services",
          items: [
            "Custom development",
            "Advanced configurations",
            "Dedicated support",
          ],
        },
      ],
    },
    highlighted: false,
  },
]

// Compare features data
const compareCategories = [
  {
    name: "Verification",
    features: [
      {
        name: "Monthly verification limit",
        free: "50",
        plus: "Unlimited",
        enterprise: "Unlimited",
      },
      {
        name: "Document verification",
        free: true,
        plus: true,
        enterprise: true,
      },
      {
        name: "Identity verification",
        free: true,
        plus: true,
        enterprise: true,
      },
      {
        name: "AI-powered fraud detection",
        free: false,
        plus: true,
        enterprise: true,
      },
      {
        name: "Custom verification workflows",
        free: false,
        plus: true,
        enterprise: true,
      },
      {
        name: "Batch processing",
        free: false,
        plus: true,
        enterprise: true,
      },
    ],
  },
  {
    name: "Analytics & Reporting",
    features: [
      {
        name: "Basic analytics dashboard",
        free: true,
        plus: true,
        enterprise: true,
      },
      {
        name: "Custom reports",
        free: false,
        plus: true,
        enterprise: true,
      },
      {
        name: "Real-time insights",
        free: false,
        plus: true,
        enterprise: true,
      },
      {
        name: "Data export",
        free: false,
        plus: true,
        enterprise: true,
      },
      {
        name: "Advanced reporting API",
        free: false,
        plus: false,
        enterprise: true,
      },
    ],
  },
  {
    name: "Automation",
    features: [
      {
        name: "Basic automation rules",
        free: true,
        plus: true,
        enterprise: true,
      },
      {
        name: "Advanced workflow automation",
        free: false,
        plus: true,
        enterprise: true,
      },
      {
        name: "Webhook integrations",
        free: false,
        plus: true,
        enterprise: true,
      },
      {
        name: "Custom API integrations",
        free: false,
        plus: "+ API access included",
        enterprise: "+ Full API suite",
      },
      {
        name: "Automated approval workflows",
        free: false,
        plus: true,
        enterprise: true,
      },
    ],
  },
  {
    name: "User Management",
    features: [
      {
        name: "Team members",
        free: "Up to 3",
        plus: "Unlimited",
        enterprise: "Unlimited",
      },
      {
        name: "Role-based access",
        free: false,
        plus: true,
        enterprise: true,
      },
      {
        name: "Custom user roles",
        free: false,
        plus: false,
        enterprise: true,
      },
      {
        name: "Audit log",
        free: false,
        plus: true,
        enterprise: true,
      },
      {
        name: "SSO/SAML",
        free: false,
        plus: false,
        enterprise: true,
      },
    ],
  },
  {
    name: "Support & Services",
    features: [
      {
        name: "Email support",
        free: true,
        plus: true,
        enterprise: true,
      },
      {
        name: "Priority support",
        free: false,
        plus: true,
        enterprise: true,
      },
      {
        name: "Dedicated account manager",
        free: false,
        plus: false,
        enterprise: true,
      },
      {
        name: "Custom onboarding",
        free: false,
        plus: false,
        enterprise: true,
      },
      {
        name: "SLA guarantee",
        free: false,
        plus: false,
        enterprise: true,
      },
    ],
  },
]

function FeatureValue({ value }: { value: boolean | string }) {
  if (typeof value === "string") {
    return <span className="text-sm text-gray-600">{value}</span>
  }
  if (value) {
    return <Check className="h-5 w-5 text-green-600" />
  }
  return <Minus className="h-5 w-5 text-gray-300" />
}

export default function PricingPage() {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    compareCategories.map((c) => c.name)
  )
  const [emails, setEmails] = useState<Record<string, string>>({
    free: "",
    plus: "",
    enterprise: "",
  })

  const toggleCategory = (name: string) => {
    setExpandedCategories((prev) =>
      prev.includes(name)
        ? prev.filter((c) => c !== name)
        : [...prev, name]
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation placeholder - uses existing nav */}
      <header className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Dectra
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link href="/pricing" className="text-sm text-gray-900 font-medium">
              Pricing
            </Link>
            <Link href="/docs" className="text-sm text-gray-600 hover:text-gray-900">
              Docs
            </Link>
            <Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href="/auth/signin"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="text-sm bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            Start for free.
            <br />
            Scale with Intelligence.
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            Whether you&apos;re a startup, global enterprise, or somewhere in between, 
            Dectra is designed to save you time and money.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {pricingTiers.map((tier) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={cn(
                  "relative rounded-2xl border p-6 flex flex-col",
                  tier.highlighted
                    ? "border-[#D4F903] border-2 shadow-lg"
                    : "border-gray-200"
                )}
              >
                {/* Badge */}
                <div className="flex justify-center -mt-10 mb-4">
                  <span
                    className={cn(
                      "px-4 py-1.5 rounded-full text-sm font-medium border",
                      tier.badgeStyle
                    )}
                  >
                    {tier.badge}
                  </span>
                </div>

                {/* Name & Price */}
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">{tier.name}</h3>
                  <div className="mt-1">
                    <span className="text-3xl font-bold text-gray-900">
                      {tier.price}
                    </span>
                    <span className="text-gray-600">{tier.priceNote}</span>
                  </div>
                  {tier.priceSubnote && (
                    <p className="text-xs text-gray-500 mt-1">{tier.priceSubnote}</p>
                  )}
                  {tier.savings && (
                    <p className="text-xs text-gray-500">{tier.savings}</p>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-6">{tier.description}</p>

                {/* Email Input */}
                <div className="mb-3">
                  <input
                    type="email"
                    placeholder="What's your work email?"
                    value={emails[tier.id]}
                    onChange={(e) =>
                      setEmails({ ...emails, [tier.id]: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400"
                  />
                </div>

                {/* CTA Button */}
                <Link
                  href={tier.id === "enterprise" ? "/contact" : "/auth/signup"}
                  className={cn(
                    "w-full py-2.5 rounded-md text-sm font-medium text-center transition-colors",
                    tier.ctaStyle
                  )}
                >
                  {tier.cta}
                </Link>

                {/* Divider */}
                <div className="border-t border-gray-200 my-6" />

                {/* Features */}
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900 mb-4">
                    {tier.features.title}
                  </p>
                  <div className="space-y-4">
                    {tier.features.categories.map((category) => (
                      <div key={category.name}>
                        <p className="text-sm font-medium text-gray-900 mb-2">
                          {category.name}
                        </p>
                        <ul className="space-y-1.5">
                          {category.items.map((item) => (
                            <li
                              key={item}
                              className="text-sm text-gray-600 flex items-start gap-2"
                            >
                              <Check className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* View all features link */}
                <button className="mt-6 text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
                  View all features <ChevronDown className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Compare Features Section */}
      <section className="py-20 px-6 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="grid grid-cols-4 gap-4 mb-8 items-end">
            <div>
              <h2 className="text-4xl font-bold text-gray-900">Compare</h2>
              <p className="text-4xl font-bold text-gray-900">Features</p>
            </div>
            {pricingTiers.map((tier) => (
              <div key={tier.id} className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {tier.name}
                </h3>
                <Link
                  href={tier.id === "enterprise" ? "/contact" : "/auth/signup"}
                  className={cn(
                    "inline-block w-full max-w-[180px] py-2 rounded-md text-sm font-medium transition-colors",
                    tier.ctaStyle
                  )}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* Feature Categories */}
          <div className="space-y-0">
            {compareCategories.map((category) => (
              <div
                key={category.name}
                className="border-t border-gray-200"
              >
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.name)}
                  className="w-full py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <h4 className="text-base font-semibold text-gray-900">
                    {category.name}
                  </h4>
                  {expandedCategories.includes(category.name) ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
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
                      {category.features.map((feature, idx) => (
                        <div
                          key={feature.name}
                          className={cn(
                            "grid grid-cols-4 gap-4 py-3 items-center",
                            idx !== category.features.length - 1 &&
                              "border-b border-gray-100"
                          )}
                        >
                          <div className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer underline decoration-dotted underline-offset-4">
                            {feature.name}
                          </div>
                          <div className="flex justify-center">
                            <FeatureValue value={feature.free} />
                          </div>
                          <div className="flex justify-center">
                            <FeatureValue value={feature.plus} />
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

      {/* Footer CTA */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to get started?
          </h2>
          <p className="text-gray-600 mb-8">
            Join thousands of teams using Dectra to streamline their verification workflows.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/auth/signup"
              className="bg-[#D4F903] hover:bg-[#c5e802] text-gray-900 px-6 py-3 rounded-md font-medium"
            >
              Start for free
            </Link>
            <Link
              href="/contact"
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-md font-medium"
            >
              Contact sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <p className="text-sm text-gray-500">
            © 2026 Dectra. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-700">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-700">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
