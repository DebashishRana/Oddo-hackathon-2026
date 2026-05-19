"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Menu, X, ChevronDown, FileCheck, QrCode, Shield, BarChart3, Workflow, Globe, Sparkles, Code2, ClipboardList, FileSearch, Handshake, GitBranch, Users } from "lucide-react"
import { UserButtonClient } from "@/components/auth/user-button-client"
import { ThemeToggle } from "@/components/theme-toggle"

interface Session {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

interface NavigationClientProps {
  session: Session | null
}

const productItems = {
  products: [
    {
      icon: FileCheck,
      title: "Document Verification",
      description: "Verify authenticity in seconds.",
      href: "#features",
    },
    {
      icon: QrCode,
      title: "QR Access",
      description: "Scan-based verification flows.",
      href: "#features",
    },
    {
      icon: Shield,
      title: "Compliance Engine",
      description: "Stay aligned with regulations.",
      href: "#features",
    },
    {
      icon: ClipboardList,
      title: "Audit Trails",
      description: "Full traceability on every action.",
      href: "#features",
    },
    {
      icon: FileSearch,
      title: "Smart Redirects",
      description: "Route verifications intelligently.",
      href: "#features",
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: "Track verification metrics.",
      href: "#features",
    },
  ],
  platform: [
    {
      icon: Workflow,
      title: "Integrations",
      description: "Connect to your existing stack.",
      href: "#features",
    },
    {
      icon: Sparkles,
      title: "AI Verification",
      description: "Intelligent document analysis.",
      href: "#features",
    },
    {
      icon: Globe,
      title: "Global Ready",
      description: "Verify across borders.",
      href: "#features",
    },
    {
      icon: Code2,
      title: "Developer Tools",
      description: "Build custom workflows.",
      href: "/docs",
    },
  ],
}

const partnerItems = [
  {
    icon: Handshake,
    title: "Investors",
    description: "Shape the future of verification.",
    href: "/investors",
  },
  {
    icon: GitBranch,
    title: "Affiliates",
    description: "Join our growth network.",
    href: "#",
  },
  {
    icon: Users,
    title: "Community",
    description: "Connect with other builders.",
    href: "#",
  },
]

export function NavigationClient({ session }: NavigationClientProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [productOpen, setProductOpen] = React.useState(false)
  const [partnersOpen, setPartnersOpen] = React.useState(false)
  const [mobileProductOpen, setMobileProductOpen] = React.useState(false)
  const [mobilePartnersOpen, setMobilePartnersOpen] = React.useState(false)
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const partnersTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  const handleProductEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setProductOpen(true)
  }

  const handleProductLeave = () => {
    timeoutRef.current = setTimeout(() => setProductOpen(false), 200)
  }

  const handlePartnersEnter = () => {
    if (partnersTimeoutRef.current) clearTimeout(partnersTimeoutRef.current)
    setPartnersOpen(true)
  }

  const handlePartnersLeave = () => {
    partnersTimeoutRef.current = setTimeout(() => setPartnersOpen(false), 200)
  }

