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
  Menu,
  X,
  MessageSquare,
  CreditCard,
  AlertTriangle
} from "lucide-react"

// Regular user navigation items
const regularUserItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Logs", href: "/dashboard/logs", icon: BarChart3 },
  { name: "Tickets", href: "/dashboard/tickets", icon: CreditCard },
  { name: "Flagged Cases", href: "/dashboard/flagged", icon: AlertTriangle },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Support", href: "/dashboard/chat", icon: MessageSquare },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Profile", href: "/dashboard/profile", icon: User },
]

// Admin user navigation items (includes everything)
const adminUserItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Logs", href: "/dashboard/logs", icon: BarChart3 },
  { name: "Tickets", href: "/dashboard/tickets", icon: CreditCard },
  { name: "Flagged Cases", href: "/dashboard/flagged", icon: AlertTriangle },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Support", href: "/dashboard/chat", icon: MessageSquare },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Profile", href: "/dashboard/profile", icon: User },
]

interface DashboardSession {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

interface DashboardClientProps {
  children: React.ReactNode
  session: DashboardSession
}


export function DashboardClient({ children, session }: DashboardClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  // Sidebar is minimized (collapsed) by default
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)

  // Determine if user is admin and get appropriate navigation items
  const isAdmin = isAdminEmail(session.user.email)
  const sidebarItems = isAdmin ? adminUserItems : regularUserItems

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 bg-card border-r border-border transform transition-all duration-200 ease-in-out flex flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          sidebarCollapsed ? "w-14" : "w-48"
        )}
        style={{ minWidth: sidebarCollapsed ? 56 : 192 }}
      >
        <div className="flex items-center justify-between h-16 px-3 border-b border-border">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Image
              src="/Logo.png"
              alt="Dectra Logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
            {!sidebarCollapsed && (
              <span className="text-lg font-semibold">Dectra</span>
            )}
          </Link>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:inline-flex"
              onClick={() => setSidebarCollapsed((v) => !v)}
              aria-label="Toggle sidebar"
            >
              {sidebarCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <nav className="mt-4 flex-1 px-1">
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                  sidebarCollapsed ? "justify-center px-0" : "px-3 text-sm font-medium"
                )}
                onClick={() => {
                  setSidebarOpen(false)
                  if (window.innerWidth >= 1024) setSidebarCollapsed(true)
                }}
              >
                <item.icon className={cn("h-5 w-5", !sidebarCollapsed && "mr-3")} />
                {!sidebarCollapsed && item.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className={sidebarCollapsed ? "lg:pl-14" : "lg:pl-48"} style={{ width: '100%' }}>
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
              {/* Removed welcome back text */}
            </div>
            <div className="flex items-center space-x-4">
              <CreditsDisplay showRefresh />
              <ThemeToggle />
              <UserButtonClient user={session.user} />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
