"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "@/lib/api";

type Allocation = {
  id: number;
  assetId: number;
  assetName?: string;
  allocatedToUserId: number | null;
  allocatedToDepartmentId: number | null;
  allocatedByName?: string;
  status: string;
  expectedReturnDate: string | null;
  returnedAt: string | null;
  createdAt: string;
};

type Transfer = {
  id: number;
  assetId: number;
  assetName?: string;
  requestedByName?: string;
  status: string;
  notes: string | null;
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
  active: "bg-blue-50 text-blue-700",
  returned: "bg-emerald-50 text-emerald-700",
  overdue: "bg-rose-50 text-rose-700",
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

type TabKey = "allocations" | "overdue" | "transfers";

export function AllocationsPanel() {
  const [tab, setTab] = useState<TabKey>("allocations");

  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [overdue, setOverdue] = useState<Allocation[]>([]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Allocate form
  const [showAllocForm, setShowAllocForm] = useState(false);
  const [allocAssetId, setAllocAssetId] = useState("");
  const [allocUserId, setAllocUserId] = useState("");
  const [allocDeptId, setAllocDeptId] = useState("");
  const [allocReturnDate, setAllocReturnDate] = useState("");
  const [allocSaving, setAllocSaving] = useState(false);
  const [allocError, setAllocError] = useState<string | null>(null);

  // Return form
  const [returnTarget, setReturnTarget] = useState<number | null>(null);
  const [returnNotes, setReturnNotes] = useState("");
  const [returnSaving, setReturnSaving] = useState(false);

  // Transfer form
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [txAssetId, setTxAssetId] = useState("");
  const [txToUserId, setTxToUserId] = useState("");
  const [txToDeptId, setTxToDeptId] = useState("");
  const [txNotes, setTxNotes] = useState("");
  const [txSaving, setTxSaving] = useState(false);
  const [txError, setTxError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [allocRes, overdueRes, txRes] = await Promise.all([
        apiFetch("/api/allocations"),
        apiFetch("/api/allocations/overdue"),
        apiFetch("/api/transfers"),
      ]);
      const aP = await allocRes.json();
      const oP = await overdueRes.json();
      const tP = await txRes.json();
      setAllocations(aP?.data?.allocations ?? []);
      setOverdue(oP?.data?.allocations ?? []);
      setTransfers(tP?.data?.transfers ?? []);
    } catch {
      setError("Failed to load allocations");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleAllocate() {
    if (!allocAssetId) { setAllocError("Asset ID is required"); return; }
    if (!allocUserId && !allocDeptId) { setAllocError("User ID or Department ID is required"); return; }
    setAllocSaving(true); setAllocError(null);
    try {
      const body = {
        assetId: Number(allocAssetId),
        allocatedToUserId: allocUserId ? Number(allocUserId) : null,
        allocatedToDepartmentId: allocDeptId ? Number(allocDeptId) : null,
        expectedReturnDate: allocReturnDate || null,
      };
      const r = await apiFetch("/api/allocations", { method: "POST", body: JSON.stringify(body) });
      const p = await r.json();
      if (!r.ok) throw new Error(p?.message || "Allocation failed");
      setSuccess("Asset allocated.");
      setShowAllocForm(false);
      setAllocAssetId(""); setAllocUserId(""); setAllocDeptId(""); setAllocReturnDate("");
      await load();
    } catch (err: unknown) {
      setAllocError(err instanceof Error ? err.message : "Allocation failed");
    } finally {
      setAllocSaving(false);
    }
  }

  async function handleReturn(id: number) {
    setReturnSaving(true);
    try {
      const r = await apiFetch(`/api/allocations/${id}/return`, {
        method: "POST",
        body: JSON.stringify({ notes: returnNotes || null }),
      });
      const p = await r.json();
      if (!r.ok) throw new Error(p?.message || "Return failed");
      setSuccess("Asset returned.");
      setReturnTarget(null); setReturnNotes("");
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Return failed");
    } finally {
      setReturnSaving(false);
    }
  }

  async function handleTransferRequest() {
    if (!txAssetId) { setTxError("Asset ID is required"); return; }
    setTxSaving(true); setTxError(null);
    try {
      const body = {
        assetId: Number(txAssetId),
        toUserId: txToUserId ? Number(txToUserId) : null,
        toDepartmentId: txToDeptId ? Number(txToDeptId) : null,
        notes: txNotes.trim() || null,
      };
      const r = await apiFetch("/api/transfers", { method: "POST", body: JSON.stringify(body) });
      const p = await r.json();
      if (!r.ok) throw new Error(p?.message || "Request failed");
      setSuccess("Transfer requested.");
      setShowTransferForm(false);
      setTxAssetId(""); setTxToUserId(""); setTxToDeptId(""); setTxNotes("");
      await load();
    } catch (err: unknown) {
      setTxError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setTxSaving(false);
    }
  }

  async function handleTransferAction(id: number, action: "approve" | "reject") {
    try {
      const r = await apiFetch(`/api/transfers/${id}/${action}`, { method: "POST", body: JSON.stringify({}) });
      const p = await r.json();
      if (!r.ok) throw new Error(p?.message || "Action failed");
      setSuccess(`Transfer ${action}d.`);
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Action failed");
    }
  }

  const tabs: { key: TabKey; label: string }[] = [
    { key: "allocations", label: "Allocations" },
    { key: "overdue", label: `Overdue${overdue.length ? ` (${overdue.length})` : ""}` },
    { key: "transfers", label: "Transfers" },
  ];

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-neutral-500">Asset assignment</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-neutral-950">Allocations</h1>
      </div>

      {success && <SuccessMsg msg={success} />}
      {error && <ErrorMsg msg={error} />}

      <section className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  tab === t.key ? "bg-[#1677ff] text-white" : "border border-neutral-200 text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button className={btnPrimary} onClick={() => setShowAllocForm((v) => !v)}>
              {showAllocForm ? "Cancel" : "+ Allocate"}
            </button>
            <button className={btnSecondary} onClick={() => setShowTransferForm((v) => !v)}>
              {showTransferForm ? "Cancel" : "Request Transfer"}
            </button>
          </div>
        </div>

        {showAllocForm && (
          <div className="mt-5 rounded-[24px] border border-neutral-200 bg-neutral-50 p-5 space-y-3">
            <h3 className="font-semibold text-neutral-800">Allocate Asset</h3>
            {allocError && <ErrorMsg msg={allocError} />}
            <div className="grid gap-3 sm:grid-cols-2">
              <input className={inputCls} placeholder="Asset ID *" type="number" value={allocAssetId} onChange={(e) => setAllocAssetId(e.target.value)} />
              <input className={inputCls} placeholder="User ID (or leave blank)" type="number" value={allocUserId} onChange={(e) => setAllocUserId(e.target.value)} />
              <input className={inputCls} placeholder="Department ID (or leave blank)" type="number" value={allocDeptId} onChange={(e) => setAllocDeptId(e.target.value)} />
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Expected Return Date</label>
                <input className={inputCls} type="date" value={allocReturnDate} onChange={(e) => setAllocReturnDate(e.target.value)} />
              </div>
            </div>
            <div className="flex gap-3">
              <button className={btnPrimary} onClick={handleAllocate} disabled={allocSaving}>{allocSaving ? "Saving…" : "Allocate"}</button>
              <button className={btnSecondary} onClick={() => setShowAllocForm(false)}>Cancel</button>
            </div>
          </div>
        )}

        {showTransferForm && (
          <div className="mt-5 rounded-[24px] border border-neutral-200 bg-neutral-50 p-5 space-y-3">
            <h3 className="font-semibold text-neutral-800">Request Transfer</h3>
            {txError && <ErrorMsg msg={txError} />}
            <div className="grid gap-3 sm:grid-cols-2">
              <input className={inputCls} placeholder="Asset ID *" type="number" value={txAssetId} onChange={(e) => setTxAssetId(e.target.value)} />
              <input className={inputCls} placeholder="To User ID" type="number" value={txToUserId} onChange={(e) => setTxToUserId(e.target.value)} />
              <input className={inputCls} placeholder="To Department ID" type="number" value={txToDeptId} onChange={(e) => setTxToDeptId(e.target.value)} />
              <input className={inputCls} placeholder="Notes (optional)" value={txNotes} onChange={(e) => setTxNotes(e.target.value)} />
            </div>
            <div className="flex gap-3">
              <button className={btnPrimary} onClick={handleTransferRequest} disabled={txSaving}>{txSaving ? "Saving…" : "Request"}</button>
              <button className={btnSecondary} onClick={() => setShowTransferForm(false)}>Cancel</button>
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
            {/* Allocations */}
            {tab === "allocations" && (
              <table className="w-full text-left">
                <thead className="bg-neutral-50 text-xs uppercase tracking-[0.18em] text-neutral-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Asset</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Expected Return</th>
                    <th className="px-4 py-3 font-semibold">Created</th>
                    <th className="px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allocations.length === 0 ? (
                    <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-neutral-400">No allocations yet</td></tr>
                  ) : allocations.map((a) => (
                    <tr key={a.id} className="border-t border-neutral-100">
                      <td className="px-4 py-3 text-sm font-medium text-neutral-950">{a.assetName ?? `Asset #${a.assetId}`}</td>
                      <td className="px-4 py-3">
                        <Badge label={a.status} color={statusColors[a.status] ?? "bg-neutral-100 text-neutral-600"} />
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-500">
                        {a.expectedReturnDate ? new Date(a.expectedReturnDate).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-500">{new Date(a.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        {a.status === "active" && (
                          returnTarget === a.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                className="rounded-xl border border-neutral-200 px-3 py-1 text-xs outline-none"
                                placeholder="Condition notes…"
                                value={returnNotes}
                                onChange={(e) => setReturnNotes(e.target.value)}
                              />
                              <button className={btnDanger} onClick={() => handleReturn(a.id)} disabled={returnSaving}>
                                {returnSaving ? "…" : "Confirm"}
                              </button>
                              <button className={btnSecondary} onClick={() => setReturnTarget(null)} style={{ padding: "4px 12px" }}>✕</button>
                            </div>
                          ) : (
                            <button className={btnDanger} onClick={() => { setReturnTarget(a.id); setReturnNotes(""); }}>Return</button>
                          )
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Overdue */}
            {tab === "overdue" && (
              <table className="w-full text-left">
                <thead className="bg-neutral-50 text-xs uppercase tracking-[0.18em] text-neutral-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Asset</th>
                    <th className="px-4 py-3 font-semibold">Expected Return</th>
                    <th className="px-4 py-3 font-semibold">Days Overdue</th>
                    <th className="px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {overdue.length === 0 ? (
                    <tr><td colSpan={4} className="px-4 py-10 text-center text-sm text-neutral-400">No overdue allocations</td></tr>
                  ) : overdue.map((a) => {
                    const daysOverdue = a.expectedReturnDate
                      ? Math.floor((Date.now() - new Date(a.expectedReturnDate).getTime()) / 86400000)
                      : 0;
                    return (
                      <tr key={a.id} className="border-t border-neutral-100">
                        <td className="px-4 py-3 text-sm font-medium text-neutral-950">{a.assetName ?? `Asset #${a.assetId}`}</td>
                        <td className="px-4 py-3 text-sm text-rose-600">
                          {a.expectedReturnDate ? new Date(a.expectedReturnDate).toLocaleDateString() : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <Badge label={`${daysOverdue}d overdue`} color="bg-rose-50 text-rose-700" />
                        </td>
                        <td className="px-4 py-3">
                          {returnTarget === a.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                className="rounded-xl border border-neutral-200 px-3 py-1 text-xs outline-none"
                                placeholder="Notes…"
                                value={returnNotes}
                                onChange={(e) => setReturnNotes(e.target.value)}
                              />
                              <button className={btnDanger} onClick={() => handleReturn(a.id)} disabled={returnSaving}>
                                {returnSaving ? "…" : "Confirm"}
                              </button>
                              <button className={btnSecondary} onClick={() => setReturnTarget(null)} style={{ padding: "4px 12px" }}>✕</button>
                            </div>
                          ) : (
                            <button className={btnDanger} onClick={() => { setReturnTarget(a.id); setReturnNotes(""); }}>Return</button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {/* Transfers */}
            {tab === "transfers" && (
              <table className="w-full text-left">
                <thead className="bg-neutral-50 text-xs uppercase tracking-[0.18em] text-neutral-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Asset</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Notes</th>
                    <th className="px-4 py-3 font-semibold">Created</th>
                    <th className="px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transfers.length === 0 ? (
                    <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-neutral-400">No transfer requests</td></tr>
                  ) : transfers.map((t) => (
                    <tr key={t.id} className="border-t border-neutral-100">
                      <td className="px-4 py-3 text-sm font-medium text-neutral-950">{t.assetName ?? `Asset #${t.assetId}`}</td>
                      <td className="px-4 py-3">
                        <Badge
                          label={t.status}
                          color={t.status === "approved" ? "bg-emerald-50 text-emerald-700" : t.status === "rejected" ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"}
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-500">{t.notes ?? "—"}</td>
                      <td className="px-4 py-3 text-sm text-neutral-500">{new Date(t.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        {t.status === "requested" && (
                          <div className="flex gap-2">
                            <button className={btnPrimary} style={{ padding: "4px 12px", fontSize: "12px" }} onClick={() => handleTransferAction(t.id, "approve")}>
                              Approve
                            </button>
                            <button className={btnDanger} style={{ padding: "4px 12px", fontSize: "12px" }} onClick={() => handleTransferAction(t.id, "reject")}>
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
