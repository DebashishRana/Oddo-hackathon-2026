"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "@/lib/api";

type MaintenanceRequest = {
  id: number;
  assetId: number;
  assetName?: string;
  requestedByName?: string;
  description: string;
  priority: string;
  status: string;
  technicianName: string | null;
  rejectionReason: string | null;
  createdAt: string;
};

const inputCls =
  "w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-950 outline-none transition focus:border-[#1677ff] focus:ring-4 focus:ring-[#1677ff]/10";
const btnPrimary =
  "rounded-full bg-[#1677ff] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0b63db] disabled:opacity-60";
const btnSecondary =
  "rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100";

const statusColors: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  approved: "bg-blue-50 text-blue-700",
  rejected: "bg-rose-50 text-rose-700",
  assigned: "bg-indigo-50 text-indigo-700",
  in_progress: "bg-cyan-50 text-cyan-700",
  resolved: "bg-emerald-50 text-emerald-700",
};

const priorityColors: Record<string, string> = {
  low: "bg-neutral-100 text-neutral-500",
  medium: "bg-amber-50 text-amber-600",
  high: "bg-rose-50 text-rose-600",
  critical: "bg-rose-100 text-rose-800",
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

export function MaintenancePanel() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // form state
  const [assetId, setAssetId] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // assign technician
  const [assignTarget, setAssignTarget] = useState<number | null>(null);
  const [techName, setTechName] = useState("");

  // reject reason
  const [rejectTarget, setRejectTarget] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const [actionLoading, setActionLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await apiFetch("/api/maintenance");
      const p = await r.json();
      setRequests(p?.data?.requests ?? []);
    } catch {
      setError("Failed to load maintenance requests");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleCreate() {
    if (!assetId) { setFormError("Asset ID is required"); return; }
    if (!description.trim()) { setFormError("Description is required"); return; }
    setSaving(true); setFormError(null);
    try {
      const body = { assetId: Number(assetId), description: description.trim(), priority };
      const r = await apiFetch("/api/maintenance", { method: "POST", body: JSON.stringify(body) });
      const p = await r.json();
      if (!r.ok) throw new Error(p?.message || "Create failed");
      setSuccess("Maintenance request raised.");
      setShowForm(false);
      setAssetId(""); setDescription(""); setPriority("medium");
      await load();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Create failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleAction(id: number, action: "approve" | "reject" | "start" | "resolve", extra?: object) {
    setActionLoading(true);
    try {
      const r = await apiFetch(`/api/maintenance/${id}/${action}`, {
        method: "POST",
        body: JSON.stringify(extra ?? {}),
      });
      const p = await r.json();
      if (!r.ok) throw new Error(p?.message || "Action failed");
      setSuccess(`Request ${action}d.`);
      setAssignTarget(null); setRejectTarget(null);
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleAssign(id: number) {
    if (!techName.trim()) return;
    setActionLoading(true);
    try {
      const r = await apiFetch(`/api/maintenance/${id}/assign`, {
        method: "POST",
        body: JSON.stringify({ technicianName: techName.trim() }),
      });
      const p = await r.json();
      if (!r.ok) throw new Error(p?.message || "Assign failed");
      setSuccess("Technician assigned.");
      setAssignTarget(null); setTechName("");
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Assign failed");
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-neutral-500">Maintenance workflows</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-neutral-950">Maintenance</h1>
      </div>

      {success && <SuccessMsg msg={success} />}
      {error && <ErrorMsg msg={error} />}

      <section className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-950">Maintenance Requests</h2>
          <button className={btnPrimary} onClick={() => { setShowForm((v) => !v); setFormError(null); }}>
            {showForm ? "Cancel" : "+ Raise Request"}
          </button>
        </div>

        {showForm && (
          <div className="mt-5 rounded-[24px] border border-neutral-200 bg-neutral-50 p-5 space-y-3">
            <h3 className="font-semibold text-neutral-800">Raise Maintenance Request</h3>
            {formError && <ErrorMsg msg={formError} />}
            <div className="grid gap-3 sm:grid-cols-2">
              <input className={inputCls} placeholder="Asset ID *" type="number" value={assetId} onChange={(e) => setAssetId(e.target.value)} />
              <select className={inputCls} value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <textarea
              className={`${inputCls} min-h-[80px] resize-none`}
              placeholder="Description *"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex gap-3">
              <button className={btnPrimary} onClick={handleCreate} disabled={saving}>{saving ? "Saving…" : "Submit"}</button>
              <button className={btnSecondary} onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        )}
      </section>

      <section className="rounded-[28px] border border-neutral-200 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
        {loading ? (
          <div className="p-6 space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-[20px] bg-neutral-100" />
            ))}
          </div>
        ) : (
          <div className="space-y-0">
            {requests.length === 0 ? (
              <p className="px-6 py-10 text-center text-sm text-neutral-400">No maintenance requests</p>
            ) : requests.map((req) => (
              <div key={req.id} className="border-b border-neutral-100 px-6 py-4 last:border-0">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-neutral-950">{req.assetName ?? `Asset #${req.assetId}`}</p>
                      <Badge label={req.status.replace(/_/g, " ")} color={statusColors[req.status] ?? "bg-neutral-100 text-neutral-600"} />
                      <Badge label={req.priority} color={priorityColors[req.priority] ?? "bg-neutral-100 text-neutral-500"} />
                    </div>
                    <p className="mt-1 text-sm text-neutral-600">{req.description}</p>
                    {req.technicianName && (
                      <p className="mt-1 text-xs text-neutral-500">Technician: {req.technicianName}</p>
                    )}
                    {req.rejectionReason && (
                      <p className="mt-1 text-xs text-rose-600">Rejected: {req.rejectionReason}</p>
                    )}
                    <p className="mt-1 text-xs text-neutral-400">{new Date(req.createdAt).toLocaleDateString()}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {req.status === "pending" && (
                      <>
                        <button
                          className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-600 disabled:opacity-60"
                          onClick={() => handleAction(req.id, "approve")}
                          disabled={actionLoading}
                        >
                          Approve
                        </button>
                        <button
                          className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                          onClick={() => setRejectTarget(req.id)}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {req.status === "approved" && (
                      <button
                        className="rounded-full bg-indigo-500 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-600 disabled:opacity-60"
                        onClick={() => setAssignTarget(req.id)}
                        disabled={actionLoading}
                      >
                        Assign
                      </button>
                    )}
                    {req.status === "assigned" && (
                      <button
                        className="rounded-full bg-cyan-500 px-3 py-1 text-xs font-semibold text-white hover:bg-cyan-600 disabled:opacity-60"
                        onClick={() => handleAction(req.id, "start")}
                        disabled={actionLoading}
                      >
                        Start
                      </button>
                    )}
                    {req.status === "in_progress" && (
                      <button
                        className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                        onClick={() => handleAction(req.id, "resolve")}
                        disabled={actionLoading}
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>

                {assignTarget === req.id && (
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      className="rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none flex-1 max-w-xs"
                      placeholder="Technician name"
                      value={techName}
                      onChange={(e) => setTechName(e.target.value)}
                    />
                    <button className={btnPrimary} style={{ padding: "6px 14px", fontSize: "12px" }} onClick={() => handleAssign(req.id)} disabled={actionLoading}>
                      Assign
                    </button>
                    <button className={btnSecondary} style={{ padding: "6px 10px", fontSize: "12px" }} onClick={() => setAssignTarget(null)}>✕</button>
                  </div>
                )}

                {rejectTarget === req.id && (
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      className="rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none flex-1 max-w-xs"
                      placeholder="Rejection reason"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    />
                    <button
                      className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-60"
                      onClick={() => handleAction(req.id, "reject", { rejectionReason: rejectReason })}
                      disabled={actionLoading}
                    >
                      Confirm Reject
                    </button>
                    <button className={btnSecondary} style={{ padding: "4px 10px", fontSize: "12px" }} onClick={() => setRejectTarget(null)}>✕</button>
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
