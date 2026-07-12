import Link from "next/link";
import { AuthForm } from "@/features/auth/auth-form";
import { AuthShell } from "@/features/auth/auth-shell";
import { API_BASE_URL } from "@/lib/api";

export default function SignInPage() {
  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Log in to your workspace."
      subtitle="Use the demo login below to open the dashboard now. Your team can wire the full backend auth later."
    >
      <div className="space-y-5">
        <AuthForm mode="signin" />

        <div className="rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
          Demo access: <span className="font-semibold">demo@dectra.local</span> / <span className="font-semibold">Demo1234!</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="h-px flex-1 bg-slate-200" />
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">or</span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <a
          href={`${API_BASE_URL}/api/auth/google/start?intent=signin`}
          className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50"
        >
          <svg aria-hidden="true" viewBox="0 0 48 48" className="h-5 w-5">
            <path fill="#FFC107" d="M43.6 20.2H42V20H24v8h11.3C33.6 32.8 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.1-.4-3.8Z" />
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 18.9 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4c-7.7 0-14.4 4.3-17.7 10.7Z" />
            <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.3 35.2 26.8 36 24 36c-5.2 0-9.6-3.2-11.3-7.7l-6.5 5C9.4 39.6 16 44 24 44Z" />
            <path fill="#1976D2" d="M43.6 20.2H42V20H24v8h11.3c-1.2 3.2-3.6 5.8-6.3 7.5l6.3 5.3C34.9 39.1 40 34 40 24c0-1.3-.1-2.1-.4-3.8Z" />
          </svg>
          Continue with Google
        </a>

        <div className="flex items-center justify-between text-sm">
          <Link href="/auth/forgot-password" className="font-medium text-indigo-600 transition hover:text-indigo-500">
            Forgot password?
          </Link>
          <Link className="font-medium text-slate-600 transition hover:text-slate-950" href="/auth/signup">
            Create account
          </Link>
        </div>

      </div>
    </AuthShell>
  );
}
