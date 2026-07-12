import Link from "next/link";
import { ArrowRight, Boxes, CalendarDays, ClipboardCheck, ShieldCheck, Wrench } from "lucide-react";

const modules = [
  {
<<<<<<< Updated upstream
    title: "Asset lifecycle",
    copy: "Register, allocate, transfer, and retire with conflict-safe custody rules.",
    icon: Boxes,
  },
  {
    title: "Resource booking",
    copy: "Time-slot reservations for rooms, vehicles, and shared equipment — no overlaps.",
    icon: CalendarDays,
  },
  {
    title: "Maintenance approvals",
    copy: "Route repairs through Asset Manager approval before work starts.",
    icon: Wrench,
  },
  {
    title: "Audit cycles",
    copy: "Assign auditors, flag discrepancies, and lock cycles with status updates.",
    icon: ClipboardCheck,
=======
    title: "Departments",
    copy: "Structure teams, cost centers, and reporting lines in one place.",
    tint: "from-indigo-500 to-blue-500",
  },
  {
    title: "Assets",
    copy: "Track each asset through Available, Allocated, Reserved, Maintenance, Lost, Retired, and Disposed states.",
    tint: "from-cyan-500 to-sky-500",
  },
  {
    title: "Bookings",
    copy: "Reserve rooms, vehicles, and equipment with overlap checks and time-slot control.",
    tint: "from-emerald-500 to-teal-500",
  },
  {
    title: "Workflows",
    copy: "Route maintenance approvals, audit cycles, returns, and notifications through clear role-based steps.",
    tint: "from-slate-700 to-slate-950",
>>>>>>> Stashed changes
  },
];

const capabilityList = [
  "Department and employee directory setup",
  "Flexible asset lifecycle management",
  "Allocation conflict handling",
  "Shared resource booking without overlaps",
  "Maintenance approvals before repair work",
  "Scheduled audits with discrepancy reporting",
  "Overdue return, booking, and maintenance notifications",
  "Role-based access with realistic account creation",
];

const roleCards = [
  {
    role: "Admin",
    copy: "Set up the organization, manage the directory, promote roles, and oversee audit and analytics views.",
  },
  {
    role: "Asset Manager",
    copy: "Register assets, approve transfers and maintenance, and control high-value operational resources.",
  },
  {
    role: "Department Head",
    copy: "Approve department-level requests, book resources, and review assets within the team.",
  },
  {
    role: "Employee",
    copy: "View assigned assets, book shared resources, raise maintenance requests, and submit handoff flows.",
  },
];

export function LandingPage() {
  return (
<<<<<<< Updated upstream
    <main className="af-grid-bg min-h-screen text-[var(--af-ink)]">
=======
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.16),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.14),_transparent_24%),linear-gradient(180deg,#f8fafc_0%,#f8fafc_45%,#eef2ff_100%)] text-slate-950">
>>>>>>> Stashed changes
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--af-steel)] font-display text-sm font-bold text-teal-300">
            AF
          </div>
          <div>
<<<<<<< Updated upstream
            <p className="font-display text-lg font-semibold tracking-tight">AssetFlow</p>
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--af-muted)]">Enterprise ERP</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <a href="#modules" className="transition hover:text-[var(--af-ink)]">
            Modules
          </a>
          <a href="#roles" className="transition hover:text-[var(--af-ink)]">
            Roles
          </a>
=======
            <p className="text-lg font-semibold tracking-tight">AssetFlow</p>
            <p className="text-xs text-slate-500">Enterprise asset and resource management</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
          <a href="#vision">Vision</a>
          <a href="#modules">Modules</a>
          <a href="#roles">Roles</a>
          <a href="#deploy">Deploy</a>
>>>>>>> Stashed changes
        </nav>

        <div className="flex items-center gap-2">
          <Link
            className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white/70"
            href="/auth/signin"
          >
            Log in
          </Link>
          <Link
            className="rounded-xl bg-[var(--af-accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(15,118,110,0.28)] transition hover:bg-[var(--af-accent-strong)]"
            href="/auth/signup"
          >
            Get started
          </Link>
        </div>
      </header>

