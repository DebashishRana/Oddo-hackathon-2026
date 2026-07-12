"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Boxes,
  CalendarDays,
  ClipboardList,
  PackageCheck,
  ArrowLeftRight,
  Clock3,
  AlertTriangle,
  Plus,
  Wrench,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

type KpiData = {
  assetsAvailable: number;
  assetsAllocated: number;
  assetsUnderMaintenance: number;
  totalAssets: number;
  maintenanceToday: number;
  activeBookings: number;
  pendingTransfers: number;
  upcomingReturns: number;
  overdueReturns: number;
};

export function KpiDashboard() {
  const [kpis, setKpis] = useState<KpiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch("/api/dashboard/kpis")
      .then((r) => r.json())
      .then((payload) => {
        if (payload?.data?.kpis) setKpis(payload.data.kpis);
        else setError("Unexpected response shape");
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load KPIs");
      })
      .finally(() => setLoading(false));
  }, []);

  const kpiCards = kpis
    ? [
        { label: "Assets Available", value: kpis.assetsAvailable, icon: PackageCheck, tone: "text-emerald-700 bg-emerald-50", href: "/dashboard/assets?status=available" },
        { label: "Assets Allocated", value: kpis.assetsAllocated, icon: Boxes, tone: "text-sky-700 bg-sky-50", href: "/dashboard/assets?status=allocated" },
        { label: "Maintenance Today", value: kpis.maintenanceToday, icon: Wrench, tone: "text-amber-700 bg-amber-50", href: "/dashboard/maintenance" },
        { label: "Active Bookings", value: kpis.activeBookings, icon: CalendarDays, tone: "text-teal-700 bg-teal-50", href: "/dashboard/bookings" },
        { label: "Pending Transfers", value: kpis.pendingTransfers, icon: ArrowLeftRight, tone: "text-slate-700 bg-slate-100", href: "/dashboard/allocations" },
        { label: "Upcoming Returns", value: kpis.upcomingReturns, icon: Clock3, tone: "text-cyan-700 bg-cyan-50", href: "/dashboard/allocations" },
      ]
    : [];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--af-muted)]">Overview</p>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--af-ink)]">Dashboard</h1>
          <p className="mt-1 text-sm text-[var(--af-muted)]">Live operational snapshot across assets, bookings, and maintenance.</p>
        </div>
        {kpis ? (
          <Badge tone="accent">
            <span className="af-live-dot mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[var(--af-accent)]" />
            {kpis.totalAssets} tracked assets
          </Badge>
        ) : null}
      </div>

      {loading && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-[22px] border border-[var(--af-border)] bg-white/70" />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-[22px] border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
          {error} — is the backend running at localhost:4000?
        </div>
      )}

      {kpis && (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {kpiCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link key={card.label} href={card.href} className="af-panel group block p-5 transition hover:-translate-y-0.5 hover:border-teal-200">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium text-[var(--af-muted)]">{card.label}</p>
                    <div className={cn("rounded-xl p-2", card.tone)}>
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-5 font-display text-4xl font-semibold tracking-tight">
                    {card.value.toLocaleString()}
                  </div>
                </Link>
              );
            })}
          </div>

          {kpis.overdueReturns > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-[22px] border border-rose-200 bg-gradient-to-r from-rose-50 to-white p-5">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-rose-100 p-2 text-rose-700">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-rose-800">Overdue returns</p>
                  <p className="mt-1 text-sm text-rose-700">
                    {kpis.overdueReturns} allocation(s) past expected return date
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/allocations"
                className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                Review overdue
              </Link>
            </div>
          )}
        </>
      )}

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--af-muted)]">Quick actions</p>
          <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">Operate faster</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              { href: "/dashboard/assets", title: "Register Asset", desc: "Add to the central registry", icon: Plus },
              { href: "/dashboard/bookings", title: "Book Resource", desc: "Reserve a shared slot", icon: CalendarDays },
              { href: "/dashboard/maintenance", title: "Raise Maintenance", desc: "Start an approval workflow", icon: Wrench },
              { href: "/dashboard/allocations", title: "Allocate / Transfer", desc: "Move custody cleanly", icon: ArrowLeftRight },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl border border-[var(--af-border)] bg-slate-50/80 px-4 py-4 transition hover:border-teal-200 hover:bg-teal-50/40"
                >
                  <div className="flex items-center gap-2 text-[var(--af-accent)]">
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-semibold text-[var(--af-ink)]">{item.title}</span>
                  </div>
                  <p className="mt-1 text-xs text-[var(--af-muted)]">{item.desc}</p>
                </Link>
              );
            })}
          </div>
        </Card>

        <Card>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--af-muted)]">Guidance</p>
          <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">Suggested flow</h2>
          <ol className="mt-5 space-y-3">
            {[
              "Admin sets departments, categories, and roles",
              "Asset Manager registers and allocates assets",
              "Employees book shared resources and raise maintenance",
              "Audits close discrepancies; analytics stay current",
            ].map((step, index) => (
              <li key={step} className="flex gap-3 rounded-2xl border border-[var(--af-border)] bg-white px-3 py-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--af-steel)] text-xs font-semibold text-teal-300">
                  {index + 1}
                </span>
                <span className="text-sm text-slate-700">{step}</span>
              </li>
            ))}
          </ol>
          <div className="mt-4 flex items-center gap-2 text-xs text-[var(--af-muted)]">
            <ClipboardList className="h-3.5 w-3.5" />
            All activity streams into notifications and logs.
          </div>
        </Card>
      </div>
    </div>
  );
}
