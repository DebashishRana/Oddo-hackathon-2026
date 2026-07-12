"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Boxes,
  ArrowLeftRight,
  CalendarDays,
  Wrench,
  ClipboardCheck,
  BarChart3,
  Bell,
  Settings,
  Plus,
  type LucideIcon,
} from "lucide-react";
import { SignOutButton } from "./sign-out-button";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/badge";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  roles?: string[];
};

const mainNav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/organization", label: "Organization", icon: Building2, roles: ["admin"] },
  { href: "/dashboard/assets", label: "Assets", icon: Boxes },
  { href: "/dashboard/allocations", label: "Allocations", icon: ArrowLeftRight },
  { href: "/dashboard/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/dashboard/maintenance", label: "Maintenance", icon: Wrench },
  { href: "/dashboard/audits", label: "Audits", icon: ClipboardCheck, roles: ["admin", "asset_manager"] },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3, roles: ["admin", "asset_manager", "department_head"] },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

type Props = {
  user?: {
    name?: string | null;
    email: string;
    role: string;
  } | null;
  children: React.ReactNode;
};

const roleLabel = (role?: string) => {
  switch (role) {
    case "admin":
      return "Admin";
    case "asset_manager":
      return "Asset Manager";
    case "department_head":
      return "Department Head";
    default:
      return "Employee";
  }
};

export function DashboardShell({ user, children }: Props) {
  const pathname = usePathname();
  const role = user?.role || "employee";
  const visibleNav = mainNav.filter((item) => !item.roles || item.roles.includes(role));
  const initials = (user?.name?.[0] || user?.email?.[0] || "A").toUpperCase();

  return (
    <div className="af-grid-bg min-h-screen text-[var(--af-ink)]">
      <div className="mx-auto grid min-h-screen max-w-[1600px] grid-cols-1 gap-4 px-3 py-3 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-4 lg:py-4">
        <aside className="af-panel flex flex-col p-3 sm:p-4">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--af-steel)] font-display text-sm font-bold text-teal-300">
              AF
            </div>
            <div>
              <p className="font-display text-lg font-semibold tracking-tight">AssetFlow</p>
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--af-muted)]">Enterprise ERP</p>
            </div>
          </div>

          <nav className="mt-6 space-y-1">
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--af-muted)]">Workspace</p>
            {visibleNav.map((item) => {
              const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                    active
                      ? "bg-[var(--af-accent-soft)] text-[var(--af-accent)]"
                      : "text-slate-600 hover:bg-slate-50 hover:text-[var(--af-ink)]"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0 opacity-80" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto rounded-2xl border border-[var(--af-border)] bg-slate-50/80 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--af-steel)] text-sm font-semibold text-white">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-[var(--af-ink)]">{user?.name || "User"}</p>
                <p className="truncate text-xs text-[var(--af-muted)]">{user?.email}</p>
              </div>
            </div>
            <div className="mt-3">
              <Badge tone="accent">{roleLabel(role)}</Badge>
            </div>
            <div className="mt-4">
              <SignOutButton />
            </div>
          </div>
        </aside>

        <main className="flex min-w-0 flex-col gap-4">
          <header className="af-panel flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="af-fade-up">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--af-muted)]">Operations</p>
              <h1 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">Asset & Resource Control</h1>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/dashboard/notifications"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--af-border)] bg-white px-3.5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                <Bell className="h-4 w-4" />
                Alerts
              </Link>
              <Link
                href="/dashboard/settings"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--af-border)] bg-white px-3.5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
              <Link
                href="/dashboard/assets"
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--af-accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(15,118,110,0.28)] transition hover:bg-[var(--af-accent-strong)]"
              >
                <Plus className="h-4 w-4" />
                Register Asset
              </Link>
            </div>
          </header>

          <section className="af-fade-up-delay min-w-0">{children}</section>
        </main>
      </div>
    </div>
  );
}
