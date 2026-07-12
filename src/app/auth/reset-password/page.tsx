import { AuthShell } from "@/features/auth/auth-shell";
import { RecoveryForm } from "@/features/auth/recovery-form";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams?: Promise<{ token?: string }>;
}) {
  const params = searchParams ? await searchParams : undefined;

  return (
    <AuthShell
      eyebrow="Password reset"
      title="Choose a new password."
      subtitle="Use the link from your email to finish resetting your account."
    >
      <RecoveryForm mode="reset" token={params?.token} />
    </AuthShell>
  );
}
