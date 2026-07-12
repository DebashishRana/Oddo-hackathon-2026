"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type AuthMode = "signin" | "signup";

type Props = {
  mode: AuthMode;
};

type ApiErrorBody = {
  message?: string;
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
            ? { name, email, department, password }
            : { email, password }
        ),
      });

      let payload: ApiErrorBody & { data?: { verificationRequired?: boolean } } = {};
      try {
        payload = (await response.json()) as ApiErrorBody & { data?: { verificationRequired?: boolean } };
      } catch {
        payload = {};
      }

      if (!response.ok || !payload?.message) {
        if (!response.ok && response.status === 502) {
          throw new Error("Authentication service unavailable. Start the backend on port 4000.");
        }
        throw new Error(payload?.message || "Authentication failed");
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
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Avery Johnson" autoComplete="name" required />
          </label>
          <label className="block">
            <Label>Work email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" autoComplete="email" required />
          </label>
          <label className="block">
            <Label>Department</Label>
            <Input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Operations" autoComplete="organization" required />
          </label>
        </>
      ) : (
        <label className="block">
          <Label>Email</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" autoComplete="email" required />
        </label>
      )}

      <label className="block">
        <Label>Password</Label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={isSignup ? "Create a password" : "Enter your password"}
          autoComplete={isSignup ? "new-password" : "current-password"}
          minLength={8}
          required
        />
      </label>

      {isSignup ? (
        <label className="block">
          <Label>Confirm password</Label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </label>
      ) : null}

      {isSignup ? (
        <p className="rounded-xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm text-teal-800">
          Signup creates an Employee account. Admins assign roles later from Organization → Employees.
        </p>
      ) : null}

      {error ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>
      ) : null}

      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? "Working..." : isSignup ? "Create account" : "Log in"}
      </Button>
    </form>
  );
}
