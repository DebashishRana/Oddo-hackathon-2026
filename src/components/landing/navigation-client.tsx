"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"
import { SignInButton } from "@/components/auth/signin-button"
import { UserButtonClient } from "@/components/auth/user-button-client"
import { CreditsDisplay } from "@/components/credits/credits-display"

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

export function NavigationClient({ session }: NavigationClientProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const navItems = [
    { name: "Solutions", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "Why VeriQuick", href: "#testimonials" },
    { name: "Docs", href: "/docs" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/Logo.png"
              alt="VeriQuick Logo"
              width={32}
              height={32}
              className="w-8 h-8 rounded-lg"
            />
            <span className="text-xl font-bold">VeriQuick</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {!session ? (
              <>
                <SignInButton>
                  <Button variant="ghost">Sign In</Button>
                </SignInButton>
                <Button asChild>
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
              </>
            ) : (
              <>
                <CreditsDisplay />
                <Button variant="ghost" asChild>
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
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="pb-4 pt-2">
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
                  <SignInButton>
                    <Button variant="ghost" className="w-full justify-start">Sign In</Button>
                  </SignInButton>
                  <Button asChild className="w-full">
                    <Link href="/auth/signup">Get Started</Link>
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
