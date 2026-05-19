import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogsPageClient from "@/components/dashboard/logs/LogsPageClient";

export default async function LogsPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return <LogsPageClient />;
}
