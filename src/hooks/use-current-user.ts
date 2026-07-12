"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export type CurrentUser = {
  id: number;
  email: string;
  name: string | null;
  role: string;
  department?: string | null;
  departmentId?: number | null;
};

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    apiFetch("/api/auth/me")
      .then((r) => r.json())
      .then((p) => {
        if (!active) return;
        setUser(p?.data?.user ?? null);
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const role = user?.role || "employee";
  const canManageAssets = ["admin", "asset_manager"].includes(role);
  const canApprove = ["admin", "asset_manager", "department_head"].includes(role);
  const isAdmin = role === "admin";

  return { user, loading, role, canManageAssets, canApprove, isAdmin };
}
