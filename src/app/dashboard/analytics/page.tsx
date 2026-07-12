"use client";

import { useMemo, useState } from "react";

type UtilizationAsset = {
  name: string;
  department: string;
  category: string;
  allocations: number;
  usageDays: number;
  idleDays: number;
};

type MaintenanceAsset = {
  name: string;
  department: string;
  category: string;
  events: number;
  cost: number;
  dueInDays: number;
};

type DepartmentSummary = {
  department: string;
  total: number;
  allocated: number;
  available: number;
  maintenance: number;
  retired: number;
};

type BookingResource = {
  name: string;
  type: string;
  location: string;
  utilization: number[][];
};

const departments = ["All Departments", "Operations", "Finance", "IT", "Facilities"];
const categories = ["All Categories", "Electronics", "Furniture", "Vehicles", "Rooms"];
const statuses = ["All Statuses", "Allocated", "Available", "Under Maintenance", "Retired"];
const ranges = ["Last 7 days", "Last 30 days", "Last 12 months"];

const utilizationSeries = [42, 46, 44, 51, 53, 56, 58, 61, 63, 66, 68, 71];
const maintenanceSeries = [12, 15, 14, 18, 22, 19, 21, 24, 20, 17, 23, 26];

const utilizationAssets: UtilizationAsset[] = [
  { name: "MacBook Pro 16", department: "IT", category: "Electronics", allocations: 42, usageDays: 287, idleDays: 6 },
  { name: "Dell Docking Hub", department: "IT", category: "Electronics", allocations: 36, usageDays: 254, idleDays: 12 },
  { name: "Conference Room A", department: "Facilities", category: "Rooms", allocations: 31, usageDays: 198, idleDays: 4 },
  { name: "Delivery Van 02", department: "Operations", category: "Vehicles", allocations: 27, usageDays: 176, idleDays: 18 },
  { name: "Ergo Chair Fleet", department: "Operations", category: "Furniture", allocations: 24, usageDays: 166, idleDays: 22 },
  { name: "Projector Unit 4", department: "IT", category: "Electronics", allocations: 18, usageDays: 104, idleDays: 25 },
];

const maintenanceAssets: MaintenanceAsset[] = [
  { name: "Delivery Van 02", department: "Operations", category: "Vehicles", events: 9, cost: 18400, dueInDays: 4 },
  { name: "Conference Room A", department: "Facilities", category: "Rooms", events: 7, cost: 8200, dueInDays: 8 },
  { name: "MacBook Pro 16", department: "IT", category: "Electronics", events: 6, cost: 12400, dueInDays: 13 },
  { name: "Projector Unit 4", department: "IT", category: "Electronics", events: 5, cost: 6600, dueInDays: 21 },
];

const departmentSummary: DepartmentSummary[] = [
  { department: "Operations", total: 820, allocated: 602, available: 148, maintenance: 38, retired: 32 },
  { department: "IT", total: 540, allocated: 398, available: 92, maintenance: 34, retired: 16 },
  { department: "Facilities", total: 310, allocated: 192, available: 74, maintenance: 27, retired: 17 },
  { department: "Finance", total: 160, allocated: 98, available: 41, maintenance: 8, retired: 13 },
];

const bookingResources: BookingResource[] = [
  {
    name: "Room Alpha",
    type: "Room",
    location: "HQ - 2nd Floor",
    utilization: [
      [1, 1, 2, 4, 4, 3, 2, 1, 1],
      [1, 2, 3, 4, 4, 3, 3, 2, 1],
      [1, 1, 2, 3, 4, 4, 3, 2, 1],
      [1, 1, 2, 2, 3, 4, 4, 3, 2],
      [0, 1, 1, 2, 3, 4, 4, 3, 2],
      [0, 0, 1, 1, 2, 3, 4, 3, 2],
      [0, 0, 0, 1, 1, 2, 3, 3, 2],
    ],
  },
  {
    name: "Delivery Van 02",
    type: "Vehicle",
    location: "Warehouse",
    utilization: [
      [0, 1, 1, 2, 3, 3, 2, 1, 0],
      [0, 1, 2, 3, 3, 3, 2, 1, 0],
      [0, 0, 1, 2, 4, 4, 3, 1, 0],
      [0, 0, 1, 2, 3, 4, 4, 2, 1],
      [0, 0, 0, 1, 2, 3, 4, 3, 1],
      [0, 0, 0, 1, 1, 2, 3, 2, 1],
      [0, 0, 0, 0, 1, 1, 2, 2, 1],
    ],
  },
];

