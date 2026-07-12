import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { DashboardShell } from "../../features/dashboard/dashboard-shell";

async function getCurrentUser() {
  const headerStore = await headers();
  const cookieHeader = headerStore.get("cookie") || "";
  if (!cookieHeader) {
    redirect("/auth/signin");
  }

  try {
    const response = await fetch("/api/auth/me", {
      headers: { cookie: cookieHeader },
      cache: "no-store",
    });

    if (!response.ok) {
      redirect("/auth/signin");
    }

    const payload = await response.json();
    const user = payload?.data?.user ?? null;

    if (!user) {
      redirect("/auth/signin");
    }

    return user;
  } catch {
    redirect("/auth/signin");
  }
}

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  return <DashboardShell user={user}>{children}</DashboardShell>;
}
