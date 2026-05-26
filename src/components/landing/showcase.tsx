"use client"

import { motion } from "motion/react"
import { ArrowRight, Shield, Trash2, Download, PenLine, Cookie, HelpCircle, XCircle } from "lucide-react"
import Link from "next/link"

const privacyCards = [
  {
    icon: Shield,
    title: "Learn about data practices",
    description: "See what data Dectra may process, how it may be used, and the steps we take to protect it.",
    action: "Learn more",
  },
  {
    icon: Trash2,
    title: "Delete my data",
    description: "Ask Dectra to delete personal data associated with you.",
    action: "Request deletion",
  },
  {
    icon: Download,
    title: "Access my data",
    description: "Request a copy of personal data associated with you and learn more about how it may have been processed.",
    action: "Request access",
  },
  {
    icon: PenLine,
    title: "Correct my data",
    description: "Ask Dectra to correct personal data associated with you if you believe it is inaccurate.",
    action: "Request correction",
  },
  {
    icon: Cookie,
    title: "Manage my cookie preferences",
    description: "Manage requests related to cookie-based data sharing, advertising preferences, and similar privacy choices.",
    action: "Manage preferences",
  },
  {
    icon: HelpCircle,
    title: "Other privacy request",
    description: "Submit another type of request related to personal data or tell us more about a privacy concern that isn't covered above.",
    action: "Submit request",
  },
]

const Showcase = () => {
  return (
    <section className="py-24 bg-black text-foreground overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        
        {/* Header Text */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-6"
          >
            We protect people,
            <br />
            not just data
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto"
          >
            At Dectra, privacy is our foundation. That&apos;s why we provide consumers with a secure, user-friendly portal to manage their privacy and personal data requests.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-6"
          >
            <Link
              href="#"
              className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-black transition-transform hover:scale-105"
            >
              Learn more <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="#"
              className="inline-flex items-center justify-center text-sm font-medium text-white transition-opacity hover:opacity-80"
            >
              Visit our privacy portal <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </motion.div>
        </div>

        {/* Massive UI mock block */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative mx-auto max-w-5xl rounded-t-[2.5rem] border border-white/10 bg-slate-900/50 p-1 lg:p-2 overflow-hidden shadow-2xl"
        >
          {/* Subtle background gradient representing the purple/blue glow from the image */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent pointer-events-none" />
          
          <div className="relative rounded-[2rem] bg-[#0A0A0A] p-6 lg:p-12 shadow-inner border border-white/5 h-full w-full">
            {/* Mock UI Header */}
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-2 text-white font-medium text-xl">
                <Shield className="h-6 w-6 text-indigo-400" />
                <span>dectra</span>
              </div>
              <div className="hidden md:flex items-center gap-6 text-sm font-medium text-white/70">
                <span className="hover:text-white cursor-pointer">Help Center</span>
                <span className="hover:text-white cursor-pointer">Privacy &amp; Security</span>
                <button className="rounded-full bg-white/10 px-5 py-2 text-white hover:bg-white/20 transition-colors flex items-center gap-2">
                  Get a demo <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Mock UI Body */}
            <div>
              <h3 className="text-3xl font-medium text-white mb-4">Privacy portal</h3>
              <p className="text-sm text-white/60 leading-relaxed max-w-3xl mb-12">
                Understand and make requests about your personal data that Dectra processed directly, all in one place. Learn more about Dectra&apos;s data practices, request deletion or access to data, and manage other privacy-related requests.
              </p>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {privacyCards.map((card, idx) => {
                  const Icon = card.icon;
                  return (
                    <div 
                      key={idx} 
                      className="flex flex-col bg-white/[0.03] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.05] transition-colors cursor-pointer"
                    >
                      <div className="mb-6 h-10 w-10 flex items-center justify-center rounded-xl bg-white/10 text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h4 className="text-lg font-medium text-white mb-3">{card.title}</h4>
                      <p className="text-xs text-white/50 leading-relaxed mb-6 flex-grow">
                        {card.description}
                      </p>
                      <div className="mt-auto flex items-center text-xs font-medium text-indigo-400 group">
                        {card.action} <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            
            {/* Bottom fading edge to look cut-off like in the image */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none" />
          </div>
        </motion.div>

      </div>
    </section>
  )
}

export default Showcase
