"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, ShieldCheck, Workflow } from "lucide-react"
import Link from "next/link"
import { motion } from "motion/react"

const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-28 sm:pt-36">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* ── Centred text block ── */}
        <div className="mx-auto max-w-4xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-4xl font-semibold tracking-tight sm:text-[3.5rem] md:text-[4rem] lg:text-[4.5rem] lg:leading-[1.08]"
          >
            Trust and Time matter 
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.4, 0.25, 1] }}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            <span className="bg-gradient-to-r from-amber-500 via-orange-600 to-amber-600 bg-clip-text text-transparent font-semibold">Save both with Dectra</span>, the all-in-one verification platform. Streamline your workflows, reduced compliance friction and trails 
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Button className="h-11 rounded-full px-6" size="lg" asChild>
                <Link href="/auth/signup" className="flex items-center gap-2">
                  <span>Start verifying</span>
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.span>
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Button
                variant="ghost"
                className="h-11 px-2 text-muted-foreground hover:text-foreground"
                size="lg"
                asChild
              >
                <Link href="/pricing">See pricing</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── Full-width product surface beneath the text ── */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, delay: 0.15 }}
        className="relative mt-16 sm:mt-20"
      >
        {/* Glow behind the mockup */}
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6], scale: [0.98, 1.02, 0.98] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -inset-x-10 -top-20 bottom-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(99,102,241,0.22),transparent_70%)]"
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-t-[2rem] border border-b-0 border-border/60 bg-card/20 shadow-2xl shadow-black/50 backdrop-blur sm:rounded-t-[2.5rem]">
            {/* Browser chrome bar */}
            <div className="flex items-center justify-between border-b border-border/40 px-6 py-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <motion.div animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 2, repeat: Infinity, delay: 0 }} className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
                <motion.div animate={{ opacity: [0.15, 0.45, 0.15] }} transition={{ duration: 2, repeat: Infinity, delay: 0.3 }} className="h-2.5 w-2.5 rounded-full bg-yellow-400/50" />
                <motion.div animate={{ opacity: [0.1, 0.4, 0.1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.6 }} className="h-2.5 w-2.5 rounded-full bg-green-400/40" />
              </div>
              <div>dectra.app</div>
              <div className="flex items-center gap-3">
                <span className="rounded border border-border/40 px-2 py-0.5 text-[10px]">Delete notification</span>
                <span className="rounded border border-border/40 px-2 py-0.5 text-[10px]">Share</span>
              </div>
            </div>

            {/* Multi-pane mockup */}
            <div className="grid grid-cols-12 divide-x divide-border/30" style={{ minHeight: "420px" }}>
              {/* Sidebar */}
              <div className="col-span-2 hidden bg-black/30 p-4 lg:block">
                <div className="mb-6 flex items-center gap-2 text-sm font-medium">
                  <ShieldCheck className="h-4 w-4 text-emerald-400/60" />
                  <span className="text-foreground/80">Dectra</span>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground/70">
                  {["Inbox", "My documents", "Verifications", "Reports", "Settings"].map((item, i) => (
                    <div
                      key={item}
                      className={[
                        "rounded-lg px-3 py-2",
                        i === 0 ? "bg-white/5 text-foreground/80" : "",
                      ].join(" ")}
                    >
                      {item}
                      {i === 0 && (
                        <span className="ml-auto inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary/20 text-[9px] text-primary">
                          3
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Centre inbox list */}
              <div className="col-span-12 bg-black/20 p-4 sm:col-span-5 lg:col-span-4">
                <div className="mb-4 text-sm font-medium text-foreground/70">Inbox</div>
                <div className="space-y-2">
                  {[
                    { title: "EDV-135 Verify batch #47", sub: "assigned to you", time: "2h", urgent: false },
                    { title: "Compliance Bot", sub: "New report generated", time: "8h", urgent: false },
                    { title: "EDV-159 Error uploading docs", sub: "SLA breached", time: "2d", urgent: true },
                    { title: "DOC-498 Redesign verify flow", sub: "team mentioned you", time: "3d", urgent: false },
                    { title: "EDV-160 QR redirect broken", sub: "Reminded about this task", time: "1w", urgent: false },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start gap-3 rounded-xl px-3 py-2.5 text-xs hover:bg-white/[0.03]">
                      <div className="mt-0.5 h-6 w-6 rounded-full bg-white/10" />
                      <div className="flex-1">
                        <div className="font-medium text-foreground/80">{item.title}</div>
                        <div className="text-muted-foreground/60">{item.sub}</div>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground/50">
                        {item.urgent && <span className="h-1.5 w-1.5 rounded-full bg-red-400/70" />}
                        {item.time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right detail pane */}
              <div className="col-span-12 hidden bg-black/10 p-6 sm:col-span-7 sm:block lg:col-span-6">
                <div className="mb-1 flex items-center gap-2 text-[10px] text-muted-foreground/50">
                  <Workflow className="h-3 w-3" />
                  Verifications · EDV-135
                </div>
                <h3 className="text-lg font-semibold text-foreground/90">Verify batch #47</h3>
                <div className="mt-6 space-y-2 text-xs text-muted-foreground/70">
                  <div className="rounded-xl border border-border/30 bg-black/20 p-4 font-mono text-[11px] leading-relaxed">
                    <span className="text-purple-400/70">Document.verificationStatus</span>{" "}
                    <span className="text-muted-foreground/50">is defined correctly. It should be a</span>{" "}
                    <span className="text-sky-400/70">OneToMany</span>{" "}
                    <span className="text-muted-foreground/50">relation.</span>
                    <br /><br />
                    <span className="text-emerald-400/60">{"/** The verification result associated with this document */"}</span>
                    <br />
                    <span className="text-purple-400/70">@OneToMany</span>{"(() => "}
                    <span className="text-sky-400/70">VerificationResult</span>{")"}
                    <br />
                    <span className="text-foreground/60">public verificationResult?: VerificationResult;</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade into background */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </motion.div>
    </section>
  )
}

export default Hero
