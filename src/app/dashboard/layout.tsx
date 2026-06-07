import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { saveUserToDatabase } from "@/lib/user-actions";
import { buildAppUrl } from "@/lib/site-url";

export const runtime = 'nodejs';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect(buildAppUrl("/auth/signin"));
  }

  // Save user to database when they access the dashboard
  try {
    await saveUserToDatabase();
  } catch (error) {
    console.error("Failed to save user to database:", error);
    // Continue even if database save fails
  }

  return <DashboardClient session={session}>{children}</DashboardClient>
}


