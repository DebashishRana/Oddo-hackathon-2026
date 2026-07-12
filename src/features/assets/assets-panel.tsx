"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { AssetQr } from "@/components/asset-qr";
import { DepartmentSelect } from "@/components/entity-selects";
import { useCurrentUser } from "@/hooks/use-current-user";
import { apiFetch } from "@/lib/api";
import { panelBtnPrimary, panelBtnSecondary, panelInput, statusTone } from "@/lib/panel-styles";

type AssetStatus = "available" | "allocated" | "reserved" | "under_maintenance" | "lost" | "retired" | "disposed";
type Category = { id: number; name: string };
type Asset = {
  id: number; name: string; assetTag: string; serialNumber: string | null; status: AssetStatus; condition: string;
  location: string | null; isSharedBookable: boolean; acquisitionDate: string | null; acquisitionCost: number | null;
  categoryId: number | null; departmentId: number | null; categoryName?: string; deptName?: string;
  photoUrl: string | null; documentUrl: string | null; notes: string | null;
};
type Allocation = { id: number; userName?: string; deptName?: string; status: string; expectedReturnDate?: string | null; returnedAt?: string | null; createdAt?: string };
type Maintenance = { id: number; title?: string; issueDescription?: string; status: string; scheduledDate?: string | null; completedAt?: string | null; createdAt?: string };
type StatusHistory = { id: number; fromStatus: string | null; toStatus: string; reason: string | null; changedByName?: string; createdAt: string };
type AssetDetail = Asset & { allocationHistory: Allocation[]; maintenanceHistory: Maintenance[]; statusHistory: StatusHistory[] };

const statuses: AssetStatus[] = ["available", "allocated", "reserved", "under_maintenance", "lost", "retired", "disposed"];
const transitions: Record<AssetStatus, AssetStatus[]> = {
  available: ["allocated", "reserved", "under_maintenance", "lost", "retired", "disposed"],
  allocated: ["available", "under_maintenance", "lost", "retired", "disposed"],
  reserved: ["available", "allocated", "under_maintenance", "lost", "retired", "disposed"],
  under_maintenance: ["available", "retired", "disposed"],
  lost: ["available"],
  retired: ["disposed"],
  disposed: [],
};

const pretty = (value: string) => value.replace(/_/g, " ");
const dateLabel = (value?: string | null) => value ? new Date(value).toLocaleDateString() : "—";
const empty = (value?: string | null) => value?.trim() || "—";

function StatusBadge({ status }: { status: string }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusTone[status] ?? "bg-slate-100 text-slate-600"}`}>{pretty(status)}</span>;
}

function Message({ tone, children }: { tone: "error" | "success"; children: string }) {
  return <div className={`rounded-xl border px-4 py-3 text-sm ${tone === "error" ? "border-rose-200 bg-rose-50 text-rose-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>{children}</div>;
}

