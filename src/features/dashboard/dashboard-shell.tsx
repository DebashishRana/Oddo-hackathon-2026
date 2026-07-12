import Link from "next/link";
import { SignOutButton } from "./sign-out-button";

type NavItem = {
  href: string;
  label: string;
  roles?: string[];
};

const mainNav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/organization", label: "Organization", roles: ["admin"] },
  { href: "/dashboard/assets", label: "Assets" },
  { href: "/dashboard/allocations", label: "Allocations" },
  { href: "/dashboard/bookings", label: "Bookings" },
  { href: "/dashboard/maintenance", label: "Maintenance" },
  { href: "/dashboard/audits", label: "Audits", roles: ["admin", "asset_manager"] },
  { href: "/dashboard/analytics", label: "Analytics", roles: ["admin", "asset_manager", "department_head"] },
  { href: "/dashboard/notifications", label: "Notifications" },
  { href: "/dashboard/settings", label: "Settings" },
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
  const role = user?.role || "employee";
  const visibleNav = mainNav.filter((item) => !item.roles || item.roles.includes(role));

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
            {visibleNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-2xl px-3 py-3 text-sm text-neutral-700 transition hover:bg-neutral-100 hover:text-neutral-950"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-auto rounded-[24px] border border-neutral-200 bg-neutral-50 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-neutral-400">Signed in</p>
            <div className="mt-2 flex items-center justify-between">
              <div>
                <p className="font-semibold text-neutral-950">{user?.name || "User"}</p>
                <p className="text-sm text-neutral-500">{roleLabel(role)}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400 text-sm font-semibold text-white">
                {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "A"}
              </div>
            </div>
            <div className="mt-4">
              <SignOutButton />
            </div>
          </div>
        </aside>

        <main className="flex min-w-0 flex-col gap-4">
          <header className="flex flex-col gap-4 rounded-[28px] border border-neutral-200 bg-white px-5 py-4 shadow-[0_10px_40px_rgba(0,0,0,0.04)] lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">Workspace</p>
              <h1 className="font-display text-xl font-semibold text-neutral-950">Asset & Resource Management</h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/dashboard/notifications"
                className="rounded-full px-4 py-2 text-sm text-neutral-600 transition hover:bg-neutral-100"
              >
                Notifications
              </Link>
              <Link
                href="/dashboard/settings"
                className="rounded-full px-4 py-2 text-sm text-neutral-600 transition hover:bg-neutral-100"
              >
                Settings
              </Link>
              <Link
                href="/dashboard/assets"
                className="rounded-full bg-[#1677ff] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b63db]"
              >
                Register Asset
              </Link>
            </div>
          </header>

          <section className="min-w-0">{children}</section>
        </main>
      </div>
    </div>
  );
}
