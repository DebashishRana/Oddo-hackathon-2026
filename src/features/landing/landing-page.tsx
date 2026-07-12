import Link from "next/link";
import { ArrowRight, Boxes, CalendarDays, ClipboardCheck, ShieldCheck, Wrench } from "lucide-react";

const modules = [
  {
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
  },
];

export function LandingPage() {
  return (
    <main className="af-grid-bg min-h-screen text-[var(--af-ink)]">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--af-steel)] font-display text-sm font-bold text-teal-300">
            AF
          </div>
          <div>
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
            </div>
          </div>
        </div>
      </section>

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
