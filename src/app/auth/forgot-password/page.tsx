import { AuthShell } from "@/features/auth/auth-shell";
import { RecoveryForm } from "@/features/auth/recovery-form";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Reset your password."
      subtitle="Enter your work email and we will send a secure link using Resend."
    >
      <RecoveryForm mode="forgot" />
    </AuthShell>
  );
}
