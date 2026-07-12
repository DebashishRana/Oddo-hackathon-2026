"use client";

import { useEffect, useState, useCallback } from "react";
import { CheckCircle2, ChevronDown, ClipboardList, SearchCheck, TriangleAlert, XCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { AssetSelect, DepartmentSelect, MultiUserSelect } from "@/components/entity-selects";
import { useCurrentUser } from "@/hooks/use-current-user";
import { panelBtnDanger, panelBtnPrimary, panelBtnSecondary, panelInput, statusTone } from "@/lib/panel-styles";

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
  deptName?: string;
};

type AuditItem = {
  id: number;
  assetId: number;
  assetName?: string;
  assetTag?: string;
  result: "verified" | "missing" | "damaged" | null;
  notes: string | null;
  verifierName?: string;
};

const inputCls = panelInput;
const btnPrimary = panelBtnPrimary;
const btnSecondary = panelBtnSecondary;
const statusColors = statusTone;

function camelKeys<T>(value: unknown): T {
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, entry]) => [
      key.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase()),
      entry,
    ])
  ) as T;
}

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
  const { canManageAssets, isAdmin } = useCurrentUser();
  const [cycles, setCycles] = useState<AuditCycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // create form
  const [name, setName] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [auditorIds, setAuditorIds] = useState<number[]>([]);
  const [location, setLocation] = useState("");
  const [startsOn, setStartsOn] = useState("");
  const [endsOn, setEndsOn] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [expandedCycleId, setExpandedCycleId] = useState<number | null>(null);
  const [cycleItems, setCycleItems] = useState<Record<number, AuditItem[]>>({});
  const [detailLoading, setDetailLoading] = useState<number | null>(null);
  // Fallback marker is only used when a cycle contains no seeded items.
  const [markAssetId, setMarkAssetId] = useState("");
  const [markResult, setMarkResult] = useState<"verified" | "missing" | "damaged">("verified");
  const [markNotes, setMarkNotes] = useState("");
  const [markSaving, setMarkSaving] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);
  const [discrepancies, setDiscrepancies] = useState<Record<number, AuditItem[]>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await apiFetch("/api/audits");
      const p = await r.json();
      setCycles((p?.data?.cycles ?? []).map((cycle: unknown) => camelKeys<AuditCycle>(cycle)));
    } catch {
      setError("Failed to load audit cycles");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function toggleCycle(cycleId: number) {
    if (expandedCycleId === cycleId) {
      setExpandedCycleId(null);
      return;
    }
    setExpandedCycleId(cycleId);
    if (cycleItems[cycleId]) return;
    setDetailLoading(cycleId);
    try {
      const response = await apiFetch(`/api/audits/${cycleId}`);
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.message || "Failed to load audit items");
      setCycleItems((current) => ({
        ...current,
        [cycleId]: (payload?.data?.cycle?.items ?? []).map((item: unknown) => camelKeys<AuditItem>(item)),
      }));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load audit items");
    } finally {
      setDetailLoading(null);
    }
  }

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
        auditorIds,
      };
      const r = await apiFetch("/api/audits", { method: "POST", body: JSON.stringify(body) });
      const p = await r.json();
      if (!r.ok) throw new Error(p?.message || "Create failed");
      setSuccess("Audit cycle created.");
      setShowForm(false);
      setName(""); setDepartmentId(""); setAuditorIds([]); setLocation(""); setStartsOn(""); setEndsOn("");
      await load();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Create failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleMarkItem(cycleId: number, assetId: number, result = markResult) {
    if (!assetId) return;
    setMarkSaving(true);
    try {
      const r = await apiFetch(`/api/audits/${cycleId}/items/${assetId}/mark`, {
        method: "POST",
        body: JSON.stringify({ result, notes: markNotes.trim() || null }),
      });
      const p = await r.json();
      if (!r.ok) throw new Error(p?.message || "Mark failed");
      setSuccess(`Item marked as ${result}.`);
      setMarkAssetId(""); setMarkNotes("");
      setCycleItems((current) => ({
        ...current,
        [cycleId]: (current[cycleId] ?? []).map((item) =>
          item.assetId === assetId ? { ...item, result, notes: markNotes.trim() || null } : item
        ),
      }));
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
      setDiscrepancies((current) => ({
        ...current,
        [id]: (p?.data?.discrepancies ?? []).map((item: unknown) => camelKeys<AuditItem>(item)),
      }));
      setExpandedCycleId(id);
      const detailResponse = await apiFetch(`/api/audits/${id}`);
      const detailPayload = await detailResponse.json();
      if (detailResponse.ok) {
        setCycleItems((current) => ({
          ...current,
          [id]: (detailPayload?.data?.cycle?.items ?? []).map((item: unknown) => camelKeys<AuditItem>(item)),
        }));
      }
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

      <section className="af-panel p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-950">Audit Cycles</h2>
          <button className={btnPrimary} onClick={() => { setShowForm((v) => !v); setFormError(null); }}>
            <ClipboardList size={16} /> {showForm ? "Cancel" : "New cycle"}
          </button>
        </div>

        {showForm && (
          <div className="mt-5 rounded-2xl border border-[var(--af-border)] bg-slate-50/70 p-5 space-y-4">
            <h3 className="font-semibold text-neutral-800">Create Audit Cycle</h3>
            {formError && <ErrorMsg msg={formError} />}
            <div className="grid gap-3 sm:grid-cols-2">
              <input className={inputCls} placeholder="Cycle name *" value={name} onChange={(e) => setName(e.target.value)} />
              <input className={inputCls} placeholder="Location (optional)" value={location} onChange={(e) => setLocation(e.target.value)} />
              <DepartmentSelect className={inputCls} value={departmentId} onChange={setDepartmentId} placeholder="Select department (optional)" />
              <MultiUserSelect className={inputCls} values={auditorIds} onChange={setAuditorIds} />
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

      <section className="af-panel overflow-hidden">
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
                    <button
                      className={btnSecondary}
                      onClick={() => toggleCycle(cycle.id)}
                      aria-expanded={expandedCycleId === cycle.id}
                    >
                      <SearchCheck size={16} /> {expandedCycleId === cycle.id ? "Hide checklist" : "View checklist"} <ChevronDown size={15} className={expandedCycleId === cycle.id ? "rotate-180 transition-transform" : "transition-transform"} />
                    </button>
                    {cycle.status !== "closed" && (
                      <>
                        {(canManageAssets || isAdmin) && <button
                          className={btnSecondary}
                          onClick={() => handleClose(cycle.id)}
                          disabled={actionLoading}
                        >
                          <CheckCircle2 size={16} /> Close cycle
                        </button>}
                      </>
                    )}
                  </div>
                </div>

                {expandedCycleId === cycle.id && (
                  <div className="mt-4 rounded-2xl border border-[var(--af-border)] bg-slate-50/70 p-4">
                    {detailLoading === cycle.id ? <p className="text-sm text-slate-500">Loading checklist…</p> : cycleItems[cycle.id]?.length ? (
                      <div className="space-y-2">
                        {cycleItems[cycle.id].map((item) => (
                          <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 ring-1 ring-[var(--af-border)]">
                            <div>
                              <p className="text-sm font-semibold text-[var(--af-ink)]">{item.assetTag ? `${item.assetTag} — ` : ""}{item.assetName ?? `Asset #${item.assetId}`}</p>
                              <p className="text-xs text-slate-500">{item.notes ?? (item.result ? `Marked ${item.result}` : "Awaiting verification")}</p>
                            </div>
                            {cycle.status !== "closed" && <div className="flex flex-wrap gap-2">
                              <button className={item.result === "verified" ? btnPrimary : btnSecondary} onClick={() => handleMarkItem(cycle.id, item.assetId, "verified")} disabled={markSaving} title="Mark verified"><CheckCircle2 size={15} /> Verified</button>
                              <button className={item.result === "missing" ? panelBtnDanger : btnSecondary} onClick={() => handleMarkItem(cycle.id, item.assetId, "missing")} disabled={markSaving}><XCircle size={15} /> Missing</button>
                              <button className={item.result === "damaged" ? "inline-flex items-center gap-2 rounded-xl bg-amber-100 px-4 py-2.5 text-sm font-semibold text-amber-800" : btnSecondary} onClick={() => handleMarkItem(cycle.id, item.assetId, "damaged")} disabled={markSaving}><TriangleAlert size={15} /> Damaged</button>
                            </div>}
                          </div>
                        ))}
                      </div>
                    ) : cycle.status !== "closed" ? (
                      <div className="flex flex-wrap items-end gap-3">
                        <div className="min-w-[220px] flex-1"><label className="mb-1 block text-xs font-medium text-slate-500">Asset</label><AssetSelect className={inputCls} value={markAssetId} onChange={setMarkAssetId} placeholder="Select asset" /></div>
                        <div><label className="mb-1 block text-xs font-medium text-slate-500">Result</label><select className={inputCls} value={markResult} onChange={(e) => setMarkResult(e.target.value as typeof markResult)}><option value="verified">Verified</option><option value="missing">Missing</option><option value="damaged">Damaged</option></select></div>
                        <button className={btnPrimary} onClick={() => handleMarkItem(cycle.id, Number(markAssetId))} disabled={markSaving || !markAssetId}>Mark item</button>
                      </div>
                    ) : <p className="text-sm text-slate-500">This cycle has no audit items.</p>}
                    {discrepancies[cycle.id]?.length ? <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4"><p className="font-semibold text-rose-800">Discrepancy report</p><ul className="mt-2 space-y-1 text-sm text-rose-700">{discrepancies[cycle.id].map((item) => <li key={item.id}>{item.assetName ?? `Asset #${item.assetId}`} — {item.result}</li>)}</ul></div> : null}
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
