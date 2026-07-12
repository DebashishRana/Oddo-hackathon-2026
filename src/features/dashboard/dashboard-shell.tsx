import Link from "next/link";
import { SignOutButton } from "./sign-out-button";

type NavItem = {
  href: string;
  label: string;
};

const mainNav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/analytics", label: "Analytics" },
  { href: "/dashboard/entities", label: "Entities" },
  { href: "/dashboard/settings", label: "Settings" },
];

const toolsNav: NavItem[] = [
  { href: "#", label: "Projects" },
  { href: "#", label: "Customers" },
  { href: "#", label: "Messages" },
];

type Props = {
  user?: {
    name?: string | null;
    email: string;
    role: string;
  } | null;
  children: React.ReactNode;
};

export function DashboardShell({ user, children }: Props) {
  return (
    <div className="min-h-screen bg-[#f7f7f5] text-neutral-950">
      <div className="mx-auto grid min-h-screen max-w-[1600px] grid-cols-1 gap-4 px-4 py-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-5">
        <aside className="flex flex-col rounded-[28px] border border-neutral-200 bg-white p-4 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 text-sm font-bold text-white">
              AF
            </div>
            <div>
              <p className="font-display text-lg">AssetFlow</p>
              <p className="text-xs text-neutral-500">{user?.email || "guest@example.com"}</p>
            </div>
          </div>

          <div className="mt-6 space-y-1">
            <p className="px-3 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">General</p>
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-2xl px-3 py-3 text-sm text-neutral-700 transition hover:bg-neutral-100 hover:text-neutral-950"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-6 space-y-1 border-t border-neutral-200 pt-6">
            <p className="px-3 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">Tools</p>
            {toolsNav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center justify-between rounded-2xl px-3 py-3 text-sm text-neutral-700 transition hover:bg-neutral-100 hover:text-neutral-950"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-auto rounded-[24px] border border-neutral-200 bg-neutral-50 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-neutral-400">Team</p>
            <div className="mt-2 flex items-center justify-between">
              <div>
                <p className="font-semibold text-neutral-950">{user?.name || "Operations"}</p>
                <p className="text-sm text-neutral-500">{user?.role || "employee"}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400 text-sm font-semibold text-white">
                {user?.name?.[0]?.toUpperCase() || "A"}
              </div>
            </div>
            <div className="mt-4">
              <SignOutButton />
            </div>
          </div>
        </aside>

        <main className="flex min-w-0 flex-col gap-4">
          <header className="flex flex-col gap-4 rounded-[28px] border border-neutral-200 bg-white px-5 py-4 shadow-[0_10px_40px_rgba(0,0,0,0.04)] lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <button className="flex h-10 w-10 items-center justify-center rounded-2xl border border-neutral-200 text-neutral-500">☰</button>
              <label className="flex min-w-0 items-center gap-3 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2.5">
                <span className="text-neutral-400">⌕</span>
                <input className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400" placeholder="Search" />
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/" className="rounded-full px-4 py-2 text-sm text-neutral-600 transition hover:bg-neutral-100">
                Home
              </Link>
              <Link href="/dashboard/settings" className="rounded-full px-4 py-2 text-sm text-neutral-600 transition hover:bg-neutral-100">
                Settings
              </Link>
              <Link href="/auth/signin" className="rounded-full bg-[#1677ff] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b63db]">
                Open AssetFlow
              </Link>
            </div>
          </header>

          <section className="min-w-0">{children}</section>
        </main>
      </div>
    </div>
  );
}