const kpiCards = [
  { label: "Total Assets", value: "1,840", detail: "All tracked assets across departments", tone: "from-slate-950 to-slate-800" },
  { label: "Assets Allocated", value: "1,206", detail: "Currently issued or reserved", tone: "from-indigo-600 to-blue-600" },
  { label: "Assets Idle", value: "318", detail: "Available but unused recently", tone: "from-cyan-500 to-sky-500" },
  { label: "Under Maintenance", value: "74", detail: "Open or in-progress maintenance", tone: "from-rose-500 to-orange-500" },
  { label: "Booking Utilization", value: "68%", detail: "Shared resource usage in period", tone: "from-emerald-500 to-teal-500" },
];

const reportTypes = [
  { title: "Asset Utilisation Report", description: "Per department and category, with top used assets." },
  { title: "Maintenance Summary", description: "Events, costs, and due-for-maintenance assets." },
  { title: "Department Allocation Summary", description: "Allocation vs available by department." },
  { title: "Resource Booking Report", description: "Heatmap data and booking counts." },
];

const inputClassName =
  "rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-950 outline-none transition focus:border-[#1677ff] focus:ring-4 focus:ring-[#1677ff]/10";

const chartWidth = 780;
const chartHeight = 260;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

function linePath(points: number[]) {
  const step = chartWidth / Math.max(points.length - 1, 1);
  return points
    .map((value, index) => `${index === 0 ? "M" : "L"} ${index * step} ${chartHeight - clamp(value, 0, 100) * 2}`)
    .join(" ");
}

