import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { DashboardShell } from "../../features/dashboard/dashboard-shell";
import { API_BASE_URL } from "@/lib/api";

async function getCurrentUser() {
  const cookieStore = await cookies();

  try {
    const cookieHeader = cookieStore
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    if (!cookieHeader) {
      redirect("/auth/signin");
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
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
