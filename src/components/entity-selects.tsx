"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

// Shared entity pickers for forms (assets, users, departments)

const selectCls =
  "w-full rounded-xl border border-[var(--af-border)] bg-white px-4 py-3 text-sm text-[var(--af-ink)] outline-none transition focus:border-[var(--af-accent)] focus:ring-4 focus:ring-[var(--af-accent-soft)]";

type Option = { value: string; label: string };

type BaseProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  allowEmpty?: boolean;
};

export function AssetSelect({
  value,
  onChange,
  placeholder = "Select asset",
  className = selectCls,
  allowEmpty = true,
  bookableOnly = false,
  status,
}: BaseProps & { bookableOnly?: boolean; status?: string }) {
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (bookableOnly) params.set("bookable", "true");
    if (status) params.set("status", status);
    params.set("limit", "200");
    apiFetch(`/api/assets?${params.toString()}`)
      .then((r) => r.json())
      .then((p) => {
        const assets = p?.data?.assets ?? p?.data?.items ?? [];
        setOptions(
          (assets as Array<{ id: number; name: string; assetTag?: string; asset_tag?: string }>).map((a) => ({
            value: String(a.id),
            label: `${a.assetTag ?? a.asset_tag ?? `#${a.id}`} — ${a.name}`,
          }))
        );
      })
      .catch(() => setOptions([]));
  }, [bookableOnly, status]);

  return (
    <select className={className} value={value} onChange={(e) => onChange(e.target.value)}>
      {allowEmpty ? <option value="">{placeholder}</option> : null}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function UserSelect({
  value,
  onChange,
  placeholder = "Select employee",
  className = selectCls,
  allowEmpty = true,
}: BaseProps) {
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    apiFetch("/api/users/options")
      .then((r) => r.json())
      .then((p) => {
        const users = p?.data?.users ?? [];
        setOptions(
          (users as Array<{ id: number; name: string | null; email: string }>).map((u) => ({
            value: String(u.id),
            label: `${u.name || "Unnamed"} (${u.email})`,
          }))
        );
      })
      .catch(() => setOptions([]));
  }, []);

  return (
    <select className={className} value={value} onChange={(e) => onChange(e.target.value)}>
      {allowEmpty ? <option value="">{placeholder}</option> : null}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function DepartmentSelect({
  value,
  onChange,
  placeholder = "Select department",
  className = selectCls,
  allowEmpty = true,
}: BaseProps) {
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    apiFetch("/api/departments")
      .then((r) => r.json())
      .then((p) => {
        const depts = p?.data?.departments ?? [];
        setOptions(
          (depts as Array<{ id: number; name: string }>).map((d) => ({
            value: String(d.id),
            label: d.name,
          }))
        );
      })
      .catch(() => setOptions([]));
  }, []);

  return (
    <select className={className} value={value} onChange={(e) => onChange(e.target.value)}>
      {allowEmpty ? <option value="">{placeholder}</option> : null}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function MultiUserSelect({
  values,
  onChange,
  placeholder = "Select auditors",
  className = selectCls,
}: {
  values: number[];
  onChange: (values: number[]) => void;
  placeholder?: string;
  className?: string;
}) {
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    apiFetch("/api/users/options")
      .then((r) => r.json())
      .then((p) => {
        const users = p?.data?.users ?? [];
        setOptions(
          (users as Array<{ id: number; name: string | null; email: string }>).map((u) => ({
            value: String(u.id),
            label: `${u.name || "Unnamed"} (${u.email})`,
          }))
        );
      })
      .catch(() => setOptions([]));
  }, []);

  return (
    <select
      className={`${className} min-h-[120px]`}
      multiple
      value={values.map(String)}
      onChange={(e) => {
        const selected = Array.from(e.target.selectedOptions).map((o) => Number(o.value));
        onChange(selected);
      }}
    >
      {options.length === 0 ? <option disabled>{placeholder}</option> : null}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