function downloadCsv(filename: string, rows: Record<string, string | number>[]) {
  const headers = rows.length ? Object.keys(rows[0]) : [];
  const csv = [headers.join(","), ...rows.map((row) => headers.map((header) => JSON.stringify(row[header] ?? "")).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function StatCard({
  label,
  value,
  detail,
  tone,
}: {
  label: string;
  value: string;
  detail: string;
  tone: string;
}) {
  return (
    <article className="rounded-[24px] border border-neutral-200 bg-white p-5 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
      <div className={`inline-flex rounded-full bg-gradient-to-r ${tone} px-3 py-1 text-xs font-semibold text-white`}>{label}</div>
      <div className="mt-4 text-4xl font-semibold tracking-tight">{value}</div>
      <p className="mt-2 text-sm leading-6 text-neutral-500">{detail}</p>
    </article>
  );
}

function SparklineChart({ values }: { values: number[] }) {
  const area = `${linePath(values)} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;
  const line = linePath(values);

  return (
    <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="h-72 w-full">
      <defs>
        <linearGradient id="util-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#util-area)" />
      <path d={line} fill="none" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      {values.map((value, index) => {
        const step = chartWidth / Math.max(values.length - 1, 1);
        const x = index * step;
        const y = chartHeight - clamp(value, 0, 100) * 2;
        return <circle key={index} cx={x} cy={y} r="5" fill="#ef4444" />;
      })}
    </svg>
  );
}

function BarChart({
  values,
  labels,
  height = 260,
  color = "from-indigo-600 to-cyan-400",
}: {
  values: number[];
  labels: string[];
  height?: number;
  color?: string;
}) {
  const max = Math.max(...values, 1);

  return (
    <div className="flex h-full items-end gap-3">
      {values.map((value, index) => (
        <div key={labels[index] ?? index} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex h-full min-h-0 w-full items-end">
            <div
              className={`w-full rounded-t-[18px] bg-gradient-to-t ${color}`}
              style={{ height: `${Math.max((value / max) * height, 12)}px` }}
            />
          </div>
          <span className="text-xs text-neutral-500">{labels[index]}</span>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const [department, setDepartment] = useState("All Departments");
  const [category, setCategory] = useState("All Categories");
  const [status, setStatus] = useState("All Statuses");
  const [range, setRange] = useState("Last 12 months");

  const filteredUtilization = useMemo(
    () =>
      utilizationAssets.filter((asset) => {
        const matchesDepartment = department === "All Departments" || asset.department === department;
        const matchesCategory = category === "All Categories" || asset.category === category;
        const matchesStatus =
          status === "All Statuses" ||
          (status === "Allocated" && asset.allocations > 20) ||
          (status === "Available" && asset.idleDays >= 20) ||
          (status === "Under Maintenance" && asset.idleDays < 10) ||
          (status === "Retired" && asset.idleDays > 24);
        return matchesDepartment && matchesCategory && matchesStatus;
      }),
    [department, category, status]
  );

  const filteredMaintenance = useMemo(
    () =>
      maintenanceAssets.filter((asset) => {
        const matchesDepartment = department === "All Departments" || asset.department === department;
        const matchesCategory = category === "All Categories" || asset.category === category;
        return matchesDepartment && matchesCategory;
      }),
    [department, category]
  );

  const filteredDeptSummary = useMemo(
    () =>
      departmentSummary.filter((item) => department === "All Departments" || item.department === department),
    [department]
  );

  const csvPayloads = {
    utilization: filteredUtilization.map((asset) => ({
      asset: asset.name,
      department: asset.department,
      category: asset.category,
      allocations: asset.allocations,
      usage_days: asset.usageDays,
      idle_days: asset.idleDays,
    })),
    maintenance: filteredMaintenance.map((asset) => ({
      asset: asset.name,
      department: asset.department,
      category: asset.category,
      maintenance_events: asset.events,
      cost: asset.cost,
      due_in_days: asset.dueInDays,
    })),
    departments: filteredDeptSummary.map((item) => ({
      department: item.department,
      total_assets: item.total,
      allocated: item.allocated,
      available: item.available,
      under_maintenance: item.maintenance,
      retired: item.retired,
    })),
    bookings: bookingResources.map((resource) => ({
      resource: resource.name,
      type: resource.type,
      location: resource.location,
      peak_utilization: Math.max(...resource.utilization.flat()) * 25,
    })),
  };

  const reportBundleRows = [
    ...csvPayloads.departments.map((row) => ({
      report_type: "department-summary",
      name: row.department,
      total_assets: row.total_assets,
      allocated: row.allocated,
      available: row.available,
      under_maintenance: row.under_maintenance,
      retired: row.retired,
    })),
    ...csvPayloads.bookings.map((row) => ({
      report_type: "resource-bookings",
      name: row.resource,
      type: row.type,
      location: row.location,
      peak_utilization: row.peak_utilization,
    })),
  ];

  const totalBookings = 1842;
  const peakHours = "1 pm - 3 pm";
  const peakDays = "Tue / Thu";
  const averageUtilization = "68%";

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-neutral-200 bg-white p-5 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">Reports & Analytics</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">AssetFlow analytics hub</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-500">
              Monitor utilisation, maintenance, departmental allocation, and booking patterns across your assets and resources.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              className="rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100"
              onClick={() => downloadCsv("assetflow-utilization-report.csv", csvPayloads.utilization)}
            >
              Export utilisation CSV
            </button>
            <button
              className="rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100"
              onClick={() => downloadCsv("assetflow-maintenance-summary.csv", csvPayloads.maintenance)}
            >
              Export maintenance CSV
            </button>
            <button
              className="rounded-full bg-[#1677ff] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b63db]"
              onClick={() => downloadCsv("assetflow-reports-summary.csv", reportBundleRows)}
            >
              Export report bundle
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Department</span>
            <select className={`w-full ${inputClassName}`} value={department} onChange={(event) => setDepartment(event.target.value)}>
              {departments.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Category</span>
            <select className={`w-full ${inputClassName}`} value={category} onChange={(event) => setCategory(event.target.value)}>
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Status</span>
            <select className={`w-full ${inputClassName}`} value={status} onChange={(event) => setStatus(event.target.value)}>
              {statuses.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Date range</span>
            <select className={`w-full ${inputClassName}`} value={range} onChange={(event) => setRange(event.target.value)}>
              {ranges.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="overflow-hidden rounded-[32px] bg-slate-950 text-white shadow-[0_20px_60px_rgba(15,23,42,0.22)]">
          <div className="flex h-full flex-col justify-between p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/55">Utilisation</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight">Asset utilisation trends</h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-white/70">
                  Assets currently allocated, idle, and at risk based on the selected filters.
                </p>
              </div>
              <div className="rounded-full bg-white/10 px-3 py-2 text-sm text-white/75">{range}</div>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[24px] bg-white/10 p-4">
                <p className="text-sm text-white/60">Most used asset</p>
                <p className="mt-3 text-2xl font-semibold">MacBook Pro 16</p>
                <p className="mt-1 text-sm text-white/60">42 allocations</p>
              </div>
              <div className="rounded-[24px] bg-white/10 p-4">
                <p className="text-sm text-white/60">Idle asset</p>
                <p className="mt-3 text-2xl font-semibold">Projector Unit 4</p>
                <p className="mt-1 text-sm text-white/60">25 idle days</p>
              </div>
              <div className="rounded-[24px] bg-white/10 p-4">
                <p className="text-sm text-white/60">Utilisation rate</p>
                <p className="mt-3 text-2xl font-semibold">68%</p>
                <p className="mt-1 text-sm text-white/60">Rolling period average</p>
              </div>
            </div>
          </div>
        </article>

        <div className="grid gap-4 sm:grid-cols-2">
          {kpiCards.slice(0, 4).map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
        <section className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-neutral-500">Asset utilisation over time</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950">Allocated assets per month</h2>
            </div>
            <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">+0.85%</div>
          </div>
          <div className="mt-4 overflow-hidden rounded-[24px] bg-neutral-50 p-4">
            <SparklineChart values={utilizationSeries} />
          </div>
        </section>

        <section className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-500">Maintenance trend</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950">Open and resolved requests</h2>
            </div>
            <div className="rounded-full bg-rose-50 px-3 py-1 text-sm font-medium text-rose-700">26 events</div>
          </div>
          <div className="mt-4 h-[300px] rounded-[24px] bg-neutral-50 p-4">
            <BarChart values={maintenanceSeries} labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]} color="from-rose-500 to-orange-300" />
          </div>
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-500">Top used vs idle assets</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950">Asset ranking</h2>
            </div>
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-600">Filtered view</span>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div className="rounded-[24px] border border-neutral-200 p-4">
              <p className="text-sm font-medium text-neutral-500">Most used assets</p>
              <div className="mt-4 space-y-4">
                {filteredUtilization.slice(0, 4).map((asset) => (
                  <div key={asset.name}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-neutral-900">{asset.name}</span>
                      <span className="text-neutral-500">{asset.allocations} alloc.</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-100">
                      <div className="h-full rounded-full bg-[#1677ff]" style={{ width: `${clamp(asset.allocations * 2, 18, 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-neutral-200 p-4">
              <p className="text-sm font-medium text-neutral-500">Idle assets</p>
              <div className="mt-4 space-y-4">
                {filteredUtilization
                  .slice()
                  .sort((a, b) => b.idleDays - a.idleDays)
                  .slice(0, 4)
                  .map((asset) => (
                    <div key={asset.name}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-neutral-900">{asset.name}</span>
                        <span className="text-neutral-500">{asset.idleDays} idle days</span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-100">
                        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${clamp(asset.idleDays * 4, 16, 100)}%` }} />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-500">Maintenance risks</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950">Due for maintenance and near retirement</h2>
            </div>
            <span className="rounded-full bg-rose-50 px-3 py-1 text-sm text-rose-700">Open maintenance</span>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div className="rounded-[24px] border border-neutral-200 p-4">
              <p className="text-sm font-medium text-neutral-500">High maintenance frequency</p>
              <div className="mt-4 space-y-4">
                {filteredMaintenance.map((asset) => (
                  <div key={asset.name} className="rounded-2xl bg-neutral-50 p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-neutral-950">{asset.name}</span>
                      <span className="text-rose-600">{asset.events} events</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-neutral-500">
                      <span>{asset.department}</span>
                      <span>${asset.cost.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-neutral-200 p-4">
              <p className="text-sm font-medium text-neutral-500">Nearing retirement</p>
              <div className="mt-4 space-y-4">
                {filteredMaintenance
                  .slice()
                  .sort((a, b) => a.dueInDays - b.dueInDays)
                  .map((asset) => (
                    <div key={asset.name} className="rounded-2xl bg-neutral-50 p-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-neutral-950">{asset.name}</span>
                        <span className="text-amber-600">{asset.dueInDays} days</span>
                      </div>
                      <p className="mt-2 text-xs text-neutral-500">
                        {asset.category} asset nearing maintenance threshold or retirement review.
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-500">Department allocation summary</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950">Asset distribution by department</h2>
          </div>
          <div className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-600">Current period</div>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[24px] bg-neutral-50 p-5">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {filteredDeptSummary.map((item) => {
                const total = Math.max(item.total, 1);
                return (
                  <div key={item.department} className="rounded-[20px] bg-white p-4 shadow-sm">
                    <p className="text-sm font-medium text-neutral-900">{item.department}</p>
                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-neutral-100">
                      <div className="flex h-full">
                        <div className="bg-[#1677ff]" style={{ width: `${(item.allocated / total) * 100}%` }} />
                        <div className="bg-emerald-500" style={{ width: `${(item.available / total) * 100}%` }} />
                        <div className="bg-amber-400" style={{ width: `${(item.maintenance / total) * 100}%` }} />
                        <div className="bg-neutral-400" style={{ width: `${(item.retired / total) * 100}%` }} />
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-neutral-500">
                      {item.total} total assets
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="overflow-hidden rounded-[24px] border border-neutral-200">
            <table className="w-full text-left">
              <thead className="bg-neutral-50 text-xs uppercase tracking-[0.18em] text-neutral-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Department</th>
                  <th className="px-4 py-3 font-semibold">Total</th>
                  <th className="px-4 py-3 font-semibold">Allocated</th>
                  <th className="px-4 py-3 font-semibold">Available</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeptSummary.map((item) => (
                  <tr key={item.department} className="border-t border-neutral-100">
                    <td className="px-4 py-3 text-sm font-medium text-neutral-950">{item.department}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600">{item.total}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600">{item.allocated}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600">{item.available}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-500">Resource booking heatmap</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950">Peak usage windows</h2>
          </div>
          <div className="flex items-center gap-3 text-sm text-neutral-500">
            <span className="rounded-full bg-neutral-100 px-3 py-1">Peak hour: {peakHours}</span>
            <span className="rounded-full bg-neutral-100 px-3 py-1">Peak days: {peakDays}</span>
          </div>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_0.75fr]">
          <div className="rounded-[24px] bg-neutral-50 p-4">
            {bookingResources.map((resource) => (
              <div key={resource.name} className="mb-6 last:mb-0">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-neutral-950">{resource.name}</p>
                    <p className="text-xs text-neutral-500">
                      {resource.type} {resource.location ? `• ${resource.location}` : ""}
                    </p>
                  </div>
                  <p className="text-xs font-medium text-neutral-500">Avg. utilisation {averageUtilization}</p>
                </div>

                <div className="grid gap-2">
                  {resource.utilization.map((row, rowIndex) => (
                    <div key={rowIndex} className="grid grid-cols-9 gap-2">
                      {row.map((value, colIndex) => {
                        const opacity = 0.18 + value * 0.18;
                        const hue = value >= 3 ? "255, 76, 76" : value >= 2 ? "244, 114, 182" : "59, 130, 246";
                        return (
                          <div
                            key={colIndex}
                            className="aspect-square rounded-[10px]"
                            style={{ backgroundColor: `rgba(${hue}, ${opacity})` }}
                            title={`Usage ${value}`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <article className="rounded-[24px] border border-neutral-200 p-4">
              <p className="text-sm font-medium text-neutral-500">Booking KPIs</p>
              <div className="mt-4 grid gap-4">
                <div className="rounded-2xl bg-neutral-50 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">Total bookings</p>
                  <p className="mt-2 text-3xl font-semibold text-neutral-950">{totalBookings.toLocaleString()}</p>
                </div>
                <div className="rounded-2xl bg-neutral-50 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">Peak days</p>
                  <p className="mt-2 text-2xl font-semibold text-neutral-950">{peakDays}</p>
                </div>
                <div className="rounded-2xl bg-neutral-50 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">Average utilisation</p>
                  <p className="mt-2 text-2xl font-semibold text-neutral-950">{averageUtilization}</p>
                </div>
              </div>
            </article>

            <article className="rounded-[24px] border border-neutral-200 p-4">
              <p className="text-sm font-medium text-neutral-500">Filter notes</p>
              <p className="mt-3 text-sm leading-6 text-neutral-600">
                Use the selectors above to drill into departments, categories, and status combinations. The cards and tables are built to stay
                legible on smaller screens.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-500">Exportable reports</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950">Generate CSV reports</h2>
          </div>
          <button
            className="rounded-full bg-[#1677ff] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b63db]"
            onClick={() => downloadCsv("assetflow-department-summary.csv", csvPayloads.departments)}
          >
            Generate report
          </button>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {reportTypes.map((report) => (
            <div key={report.title} className="rounded-[24px] border border-neutral-200 bg-neutral-50 p-4">
              <p className="text-sm font-semibold text-neutral-950">{report.title}</p>
              <p className="mt-2 text-sm leading-6 text-neutral-600">{report.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
