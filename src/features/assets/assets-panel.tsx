"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "@/lib/api";

type Asset = {
  id: number;
  name: string;
  assetTag: string;
  serialNumber: string | null;
  status: string;
  condition: string;
  location: string | null;
  isSharedBookable: boolean;
  acquisitionDate: string | null;
  acquisitionCost: number | null;
  categoryId: number | null;
  departmentId: number | null;
  notes: string | null;
  createdAt: string;
};

type Category = { id: number; name: string };

const inputCls =
  "w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-950 outline-none transition focus:border-[#1677ff] focus:ring-4 focus:ring-[#1677ff]/10";
const btnPrimary =
  "rounded-full bg-[#1677ff] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0b63db] disabled:opacity-60";
const btnSecondary =
  "rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100";

const statusColors: Record<string, string> = {
  available: "bg-emerald-50 text-emerald-700",
  allocated: "bg-blue-50 text-blue-700",
  reserved: "bg-indigo-50 text-indigo-700",
  under_maintenance: "bg-amber-50 text-amber-700",
  lost: "bg-rose-50 text-rose-700",
  retired: "bg-neutral-100 text-neutral-500",
  disposed: "bg-neutral-100 text-neutral-400",
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

export function AssetsPanel() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // filters
  const [searchQ, setSearchQ] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCat, setFilterCat] = useState("");

  // form state
  const [name, setName] = useState("");
  const [serial, setSerial] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [condition, setCondition] = useState("good");
  const [location, setLocation] = useState("");
  const [acquisitionDate, setAcquisitionDate] = useState("");
  const [acquisitionCost, setAcquisitionCost] = useState("");
  const [isSharedBookable, setIsSharedBookable] = useState(false);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQ) params.set("q", searchQ);
      if (filterStatus) params.set("status", filterStatus);
      if (filterCat) params.set("categoryId", filterCat);

      const [assetsRes, catsRes] = await Promise.all([
        apiFetch(`/api/assets${params.toString() ? `?${params}` : ""}`),
        apiFetch("/api/categories"),
      ]);
      const assetsPayload = await assetsRes.json();
      const catsPayload = await catsRes.json();
      setAssets(assetsPayload?.data?.assets ?? assetsPayload?.data ?? []);
      setCategories(catsPayload?.data?.categories ?? []);
    } catch {
      setError("Failed to load assets");
    } finally {
      setLoading(false);
    }
  }, [searchQ, filterStatus, filterCat]);

  useEffect(() => { load(); }, [load]);

  function resetForm() {
    setName(""); setSerial(""); setCategoryId(""); setDepartmentId("");
    setCondition("good"); setLocation(""); setAcquisitionDate("");
    setAcquisitionCost(""); setIsSharedBookable(false); setNotes("");
    setFormError(null);
  }

  async function handleCreate() {
    if (!name.trim()) { setFormError("Asset name is required"); return; }
    setSaving(true); setFormError(null);
    try {
      const body = {
        name: name.trim(),
        serialNumber: serial.trim() || null,
        categoryId: categoryId ? Number(categoryId) : null,
        departmentId: departmentId ? Number(departmentId) : null,
        condition,
        location: location.trim() || null,
        acquisitionDate: acquisitionDate || null,
        acquisitionCost: acquisitionCost ? Number(acquisitionCost) : null,
        isSharedBookable,
        notes: notes.trim() || null,
      };
      const r = await apiFetch("/api/assets", { method: "POST", body: JSON.stringify(body) });
      const p = await r.json();
      if (!r.ok) throw new Error(p?.message || "Create failed");
      setSuccess("Asset registered.");
      setShowForm(false);
      resetForm();
      await load();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Create failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-neutral-500">Asset registry</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-neutral-950">Assets</h1>
      </div>

      {success && <SuccessMsg msg={success} />}

      <section className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
        <div className="flex flex-wrap items-center gap-3">
          <input
            className={`${inputCls} max-w-xs`}
            placeholder="Search by name or tag…"
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
          />
          <select className={`${inputCls} max-w-[160px]`} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All Statuses</option>
            {Object.keys(statusColors).map((s) => (
              <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
            ))}
          </select>
          <select className={`${inputCls} max-w-[180px]`} value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button className={btnSecondary} onClick={() => load()}>Refresh</button>
          <button className={btnPrimary} onClick={() => { resetForm(); setShowForm((v) => !v); setSelectedAsset(null); }}>
            {showForm ? "Cancel" : "+ Register Asset"}
          </button>
        </div>

        {showForm && (
          <div className="mt-5 rounded-[24px] border border-neutral-200 bg-neutral-50 p-5 space-y-3">
            <h3 className="font-semibold text-neutral-800">Register New Asset</h3>
            {formError && <ErrorMsg msg={formError} />}
            <div className="grid gap-3 sm:grid-cols-2">
              <input className={inputCls} placeholder="Asset name *" value={name} onChange={(e) => setName(e.target.value)} />
              <input className={inputCls} placeholder="Serial number" value={serial} onChange={(e) => setSerial(e.target.value)} />
              <select className={inputCls} value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                <option value="">Category (optional)</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input className={inputCls} placeholder="Department ID (optional)" type="number" value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} />
              <select className={inputCls} value={condition} onChange={(e) => setCondition(e.target.value)}>
                <option value="new">New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
              <input className={inputCls} placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Acquisition Date</label>
                <input className={inputCls} type="date" value={acquisitionDate} onChange={(e) => setAcquisitionDate(e.target.value)} />
              </div>
              <input className={inputCls} placeholder="Acquisition cost" type="number" value={acquisitionCost} onChange={(e) => setAcquisitionCost(e.target.value)} />
            </div>
            <input className={inputCls} placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
            <label className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer">
              <input type="checkbox" checked={isSharedBookable} onChange={(e) => setIsSharedBookable(e.target.checked)} className="h-4 w-4 rounded" />
              Shared / Bookable resource
            </label>
            <div className="flex gap-3">
              <button className={btnPrimary} onClick={handleCreate} disabled={saving}>{saving ? "Saving…" : "Register"}</button>
              <button className={btnSecondary} onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        )}

        {selectedAsset && (
          <div className="mt-5 rounded-[24px] border border-neutral-200 bg-neutral-50 p-5 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-neutral-800">Asset Details — {selectedAsset.name}</h3>
              <button className={btnSecondary} onClick={() => setSelectedAsset(null)}>Close</button>
            </div>
            <div className="grid gap-2 text-sm sm:grid-cols-2">
              <div><span className="font-medium text-neutral-500">Asset Tag:</span> {selectedAsset.assetTag}</div>
              <div><span className="font-medium text-neutral-500">Serial:</span> {selectedAsset.serialNumber ?? "—"}</div>
              <div><span className="font-medium text-neutral-500">Condition:</span> {selectedAsset.condition}</div>
              <div><span className="font-medium text-neutral-500">Location:</span> {selectedAsset.location ?? "—"}</div>
              <div><span className="font-medium text-neutral-500">Bookable:</span> {selectedAsset.isSharedBookable ? "Yes" : "No"}</div>
              <div><span className="font-medium text-neutral-500">Acquired:</span> {selectedAsset.acquisitionDate ? new Date(selectedAsset.acquisitionDate).toLocaleDateString() : "—"}</div>
              <div><span className="font-medium text-neutral-500">Cost:</span> {selectedAsset.acquisitionCost != null ? `$${selectedAsset.acquisitionCost.toLocaleString()}` : "—"}</div>
              <div className="col-span-2"><span className="font-medium text-neutral-500">Notes:</span> {selectedAsset.notes ?? "—"}</div>
            </div>
          </div>
        )}
      </section>

      {error && <ErrorMsg msg={error} />}

      <section className="rounded-[28px] border border-neutral-200 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
        {loading ? (
          <div className="p-6 space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-[20px] bg-neutral-100" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-neutral-50 text-xs uppercase tracking-[0.18em] text-neutral-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Tag</th>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Serial</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Condition</th>
                  <th className="px-4 py-3 font-semibold">Location</th>
                  <th className="px-4 py-3 font-semibold">Bookable</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assets.length === 0 ? (
                  <tr><td colSpan={8} className="px-4 py-10 text-center text-sm text-neutral-400">No assets found</td></tr>
                ) : assets.map((asset) => (
                  <tr key={asset.id} className="border-t border-neutral-100">
                    <td className="px-4 py-3 text-sm font-medium text-neutral-700">{asset.assetTag}</td>
                    <td className="px-4 py-3 text-sm font-medium text-neutral-950">{asset.name}</td>
                    <td className="px-4 py-3 text-sm text-neutral-500">{asset.serialNumber ?? "—"}</td>
                    <td className="px-4 py-3">
                      <Badge label={asset.status.replace(/_/g, " ")} color={statusColors[asset.status] ?? "bg-neutral-100 text-neutral-600"} />
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600 capitalize">{asset.condition}</td>
                    <td className="px-4 py-3 text-sm text-neutral-500">{asset.location ?? "—"}</td>
                    <td className="px-4 py-3 text-sm text-neutral-500">{asset.isSharedBookable ? "Yes" : "No"}</td>
                    <td className="px-4 py-3">
                      <button className="text-sm text-[#1677ff] hover:underline" onClick={() => setSelectedAsset(selectedAsset?.id === asset.id ? null : asset)}>
                        {selectedAsset?.id === asset.id ? "Hide" : "Details"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
