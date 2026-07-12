"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

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
        if (payload?.data?.kpis) {
          setKpis(payload.data.kpis);
        } else {
          setError("Unexpected response shape");
        }
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load KPIs");
      })
      .finally(() => setLoading(false));
  }, []);

  const kpiCards = kpis
    ? [
        { label: "Assets Available", value: kpis.assetsAvailable, tone: "text-emerald-700 bg-emerald-50" },
        { label: "Assets Allocated", value: kpis.assetsAllocated, tone: "text-blue-700 bg-blue-50" },
        { label: "Maintenance Today", value: kpis.maintenanceToday, tone: "text-amber-700 bg-amber-50" },
        { label: "Active Bookings", value: kpis.activeBookings, tone: "text-indigo-700 bg-indigo-50" },
        { label: "Pending Transfers", value: kpis.pendingTransfers, tone: "text-purple-700 bg-purple-50" },
        { label: "Upcoming Returns", value: kpis.upcomingReturns, tone: "text-cyan-700 bg-cyan-50" },
      ]
    : [];

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-neutral-500">Overview</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-neutral-950">Dashboard</h1>
      </div>

      {loading && (
        <div className="grid gap-4 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-[24px] border border-neutral-200 bg-neutral-100" />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-[24px] border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
          {error} — is the backend running at localhost:4000?
        </div>
      )}

      {kpis && (
        <>
          <div className="grid gap-4 xl:grid-cols-3">
            {kpiCards.map((card) => (
              <article key={card.label} className="rounded-[24px] border border-neutral-200 bg-white p-5 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
                <p className="text-sm text-neutral-500">{card.label}</p>
                <div className="mt-4 flex items-end justify-between gap-3">
                  <div className="text-4xl font-semibold tracking-tight">{card.value.toLocaleString()}</div>
                  <div className={`rounded-full px-3 py-1 text-sm font-medium ${card.tone}`}>Live</div>
                </div>
              </article>
            ))}
          </div>

          {kpis.overdueReturns > 0 && (
            <div className="rounded-[24px] border border-rose-200 bg-rose-50 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-rose-700">Overdue Returns</p>
                  <p className="mt-1 text-sm text-rose-600">{kpis.overdueReturns} allocation(s) past expected return date</p>
                </div>
                <Link
                  href="/dashboard/allocations"
                  className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
                >
                  View Overdue
                </Link>
              </div>
            </div>
          )}
        </>
      )}

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
          <p className="text-sm text-neutral-500">Quick actions</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">Get started</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Link
              href="/dashboard/assets"
              className="rounded-[22px] border border-neutral-200 bg-neutral-50 px-4 py-5 text-sm font-medium text-neutral-800 transition hover:bg-neutral-100"
            >
              <div className="text-base font-semibold">Register Asset</div>
              <p className="mt-1 text-xs text-neutral-500">Add a new asset to the registry</p>
            </Link>
            <Link
              href="/dashboard/bookings"
              className="rounded-[22px] border border-neutral-200 bg-neutral-50 px-4 py-5 text-sm font-medium text-neutral-800 transition hover:bg-neutral-100"
            >
              <div className="text-base font-semibold">Book Resource</div>
              <p className="mt-1 text-xs text-neutral-500">Reserve a shared bookable asset</p>
            </Link>
            <Link
              href="/dashboard/maintenance"
              className="rounded-[22px] border border-neutral-200 bg-neutral-50 px-4 py-5 text-sm font-medium text-neutral-800 transition hover:bg-neutral-100"
            >
              <div className="text-base font-semibold">Raise Maintenance</div>
              <p className="mt-1 text-xs text-neutral-500">Submit a maintenance request</p>
            </Link>
            <Link
              href="/dashboard/allocations"
              className="rounded-[22px] border border-neutral-200 bg-neutral-50 px-4 py-5 text-sm font-medium text-neutral-800 transition hover:bg-neutral-100"
            >
              <div className="text-base font-semibold">Allocate Asset</div>
              <p className="mt-1 text-xs text-neutral-500">Assign asset to user or department</p>
            </Link>
          </div>
        </section>

        <section className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
          <p className="text-sm text-neutral-500">Navigate</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">AssetFlow modules</h2>
          <div className="mt-5 space-y-2">
            {[
              { href: "/dashboard/organization", label: "Organization", desc: "Departments, categories, employees" },
              { href: "/dashboard/audits", label: "Audits", desc: "Asset audit cycles and discrepancies" },
              { href: "/dashboard/analytics", label: "Analytics", desc: "Utilisation and reporting" },
              { href: "/dashboard/notifications", label: "Notifications", desc: "Your alerts and activity logs" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-2xl border border-neutral-200 px-4 py-3 transition hover:bg-neutral-50"
              >
                <div>
                  <p className="text-sm font-medium text-neutral-900">{item.label}</p>
                  <p className="text-xs text-neutral-500">{item.desc}</p>
                </div>
                <span className="text-neutral-400">→</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
