"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { apiFetch } from "@/lib/api";

type Mode = "forgot" | "reset" | "verify";

type Props = {
  mode: Mode;
  token?: string;
  email?: string;
};

const inputClassName =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10";

export function RecoveryForm({ mode, token, email = "" }: Props) {
  const router = useRouter();
  const [address, setAddress] = useState(email);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const autoVerified = useRef(false);

  const isReset = mode === "reset";
  const isVerify = mode === "verify";

  const heading = useMemo(() => {
    if (mode === "forgot") return "Forgot your password?";
    if (mode === "reset") return "Set a new password";
    return "Verify your email";
  }, [mode]);

  const description = useMemo(() => {
    if (mode === "forgot") return "We will send a reset link to your work email.";
    if (mode === "reset") return "Choose a secure new password for your account.";
    return "Click the verification link in your inbox, or request a new one below.";
  }, [mode]);

  const handleForgot = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await apiFetch("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: address }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload?.message || "Unable to send reset link");
      }

      setMessage("If the account exists, a reset link has been sent.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setLoading(false);
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await apiFetch("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload?.message || "Unable to reset password");
      }

      router.push("/auth/signin?reset=1");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const verifyToken = useCallback(async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await apiFetch("/api/auth/email/verify", {
        method: "POST",
        body: JSON.stringify({ token }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload?.message || "Unable to verify email");
      }

      setMessage("Email verified. You can now log in.");
      router.push("/auth/signin?verified=1");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [token, router]);

  const handleVerify = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await verifyToken();
  };

  useEffect(() => {
    if (mode === "verify" && token && !autoVerified.current) {
      autoVerified.current = true;
      void verifyToken();
    }
  }, [mode, token, verifyToken]);

  const resendVerification = async () => {
    if (!address) {
      setError("Enter your email address first.");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await apiFetch("/api/auth/email/send-verification", {
        method: "POST",
        body: JSON.stringify({ email: address }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload?.message || "Unable to send verification email");
      }

      setMessage("Verification email sent. Check your inbox.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-950">{heading}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
      </div>

      {mode === "forgot" ? (
        <form className="space-y-4" onSubmit={handleForgot}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Work Email</span>
            <input
              className={inputClassName}
              type="email"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="you@company.com"
              autoComplete="email"
              required
            />
          </label>

          {error ? <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
          {message ? <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}

          <button
            className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-3 font-semibold text-white shadow-[0_12px_30px_rgba(79,70,229,0.28)] transition hover:from-indigo-500 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
            type="submit"
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>
      ) : null}

      {isReset ? (
        <form className="space-y-4" onSubmit={handleReset}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">New password</span>
            <input
              className={inputClassName}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Create a new password"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Confirm password</span>
            <input
              className={inputClassName}
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Confirm password"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </label>

          {error ? <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
          {message ? <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}

          <button
            className="w-full rounded-2xl bg-gradient-to-r from-slate-950 to-slate-800 px-4 py-3 font-semibold text-white transition hover:from-slate-900 hover:to-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
            type="submit"
          >
            {loading ? "Updating..." : "Update password"}
          </button>
        </form>
      ) : null}

      {isVerify ? (
        <div className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Email address</span>
            <input
              className={inputClassName}
              type="email"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="you@company.com"
              autoComplete="email"
            />
          </label>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={resendVerification}
              className="rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-3 font-semibold text-white shadow-[0_12px_30px_rgba(79,70,229,0.28)] transition hover:from-indigo-500 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Sending..." : "Resend verification"}
            </button>
            <Link
              href="/auth/signin"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Back to login
            </Link>
          </div>

          {token ? (
            <form onSubmit={handleVerify}>
              <button
                type="submit"
                className="w-full rounded-2xl bg-slate-950 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify this link"}
              </button>
            </form>
          ) : null}

          {error ? <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
          {message ? <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
