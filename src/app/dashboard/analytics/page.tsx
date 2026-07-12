"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";

type Asset = { name: string; department: string; category: string; allocations: number; usageDays: number; idleDays: number };
type MaintenanceAsset = { name: string; department: string; category: string; events: number; cost: number; dueInDays: number };
type DepartmentSummary = { department: string; total: number; allocated: number; available: number; maintenance: number; retired: number };
type Resource = { name: string; type: string; location: string; utilization: number[][] };
type UtilizationData = {
  kpis: { totalAssets: number; allocatedAssets: number; idleAssets: number; underMaintenance: number; utilizationRate: number };
  series: { period: string; utilization_rate: number }[];
  topUsed: Asset[];
  topIdle: Asset[];
};
type MaintenanceData = {
  kpis: { openMaintenanceRequests: number; averageMaintenanceFrequency: number; totalMaintenanceCost: number; assetsDueForMaintenance: number };
  categoryCounts: { category: string; events: number }[];
  costSeries: { period: string; cost: number }[];
  highFrequency: MaintenanceAsset[];
};
type BookingData = { kpis: { totalBookings: number; peakHour: string; peakDays: string[]; averageUtilization: number }; resources: Resource[] };

const inputClassName = "w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-950 outline-none transition focus:border-[#1677ff] focus:ring-4 focus:ring-[#1677ff]/10";
const cardClassName = "rounded-[28px] border border-neutral-200 bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)]";
const reportTypes = [
  { type: "asset-utilization", title: "Asset Utilisation Report", description: "Per department and category, with top used assets." },
  { type: "maintenance-summary", title: "Maintenance Summary", description: "Events, costs, and high-frequency maintenance assets." },
  { type: "department-summary", title: "Department Allocation Summary", description: "Allocation and availability by department." },
  { type: "resource-bookings", title: "Resource Booking Report", description: "Heatmap data and booking counts." },
] as const;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

async function getData<T>(path: string): Promise<T> {
  const response = await apiFetch(path);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload?.success === false) throw new Error(payload?.message || "Unable to load analytics.");
  return payload.data as T;
}

function EmptyState({ message }: { message: string }) {
  return <p className="rounded-2xl bg-neutral-50 p-4 text-sm text-neutral-500">{message}</p>;
}

function StatCard({ label, value, detail, tone }: { label: string; value: string; detail: string; tone: string }) {
  return <article className="rounded-[24px] border border-neutral-200 bg-white p-5 shadow-[0_10px_40px_rgba(0,0,0,0.04)]"><div className={`inline-flex rounded-full bg-gradient-to-r ${tone} px-3 py-1 text-xs font-semibold text-white`}>{label}</div><div className="mt-4 text-4xl font-semibold tracking-tight">{value}</div><p className="mt-2 text-sm leading-6 text-neutral-500">{detail}</p></article>;
}

function LineChart({ values }: { values: number[] }) {
  if (!values.length) return <EmptyState message="No utilisation trend is available for this period." />;
  const width = 780, height = 240, max = Math.max(...values, 1), step = width / Math.max(values.length - 1, 1);
  const points = values.map((value, index) => `${index === 0 ? "M" : "L"} ${index * step} ${height - (value / max) * (height - 20)}`).join(" ");
  return <svg viewBox={`0 0 ${width} ${height}`} className="h-64 w-full" aria-label="Utilisation trend"><defs><linearGradient id="util-area" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#3b82f6" stopOpacity="0.28" /><stop offset="100%" stopColor="#3b82f6" stopOpacity="0" /></linearGradient></defs><path d={`${points} L ${width} ${height} L 0 ${height} Z`} fill="url(#util-area)" /><path d={points} fill="none" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" /></svg>;
}

