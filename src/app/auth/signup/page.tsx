import Link from "next/link";
import { AuthForm } from "@/features/auth/auth-form";
import { AuthShell } from "@/features/auth/auth-shell";
import { API_BASE_URL } from "@/lib/api";

export default function SignUpPage() {
  return (
    <AuthShell
      eyebrow="Get started"
      title="Create your employee account."
      subtitle="Set up your workspace access in minutes. Admins can promote users later from the employee directory."
    >
      <div className="space-y-5">
        <AuthForm mode="signup" />

        <div className="flex items-center gap-4">
          <span className="h-px flex-1 bg-slate-200" />
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">or</span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <a
          href={`${API_BASE_URL}/api/auth/google/start?intent=signup`}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-[var(--af-border)] bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
        >
          Sign up with Google
        </a>

        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link className="font-semibold text-[var(--af-accent)] hover:underline" href="/auth/signin">
            Log in
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
