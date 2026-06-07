import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogsPageClient from "@/components/dashboard/logs/LogsPageClient";
import { buildAppUrl } from "@/lib/site-url";

export default async function LogsPage() {
  const session = await auth();

  if (!session) {
    redirect(buildAppUrl("/auth/signin"));
  }

  return <LogsPageClient />;
}
