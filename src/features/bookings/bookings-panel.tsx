"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "@/lib/api";
import { AssetSelect } from "@/components/entity-selects";

type Booking = {
  id: number;
  assetId: number;
  assetName?: string;
  bookedByName?: string;
  status: string;
  startsAt: string;
  endsAt: string;
  purpose: string | null;
  createdAt: string;
};

const inputCls =
  "w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-950 outline-none transition focus:border-[#1677ff] focus:ring-4 focus:ring-[#1677ff]/10";
const btnPrimary =
  "rounded-full bg-[#1677ff] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0b63db] disabled:opacity-60";
const btnSecondary =
  "rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100";
const btnDanger =
  "rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-60";

const statusColors: Record<string, string> = {
  upcoming: "bg-blue-50 text-blue-700",
  ongoing: "bg-emerald-50 text-emerald-700",
  completed: "bg-neutral-100 text-neutral-600",
  cancelled: "bg-rose-50 text-rose-500",
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

export function BookingsPanel() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Create form
  const [assetId, setAssetId] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [purpose, setPurpose] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Reschedule
  const [rescheduleTarget, setRescheduleTarget] = useState<number | null>(null);
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");
  const [rescheduleSaving, setRescheduleSaving] = useState(false);

  // Filter
  const [filterStatus, setFilterStatus] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.set("status", filterStatus);
      const r = await apiFetch(`/api/bookings${params.toString() ? `?${params}` : ""}`);
      const p = await r.json();
      setBookings(p?.data?.bookings ?? []);
    } catch {
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => { load(); }, [load]);

  async function handleCreate() {
    if (!assetId) { setFormError("A bookable asset is required"); return; }
    if (!startsAt || !endsAt) { setFormError("Start and end time are required"); return; }
    setSaving(true); setFormError(null);
    try {
      const body = {
        assetId: Number(assetId),
        startsAt,
        endsAt,
        purpose: purpose.trim() || null,
      };
      const r = await apiFetch("/api/bookings", { method: "POST", body: JSON.stringify(body) });
      const p = await r.json();
      if (!r.ok) throw new Error(p?.message || "Booking failed");
      setSuccess("Booking created.");
      setShowForm(false);
      setAssetId(""); setStartsAt(""); setEndsAt(""); setPurpose("");
      await load();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleCancel(id: number) {
    try {
      const r = await apiFetch(`/api/bookings/${id}/cancel`, { method: "PATCH", body: JSON.stringify({}) });
      const p = await r.json();
      if (!r.ok) throw new Error(p?.message || "Cancel failed");
      setSuccess("Booking cancelled.");
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Cancel failed");
    }
  }

  async function handleReschedule(id: number) {
    if (!newStart || !newEnd) return;
    setRescheduleSaving(true);
    try {
      const r = await apiFetch(`/api/bookings/${id}/reschedule`, {
        method: "PATCH",
        body: JSON.stringify({ startsAt: newStart, endsAt: newEnd }),
      });
      const p = await r.json();
      if (!r.ok) throw new Error(p?.message || "Reschedule failed");
      setSuccess("Booking rescheduled.");
      setRescheduleTarget(null); setNewStart(""); setNewEnd("");
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Reschedule failed");
    } finally {
      setRescheduleSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-neutral-500">Shared resource scheduling</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-neutral-950">Bookings</h1>
      </div>

      {success && <SuccessMsg msg={success} />}
      {error && <ErrorMsg msg={error} />}

      <section className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <select className={`${inputCls} max-w-[180px]`} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All Statuses</option>
            {Object.keys(statusColors).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button className={btnPrimary} onClick={() => { setShowForm((v) => !v); setFormError(null); }}>
            {showForm ? "Cancel" : "+ New Booking"}
          </button>
        </div>

        {showForm && (
          <div className="mt-5 rounded-[24px] border border-neutral-200 bg-neutral-50 p-5 space-y-3">
            <h3 className="font-semibold text-neutral-800">Create Booking</h3>
            {formError && <ErrorMsg msg={formError} />}
            <div className="grid gap-3 sm:grid-cols-2">
              <AssetSelect className={inputCls} value={assetId} onChange={setAssetId} bookableOnly placeholder="Select bookable asset *" />
              <input className={inputCls} placeholder="Purpose (optional)" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Starts At *</label>
                <input className={inputCls} type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Ends At *</label>
                <input className={inputCls} type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} />
              </div>
            </div>
            <div className="flex gap-3">
              <button className={btnPrimary} onClick={handleCreate} disabled={saving}>{saving ? "Saving…" : "Book"}</button>
              <button className={btnSecondary} onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        )}
      </section>

      <section className="rounded-[28px] border border-neutral-200 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
        {loading ? (
          <div className="p-6 space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-[20px] bg-neutral-100" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-neutral-50 text-xs uppercase tracking-[0.18em] text-neutral-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Asset</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Starts</th>
                  <th className="px-4 py-3 font-semibold">Ends</th>
                  <th className="px-4 py-3 font-semibold">Purpose</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-neutral-400">No bookings yet</td></tr>
                ) : bookings.map((b) => (
                  <>
                    <tr key={b.id} className="border-t border-neutral-100">
                      <td className="px-4 py-3 text-sm font-medium text-neutral-950">{b.assetName ?? `Asset #${b.assetId}`}</td>
                      <td className="px-4 py-3">
                        <Badge label={b.status} color={statusColors[b.status] ?? "bg-neutral-100 text-neutral-600"} />
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-600">{new Date(b.startsAt).toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-neutral-600">{new Date(b.endsAt).toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-neutral-500">{b.purpose ?? "—"}</td>
                      <td className="px-4 py-3">
                        {(b.status === "upcoming" || b.status === "ongoing") && (
                          <div className="flex gap-2">
                            <button
                              className={btnSecondary}
                              style={{ padding: "4px 10px", fontSize: "12px" }}
                              onClick={() => {
                                if (rescheduleTarget === b.id) {
                                  setRescheduleTarget(null);
                                } else {
                                  setRescheduleTarget(b.id);
                                  setNewStart(b.startsAt.slice(0, 16));
                                  setNewEnd(b.endsAt.slice(0, 16));
                                }
                              }}
                            >
                              {rescheduleTarget === b.id ? "Close" : "Reschedule"}
                            </button>
                            <button
                              className={btnDanger}
                              style={{ padding: "4px 10px", fontSize: "12px" }}
                              onClick={() => handleCancel(b.id)}
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                    {rescheduleTarget === b.id && (
                      <tr key={`rs-${b.id}`} className="border-t border-neutral-100 bg-neutral-50">
                        <td colSpan={6} className="px-4 py-3">
                          <div className="flex flex-wrap items-end gap-3">
                            <div>
                              <label className="mb-1 block text-xs font-medium text-neutral-500">New Start</label>
                              <input className={inputCls} type="datetime-local" value={newStart} onChange={(e) => setNewStart(e.target.value)} />
                            </div>
                            <div>
                              <label className="mb-1 block text-xs font-medium text-neutral-500">New End</label>
                              <input className={inputCls} type="datetime-local" value={newEnd} onChange={(e) => setNewEnd(e.target.value)} />
                            </div>
                            <button
                              className={btnPrimary}
                              onClick={() => handleReschedule(b.id)}
                              disabled={rescheduleSaving}
                            >
                              {rescheduleSaving ? "Saving…" : "Confirm Reschedule"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
