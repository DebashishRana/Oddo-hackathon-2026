"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, ShieldCheck, Workflow } from "lucide-react"
import { motion } from "motion/react"
import Image from "next/image"

type TabId = "accessibility" | "security" | "compliance"

const tabs: { id: TabId; label: string; title: string; description: string }[] = [
  {
    id: "accessibility",
    label: "Accessibility",
    title: "Accessible from any device, in seconds.",
    description:
      "Upload, verify, and share documents from desktop or mobile. QR-based access makes every verification just a scan away.",
  },
  {
    id: "security",
    label: "Security",
    title: "Security-first by design.",
    description:
      "Token-based access, encryption at rest and in transit, and detailed audit logs keep every verification traceable.",
  },
  {
    id: "compliance",
    label: "Compliance",
    title: "Compliance that keeps pace with operations.",
    description:
      "Policy-driven retention, EDV thresholds, and exportable reports help you stay aligned with regulatory requirements.",
  },
]

const Features = () => {
  const [activeTab, setActiveTab] = useState<TabId>("accessibility")
  const active = tabs.find((t) => t.id === activeTab)!

  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Featured logos strip */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Trusted by teams and programs
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            From innovation labs to enterprise accelerators.
          </p>
          <div className="mt-8 flex items-center justify-center">
            <div className="inline-flex max-w-full overflow-hidden rounded-2xl border border-border/60 bg-card/20 px-6 py-4">
              <Image
                src="/best saas kit.png"
                alt="Programs and institutions featuring Dectra"
                width={1200}
                height={360}
                className="h-14 w-auto object-contain opacity-90"
              />
            </div>
          </div>
        </motion.div>

        {/* Three main pillars as large interactive cards */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-10 max-w-2xl"
        >
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Product
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
            Made for modern verification teams.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Three pillars — accessibility, security, and compliance — keep every document flow reliable and auditable.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {tabs.map((tab, index) => {
            const isActive = tab.id === activeTab
            const Icon =
              tab.id === "accessibility" ? Workflow : tab.id === "security" ? Lock : ShieldCheck

            return (
              <motion.button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className="text-left"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                viewport={{ once: true }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <Card
                  className={[
                    "h-full rounded-2xl border-border/60 bg-card/25 backdrop-blur transition-all duration-300",
                    isActive ? "border-primary/40 bg-card/35 shadow-lg shadow-primary/5" : "hover:bg-card/30 hover:shadow-md hover:shadow-black/20",
                  ].join(" ")}
                >
                  <CardHeader>
                    <div className="mb-4 inline-flex h-9 items-center gap-2 rounded-full border border-border/60 px-3 text-xs text-muted-foreground">
                      <motion.span
                        className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary"
                        animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <Icon className="h-3 w-3" />
                      </motion.span>
                      {tab.label}
                    </div>
                    <CardTitle className="text-lg">{tab.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">{tab.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.button>
            )
          })}
        </div>

        {/* Tab detail area: image/text layout, with security-focused metrics for that tab */}
        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold">{active.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{active.description}</p>

            {active.id === "security" && (
              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                {[
                  { label: "Uptime", value: "99.9%" },
                  { label: "EDV checks < ", value: "60s" },
                  { label: "Audit events / mo", value: "100k+" },
                  { label: "Encryption", value: "AES‑256" },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                    className="rounded-2xl border border-border/60 bg-card/25 px-3 py-4 text-left"
                  >
                    <div className="text-2xl font-semibold">{item.value}</div>
                    <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      {item.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {active.id !== "security" && (
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {active.id === "accessibility" && (
                  <>
                    <li>Upload and verify from desktop or mobile without new installs.</li>
                    <li>Share QR codes instead of attachments for instant re-validation.</li>
                    <li>Readable layouts and contrast tuned for busy operations teams.</li>
                  </>
                )}
                {active.id === "compliance" && (
                  <>
                    <li>Policy-driven document lifecycles with configurable retention.</li>
                    <li>Export-ready reports for audits, internal reviews, and regulators.</li>
                    <li>Immutable verification trails for every EDV check and redirect.</li>
                  </>
                )}
              </ul>
            )}
          </motion.div>

          <motion.div
            key={`${active.id}-surface`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="relative"
          >
            <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-[radial-gradient(closest-side,rgba(99,102,241,0.18),transparent)] blur-2xl" />
            <motion.div
              className="h-64 rounded-[1.75rem] border border-border/60 bg-card/25 shadow-xl shadow-black/40 backdrop-blur overflow-hidden"
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
            >
              <Image
                src={active.id === "accessibility" ? "/2.jpg" : active.id === "security" ? "/3.jpg" : "/4.jpg"}
                alt={active.title}
                fill
                className="object-cover"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Features
