"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { clearDemoSessionCookie } from "@/lib/demo-auth";

export function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await apiFetch("/api/auth/logout", { method: "POST" }).catch(() => null);
      document.cookie = clearDemoSessionCookie();
      router.push("/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700 transition hover:bg-neutral-50 hover:text-neutral-950 disabled:opacity-60"
      onClick={handleSignOut}
      disabled={loading}
      type="button"
    >
      {loading ? "Signing out..." : "Sign out"}
    </button>
  );
}