<<<<<<< Updated upstream
      <section className="relative mx-auto w-full max-w-7xl overflow-hidden px-6 pb-16 pt-8 lg:px-8 lg:pb-24 lg:pt-10">
        <div className="absolute inset-x-6 top-0 -z-10 h-[72vh] rounded-[32px] bg-[linear-gradient(135deg,#0f172a_0%,#134e4a_48%,#0f766e_100%)] lg:inset-x-8" />
        <div className="absolute inset-x-6 top-0 -z-10 h-[72vh] rounded-[32px] bg-[radial-gradient(circle_at_20%_20%,rgba(45,212,191,0.25),transparent_42%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.12),transparent_35%)] lg:inset-x-8" />

        <div className="af-fade-up grid min-h-[68vh] items-center gap-10 rounded-[32px] px-6 py-14 text-white sm:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:px-14">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-teal-100 backdrop-blur">
              <ShieldCheck className="h-3.5 w-3.5" />
              Role-based ERP
            </p>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              AssetFlow
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-200">
              Centralize asset custody, shared bookings, maintenance approvals, and audit cycles — without spreadsheets.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-teal-50"
              >
                Create employee account
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/auth/signin"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
              >
                Sign in to workspace
              </Link>
            </div>
          </div>

          <div className="af-fade-up-delay hidden rounded-[28px] border border-white/15 bg-white/10 p-5 backdrop-blur-md lg:block">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-100">Live control plane</p>
            <div className="mt-4 space-y-3">
              {["Available → Allocated", "Overlap-safe bookings", "Maintenance approvals", "Audit discrepancy lock"].map(
                (item, i) => (
                  <div key={item} className="flex items-center justify-between rounded-2xl bg-slate-950/35 px-4 py-3">
                    <span className="text-sm text-slate-100">{item}</span>
                    <span className="text-xs font-semibold text-teal-200">0{i + 1}</span>
                  </div>
                )
              )}
