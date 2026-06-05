"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

// ─── Data ────────────────────────────────────────────────────────────────────

const featuresTop = [
  {
    id: 1,
    label: "QR Document Verification",
    description:
      "Authenticate documents instantly using QR-linked metadata and cross-source validation against DigiLocker and UIDAI.",
    image: "/images/feature-qr.png",
  },
  {
    id: 2,
    label: "KYC & Identity Checks",
    description:
      "Deep-learning powered Aadhaar and PAN verification with confidence scoring and automated fraud detection.",
    image: "/images/feature-kyc.png",
  },
]

const featuresBottom = [
  {
    id: 3,
    label: "Ephemeral Architecture",
    description:
      "Zero PII retention. Verifications are processed and discarded — not stored — minimising liability.",
    image: "/images/feature-ephemeral.png",
    bgColor: "bg-indigo-500/20",
  },
  {
    id: 4,
    label: "Fraud Prevention",
    description:
      "Multi-layer cross-verification detects mismatches before they reach your compliance team.",
    image: "/images/feature-fraud.png",
    bgColor: "bg-emerald-500/20",
  },
  {
    id: 5,
    label: "Compliance Audit Trail",
    description:
      "Every verification is traceable, timestamped, and ready for institutional review or certification.",
    image: "/images/feature-audit.png",
    bgColor: "bg-sky-500/20",
  },
]

const stats = [
  { label: "Faster than manual review¹", value: "10x" },
  { label: "Reduction in PII exposure²", value: "80%" },
  { label: "Document types supported", value: "25+" },
  { label: "Verification accuracy", value: "99.2%" },
]

const orgLogos = [
  { src: "/logos/auj.png", alt: "Amity University" },
  { src: "/logos/edc.png", alt: "EDC IIT Delhi" },
  { src: "/logos/ic.png", alt: "Microsoft Imagine Cup" },
  { src: "/logos/ii.png", alt: "India Innovates" },
  { src: "/logos/sj.png", alt: "SJ Logo" },
  { src: "/logos/xiss.png", alt: "XISS" },
]

// ─── OrgLogoWall ─────────────────────────────────────────────────────────────

const OrgLogoWall = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16 lg:gap-20">
      {orgLogos.map((logo, idx) => (
        <Image
          key={logo.alt}
          src={logo.src}
          alt={logo.alt}
          width={idx < 2 ? 180 : 150}
          height={idx < 2 ? 72 : 60}
          className={idx < 2 ? "h-14 w-auto object-contain" : "h-12 md:h-14 w-auto object-contain"}
          style={idx === 0 ? undefined : { filter: "brightness(0) invert(1)" }}
        />
      ))}
    </div>
  )
}

// ─── Features ─────────────────────────────────────────────────────────────────

const Features = () => {
  return (
    <section
      id="features"
      className="py-24 bg-black text-foreground overflow-hidden"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">

        {/* Org Logo Wall */}
        <OrgLogoWall />

        {/* Section Header */}
        <div className="mt-24 mb-16 md:mt-32 md:mb-20 text-center max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ease: "easeInOut" }}
            className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-6"
          >
            Building blocks for your
            <br />
            <span className="text-white">ideal verification solution</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, ease: "easeInOut" }}
            className="text-lg text-muted-foreground leading-relaxed"
          >
            Dectra's modular platform helps you verify, prevent fraud, and
            orchestrate compliance across the entire life cycle.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, ease: "easeInOut" }}
            className="mt-8"
          >
            <motion.div whileHover={{ scale: 1.05 }} className="inline-block">
              <Button className="rounded-full px-8 bg-white hover:bg-white/90 text-black font-semibold h-12">
                See the full platform
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Bento Grid */}
        <div className="flex flex-col gap-6">

          {/* Top Row — 2 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuresTop.map((feature, idx) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, ease: "easeInOut" }}
                className="group flex flex-col"
              >
                <div className="aspect-[4/3] rounded-t-3xl overflow-hidden bg-slate-900 border border-white/10 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/5 pointer-events-none" />
                  <Image
                    src={feature.image}
                    alt={feature.label}
                    fill
                    className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="pt-6">
                  <h3 className="text-xl font-medium mb-2">{feature.label}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Row — 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuresBottom.map((feature, idx) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + idx * 0.1, ease: "easeInOut" }}
                className="group flex flex-col"
              >
                <div
                  className={`aspect-[4/3] rounded-t-3xl overflow-hidden border border-white/10 relative ${feature.bgColor}`}
                >
                  <div className="absolute inset-0 bg-black/40 pointer-events-none" />
                  <Image
                    src={feature.image}
                    alt={feature.label}
                    fill
                    className="object-cover opacity-60 mix-blend-overlay group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="pt-6">
                  <h3 className="text-lg font-medium mb-2">{feature.label}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Unified By Design — Glowing Box */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mt-32 md:mt-48 relative rounded-3xl overflow-hidden bg-black border border-white/5 py-24 md:py-32 flex flex-col items-center justify-center text-center px-4"
        >
          {/* Glow layers */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg aspect-square bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.4),rgba(59,130,246,0.2),transparent_70%)] blur-[80px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md aspect-square bg-[radial-gradient(ellipse_at_center,rgba(52,211,153,0.3),transparent_60%)] blur-[60px] pointer-events-none mix-blend-screen" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ ease: "easeInOut" }}
              className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white"
            >
              Unified by design.
              <br />
              <span className="text-white/90">Built for the AI era.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: 0.1, ease: "easeInOut" }}
              className="text-base md:text-lg text-white/70 leading-relaxed font-medium"
            >
              Dectra AI is designed from the ground up to connect a grid of
              agents behind the scenes — across verifications, compliance, and
              user identities. Powered by our Context Model, it acts safely,
              intelligently, and in context.
            </motion.p>

            <div className="pt-4">
              <motion.div whileHover={{ scale: 1.05 }} className="inline-block">
                <Button className="rounded-full px-8 bg-white hover:bg-white/90 text-black h-12 text-sm font-semibold transition-all duration-300">
                  Explore Dectra AI
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Numbers Don't Lie */}
        <div className="mt-32 md:mt-40 border-t border-white/10 pt-24 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 lg:gap-8">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ ease: "easeInOut" }}
                className="text-4xl lg:text-5xl font-medium tracking-tight text-white"
              >
                Numbers don't lie
              </motion.h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="space-y-4 border-b border-white/10 pb-12"
                >
                  <div className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </div>
                  <div className="text-6xl lg:text-7xl font-medium tracking-tighter text-white">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 text-xs text-muted-foreground space-y-1">
            <p>1 Customer case study average estimation 2025</p>
            <p>2 Verification industry benchmark assessment 2025</p>
          </div>
        </div>

      </div>
    </section>
  )
}

export default Features
