"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "@/lib/api";

type AuthMode = "signin" | "signup";

type Props = {
  mode: AuthMode;
};

type ApiErrorBody = {
  message?: string;
  error?: {
    code?: string;
    details?: unknown;
  };
};

const inputClassName =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10";

const getErrorMessage = (payload: ApiErrorBody | undefined, fallback: string) => {
  const message = payload?.message || fallback;
  return message;
};

export function AuthForm({ mode }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState(mode === "signin" ? "admin@assetflow.local" : "");
  const [password, setPassword] = useState(mode === "signin" ? "Admin1234!" : "");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSignup = mode === "signup";
  const submitLabel = isSignup ? "Create account" : "Log in";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (isSignup && password !== confirmPassword) {
      setLoading(false);
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await apiFetch(isSignup ? "/api/auth/register" : "/api/auth/login", {
        method: "POST",
        body: JSON.stringify(
          isSignup
            ? {
                name,
                email,
                department,
                password,
              }
            : {
                email,
                password,
              }
        ),
      });

      let payload: ApiErrorBody & {
        data?: { verificationRequired?: boolean; user?: { email?: string } };
      } = {};

      try {
        payload = (await response.json()) as ApiErrorBody & {
          data?: { verificationRequired?: boolean; user?: { email?: string } };
        };
      } catch {
        payload = {};
      }

      if (!response.ok || !payload?.message) {
        if (!response.ok && response.status === 502) {
          throw new Error("Authentication service is unavailable. Check that the backend is running and the API URL is correct.");
        }

        throw new Error(getErrorMessage(payload, "Authentication failed"));
      }

      if (isSignup && payload.data?.verificationRequired) {
        router.push(`/auth/verify-email?email=${encodeURIComponent(email)}&sent=1`);
      } else {
        router.push("/dashboard");
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {isSignup ? (
        <>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Name</span>
            <input
              className={inputClassName}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Avery Johnson"
              autoComplete="name"
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Work Email</span>
            <input
              className={inputClassName}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
              autoComplete="email"
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Department</span>
            <input
              className={inputClassName}
              value={department}
              onChange={(event) => setDepartment(event.target.value)}
              placeholder="Operations"
              autoComplete="organization"
              required
            />
          </label>
        </>
      ) : (
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
          <input
            className={inputClassName}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
            autoComplete="email"
            required
          />
        </label>
      )}

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
        <input
          className={inputClassName}
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder={isSignup ? "Create a password" : "Enter your password"}
          autoComplete={isSignup ? "new-password" : "current-password"}
          minLength={8}
          required
        />
      </label>

      {isSignup ? (
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Confirm Password</span>
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
      ) : null}

      {isSignup ? (
        <p className="rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
          Signup creates an Employee account. Admins assign roles later from Organization → Employees.
        </p>
      ) : null}

      {error ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      ) : null}

      <button
        className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-3 font-semibold text-white shadow-[0_12px_30px_rgba(79,70,229,0.28)] transition hover:from-indigo-500 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
        disabled={loading}
      >
        {loading ? "Working..." : submitLabel}
      </button>
    </form>
  );
}