  const navItems = [
    { name: "Pricing", href: "/pricing" },
    { name: "Docs", href: "/docs" },
    { name: "Solutions", href: "/demo" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/Logo.png"
              alt="Dectra Logo"
              width={32}
              height={32}
              className="w-8 h-8 rounded-lg"
            />
            <span className="text-[15px] font-semibold tracking-tight">Dectra</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 items-center justify-center">
            <div className="flex items-center gap-7">
              {/* Product dropdown trigger */}
              <div
                className="relative"
                onMouseEnter={handleProductEnter}
                onMouseLeave={handleProductLeave}
              >
                <button
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Product
                  <ChevronDown className={cn(
                    "h-3.5 w-3.5 transition-transform duration-200",
                    productOpen && "rotate-180"
                  )} />
                </button>

                {/* Mega dropdown */}
                <div
                  className={cn(
                    "absolute left-0 top-full pt-3 z-50 transition-all duration-300 ease-out",
                    productOpen
                      ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 -translate-y-2 pointer-events-none"
                  )}
                >
                  <div className="w-[680px] rounded-xl border border-border/40 bg-popover shadow-2xl p-6">
                    <div className="grid grid-cols-12 gap-6">
                      {/* Core Features column */}
                      <div className="col-span-4">
                        <h3 className="text-xs font-medium text-muted-foreground/70 mb-4">Core Features</h3>
                        <div className="space-y-4">
                          {productItems.products.slice(0, 2).map((item) => (
                            <Link
                              key={item.title}
                              href={item.href}
                              onClick={() => setProductOpen(false)}
                              className="group block rounded-md transition-colors duration-150"
                            >
                              <div className="text-sm font-semibold text-foreground">{item.title}</div>
                              <div className="mt-0.5 text-xs text-muted-foreground/70 leading-snug">{item.description}</div>
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* More columns */}
                      <div className="col-span-8">
                        <h3 className="text-xs font-medium text-muted-foreground/70 mb-4">More</h3>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                          {[...productItems.products.slice(2), ...productItems.platform.slice(0, 2)].map((item) => (
                            <Link
                              key={item.title}
                              href={item.href}
                              onClick={() => setProductOpen(false)}
                              className="group block rounded-md transition-colors duration-150"
                            >
                              <div className="text-sm font-semibold text-foreground">{item.title}</div>
                              <div className="mt-0.5 text-xs text-muted-foreground/70 leading-snug">{item.description}</div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom banner */}
                    <div className="mt-5 border-t border-border/30 pt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-foreground">New: AI-Powered Verification</span>
                        <span className="text-xs text-muted-foreground/70">Instant document authenticity checks with fraud detection...</span>
                      </div>
                      <Link
                        href="/demo"
                        onClick={() => setProductOpen(false)}
                        className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors shrink-0"
                      >
                        Learn more
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Partners dropdown trigger */}
              <div
                className="relative"
                onMouseEnter={handlePartnersEnter}
                onMouseLeave={handlePartnersLeave}
              >
                <button
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Partners
                  <ChevronDown className={cn(
                    "h-3.5 w-3.5 transition-transform duration-200",
                    partnersOpen && "rotate-180"
                  )} />
                </button>

                {/* Partners dropdown */}
                <div
                  className={cn(
                    "absolute left-0 top-full pt-3 z-50 transition-all duration-300 ease-out",
                    partnersOpen
                      ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 -translate-y-2 pointer-events-none"
                  )}
                >
                  <div className="w-[250px] rounded-xl border border-border/40 bg-popover shadow-2xl p-4">
                    <div className="space-y-3">
                      {partnerItems.map((item) => (
                        <Link
                          key={item.title}
                          href={item.href}
                          onClick={() => setPartnersOpen(false)}
                          className="group block rounded-md p-2 transition-colors duration-150 hover:bg-muted/50"
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="text-sm font-semibold text-foreground">{item.title}</div>
                              <div className="mt-0.5 text-xs text-muted-foreground leading-snug">{item.description}</div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
            </div>
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {!session ? (
              <>
                <Button variant="ghost" className="h-9 px-3 text-sm text-muted-foreground hover:text-foreground" asChild>
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button className="h-9 rounded-full px-4" asChild>
                  <Link href="/auth/signup">Sign up</Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" className="h-9 px-3 text-sm text-muted-foreground hover:text-foreground" asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <UserButtonClient user={session.user} />
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="pb-4 pt-2">
            {/* Mobile Product accordion */}
            <button
              onClick={() => setMobileProductOpen(!mobileProductOpen)}
              className="flex w-full items-center justify-between px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Product
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform duration-200",
                mobileProductOpen && "rotate-180"
              )} />
            </button>
            <div className={cn(
              "overflow-hidden transition-all duration-300 ease-in-out",
              mobileProductOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            )}>
              <div className="pl-4 space-y-1 pb-2">
                {[...productItems.products, ...productItems.platform].map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="h-3.5 w-3.5" />
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Partners accordion */}
            <button
              onClick={() => setMobilePartnersOpen(!mobilePartnersOpen)}
              className="flex w-full items-center justify-between px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Partners
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform duration-200",
                mobilePartnersOpen && "rotate-180"
              )} />
            </button>
            <div className={cn(
              "overflow-hidden transition-all duration-300 ease-in-out",
              mobilePartnersOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            )}>
              <div className="pl-4 space-y-1 pb-2">
                {partnerItems.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="h-3.5 w-3.5" />
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>

            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex flex-col space-y-2 pt-4 border-t border-border">
              {!session ? (
                <>
                  <Button variant="ghost" asChild className="w-full justify-start">
                    <Link href="/auth/signin" onClick={() => setIsOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                  <Button asChild className="w-full rounded-full">
                    <Link href="/auth/signup">Sign up</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild className="w-full justify-start">
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                  <div className="flex items-center space-x-2 p-2">
                    <UserButtonClient user={session.user} />
                    <span className="text-sm text-muted-foreground">Account</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
