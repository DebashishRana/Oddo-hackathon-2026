import { AuthShell } from "@/features/auth/auth-shell";
import { RecoveryForm } from "@/features/auth/recovery-form";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams?: Promise<{ email?: string; token?: string }>;
}) {
  const params = searchParams ? await searchParams : undefined;

  return (
    <AuthShell
      eyebrow="Verify email"
      title="Activate your account."
      subtitle="Open the link in your inbox to confirm your email and unlock login."
    >
      <RecoveryForm mode="verify" token={params?.token} email={params?.email || ""} />
    </AuthShell>
  );
}