=======
      <section className="mx-auto flex w-full max-w-7xl flex-col items-center px-6 pb-20 pt-12 text-center lg:px-8 lg:pt-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/75 px-4 py-2 text-sm font-medium text-indigo-700 shadow-sm backdrop-blur">
          <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
          Built for ERP workflows, not generic task tracking
        </div>

        <h1 className="mt-8 max-w-5xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-[84px] lg:leading-[0.96]">
          Centralize assets, bookings, maintenance, and audits.
          <span className="block text-slate-500">One ERP for every shared resource in the organization.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
          AssetFlow is an enterprise asset and resource management system for any organization that handles equipment, furniture, vehicles, rooms, or other shared resources.
          It replaces spreadsheets and paper logs with structured lifecycles, role-based approvals, and live visibility into who holds what, where it is, and what condition it is in.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link className="rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-3 text-base font-semibold text-white transition hover:from-indigo-500 hover:to-blue-500" href="/auth/signup">
            Start as Employee
          </Link>
          <Link className="rounded-full border border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100" href="/auth/signin">
            Sign in
          </Link>
        </div>

        <div className="mt-8 flex max-w-4xl flex-wrap justify-center gap-3 text-sm text-slate-600">
          <span className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 shadow-sm">No self-assigned admin roles</span>
          <span className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 shadow-sm">No purchasing or invoicing</span>
          <span className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 shadow-sm">Real relational database</span>
        </div>
      </section>

      <section id="vision" className="mx-auto w-full max-w-7xl px-6 pb-20 lg:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-600">Overall vision</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Reduce manual tracking with a single source of truth.</h2>
          </div>
          <Link href="/dashboard" className="hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 lg:inline-flex">
            Open dashboard
          </Link>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {featureCards.map((card) => (
            <article key={card.title} className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.04)]">
              <div className="p-6">
                <p className="text-sm text-slate-500">{card.title}</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-950">{card.copy}</h3>
              </div>
              <div className={`min-h-[240px] bg-gradient-to-br ${card.tint} p-6`}>
                <div className="h-full rounded-[24px] border border-white/20 bg-white/90 p-5 text-left shadow-xl backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">ERP capability</p>
                  <div className="mt-3 text-2xl font-semibold text-slate-950">
                    {card.title === "Assets"
                      ? "Lifecycle states and ownership history"
                      : card.title === "Bookings"
                        ? "Time-slot validation for shared resources"
                        : card.title === "Departments"
                          ? "Org structure that drives access control"
                          : "Approval flow with audit-friendly records"}
                  </div>
                  <p className="mt-3 max-w-md text-sm leading-6 text-slate-700">
                    The platform is designed for real operations data, not demo-only placeholders. Each module maps to a clear business process and a live relational record set.
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="modules" className="mx-auto w-full max-w-7xl px-6 pb-20 lg:px-8">
        <div className="rounded-[32px] border border-slate-200 bg-white/85 px-6 py-10 shadow-[0_30px_90px_rgba(15,23,42,0.08)] backdrop-blur sm:px-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-600">Mission fit</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Core ERP modules, without the finance clutter.</h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                AssetFlow focuses on asset management, bookings, maintenance, audits, notifications, and role-based workflows. It deliberately avoids purchasing, invoicing, and accounting so the product stays focused and usable.
              </p>
            </div>
            <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
              Real data, not static mockups
>>>>>>> Stashed changes
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {capabilityList.map((item) => (
              <div key={item} className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 text-sm font-bold text-white">
                  AF
                </div>
                <p className="mt-4 text-sm font-medium leading-6 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="roles" className="mx-auto w-full max-w-7xl px-6 pb-20 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[32px] bg-slate-950 px-6 py-10 text-white shadow-[0_30px_90px_rgba(15,23,42,0.18)] sm:px-10">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">Role-based workflow</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Permissions reflect how organizations actually work.</h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
              The application creates realistic employee accounts first. Admin access is granted through organization management, keeping the workflow aligned with the hackathon brief.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {roleCards.map((item) => (
              <article key={item.role} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.04)]">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-600">{item.role}</p>
                <p className="mt-3 text-lg font-semibold text-slate-950">{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

<<<<<<< Updated upstream
      <section id="modules" className="mx-auto w-full max-w-7xl px-6 pb-20 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--af-accent)]">Modules</p>
          <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight">Built for full asset operations.</h2>
          <p className="mt-3 text-base leading-7 text-[var(--af-muted)]">
            Every module maps to a real ERP workflow — from organization setup to analytics.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {modules.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="af-panel p-6 transition hover:-translate-y-0.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--af-accent-soft)] text-[var(--af-accent)]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--af-muted)]">{item.copy}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="roles" className="mx-auto w-full max-w-7xl px-6 pb-20 lg:px-8">
        <div className="overflow-hidden rounded-[32px] bg-[var(--af-steel)] px-6 py-10 text-white sm:px-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-300">Access model</p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight">Signup stays Employee-only.</h2>
          <p className="mt-3 max-w-2xl text-slate-300">
            Admins promote Department Heads and Asset Managers from the Employee Directory — no self-assigned privilege escalation.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {["Admin", "Asset Manager", "Department Head", "Employee"].map((role) => (
              <div key={role} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                <p className="text-sm font-semibold">{role}</p>
                <p className="mt-2 text-xs text-slate-400">Scoped workflows & approvals</p>
              </div>
            ))}
=======
      <footer id="deploy" className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-10 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-lg font-semibold tracking-tight text-slate-950">AssetFlow</p>
            <p className="mt-2 text-sm text-slate-500">Enterprise asset and resource management for modern organizations.</p>
>>>>>>> Stashed changes
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--af-border)] bg-white/70">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div>
            <p className="font-display text-lg font-semibold">AssetFlow</p>
            <p className="text-sm text-[var(--af-muted)]">Enterprise asset & resource management</p>
          </div>
          <div className="flex gap-2">
            <Link href="/auth/signin" className="rounded-xl border border-[var(--af-border)] px-4 py-2 text-sm font-semibold">
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-xl bg-[var(--af-accent)] px-4 py-2 text-sm font-semibold text-white"
            >
              Sign up
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
