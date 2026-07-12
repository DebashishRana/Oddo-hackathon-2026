import Link from "next/link";
import { AuthForm } from "@/features/auth/auth-form";
import { AuthShell } from "@/features/auth/auth-shell";
import { API_BASE_URL } from "@/lib/api";

export default function SignInPage() {
  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to AssetFlow."
      subtitle="Use your workspace credentials. New accounts always start as Employees."
    >
      <div className="space-y-5">
        <AuthForm mode="signin" />

        <div className="rounded-xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm text-teal-800">
          Seed admin: <span className="font-semibold">admin@assetflow.local</span> /{" "}
          <span className="font-semibold">Admin1234!</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="h-px flex-1 bg-slate-200" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">or</span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <a
          href={`${API_BASE_URL}/api/auth/google/start?intent=signin`}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-[var(--af-border)] bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
        >
          Continue with Google
        </a>

        <div className="flex items-center justify-between text-sm">
          <Link href="/auth/forgot-password" className="font-medium text-[var(--af-accent)] hover:underline">
            Forgot password?
          </Link>
          <Link className="font-medium text-slate-600 hover:text-slate-950" href="/auth/signup">
            Create account
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}
