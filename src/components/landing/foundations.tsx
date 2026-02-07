"use client"

import { motion } from "motion/react"

const rows = [
  {
    title: "Verification engine",
    description:
      "High‑performance architecture that keeps EDV checks fast, consistent, and observable across every team.",
  },
  {
    title: "Enterprise‑ready security",
    description:
      "Best‑in‑class security practices — encryption, access controls, audit trails — keep your data safe at every layer.",
  },
  {
    title: "Engineered for scale",
    description:
      "From early‑stage pilots to institution‑wide rollouts, Dectra scales with your document volume and compliance needs.",
  },
]

const Foundations = () => {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Under the hood
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
              Built on strong foundations.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              It&apos;s easy to overlook the systems that keep verification reliable. Underneath Dectra is an
              engine focused on speed, safety, and scale so your team can move quickly without cutting corners.
            </p>

            <div className="mt-10 space-y-6 border-t border-border/60 pt-8">
              {rows.map((row) => (
                <div key={row.title} className="grid gap-2 sm:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]">
                  <div className="text-sm font-medium">{row.title}</div>
                  <div className="text-sm text-muted-foreground leading-relaxed">{row.description}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            viewport={{ once: true }}
            className="relative hidden min-h-[360px] rounded-[2.25rem] border border-border/60 bg-card/20 shadow-2xl shadow-black/40 backdrop-blur lg:block"
          >
            <div className="pointer-events-none absolute inset-0 rounded-[2.25rem] border border-white/5" />
            <div className="absolute left-10 top-10 h-24 w-40 rounded-2xl border border-white/12 bg-gradient-to-br from-white/12 to-transparent" />
            <div className="absolute right-8 top-6 h-16 w-24 rounded-2xl border border-white/10 bg-gradient-to-tr from-emerald-400/18 via-sky-400/10 to-transparent" />
            <div className="absolute bottom-10 left-8 h-28 w-56 rounded-2xl border border-white/8 bg-gradient-to-tr from-white/6 to-transparent" />
            <div className="absolute bottom-6 right-8 h-10 w-32 rounded-full border border-white/10 bg-black/40" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Foundations