export function AssetsPanel() {
  const { canManageAssets } = useCurrentUser();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({ q: "", tag: "", serial: "", categoryId: "", status: "", departmentId: "", location: "" });
  const [selectedAsset, setSelectedAsset] = useState<AssetDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [statusTarget, setStatusTarget] = useState("");
  const [statusReason, setStatusReason] = useState("");
  const [transitioning, setTransitioning] = useState(false);
  const [transitionError, setTransitionError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "", categoryId: "", serialNumber: "", acquisitionDate: "", acquisitionCost: "", condition: "good",
    location: "", departmentId: "", photoUrl: "", documentUrl: "", notes: "", isSharedBookable: false,
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ limit: "100" });
      Object.entries(filters).forEach(([key, value]) => { if (value) params.set(key, value); });
      const [assetsResponse, categoriesResponse] = await Promise.all([apiFetch(`/api/assets?${params}`), apiFetch("/api/categories")]);
      const [assetsPayload, categoriesPayload] = await Promise.all([assetsResponse.json(), categoriesResponse.json()]);
      if (!assetsResponse.ok) throw new Error(assetsPayload?.message || "Could not load assets.");
      setAssets(assetsPayload?.data?.assets ?? []);
      setCategories(categoriesPayload?.data?.categories ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load assets.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { void load(); }, [load]);

  const updateFilter = (name: keyof typeof filters, value: string) => setFilters((current) => ({ ...current, [name]: value }));
  const resetForm = () => {
    setForm({ name: "", categoryId: "", serialNumber: "", acquisitionDate: "", acquisitionCost: "", condition: "good", location: "", departmentId: "", photoUrl: "", documentUrl: "", notes: "", isSharedBookable: false });
    setFormError(null);
  };

  async function openDetail(id: number) {
    setDetailLoading(true);
    setTransitionError(null);
    try {
      const response = await apiFetch(`/api/assets/${id}`);
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.message || "Could not load asset details.");
      setSelectedAsset(payload?.data?.asset ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load asset details.");
    } finally {
      setDetailLoading(false);
    }
  }

  async function createAsset() {
    if (!form.name.trim()) { setFormError("An asset name is required."); return; }
    setSaving(true);
    setFormError(null);
    try {
      const response = await apiFetch("/api/assets", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          name: form.name.trim(), serialNumber: form.serialNumber.trim() || null, categoryId: form.categoryId ? Number(form.categoryId) : null,
          departmentId: form.departmentId ? Number(form.departmentId) : null, location: form.location.trim() || null,
          acquisitionDate: form.acquisitionDate || null, acquisitionCost: form.acquisitionCost ? Number(form.acquisitionCost) : null,
          photoUrl: form.photoUrl.trim() || null, documentUrl: form.documentUrl.trim() || null, notes: form.notes.trim() || null,
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.message || "Could not register asset.");
      setSuccess(`Asset ${payload?.data?.asset?.assetTag ?? ""} registered successfully.`.trim());
      setShowForm(false);
      resetForm();
      await load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not register asset.");
    } finally {
      setSaving(false);
    }
  }

  async function transitionStatus() {
    if (!selectedAsset || !statusTarget) return;
    setTransitioning(true);
    setTransitionError(null);
    try {
      const response = await apiFetch(`/api/assets/${selectedAsset.id}/status`, { method: "POST", body: JSON.stringify({ status: statusTarget, reason: statusReason.trim() || null }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.message || "Could not update status.");
      setSuccess("Asset status updated.");
      setStatusTarget("");
      setStatusReason("");
      await Promise.all([load(), openDetail(selectedAsset.id)]);
    } catch (err) {
      setTransitionError(err instanceof Error ? err.message : "Could not update status.");
    } finally {
      setTransitioning(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--af-muted)]">Asset registry</p>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--af-ink)]">Assets</h1>
          <p className="mt-1 text-sm text-[var(--af-muted)]">Track equipment, ownership, lifecycle, and availability.</p>
        </div>
        {canManageAssets && <button className={panelBtnPrimary} onClick={() => { resetForm(); setShowForm((shown) => !shown); }}>{showForm ? "Close registration" : "Register asset"}</button>}
      </div>

      {success && <Message tone="success">{success}</Message>}
      {error && <Message tone="error">{error}</Message>}

      {canManageAssets && showForm && (
        <section className="af-panel p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3"><div><h2 className="font-display text-xl font-semibold text-[var(--af-ink)]">Register an asset</h2><p className="mt-1 text-sm text-[var(--af-muted)]">A tag is automatically assigned when the record is created.</p></div><button className={panelBtnSecondary} onClick={() => setShowForm(false)}>Cancel</button></div>
          {formError && <div className="mb-4"><Message tone="error">{formError}</Message></div>}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <input className={panelInput} placeholder="Asset name *" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            <select className={panelInput} value={form.categoryId} onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}><option value="">Category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select>
            <input className={panelInput} placeholder="Serial number" value={form.serialNumber} onChange={(e) => setForm((f) => ({ ...f, serialNumber: e.target.value }))} />
            <label className="space-y-1"><span className="text-xs font-medium text-[var(--af-muted)]">Acquisition date</span><input className={panelInput} type="date" value={form.acquisitionDate} onChange={(e) => setForm((f) => ({ ...f, acquisitionDate: e.target.value }))} /></label>
            <input className={panelInput} type="number" min="0" step="0.01" placeholder="Acquisition cost" value={form.acquisitionCost} onChange={(e) => setForm((f) => ({ ...f, acquisitionCost: e.target.value }))} />
            <select className={panelInput} value={form.condition} onChange={(e) => setForm((f) => ({ ...f, condition: e.target.value }))}>{["excellent", "good", "fair", "poor"].map((condition) => <option key={condition} value={condition}>{pretty(condition)}</option>)}</select>
            <input className={panelInput} placeholder="Location" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
            <DepartmentSelect className={panelInput} value={form.departmentId} onChange={(departmentId) => setForm((f) => ({ ...f, departmentId }))} placeholder="Department" />
            <input className={panelInput} type="url" placeholder="Photo URL" value={form.photoUrl} onChange={(e) => setForm((f) => ({ ...f, photoUrl: e.target.value }))} />
            <input className={panelInput} type="url" placeholder="Document URL" value={form.documentUrl} onChange={(e) => setForm((f) => ({ ...f, documentUrl: e.target.value }))} />
            <textarea className={`${panelInput} min-h-24 md:col-span-2`} placeholder="Notes" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--af-border)] bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"><input type="checkbox" checked={form.isSharedBookable} onChange={(e) => setForm((f) => ({ ...f, isSharedBookable: e.target.checked }))} className="h-4 w-4 accent-[var(--af-accent)]" />Shared / bookable resource</label>
          </div>
          <div className="mt-5"><button className={panelBtnPrimary} disabled={saving} onClick={createAsset}>{saving ? "Registering…" : "Register asset"}</button></div>
        </section>
      )}

      <section className="af-panel p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-display text-xl font-semibold text-[var(--af-ink)]">Asset inventory</h2><p className="mt-1 text-sm text-[var(--af-muted)]">{assets.length} matching asset{assets.length === 1 ? "" : "s"}</p></div><button className={panelBtnSecondary} onClick={() => void load()}>Refresh</button></div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <input className={panelInput} placeholder="Search name, tag, or serial" value={filters.q} onChange={(e) => updateFilter("q", e.target.value)} />
          <input className={panelInput} placeholder="Filter asset tag" value={filters.tag} onChange={(e) => updateFilter("tag", e.target.value)} />
          <input className={panelInput} placeholder="Filter serial number" value={filters.serial} onChange={(e) => updateFilter("serial", e.target.value)} />
          <select className={panelInput} value={filters.categoryId} onChange={(e) => updateFilter("categoryId", e.target.value)}><option value="">All categories</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select>
          <select className={panelInput} value={filters.status} onChange={(e) => updateFilter("status", e.target.value)}><option value="">All statuses</option>{statuses.map((status) => <option key={status} value={status}>{pretty(status)}</option>)}</select>
          <DepartmentSelect className={panelInput} value={filters.departmentId} onChange={(value) => updateFilter("departmentId", value)} placeholder="All departments" />
          <input className={panelInput} placeholder="Filter location" value={filters.location} onChange={(e) => updateFilter("location", e.target.value)} />
          <button className={panelBtnSecondary} onClick={() => setFilters({ q: "", tag: "", serial: "", categoryId: "", status: "", departmentId: "", location: "" })}>Clear filters</button>
        </div>
      </section>

      <section className="af-panel overflow-hidden">
        {loading ? <div className="space-y-3 p-6">{Array.from({ length: 5 }).map((_, index) => <div key={index} className="h-14 animate-pulse rounded-xl bg-slate-100" />)}</div> : (
          <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead className="border-b border-[var(--af-border)] bg-slate-50 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--af-muted)]"><tr><th className="px-5 py-3">Tag</th><th className="px-5 py-3">Asset</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Condition</th><th className="px-5 py-3">Location</th><th className="px-5 py-3">Bookable</th><th className="px-5 py-3" /></tr></thead>
            <tbody>{assets.length === 0 ? <tr><td colSpan={7} className="px-5 py-14 text-center text-sm text-[var(--af-muted)]">No assets match these filters.</td></tr> : assets.map((asset) => <tr key={asset.id} className="border-b border-[var(--af-border)] last:border-0 hover:bg-teal-50/30"><td className="px-5 py-4 text-sm font-semibold text-[var(--af-accent-strong)]">{asset.assetTag}</td><td className="px-5 py-4"><p className="font-semibold text-[var(--af-ink)]">{asset.name}</p><p className="mt-0.5 text-xs text-[var(--af-muted)]">{empty(asset.serialNumber)}</p></td><td className="px-5 py-4"><StatusBadge status={asset.status} /></td><td className="px-5 py-4 text-sm capitalize text-slate-700">{asset.condition}</td><td className="px-5 py-4 text-sm text-slate-600">{empty(asset.location)}</td><td className="px-5 py-4 text-sm">{asset.isSharedBookable ? <span className="font-medium text-teal-700">Yes</span> : <span className="text-[var(--af-muted)]">No</span>}</td><td className="px-5 py-4 text-right"><button className="text-sm font-semibold text-[var(--af-accent-strong)] hover:underline" onClick={() => void openDetail(asset.id)}>View</button></td></tr>)}</tbody>
          </table></div>
        )}
      </section>

      {(detailLoading || selectedAsset) && <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/25" onMouseDown={() => !detailLoading && setSelectedAsset(null)}><aside className="h-full w-full max-w-2xl overflow-y-auto bg-white p-5 shadow-2xl sm:p-7" onMouseDown={(event) => event.stopPropagation()}>
        {detailLoading && !selectedAsset ? <div className="space-y-4"><div className="h-8 w-2/3 animate-pulse rounded bg-slate-100" /><div className="h-48 animate-pulse rounded-xl bg-slate-100" /></div> : selectedAsset && <><div className="flex items-start justify-between gap-4 border-b border-[var(--af-border)] pb-5"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--af-accent-strong)]">{selectedAsset.assetTag}</p><h2 className="mt-1 font-display text-3xl font-semibold tracking-tight text-[var(--af-ink)]">{selectedAsset.name}</h2><div className="mt-3"><StatusBadge status={selectedAsset.status} /></div></div><button className={panelBtnSecondary} onClick={() => setSelectedAsset(null)}>Close</button></div>
          <div className="grid gap-5 border-b border-[var(--af-border)] py-6 sm:grid-cols-[150px_1fr]"><AssetQr tag={selectedAsset.assetTag} /><dl className="grid grid-cols-2 gap-x-5 gap-y-4 text-sm"><div><dt className="text-[var(--af-muted)]">Serial</dt><dd className="mt-1 font-medium text-[var(--af-ink)]">{empty(selectedAsset.serialNumber)}</dd></div><div><dt className="text-[var(--af-muted)]">Condition</dt><dd className="mt-1 capitalize font-medium text-[var(--af-ink)]">{selectedAsset.condition}</dd></div><div><dt className="text-[var(--af-muted)]">Location</dt><dd className="mt-1 font-medium text-[var(--af-ink)]">{empty(selectedAsset.location)}</dd></div><div><dt className="text-[var(--af-muted)]">Bookable</dt><dd className="mt-1 font-medium text-[var(--af-ink)]">{selectedAsset.isSharedBookable ? "Yes" : "No"}</dd></div><div><dt className="text-[var(--af-muted)]">Acquired</dt><dd className="mt-1 font-medium text-[var(--af-ink)]">{dateLabel(selectedAsset.acquisitionDate)}</dd></div><div><dt className="text-[var(--af-muted)]">Cost</dt><dd className="mt-1 font-medium text-[var(--af-ink)]">{selectedAsset.acquisitionCost == null ? "—" : `$${selectedAsset.acquisitionCost.toLocaleString()}`}</dd></div></dl></div>
          {(selectedAsset.photoUrl || selectedAsset.documentUrl || selectedAsset.notes) && <section className="border-b border-[var(--af-border)] py-5 text-sm"><h3 className="font-display text-lg font-semibold text-[var(--af-ink)]">Record notes</h3>{selectedAsset.notes && <p className="mt-2 whitespace-pre-wrap text-slate-600">{selectedAsset.notes}</p>}<div className="mt-3 flex flex-wrap gap-3">{selectedAsset.photoUrl && <a className="font-semibold text-[var(--af-accent-strong)] hover:underline" href={selectedAsset.photoUrl} target="_blank" rel="noreferrer">View photo</a>}{selectedAsset.documentUrl && <a className="font-semibold text-[var(--af-accent-strong)] hover:underline" href={selectedAsset.documentUrl} target="_blank" rel="noreferrer">Open document</a>}</div></section>}
          {canManageAssets && transitions[selectedAsset.status].length > 0 && <section className="border-b border-[var(--af-border)] py-5"><h3 className="font-display text-lg font-semibold text-[var(--af-ink)]">Transition status</h3>{transitionError && <div className="mt-3"><Message tone="error">{transitionError}</Message></div>}<div className="mt-3 grid gap-3 sm:grid-cols-2"><select className={panelInput} value={statusTarget} onChange={(e) => setStatusTarget(e.target.value)}><option value="">Choose next status</option>{transitions[selectedAsset.status].map((status) => <option key={status} value={status}>{pretty(status)}</option>)}</select><input className={panelInput} placeholder="Reason (optional)" value={statusReason} onChange={(e) => setStatusReason(e.target.value)} /></div><button className={`${panelBtnPrimary} mt-3`} disabled={!statusTarget || transitioning} onClick={transitionStatus}>{transitioning ? "Updating…" : "Update status"}</button></section>}
          <HistorySection title="Allocation history" emptyText="No allocation history recorded." items={selectedAsset.allocationHistory} render={(item) => <><StatusBadge status={item.status} /><span className="text-sm text-slate-600">{item.userName || item.deptName || "Unassigned"} · {dateLabel(item.createdAt)}</span>{item.expectedReturnDate && <span className="text-xs text-[var(--af-muted)]">Expected return: {dateLabel(item.expectedReturnDate)}</span>}</>} />
          <HistorySection title="Maintenance history" emptyText="No maintenance history recorded." items={selectedAsset.maintenanceHistory} render={(item) => <><StatusBadge status={item.status} /><span className="text-sm font-medium text-[var(--af-ink)]">{item.title || item.issueDescription || "Maintenance record"}</span><span className="text-xs text-[var(--af-muted)]">{dateLabel(item.completedAt || item.scheduledDate || item.createdAt)}</span></>} />
          <HistorySection title="Status history" emptyText="No status changes recorded." items={selectedAsset.statusHistory} render={(item) => <><span className="text-sm font-medium text-[var(--af-ink)]">{item.fromStatus ? `${pretty(item.fromStatus)} → ` : ""}{pretty(item.toStatus)}</span><span className="text-sm text-slate-600">{item.reason || "No reason provided"} · {dateLabel(item.createdAt)}</span></>} />
        </>}</aside></div>}
    </div>
  );
}

function HistorySection<T extends { id: number }>({ title, emptyText, items, render }: { title: string; emptyText: string; items: T[]; render: (item: T) => ReactNode }) {
  return <section className="border-b border-[var(--af-border)] py-5 last:border-0"><h3 className="font-display text-lg font-semibold text-[var(--af-ink)]">{title}</h3>{items.length === 0 ? <p className="mt-2 text-sm text-[var(--af-muted)]">{emptyText}</p> : <div className="mt-3 space-y-2">{items.map((item) => <div key={item.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl bg-slate-50 px-3 py-2.5">{render(item)}</div>)}</div>}</section>;
}
