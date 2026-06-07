"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "motion/react"
import { buildAppUrl } from "@/lib/site-url"

const footerColumns = [
  {
    title: "Features",
    links: [
      { name: "Plan", href: "#features" },
      { name: "Build", href: "#features" },
      { name: "Insights", href: "#features" },
      { name: "Customer Requests", href: "#features" },
      { name: "Linear Asks", href: "#features" },
      { name: "Security", href: "#features" },
      { name: "Mobile", href: "#features" },
    ],
  },
  {
    title: "Product",
    links: [
      { name: "Pricing", href: "/pricing" },
      { name: "Method", href: "/docs" },
      { name: "Integrations", href: "#features" },
      { name: "Changelog", href: "#" },
      { name: "Documentation", href: "/docs" },
      { name: "Download", href: "#" },
      { name: "Switch", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "#" },
      { name: "Customers", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Now", href: "#" },
      { name: "README", href: "#" },
      { name: "Quality", href: "#" },
      { name: "Brand", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Developers", href: "/docs" },
      { name: "Status", href: "#" },
      { name: "Startups", href: "#" },
      { name: "Report vulnerability", href: "#" },
      { name: "DPA", href: "#" },
      { name: "Privacy", href: "#" },
      { name: "Terms", href: "#" },
    ],
  },
  {
    title: "Connect",
    links: [
      { name: "Contact us", href: "/contact" },
      { name: "Community", href: "#" },
      { name: "X (Twitter)", href: "#" },
      { name: "GitHub", href: "#" },
      { name: "YouTube", href: "#" },
    ],
  },
]

const Footer = () => {
  return (
    <footer className="bg-background dark:bg-[#0a0a0b]">
      {/* CTA Banner */}
      <div className="border-b border-border/10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-[42px] font-medium tracking-tight text-foreground leading-tight"
          >
            Proof first, profit faster.
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 shrink-0"
          >
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-border/40 bg-white/5 px-5 py-2.5 text-sm font-medium text-foreground hover:bg-white/10 hover:scale-105 transition-all duration-200"
            >
              Contact sales
            </Link>
            <Link
              href={buildAppUrl("/auth/signup")}
              className="inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:opacity-90 hover:scale-105 transition-all duration-200"
            >
              Get started
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Footer links */}
      <div className="border-t border-border/10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-6 lg:gap-12">
          {/* Logo */}
          <div className="col-span-2 sm:col-span-3 md:col-span-1">
            <Link href="/" className="inline-block">
              <Image
                src="/Logo.png"
                alt="Dectra Logo"
                width={28}
                height={28}
                className="h-7 w-7 rounded-lg opacity-80 hover:opacity-100 transition-opacity"
              />
            </Link>
          </div>

          {/* Link columns */}
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-medium text-foreground/90">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground/70 hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom legal bar */}
      <div className="border-t border-border/10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
          <div className="flex flex-col gap-2 text-xs text-muted-foreground/60">
            <p>© 2026 Dectra Labs Pvt lmtd. &ldquo;Dectra&rdquo; and the Dectra logo are registered trademarks of the company.</p>
            <p>Indian Residents: +91-930-4211-754</p>
          </div>
        </div>
      </div>
      </div>
    </footer>
  )
}

export default Footer
