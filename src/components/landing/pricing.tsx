"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Star, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { PricingClient } from "./pricing-client"

interface PricingProps {
  isAuthenticated?: boolean;
}

const Pricing = ({ isAuthenticated = false }: PricingProps) => {
  const plans = [
    {
      name: "EDV GO",
      price: "Rs. 1900",
      period: "m",
      description: "Dedicated point for verification and documentation",
      features: [
        "EDV threshold 450 documents",
        "Custom API integration for pipelines",
        "Token auth & auto-deletion",
        "Admin panel access",
        "QR verification on laptop or phone"
      ],
      cta: "Get started",
      popular: false,
      variant: "outline" as const,
      action: "signin" as const
    },
    {
      name: "EDV Premium",
      price: "Rs. 2999",
      period: "m",
      description: "Advanced point for verification and documentation",
      features: [
        "EDV threshold 1000 documents",
        "Dedicated API support for custom pipelines and lakes",
        "Priority token auth & auto-deletion",
        "Admin panel & advanced analytics",
        "Govt-backed double verification"
      ],
      cta: "Get started",
      popular: true,
      variant: "default" as const,
      action: "checkout" as const,
      checkoutPlan: "pro"
    },
    {
      name: "EDV Enterprise",
      price: "Contact us",
      description: "Custom AI chatbot, advanced analytics, dedicated account",
      features: [
        "Unlimited EDV threshold",
        "Enterprise API support for large-scale pipelines and lakes",
        "Priority token auth & auto-deletion",
        "Dedicated account management & SLA",
        "Custom AI chatbot and analytics"
      ],
      cta: "Contact us",
      popular: false,
      variant: "outline" as const,
      action: "contact" as const,
      contactEmail: "support@veriquick.com"
    }
  ]

  return (
    <section id="pricing" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Get started with project Vectra
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              {" "}Flexible pricing for all teams
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Flexible pricing plans for teams of all sizes. Pick the right EDV throughput, integrations, and support for your compliance workflow.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-[#FF7F3F] text-primary-foreground px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}
              
              <Card className={`h-full ${plan.popular ? 'border-[#FF7F3F] shadow-lg scale-105' : 'border-border'} hover:shadow-lg transition-all duration-300`}>
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && (
                      <span className="text-muted-foreground ml-2">/{plan.period}</span>
                    )}
                  </div>
                  <CardDescription className="text-base mt-2">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <PricingClient
                    plan={plan}
                    isAuthenticated={isAuthenticated}
                  />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-24"
        >
          <h3 className="text-2xl font-bold text-center mb-12">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <h4 className="font-semibold">How fast can VeriQuick verify documents?</h4>
              <p className="text-muted-foreground text-sm">
                Typical verifications complete in under a minute with EDV automation. Bulk uploads and redirects run continuously with audit-ready logs.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Is data secured during verification?</h4>
              <p className="text-muted-foreground text-sm">
                Yes. Token-based authentication, automatic deletion policies, and government-backed checks ensure every document remains tamper-proof.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Can I integrate with my data lakes?</h4>
              <p className="text-muted-foreground text-sm">
                Absolutely. VeriQuick streams verified records to your databases or lakes and supports custom API pipelines for bespoke workflows.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">What kind of support do you provide?</h4>
              <p className="text-muted-foreground text-sm">
                Guided onboarding for EDV GO, priority support for EDV Premium, and dedicated account management with SLA for EDV Enterprise.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Money Back Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-muted/30 rounded-2xl p-8 border border-border">
            <h3 className="text-xl font-bold mb-2">Compliance-first and cancellation friendly</h3>
            <p className="text-muted-foreground">
              Upgrade, downgrade, or cancel as your verification volume changes. Need something bespoke? Our team will tailor an EDV plan to fit.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Pricing