function BarChart({ values, labels }: { values: number[]; labels: string[] }) {
  if (!values.length) return <EmptyState message="No maintenance activity is available for this period." />;
  const max = Math.max(...values, 1);
  return <div className="flex h-full items-end gap-2">{values.map((value, index) => <div key={`${labels[index]}-${index}`} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><div className="w-full rounded-t-[16px] bg-gradient-to-t from-rose-500 to-orange-300" style={{ height: `${Math.max((value / max) * 230, 8)}px` }} /><span className="text-xs text-neutral-500">{labels[index]}</span></div>)}</div>;
}

export default function AnalyticsPage() {
  const [utilization, setUtilization] = useState<UtilizationData | null>(null);
  const [maintenance, setMaintenance] = useState<MaintenanceData | null>(null);
  const [departmentsData, setDepartmentsData] = useState<DepartmentSummary[]>([]);
  const [bookings, setBookings] = useState<BookingData | null>(null);
  const [department, setDepartment] = useState("All Departments");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      getData<UtilizationData>("/api/analytics/assets/utilization"),
      getData<MaintenanceData>("/api/analytics/assets/maintenance"),
      getData<{ summaries: DepartmentSummary[] }>("/api/analytics/assets/departments"),
      getData<BookingData>("/api/analytics/bookings/heatmap"),
    ])
      .then(([utilizationData, maintenanceData, departmentData, bookingData]) => {
        if (!active) return;
        setUtilization(utilizationData);
        setMaintenance(maintenanceData);
        setDepartmentsData(departmentData.summaries);
        setBookings(bookingData);
      })
      .catch((reason: unknown) => active && setError(reason instanceof Error ? reason.message : "Unable to load analytics."))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const departmentOptions = useMemo(() => ["All Departments", ...Array.from(new Set([...departmentsData.map(({ department: name }) => name), ...(utilization?.topUsed ?? []).map(({ department: name }) => name), ...(maintenance?.highFrequency ?? []).map(({ department: name }) => name)])).sort()], [departmentsData, utilization, maintenance]);
  const belongsToDepartment = <T extends { department: string }>(item: T) => department === "All Departments" || item.department === department;
  const topUsed = (utilization?.topUsed ?? []).filter(belongsToDepartment);
  const topIdle = (utilization?.topIdle ?? []).filter(belongsToDepartment);
  const highFrequency = (maintenance?.highFrequency ?? []).filter(belongsToDepartment);
  const summaries = departmentsData.filter(belongsToDepartment);

  const downloadReport = async (type: (typeof reportTypes)[number]["type"]) => {
    setExporting(type);
    try {
      const response = await apiFetch(`/api/reports/${type}.csv`);
      if (!response.ok) throw new Error("Unable to download report.");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${type}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to download report.");
    } finally {
      setExporting(null);
    }
  };

  if (loading) return <div className={`${cardClassName} text-sm text-neutral-500`}>Loading live analytics…</div>;
  if (error && !utilization) return <div className={`${cardClassName} text-sm text-rose-600`}>{error}</div>;
  if (!utilization || !maintenance || !bookings) return <div className={`${cardClassName} text-sm text-neutral-500`}>Analytics data is not available.</div>;

  const kpiCards = [
    { label: "Total Assets", value: utilization.kpis.totalAssets.toLocaleString(), detail: "All tracked active assets", tone: "from-slate-950 to-slate-800" },
    { label: "Assets Allocated", value: utilization.kpis.allocatedAssets.toLocaleString(), detail: "Currently issued or reserved", tone: "from-indigo-600 to-blue-600" },
    { label: "Assets Idle", value: utilization.kpis.idleAssets.toLocaleString(), detail: "Available assets", tone: "from-cyan-500 to-sky-500" },
    { label: "Under Maintenance", value: utilization.kpis.underMaintenance.toLocaleString(), detail: "Assets in maintenance", tone: "from-rose-500 to-orange-500" },
  ];
  const bookingUtilization = `${Math.round(bookings.kpis.averageUtilization * 100)}%`;
  const peakDays = bookings.kpis.peakDays.length ? bookings.kpis.peakDays.join(" / ") : "N/A";

  return <div className="space-y-6">
    <section className="rounded-[32px] border border-neutral-200 bg-white p-5 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">Reports & Analytics</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">AssetFlow analytics hub</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-500">Monitor live utilisation, maintenance, departmental allocation, and booking patterns across your assets and resources.</p></div><div className="flex flex-wrap gap-3">{reportTypes.slice(0, 2).map((report) => <button key={report.type} className="rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100 disabled:opacity-50" disabled={exporting !== null} onClick={() => downloadReport(report.type)}>{exporting === report.type ? "Preparing…" : `Export ${report.title.replace(" Report", "")}`}</button>)}</div></div>
      <label className="mt-6 block max-w-sm"><span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Department</span><select className={inputClassName} value={department} onChange={(event) => setDepartment(event.target.value)}>{departmentOptions.map((item) => <option key={item}>{item}</option>)}</select></label>
      {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}
    </section>

    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]"><article className="overflow-hidden rounded-[32px] bg-slate-950 text-white shadow-[0_20px_60px_rgba(15,23,42,0.22)]"><div className="flex h-full flex-col justify-between p-6"><div><p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/55">Utilisation</p><h2 className="mt-2 text-3xl font-semibold tracking-tight">Asset utilisation trends</h2><p className="mt-2 max-w-xl text-sm leading-6 text-white/70">Live allocation and availability data across the selected department.</p></div><div className="mt-10 grid gap-4 sm:grid-cols-3"><div className="rounded-[24px] bg-white/10 p-4"><p className="text-sm text-white/60">Most used asset</p><p className="mt-3 truncate text-2xl font-semibold">{topUsed[0]?.name ?? "—"}</p><p className="mt-1 text-sm text-white/60">{topUsed[0] ? `${topUsed[0].allocations} allocations` : "No matching assets"}</p></div><div className="rounded-[24px] bg-white/10 p-4"><p className="text-sm text-white/60">Idle asset</p><p className="mt-3 truncate text-2xl font-semibold">{topIdle[0]?.name ?? "—"}</p><p className="mt-1 text-sm text-white/60">{topIdle[0] ? `${topIdle[0].idleDays} idle days` : "No matching assets"}</p></div><div className="rounded-[24px] bg-white/10 p-4"><p className="text-sm text-white/60">Utilisation rate</p><p className="mt-3 text-2xl font-semibold">{utilization.kpis.utilizationRate}%</p><p className="mt-1 text-sm text-white/60">Current allocation rate</p></div></div></div></article><div className="grid gap-4 sm:grid-cols-2">{kpiCards.map((card) => <StatCard key={card.label} {...card} />)}</div></div>

    <div className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]"><section className={cardClassName}><p className="text-sm font-medium text-neutral-500">Asset utilisation over time</p><h2 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950">Monthly allocations</h2><div className="mt-4 overflow-hidden rounded-[24px] bg-neutral-50 p-4"><LineChart values={utilization.series.map((item) => item.utilization_rate)} /><div className="flex justify-between px-2 text-xs text-neutral-500">{utilization.series.map((item) => <span key={item.period}>{item.period}</span>)}</div></div></section><section className={cardClassName}><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-neutral-500">Maintenance trend</p><h2 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950">Maintenance activity</h2></div><div className="rounded-full bg-rose-50 px-3 py-1 text-sm font-medium text-rose-700">{maintenance.kpis.openMaintenanceRequests} open</div></div><div className="mt-4 h-[300px] rounded-[24px] bg-neutral-50 p-4"><BarChart values={maintenance.costSeries.map((item) => item.cost)} labels={maintenance.costSeries.map((item) => item.period)} /></div></section></div>

    <div className="grid gap-4 xl:grid-cols-2"><section className={cardClassName}><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-neutral-500">Top used vs idle assets</p><h2 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950">Asset ranking</h2></div><span className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-600">{department}</span></div><div className="mt-5 grid gap-4 lg:grid-cols-2"><Ranking title="Most used assets" items={topUsed} value={(asset) => asset.allocations} suffix="alloc." color="bg-[#1677ff]" empty="No used assets match this department." /><Ranking title="Idle assets" items={topIdle} value={(asset) => asset.idleDays} suffix="idle days" color="bg-emerald-500" empty="No idle assets match this department." /></div></section><section className={cardClassName}><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-neutral-500">Maintenance risks</p><h2 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950">High-frequency maintenance</h2></div><span className="rounded-full bg-rose-50 px-3 py-1 text-sm text-rose-700">{maintenance.kpis.assetsDueForMaintenance} assets</span></div><div className="mt-5 grid gap-4 lg:grid-cols-2"><div className="rounded-[24px] border border-neutral-200 p-4"><p className="text-sm font-medium text-neutral-500">Assets requiring attention</p><div className="mt-4 space-y-3">{highFrequency.length ? highFrequency.map((asset) => <div key={asset.name} className="rounded-2xl bg-neutral-50 p-3"><div className="flex justify-between gap-3 text-sm"><span className="font-medium text-neutral-950">{asset.name}</span><span className="whitespace-nowrap text-rose-600">{asset.events} events</span></div><p className="mt-2 text-xs text-neutral-500">{asset.department} · {asset.category}</p></div>) : <EmptyState message="No maintenance assets match this department." />}</div></div><div className="rounded-[24px] border border-neutral-200 p-4"><p className="text-sm font-medium text-neutral-500">Requests by category</p><div className="mt-4 space-y-3">{maintenance.categoryCounts.length ? maintenance.categoryCounts.map((item) => <div key={item.category} className="flex items-center justify-between rounded-2xl bg-neutral-50 p-3 text-sm"><span className="font-medium text-neutral-950">{item.category}</span><span className="text-neutral-500">{item.events} events</span></div>) : <EmptyState message="No maintenance categories are available." />}</div></div></div></section></div>

    <section className={cardClassName}><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-neutral-500">Department allocation summary</p><h2 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950">Asset distribution by department</h2></div><div className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-600">Live data</div></div><div className="mt-5 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]"><div className="rounded-[24px] bg-neutral-50 p-5"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{summaries.length ? summaries.map((item) => { const total = Math.max(item.total, 1); return <div key={item.department} className="rounded-[20px] bg-white p-4 shadow-sm"><p className="text-sm font-medium text-neutral-900">{item.department}</p><div className="mt-4 flex h-3 overflow-hidden rounded-full bg-neutral-100"><div className="bg-[#1677ff]" style={{ width: `${(item.allocated / total) * 100}%` }} /><div className="bg-emerald-500" style={{ width: `${(item.available / total) * 100}%` }} /><div className="bg-amber-400" style={{ width: `${(item.maintenance / total) * 100}%` }} /><div className="bg-neutral-400" style={{ width: `${(item.retired / total) * 100}%` }} /></div><p className="mt-3 text-xs text-neutral-500">{item.total} total assets</p></div>; }) : <EmptyState message="No department summary matches this selection." />}</div></div><div className="overflow-hidden rounded-[24px] border border-neutral-200"><table className="w-full text-left"><thead className="bg-neutral-50 text-xs uppercase tracking-[0.18em] text-neutral-500"><tr><th className="px-4 py-3 font-semibold">Department</th><th className="px-4 py-3 font-semibold">Total</th><th className="px-4 py-3 font-semibold">Allocated</th><th className="px-4 py-3 font-semibold">Available</th></tr></thead><tbody>{summaries.map((item) => <tr key={item.department} className="border-t border-neutral-100"><td className="px-4 py-3 text-sm font-medium text-neutral-950">{item.department}</td><td className="px-4 py-3 text-sm text-neutral-600">{item.total}</td><td className="px-4 py-3 text-sm text-neutral-600">{item.allocated}</td><td className="px-4 py-3 text-sm text-neutral-600">{item.available}</td></tr>)}</tbody></table>{!summaries.length && <div className="p-4"><EmptyState message="No rows to display." /></div>}</div></div></section>

    <section className={cardClassName}><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-medium text-neutral-500">Resource booking heatmap</p><h2 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950">Peak usage windows</h2></div><div className="flex gap-2 text-sm text-neutral-500"><span className="rounded-full bg-neutral-100 px-3 py-1">Peak hour: {bookings.kpis.peakHour}</span><span className="rounded-full bg-neutral-100 px-3 py-1">Peak days: {peakDays}</span></div></div><div className="mt-5 grid gap-5 xl:grid-cols-[1fr_0.75fr]"><div className="rounded-[24px] bg-neutral-50 p-4">{bookings.resources.length ? bookings.resources.map((resource) => { const max = Math.max(...resource.utilization.flat(), 1); return <div key={resource.name} className="mb-6 last:mb-0"><div className="mb-3"><p className="font-medium text-neutral-950">{resource.name}</p><p className="text-xs text-neutral-500">{resource.type} {resource.location ? `• ${resource.location}` : ""}</p></div><div className="grid gap-2">{resource.utilization.map((row, rowIndex) => <div key={rowIndex} className="grid gap-2" style={{ gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))` }}>{row.map((value, colIndex) => <div key={colIndex} className="aspect-square rounded-[10px]" style={{ backgroundColor: `rgba(59, 130, 246, ${0.12 + (value / max) * 0.78})` }} title={`${value} bookings`} />)}</div>)}</div></div>; }) : <EmptyState message="No booking resources are available." />}</div><article className="rounded-[24px] border border-neutral-200 p-4"><p className="text-sm font-medium text-neutral-500">Booking KPIs</p><div className="mt-4 grid gap-4">{[{ label: "Total bookings", value: bookings.kpis.totalBookings.toLocaleString() }, { label: "Peak days", value: peakDays }, { label: "Average utilisation", value: bookingUtilization }].map((item) => <div key={item.label} className="rounded-2xl bg-neutral-50 p-4"><p className="text-xs uppercase tracking-[0.18em] text-neutral-500">{item.label}</p><p className="mt-2 text-2xl font-semibold text-neutral-950">{item.value}</p></div>)}</div></article></div></section>

    <section className={cardClassName}><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-neutral-500">Exportable reports</p><h2 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950">Generate CSV reports</h2></div></div><div className="mt-5 grid gap-4 lg:grid-cols-2">{reportTypes.map((report) => <div key={report.type} className="flex flex-col justify-between rounded-[24px] border border-neutral-200 bg-neutral-50 p-4"><div><p className="text-sm font-semibold text-neutral-950">{report.title}</p><p className="mt-2 text-sm leading-6 text-neutral-600">{report.description}</p></div><button className="mt-4 self-start rounded-full bg-[#1677ff] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0b63db] disabled:opacity-50" disabled={exporting !== null} onClick={() => downloadReport(report.type)}>{exporting === report.type ? "Preparing…" : "Download CSV"}</button></div>)}</div></section>
  </div>;
}

function Ranking({ title, items, value, suffix, color, empty }: { title: string; items: Asset[]; value: (asset: Asset) => number; suffix: string; color: string; empty: string }) {
  const max = Math.max(...items.map(value), 1);
  return <div className="rounded-[24px] border border-neutral-200 p-4"><p className="text-sm font-medium text-neutral-500">{title}</p><div className="mt-4 space-y-4">{items.length ? items.slice(0, 4).map((asset) => <div key={asset.name}><div className="flex items-center justify-between gap-3 text-sm"><span className="truncate font-medium text-neutral-900">{asset.name}</span><span className="whitespace-nowrap text-neutral-500">{value(asset)} {suffix}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-100"><div className={`h-full rounded-full ${color}`} style={{ width: `${clamp((value(asset) / max) * 100, 4, 100)}%` }} /></div></div>) : <EmptyState message={empty} />}</div></div>;
}
