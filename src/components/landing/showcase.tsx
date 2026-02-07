"use client"

import { motion } from "motion/react"
import { ArrowRight, Bot, Zap, Shield, BarChart3, Layers, FileCheck2, Clock, Globe, CheckCircle2, AlertTriangle, Sparkles, FileText, Settings } from "lucide-react"
import Link from "next/link"

/* ──────────────────────────────────────────────────────────
   Section 1 — AI-assisted verification  (full-width hero)
   ────────────────────────────────────────────────────────── */

function AIVerificationSection() {
  return (
    <div className="mb-24">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center"
      >
        {/* Text */}
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
            Artificial intelligence
            <ArrowRight className="h-3 w-3" />
          </div>

          <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-5xl lg:text-[3.25rem]">
            AI‑assisted document verification
          </h2>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            <span className="font-medium text-foreground">Dectra for AI.</span>{" "}
            Leverage intelligent document analysis and automated EDV checks to verify documents in seconds, not hours.
          </p>

          <Link
            href="#features"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/30 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-card/50"
          >
            Learn more
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Mock UI — Agent assignment panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute -inset-8 -z-10 rounded-[2.5rem] bg-[radial-gradient(closest-side,rgba(99,102,241,0.14),transparent)] blur-2xl" />
          <div className="overflow-hidden rounded-[1.75rem] border border-border/60 bg-card/20 p-6 shadow-2xl shadow-black/40 backdrop-blur">
            {/* Top toolbar */}
            <div className="mb-5 flex items-center gap-3 text-xs text-muted-foreground">
              <div className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <span className="ml-auto">Assign verification to…</span>
            </div>

            {/* Search bar */}
            <div className="mb-4 rounded-xl border border-border/60 bg-black/30 px-4 py-2.5 text-sm text-muted-foreground">
              Assign to…
            </div>

            {/* Agent list */}
            <div className="space-y-1">
              {[
                { name: "Document AI", badge: "Agent", active: true, icon: <Bot className="h-4 w-4" /> },
                { name: "EDV Scanner", badge: "Agent", active: false, icon: <FileCheck2 className="h-4 w-4" /> },
                { name: "Compliance Bot", badge: "Agent", active: false, icon: <Shield className="h-4 w-4" /> },
                { name: "QR Validator", badge: null, active: false, icon: <Zap className="h-4 w-4" /> },
                { name: "Batch Processor", badge: "Agent", active: false, icon: <Layers className="h-4 w-4" /> },
              ].map((agent) => (
                <div
                  key={agent.name}
                  className={[
                    "flex items-center gap-3 rounded-xl px-4 py-2.5 transition-colors",
                    agent.active ? "bg-white/5" : "hover:bg-white/[0.03]",
                  ].join(" ")}
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/60">
                    {agent.icon}
                  </span>
                  <span className="text-sm font-medium text-foreground">{agent.name}</span>
                  {agent.badge && (
                    <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      {agent.badge}
                    </span>
                  )}
                  {agent.active && (
                    <CheckCircle2 className="ml-auto h-4 w-4 text-emerald-400/80" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────
   Section 2 — Two side-by-side cards (Smart Triage + API)
   ────────────────────────────────────────────────────────── */

function SmartTriageCards() {
  return (
    <div className="mb-24 grid gap-6 lg:grid-cols-2">
      {/* Card A — Smart triage */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="flex flex-col"
      >
        <h3 className="text-xl font-semibold">Self‑driving verification ops</h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          Streamline your verification workflows with AI assistance for routine, manual document checks.
        </p>

        {/* Mock card */}
        <div className="mt-6 flex-1 overflow-hidden rounded-[1.75rem] border border-border/60 bg-card/20 p-6 shadow-xl shadow-black/30 backdrop-blur">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium">
            <Sparkles className="h-4 w-4 text-muted-foreground" />
            Triage Intelligence
          </div>

          <div className="mb-4 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
            <span className="font-medium text-foreground">Suggestions</span>
            <span className="inline-flex items-center gap-1 rounded-md border border-border/60 px-2 py-0.5">
              <Bot className="h-3 w-3" /> Document AI
            </span>
            <span className="inline-flex items-center gap-1 rounded-md border border-border/60 px-2 py-0.5">
              <FileText className="h-3 w-3" /> EDV Module
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Route to</span>
              <div className="inline-flex items-center gap-1.5 rounded-md border border-border/60 px-2 py-1">
                <Bot className="h-3 w-3" /> Document AI
              </div>
            </div>
            <div className="rounded-xl border border-border/40 bg-black/20 px-4 py-3 text-xs">
              <div className="mb-1 font-medium text-foreground/80">Why this was suggested</div>
              <p className="text-muted-foreground">
                This document type was previously processed by the Document AI module with 99.2% accuracy.
              </p>
              <div className="mt-3 flex items-center gap-2 text-muted-foreground">
                <span className="font-medium">Alternatives</span>
                <span className="inline-flex items-center gap-1 rounded-md border border-border/60 px-2 py-0.5">Manual review</span>
                <span className="inline-flex items-center gap-1 rounded-md border border-border/60 px-2 py-0.5">Batch queue</span>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border/40 bg-white/[0.03] px-4 py-2 text-xs font-medium">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400/80" />
              Accept suggestion
            </div>
          </div>
        </div>
      </motion.div>

      {/* Card B — API / MCP Integration */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.08 }}
        viewport={{ once: true }}
        className="flex flex-col"
      >
        <h3 className="text-xl font-semibold">Dectra API</h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          Connect Dectra to your favorite tools — CRMs, compliance platforms, and custom integrations.
        </p>

        {/* Mock card */}
        <div className="mt-6 flex-1 overflow-hidden rounded-[1.75rem] border border-border/60 bg-card/20 p-6 shadow-xl shadow-black/30 backdrop-blur">
          {/* Code snippet */}
          <div className="mb-5 rounded-xl border border-border/40 bg-black/30 px-4 py-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
            <div className="text-white/30">// api.dectra.app/v1</div>
            <div className="mt-1">
              <span className="text-purple-400/80">&quot;endpoints&quot;</span>: {"{"}
            </div>
            <div className="ml-4">
              <span className="text-purple-400/80">&quot;verify&quot;</span>: {"{"}
            </div>
            <div className="ml-8">
              <span className="text-purple-400/80">&quot;method&quot;</span>: <span className="text-emerald-400/80">&quot;POST&quot;</span>,
            </div>
            <div className="ml-8">
              <span className="text-purple-400/80">&quot;path&quot;</span>: <span className="text-emerald-400/80">&quot;/documents/verify&quot;</span>
            </div>
            <div className="ml-4">{"}"}</div>
            <div>{"}"}</div>
          </div>

          {/* Chat input */}
          <div className="rounded-xl border border-border/60 bg-black/20 p-4">
            <div className="mb-3 text-sm text-muted-foreground">Ask anything</div>
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1 rounded-md border border-border/60 px-2.5 py-1">
                <FileText className="h-3 w-3" /> Attach
              </span>
              <span className="inline-flex items-center gap-1 rounded-md border border-border/60 px-2.5 py-1">
                <Globe className="h-3 w-3" /> Search
              </span>
              <span className="inline-flex items-center gap-1 rounded-md border border-border/60 px-2.5 py-1">
                <Sparkles className="h-3 w-3" /> Reason
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────
   Section 3 — "Set the product direction" (full-width hero)
   → Adapted: Verification pipeline / timeline
   ────────────────────────────────────────────────────────── */

function PipelineSection() {
  return (
    <div className="mb-24">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:items-center"
      >
        {/* Text */}
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
            Pipeline &amp; tracking
            <ArrowRight className="h-3 w-3" />
          </div>

          <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-5xl lg:text-[3.25rem]">
            Track every verification end-to-end
          </h2>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            <span className="font-medium text-foreground">Unified verification timeline.</span>{" "}
            Plan, manage, and track all document verification pipelines with visual scheduling tools.
          </p>
        </div>

        {/* Mock timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute -inset-8 -z-10 rounded-[2.5rem] bg-[radial-gradient(closest-side,rgba(52,211,153,0.10),transparent)] blur-2xl" />
          <div className="overflow-hidden rounded-[1.75rem] border border-border/60 bg-card/20 p-6 shadow-2xl shadow-black/40 backdrop-blur">
            {/* Timeline header */}
            <div className="mb-4 flex items-center justify-between text-[11px] uppercase tracking-wider text-muted-foreground">
              <span>JAN 5</span>
              <span className="rounded-md border border-border/60 bg-black/30 px-3 py-1 text-xs font-medium text-foreground">JAN 22</span>
              <span>FEB</span>
            </div>

            {/* Timeline bars */}
            <div className="relative space-y-3">
              {/* Vertical indicator line */}
              <div className="absolute left-[55%] top-0 h-full w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent" />

              {[
                { label: "Batch EDV check", color: "from-emerald-400/20 via-emerald-400/10", width: "w-[75%]", offset: "ml-[5%]", hasIcon: true },
                { label: "QR generation", color: "from-sky-400/15 via-sky-400/5", width: "w-[50%]", offset: "ml-[25%]", hasIcon: false },
                { label: "Compliance review", color: "from-purple-400/15 via-purple-400/5", width: "w-[65%]", offset: "ml-[15%]", hasIcon: true },
              ].map((bar) => (
                <div key={bar.label} className={`${bar.offset} ${bar.width}`}>
                  <div className={`flex items-center gap-2 rounded-xl border border-white/8 bg-gradient-to-r ${bar.color} to-transparent px-4 py-3`}>
                    {bar.hasIcon && (
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-white/10">
                        <CheckCircle2 className="h-3 w-3 text-emerald-400/80" />
                      </span>
                    )}
                    <span className="text-xs font-medium text-foreground/80">{bar.label}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Scale markers */}
            <div className="mt-4 flex items-center justify-between text-[10px] text-muted-foreground/60">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-2 w-px bg-white/10" />
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────
   Section 4 — Two side-by-side cards (Dashboard + Status)
   ────────────────────────────────────────────────────────── */

function DashboardCards() {
  return (
    <div className="mb-24 grid gap-6 lg:grid-cols-2">
      {/* Card A — Project overview */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="flex flex-col"
      >
        <h3 className="text-xl font-semibold">Manage verifications end‑to‑end</h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          Consolidate documents, verification statuses, and audit trails in one centralized location.
        </p>

        <div className="mt-6 flex-1 overflow-hidden rounded-[1.75rem] border border-border/60 bg-card/20 p-6 shadow-xl shadow-black/30 backdrop-blur">
          <h4 className="mb-4 text-base font-semibold">Verification Overview</h4>

          <div className="space-y-4 text-sm">
            {[
              { label: "Properties", items: [
                { text: "In Progress", color: "text-amber-400", icon: <Clock className="h-3 w-3" /> },
                { text: "EDV", color: "text-foreground", icon: <FileCheck2 className="h-3 w-3" /> },
              ]},
              { label: "Resources", items: [
                { text: "Exploration", color: "text-purple-400", icon: <Sparkles className="h-3 w-3" /> },
                { text: "Document scans", color: "text-foreground", icon: <FileText className="h-3 w-3" /> },
              ]},
            ].map((row) => (
              <div key={row.label} className="flex items-start gap-4">
                <span className="w-20 shrink-0 text-xs text-muted-foreground">{row.label}</span>
                <div className="flex flex-wrap gap-2">
                  {row.items.map((item) => (
                    <span key={item.text} className={`inline-flex items-center gap-1.5 rounded-md border border-border/60 px-2 py-0.5 text-xs ${item.color}`}>
                      {item.icon} {item.text}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-2 border-t border-border/40 pt-4 text-sm">
            <div className="font-medium">Milestones</div>
            {[
              { text: "Initial Review", pct: "100%", complete: true },
              { text: "EDV Verification", pct: "100% of 10", complete: true },
              { text: "Final Approval", pct: "25% of 53", complete: false },
            ].map((m) => (
              <div key={m.text} className="flex items-center gap-3">
                <span className={`h-2 w-2 rounded-full ${m.complete ? "bg-emerald-400/80" : "bg-white/20"}`} />
                <span className="text-xs font-medium">{m.text}</span>
                <span className="text-xs text-muted-foreground">{m.pct}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Card B — Status updates */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.08 }}
        viewport={{ once: true }}
        className="flex flex-col"
      >
        <h3 className="text-xl font-semibold">Verification updates</h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          Communicate progress and verification health with built‑in status updates.
        </p>

        <div className="mt-6 flex-1 overflow-hidden rounded-[1.75rem] border border-border/60 bg-card/20 p-6 shadow-xl shadow-black/30 backdrop-blur">
          {/* Stacked status cards */}
          <div className="relative space-y-3">
            {[
              { status: "On track", message: "All documents verified and ready for final sign-off", date: "Feb 8", color: "text-emerald-400", icon: <CheckCircle2 className="h-4 w-4 text-emerald-400" />, opacity: "opacity-100" },
              { status: "At risk", message: "3 documents pending re-verification", date: "Feb 5", color: "text-amber-400", icon: <AlertTriangle className="h-4 w-4 text-amber-400" />, opacity: "opacity-70" },
              { status: "Under review", message: "Batch #47 submitted for compliance check", date: "Feb 2", color: "text-sky-400", icon: <Clock className="h-4 w-4 text-sky-400" />, opacity: "opacity-50" },
            ].map((card, i) => (
              <div
                key={card.status}
                className={`rounded-xl border border-border/40 bg-black/20 px-4 py-3 ${card.opacity}`}
                style={{ transform: `translateX(${i * 6}px)` }}
              >
                <div className="flex items-center gap-2">
                  {card.icon}
                  <span className={`text-sm font-semibold ${card.color}`}>{card.status}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{card.message}</p>
                <p className="mt-2 text-[10px] text-muted-foreground/60">{card.date}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────
   Main Showcase Export
   ────────────────────────────────────────────────────────── */

const Showcase = () => {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <AIVerificationSection />
        <SmartTriageCards />
        <PipelineSection />
        <DashboardCards />
      </div>
    </section>
  )
}

export default Showcase
