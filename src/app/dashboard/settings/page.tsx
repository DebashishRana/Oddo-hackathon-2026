"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type UserProfile = {
  id: number;
  name: string | null;
  email: string;
  department: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
};

const inputCls =
  "w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-950 outline-none transition focus:border-[#1677ff] focus:ring-4 focus:ring-[#1677ff]/10";
const btnPrimary =
  "rounded-full bg-[#1677ff] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0b63db] disabled:opacity-60";

function ErrorMsg({ msg }: { msg: string }) {
  return <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{msg}</p>;
}

function SuccessMsg({ msg }: { msg: string }) {
  return <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{msg}</p>;
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch("/api/users/me")
      .then((r) => r.json())
      .then((p) => {
        const user = p?.data?.user;
        if (user) {
          setProfile(user);
          setName(user.name ?? "");
          setDepartment(user.department ?? "");
        }
      })
      .catch(() => setError("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true); setSaveError(null);
    try {
      const r = await apiFetch("/api/users/me", {
        method: "PATCH",
        body: JSON.stringify({ name: name.trim() || null, department: department.trim() || null }),
      });
      const p = await r.json();
      if (!r.ok) throw new Error(p?.message || "Update failed");
      setProfile((prev) => prev ? { ...prev, name: p.data?.user?.name ?? name, department: p.data?.user?.department ?? department } : prev);
      setSuccess("Profile updated.");
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  }

  const systemInfo = [
    { label: "Brand name", value: "AssetFlow" },
    { label: "Session policy", value: "JWT cookie" },
    { label: "Database", value: "Postgres" },
    { label: "API backend", value: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-neutral-500">Account</p>
        <h1 className="font-display text-3xl font-semibold">Settings</h1>
      </div>

      {success && <SuccessMsg msg={success} />}

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
          <h2 className="text-lg font-semibold text-neutral-950">Profile</h2>

          {loading ? (
            <div className="mt-5 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-12 animate-pulse rounded-[20px] bg-neutral-100" />
              ))}
            </div>
          ) : error ? (
            <div className="mt-4"><ErrorMsg msg={error} /></div>
          ) : profile ? (
            <div className="mt-5 space-y-4">
              <div>
                <p className="mb-1 text-xs font-medium text-neutral-500">Email</p>
                <p className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">{profile.email}</p>
              </div>
              <div>
                <p className="mb-1 text-xs font-medium text-neutral-500">Role</p>
                <p className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 capitalize">{profile.role.replace(/_/g, " ")}</p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Display Name</label>
                <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Department</label>
                <input className={inputCls} value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Your department" />
              </div>
              {saveError && <ErrorMsg msg={saveError} />}
              <button className={btnPrimary} onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          ) : null}
        </section>

        <section className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
          <h2 className="text-lg font-semibold text-neutral-950">System</h2>
          <div className="mt-5 space-y-3">
            {systemInfo.map((item) => (
              <div key={item.label} className="rounded-[22px] border border-neutral-200 bg-neutral-50 px-4 py-4">
                <p className="text-xs text-neutral-500">{item.label}</p>
                <p className="mt-1 text-sm font-medium text-neutral-900">{item.value}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
