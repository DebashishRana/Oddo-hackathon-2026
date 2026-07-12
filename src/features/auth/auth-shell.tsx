import Link from "next/link";
import { Boxes, CalendarDays, ShieldCheck, Wrench } from "lucide-react";

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

const highlights = [
  { label: "Lifecycle tracking", icon: Boxes },
  { label: "Overlap-safe bookings", icon: CalendarDays },
  { label: "Approval workflows", icon: Wrench },
  { label: "Role-based access", icon: ShieldCheck },
];

export function AuthShell({ eyebrow, title, subtitle, children }: Props) {
  return (
    <main className="af-grid-bg min-h-screen text-[var(--af-ink)]">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-14">
          <div className="af-fade-up w-full max-w-md">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--af-steel)] font-display text-sm font-bold text-teal-300">
                AF
              </div>
              <div>
                <p className="font-display text-xl font-semibold tracking-tight">AssetFlow</p>
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--af-muted)]">Enterprise ERP</p>
              </div>
            </Link>

            <div className="mt-12">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--af-accent)]">{eyebrow}</p>
              <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
              <p className="mt-3 text-base leading-7 text-[var(--af-muted)]">{subtitle}</p>
            </div>

            <div className="af-panel mt-8 p-6 sm:p-7">{children}</div>
          </div>
        </section>

        <aside className="relative hidden overflow-hidden bg-[linear-gradient(160deg,#0f172a_0%,#134e4a_55%,#0f766e_100%)] text-white lg:flex lg:flex-col lg:justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(45,212,191,0.28),transparent_40%),radial-gradient(circle_at_85%_75%,rgba(255,255,255,0.08),transparent_35%)]" />
          <div className="relative mx-auto w-full max-w-xl px-12 py-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-200">Operations control</p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight">
              One workspace for assets, bookings, and approvals.
            </h2>
            <p className="mt-4 max-w-md text-base leading-7 text-slate-200">
              Employees start with safe defaults. Admins promote managers from the directory — never at signup.
            </p>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {highlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur">
                    <Icon className="h-4 w-4 text-teal-200" />
                    <p className="mt-3 text-sm font-semibold">{item.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
