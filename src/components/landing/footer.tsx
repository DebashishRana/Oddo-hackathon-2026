"use client"

import Link from "next/link"
import Image from "next/image"
import { Github, Twitter, Linkedin, Mail } from "lucide-react"

const Footer = () => {
  const footerLinks = {
    product: [
      { name: "Solutions", href: "#features" },
      { name: "Pricing", href: "#pricing" },
      { name: "Why VeriQuick", href: "#testimonials" },
      { name: "Documentation", href: "/docs" },
      { name: "Roadmap", href: "/roadmap" }
    ],
    company: [
      { name: "About", href: "/about" },
      { name: "Blog", href: "/blog" },
      { name: "Careers", href: "/careers" },
      { name: "Contact", href: "/contact" },
      { name: "Press Kit", href: "/press" }
    ],
    resources: [
      { name: "Compliance Center", href: "/compliance" },
      { name: "Help Center", href: "/help" },
      { name: "API Reference", href: "/api" },
      { name: "Examples", href: "/examples" },
      { name: "Templates", href: "/templates" }
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "GDPR", href: "/gdpr" },
      { name: "Security", href: "/security" }
    ]
  }

  const socialLinks = [
    { name: "GitHub", href: "https://github.com/VeriQuick", icon: Github },
    { name: "Twitter", href: "https://twitter.com", icon: Twitter },
    { name: "LinkedIn", href: "https://linkedin.com/company/veriquick", icon: Linkedin },
    { name: "Email", href: "mailto:hello@veriquick.com", icon: Mail }
  ]

  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Image
                src="/Logo.png"
                alt="VeriQuick Logo"
                width={32}
                height={32}
                className="w-8 h-8 rounded-lg"
              />
              <span className="text-xl font-bold text-foreground">VeriQuick</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Instant document verification, QR access, and government-backed integrity. Manage, verify, and redirect documents from one secure workspace.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="max-w-md">
            <h3 className="font-semibold text-foreground mb-2">Stay Updated</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Get the latest updates, tutorials, and announcements delivered to your inbox.
            </p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <div className="text-muted-foreground text-sm">
            © 2026 VeriQuick. All rights reserved.
          </div>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <span className="text-muted-foreground text-sm">Built with ❤️ from D</span>
            <div className="flex items-center space-x-2 text-muted-foreground text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
