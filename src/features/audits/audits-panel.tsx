"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "@/lib/api";

type AuditCycle = {
  id: number;
  name: string;
  status: string;
  departmentId: number | null;
  location: string | null;
  startsOn: string;
  endsOn: string;
  createdAt: string;
  discrepancyCount?: number;
  verifiedCount?: number;
  missingCount?: number;
  damagedCount?: number;
};

const inputCls =
  "w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-950 outline-none transition focus:border-[#1677ff] focus:ring-4 focus:ring-[#1677ff]/10";
const btnPrimary =
  "rounded-full bg-[#1677ff] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0b63db] disabled:opacity-60";
const btnSecondary =
  "rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100";

const statusColors: Record<string, string> = {
  open: "bg-blue-50 text-blue-700",
  in_progress: "bg-amber-50 text-amber-700",
  closed: "bg-neutral-100 text-neutral-600",
};

function Badge({ label, color }: { label: string; color: string }) {
  return <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${color}`}>{label}</span>;
}

function ErrorMsg({ msg }: { msg: string }) {
  return <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{msg}</p>;
}

function SuccessMsg({ msg }: { msg: string }) {
  return <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{msg}</p>;
}

export function AuditsPanel() {
  const [cycles, setCycles] = useState<AuditCycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // create form
  const [name, setName] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [location, setLocation] = useState("");
  const [startsOn, setStartsOn] = useState("");
  const [endsOn, setEndsOn] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // mark item form
  const [markCycleId, setMarkCycleId] = useState<number | null>(null);
  const [markAssetId, setMarkAssetId] = useState("");
  const [markResult, setMarkResult] = useState<"verified" | "missing" | "damaged">("verified");
  const [markNotes, setMarkNotes] = useState("");
  const [markSaving, setMarkSaving] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await apiFetch("/api/audits");
      const p = await r.json();
      setCycles(p?.data?.cycles ?? []);
    } catch {
      setError("Failed to load audit cycles");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleCreate() {
    if (!name.trim()) { setFormError("Name is required"); return; }
    if (!startsOn || !endsOn) { setFormError("Start and end dates are required"); return; }
    setSaving(true); setFormError(null);
    try {
      const body = {
        name: name.trim(),
        departmentId: departmentId ? Number(departmentId) : null,
        location: location.trim() || null,
        startsOn,
        endsOn,
        auditorIds: [],
      };
      const r = await apiFetch("/api/audits", { method: "POST", body: JSON.stringify(body) });
      const p = await r.json();
      if (!r.ok) throw new Error(p?.message || "Create failed");
      setSuccess("Audit cycle created.");
      setShowForm(false);
      setName(""); setDepartmentId(""); setLocation(""); setStartsOn(""); setEndsOn("");
      await load();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Create failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleMarkItem(cycleId: number) {
    if (!markAssetId) return;
    setMarkSaving(true);
    try {
      const r = await apiFetch(`/api/audits/${cycleId}/items/${markAssetId}/mark`, {
        method: "POST",
        body: JSON.stringify({ result: markResult, notes: markNotes.trim() || null }),
      });
      const p = await r.json();
      if (!r.ok) throw new Error(p?.message || "Mark failed");
      setSuccess(`Asset marked as ${markResult}.`);
      setMarkCycleId(null); setMarkAssetId(""); setMarkNotes("");
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Mark failed");
    } finally {
      setMarkSaving(false);
    }
  }

  async function handleClose(id: number) {
    setActionLoading(true);
    try {
      const r = await apiFetch(`/api/audits/${id}/close`, { method: "POST", body: JSON.stringify({}) });
      const p = await r.json();
      if (!r.ok) throw new Error(p?.message || "Close failed");
      setSuccess("Audit cycle closed.");
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Close failed");
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-neutral-500">Asset verification</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-neutral-950">Audits</h1>
      </div>

      {success && <SuccessMsg msg={success} />}
      {error && <ErrorMsg msg={error} />}

      <section className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-950">Audit Cycles</h2>
          <button className={btnPrimary} onClick={() => { setShowForm((v) => !v); setFormError(null); }}>
            {showForm ? "Cancel" : "+ New Cycle"}
          </button>
        </div>

        {showForm && (
          <div className="mt-5 rounded-[24px] border border-neutral-200 bg-neutral-50 p-5 space-y-3">
            <h3 className="font-semibold text-neutral-800">Create Audit Cycle</h3>
            {formError && <ErrorMsg msg={formError} />}
            <div className="grid gap-3 sm:grid-cols-2">
              <input className={inputCls} placeholder="Cycle name *" value={name} onChange={(e) => setName(e.target.value)} />
              <input className={inputCls} placeholder="Location (optional)" value={location} onChange={(e) => setLocation(e.target.value)} />
              <input className={inputCls} placeholder="Department ID (optional)" type="number" value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} />
              <div />
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Starts On *</label>
                <input className={inputCls} type="date" value={startsOn} onChange={(e) => setStartsOn(e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Ends On *</label>
                <input className={inputCls} type="date" value={endsOn} onChange={(e) => setEndsOn(e.target.value)} />
              </div>
            </div>
            <div className="flex gap-3">
              <button className={btnPrimary} onClick={handleCreate} disabled={saving}>{saving ? "Saving…" : "Create"}</button>
              <button className={btnSecondary} onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        )}
      </section>

      <section className="rounded-[28px] border border-neutral-200 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
        {loading ? (
          <div className="p-6 space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-[20px] bg-neutral-100" />
            ))}
          </div>
        ) : cycles.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-neutral-400">No audit cycles yet</p>
        ) : (
          <div className="space-y-0">
            {cycles.map((cycle) => (
              <div key={cycle.id} className="border-b border-neutral-100 px-6 py-5 last:border-0">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-neutral-950">{cycle.name}</p>
                      <Badge label={cycle.status.replace(/_/g, " ")} color={statusColors[cycle.status] ?? "bg-neutral-100 text-neutral-600"} />
                    </div>
                    <p className="mt-1 text-sm text-neutral-500">
                      {new Date(cycle.startsOn).toLocaleDateString()} — {new Date(cycle.endsOn).toLocaleDateString()}
                      {cycle.location ? ` · ${cycle.location}` : ""}
                    </p>
                    {cycle.verifiedCount !== undefined && (
                      <div className="mt-2 flex flex-wrap gap-3 text-xs">
                        <span className="text-emerald-600">{cycle.verifiedCount ?? 0} verified</span>
                        <span className="text-rose-600">{cycle.missingCount ?? 0} missing</span>
                        <span className="text-amber-600">{cycle.damagedCount ?? 0} damaged</span>
                        {(cycle.discrepancyCount ?? 0) > 0 && (
                          <span className="font-semibold text-rose-700">{cycle.discrepancyCount} discrepancies</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {cycle.status !== "closed" && (
                      <>
                        <button
                          className={btnSecondary}
                          style={{ padding: "6px 14px", fontSize: "12px" }}
                          onClick={() => setMarkCycleId(markCycleId === cycle.id ? null : cycle.id)}
                        >
                          {markCycleId === cycle.id ? "Close" : "Mark Item"}
                        </button>
                        <button
                          className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 disabled:opacity-60"
                          onClick={() => handleClose(cycle.id)}
                          disabled={actionLoading}
                        >
                          Close Cycle
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {markCycleId === cycle.id && (
                  <div className="mt-3 flex flex-wrap items-end gap-3 rounded-[20px] border border-neutral-200 bg-neutral-50 p-4">
                    <div className="flex-1 min-w-[120px]">
                      <label className="mb-1 block text-xs font-medium text-neutral-500">Asset ID</label>
                      <input className={inputCls} type="number" placeholder="Asset ID" value={markAssetId} onChange={(e) => setMarkAssetId(e.target.value)} />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-neutral-500">Result</label>
                      <select
                        className={inputCls}
                        value={markResult}
                        onChange={(e) => setMarkResult(e.target.value as "verified" | "missing" | "damaged")}
                      >
                        <option value="verified">Verified</option>
                        <option value="missing">Missing</option>
                        <option value="damaged">Damaged</option>
                      </select>
                    </div>
                    <div className="flex-1 min-w-[120px]">
                      <label className="mb-1 block text-xs font-medium text-neutral-500">Notes</label>
                      <input className={inputCls} placeholder="Notes (optional)" value={markNotes} onChange={(e) => setMarkNotes(e.target.value)} />
                    </div>
                    <button className={btnPrimary} style={{ padding: "10px 14px", fontSize: "12px" }} onClick={() => handleMarkItem(cycle.id)} disabled={markSaving}>
                      {markSaving ? "…" : "Mark"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
