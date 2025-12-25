"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  FileCheck2,
  ServerCog,
  QrCode,
  ShieldCheck,
  Leaf,
  Smartphone,
  Lock,
  Workflow,
  Puzzle
} from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

const Features = () => {
  const features = [
    {
      icon: <FileCheck2 className="w-8 h-8" />,
      title: "Instant Document Verification",
      description: "Verify identification and sensitive documents within seconds using automated validation — no manual checking or delays.",
      color: "text-primary"
    },
    {
      icon: <ServerCog className="w-8 h-8" />,
      title: "Enterprise-Level Savings & Automation",
      description: "Supports bulk uploads, metadata extraction, audit logs, and integrations to streamline workflows while cutting costs by up to 30%.",
      color: "text-amber-500"
    },
    {
      icon: <QrCode className="w-8 h-8" />,
      title: "QR-Based Access",
      description: "Generate secure QR codes for every uploaded document, enabling fast retrieval and verification from any device.",
      color: "text-blue-500"
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: "Govt Backed Integrity",
      description: "Integrity checks backed by verified government databases ensure every document is tamper-proof and trusted.",
      color: "text-green-500"
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Eco-Friendly & Paperless",
      description: "Digitize verification to reduce printing costs and keep operations sustainable without sacrificing security.",
      color: "text-emerald-500"
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Free to Use Anywhere",
      description: "Access VeriQuick on laptops or phones to upload and verify with QR validation at no cost.",
      color: "text-indigo-500"
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Token-Based Security",
      description: "Token authentication, automatic deletion, and audit-ready logs keep every verification session secure.",
      color: "text-slate-500"
    },
    {
      icon: <Workflow className="w-8 h-8" />,
      title: "Pipelining & Storage",
      description: "Redirect and forward verification records to your databases or lakes securely with built-in pipelines.",
      color: "text-cyan-500"
    },
    {
      icon: <Puzzle className="w-8 h-8" />,
      title: "Custom API Support",
      description: "Plug VeriQuick into your stack for bespoke workflows, verified databases, and automated redirection.",
      color: "text-orange-500"
    }
  ]

  return (
    <section id="features" className="py-24 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Image Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="relative max-w-5xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-2">
              <Image
                src="/best saas kit.png"
                alt="VeriQuick workspace showing instant document verification"
                width={1200}
                height={800}
                className="w-full h-auto rounded-xl"
                priority
                quality={95}
              />
              {/* Overlay gradient for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent rounded-xl" />
            </div>

            {/* Floating elements for visual appeal */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary/20 rounded-full blur-sm" />
            <div className="absolute -top-2 -right-6 w-6 h-6 bg-secondary/30 rounded-full blur-sm" />
            <div className="absolute -bottom-3 left-8 w-5 h-5 bg-accent/25 rounded-full blur-sm" />
            <div className="absolute -bottom-4 -right-3 w-7 h-7 bg-primary/15 rounded-full blur-sm" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Because validity is{" "}
            <span className="bg-gradient-to-r from-orange-500 via-orange-400 to-orange-300 bg-clip-text text-transparent">
              proven
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Instant verification, government-backed integrity, and QR access in one place. Manage, verify,
            and redirect documents without manual delays or fragmented tools.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className={`${feature.color} mb-4`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8 border border-primary/20">
            <h3 className="text-2xl font-bold mb-4">Ready for instant document verification?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Use VeriQuick to verify documents within seconds, generate QR access, and stream results into your existing data lakes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-orange-500 via-orange-400 to-orange-300 text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Start verifying now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border border-border px-8 py-3 rounded-lg font-medium hover:bg-muted/50 transition-colors"
              >
                See how VeriQuick works
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Features
