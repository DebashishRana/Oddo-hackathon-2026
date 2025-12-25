"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { UserButtonClient } from "@/components/auth/user-button-client"
import { CreditsDisplay } from "@/components/credits/credits-display"
import { isAdminEmail } from "@/lib/admin-config"
import { cn } from "@/lib/utils"
import {
  Home,
  Settings,
  User,
  Users,
  BarChart3,
  Zap,
  Menu,
  X,
  MessageSquare,
  CreditCard
} from "lucide-react"

// Regular user navigation items
const regularUserItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "AI Chat", href: "/dashboard/chat", icon: MessageSquare },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

// Admin user navigation items (includes everything)
const adminUserItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "AI Chat", href: "/dashboard/chat", icon: MessageSquare },
  { name: "Users", href: "/dashboard/users", icon: Users },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

interface DashboardClientProps {
  children: React.ReactNode
  session: any
}

export function DashboardClient({ children, session }: DashboardClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Determine if user is admin and get appropriate navigation items
  const isAdmin = isAdminEmail(session.user.email)
  const sidebarItems = isAdmin ? adminUserItems : regularUserItems

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Image
              src="/Logo.png"
              alt="Vectra Logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="text-lg font-semibold">Vectra</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navigation */}
        <header className="bg-background border-b border-border">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold">
                Welcome back, {session.user?.name?.split(' ')[0] || "User"}!
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <CreditsDisplay showRefresh />
              <ThemeToggle />
              <UserButtonClient user={session.user} />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
