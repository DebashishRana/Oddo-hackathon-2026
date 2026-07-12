"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "@/lib/api";

type Tab = "departments" | "categories" | "employees";

type Department = {
  id: number;
  name: string;
  code: string | null;
  parentDepartmentId: number | null;
  headUserId: number | null;
  status: string;
  createdAt: string;
};

type Category = {
  id: number;
  name: string;
  description: string | null;
  customFields: Record<string, unknown>;
  createdAt: string;
};

type Employee = {
  id: number;
  name: string | null;
  email: string;
  department: string | null;
  role: string;
  roleName: string;
  isActive: boolean;
};

const inputCls =
  "w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-950 outline-none transition focus:border-[#1677ff] focus:ring-4 focus:ring-[#1677ff]/10";
const btnPrimary =
  "rounded-full bg-[#1677ff] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0b63db] disabled:opacity-60";
const btnSecondary =
  "rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100";

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${color}`}>{label}</span>
  );
}

function ErrorMsg({ msg }: { msg: string }) {
  return <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{msg}</p>;
}

function SuccessMsg({ msg }: { msg: string }) {
  return <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{msg}</p>;
}

// ---------- Departments Tab ----------
function DepartmentsTab() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [parentId, setParentId] = useState("");
  const [headId, setHeadId] = useState("");
  const [status, setStatus] = useState("active");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await apiFetch("/api/departments");
      const p = await r.json();
      setDepartments(p?.data?.departments ?? []);
    } catch {
      setError("Failed to load departments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function openCreate() {
    setEditing(null);
    setName(""); setCode(""); setParentId(""); setHeadId(""); setStatus("active");
    setFormError(null);
    setShowForm(true);
  }

  function openEdit(dept: Department) {
    setEditing(dept);
    setName(dept.name);
    setCode(dept.code ?? "");
    setParentId(dept.parentDepartmentId?.toString() ?? "");
    setHeadId(dept.headUserId?.toString() ?? "");
    setStatus(dept.status);
    setFormError(null);
    setShowForm(true);
  }

  async function handleSave() {
    if (!name.trim()) { setFormError("Name is required"); return; }
    setSaving(true); setFormError(null);
    try {
      const body = {
        name: name.trim(),
        code: code.trim() || null,
        parentDepartmentId: parentId ? Number(parentId) : null,
        headUserId: headId ? Number(headId) : null,
        status,
      };
      const r = editing
        ? await apiFetch(`/api/departments/${editing.id}`, { method: "PATCH", body: JSON.stringify(body) })
        : await apiFetch("/api/departments", { method: "POST", body: JSON.stringify(body) });
      const p = await r.json();
      if (!r.ok) throw new Error(p?.message || "Save failed");
      setSuccess(editing ? "Department updated." : "Department created.");
      setShowForm(false);
      await load();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-neutral-950">Departments</h3>
        <button className={btnPrimary} onClick={openCreate}>+ New Department</button>
      </div>

      {success && <SuccessMsg msg={success} />}
      {error && <ErrorMsg msg={error} />}

      {showForm && (
        <div className="rounded-[24px] border border-neutral-200 bg-neutral-50 p-5 space-y-3">
          <h4 className="font-semibold text-neutral-800">{editing ? "Edit Department" : "New Department"}</h4>
          {formError && <ErrorMsg msg={formError} />}
          <input className={inputCls} placeholder="Name *" value={name} onChange={(e) => setName(e.target.value)} />
          <input className={inputCls} placeholder="Code (optional)" value={code} onChange={(e) => setCode(e.target.value)} />
          <input className={inputCls} placeholder="Parent Dept ID (optional)" type="number" value={parentId} onChange={(e) => setParentId(e.target.value)} />
          <input className={inputCls} placeholder="Head User ID (optional)" type="number" value={headId} onChange={(e) => setHeadId(e.target.value)} />
          <select className={inputCls} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <div className="flex gap-3">
            <button className={btnPrimary} onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Save"}</button>
            <button className={btnSecondary} onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-[20px] bg-neutral-100" />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-[24px] border border-neutral-200">
          <table className="w-full text-left">
            <thead className="bg-neutral-50 text-xs uppercase tracking-[0.18em] text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Code</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-sm text-neutral-400">No departments yet</td></tr>
              ) : departments.map((dept) => (
                <tr key={dept.id} className="border-t border-neutral-100">
                  <td className="px-4 py-3 text-sm font-medium text-neutral-950">{dept.name}</td>
                  <td className="px-4 py-3 text-sm text-neutral-500">{dept.code ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Badge
                      label={dept.status}
                      color={dept.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-neutral-100 text-neutral-500"}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-sm text-[#1677ff] hover:underline" onClick={() => openEdit(dept)}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ---------- Categories Tab ----------
function CategoriesTab() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [warrantyField, setWarrantyField] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await apiFetch("/api/categories");
      const p = await r.json();
      setCategories(p?.data?.categories ?? []);
    } catch {
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function openCreate() {
    setEditing(null);
    setName(""); setDescription(""); setWarrantyField("");
    setFormError(null); setShowForm(true);
  }

  function openEdit(cat: Category) {
    setEditing(cat);
    setName(cat.name);
    setDescription(cat.description ?? "");
    setWarrantyField((cat.customFields?.warranty as string) ?? "");
    setFormError(null); setShowForm(true);
  }

  async function handleSave() {
    if (!name.trim()) { setFormError("Name is required"); return; }
    setSaving(true); setFormError(null);
    try {
      const body = {
        name: name.trim(),
        description: description.trim() || null,
        customFields: warrantyField ? { warranty: warrantyField } : {},
      };
      const r = editing
        ? await apiFetch(`/api/categories/${editing.id}`, { method: "PATCH", body: JSON.stringify(body) })
        : await apiFetch("/api/categories", { method: "POST", body: JSON.stringify(body) });
      const p = await r.json();
      if (!r.ok) throw new Error(p?.message || "Save failed");
      setSuccess(editing ? "Category updated." : "Category created.");
      setShowForm(false);
      await load();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-neutral-950">Categories</h3>
        <button className={btnPrimary} onClick={openCreate}>+ New Category</button>
      </div>

      {success && <SuccessMsg msg={success} />}
      {error && <ErrorMsg msg={error} />}

      {showForm && (
        <div className="rounded-[24px] border border-neutral-200 bg-neutral-50 p-5 space-y-3">
          <h4 className="font-semibold text-neutral-800">{editing ? "Edit Category" : "New Category"}</h4>
          {formError && <ErrorMsg msg={formError} />}
          <input className={inputCls} placeholder="Name *" value={name} onChange={(e) => setName(e.target.value)} />
          <input className={inputCls} placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
          <input className={inputCls} placeholder="Warranty (e.g. 2 years) — optional custom field" value={warrantyField} onChange={(e) => setWarrantyField(e.target.value)} />
          <div className="flex gap-3">
            <button className={btnPrimary} onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Save"}</button>
            <button className={btnSecondary} onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-[20px] bg-neutral-100" />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-[24px] border border-neutral-200">
          <table className="w-full text-left">
            <thead className="bg-neutral-50 text-xs uppercase tracking-[0.18em] text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Description</th>
                <th className="px-4 py-3 font-semibold">Warranty</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-sm text-neutral-400">No categories yet</td></tr>
              ) : categories.map((cat) => (
                <tr key={cat.id} className="border-t border-neutral-100">
                  <td className="px-4 py-3 text-sm font-medium text-neutral-950">{cat.name}</td>
                  <td className="px-4 py-3 text-sm text-neutral-500">{cat.description ?? "—"}</td>
                  <td className="px-4 py-3 text-sm text-neutral-500">{(cat.customFields?.warranty as string) ?? "—"}</td>
                  <td className="px-4 py-3">
                    <button className="text-sm text-[#1677ff] hover:underline" onClick={() => openEdit(cat)}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ---------- Employees Tab ----------
function EmployeesTab() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [roleTarget, setRoleTarget] = useState<{ id: number; name: string } | null>(null);
  const [newRole, setNewRole] = useState("employee");
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await apiFetch("/api/users/directory");
      const p = await r.json();
      setEmployees(p?.data?.users ?? []);
    } catch {
      setError("Failed to load directory");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleRoleChange(userId: number) {
    setSaving(true); setActionError(null);
    try {
      const r = await apiFetch(`/api/users/${userId}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role: newRole }),
      });
      const p = await r.json();
      if (!r.ok) throw new Error(p?.message || "Failed");
      setSuccess("Role updated.");
      setRoleTarget(null);
      await load();
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : "Failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleStatus(user: Employee) {
    setSaving(true); setActionError(null);
    try {
      const r = await apiFetch(`/api/users/${user.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: !user.isActive }),
      });
      const p = await r.json();
      if (!r.ok) throw new Error(p?.message || "Failed");
      setSuccess(`User ${user.isActive ? "deactivated" : "activated"}.`);
      await load();
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : "Failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-neutral-950">Employees</h3>
      </div>

      {success && <SuccessMsg msg={success} />}
      {error && <ErrorMsg msg={error} />}
      {actionError && <ErrorMsg msg={actionError} />}

      {roleTarget && (
        <div className="rounded-[24px] border border-neutral-200 bg-neutral-50 p-5 space-y-3">
          <h4 className="font-semibold text-neutral-800">Change role for {roleTarget.name}</h4>
          <select className={inputCls} value={newRole} onChange={(e) => setNewRole(e.target.value)}>
            <option value="employee">Employee</option>
            <option value="department_head">Department Head</option>
            <option value="asset_manager">Asset Manager</option>
          </select>
          <div className="flex gap-3">
            <button className={btnPrimary} onClick={() => handleRoleChange(roleTarget.id)} disabled={saving}>
              {saving ? "Saving…" : "Update Role"}
            </button>
            <button className={btnSecondary} onClick={() => setRoleTarget(null)}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-[20px] bg-neutral-100" />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-[24px] border border-neutral-200">
          <table className="w-full text-left">
            <thead className="bg-neutral-50 text-xs uppercase tracking-[0.18em] text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Name / Email</th>
                <th className="px-4 py-3 font-semibold">Department</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-neutral-400">No employees found</td></tr>
              ) : employees.map((emp) => (
                <tr key={emp.id} className="border-t border-neutral-100">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-neutral-950">{emp.name ?? "—"}</p>
                    <p className="text-xs text-neutral-500">{emp.email}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-600">{emp.department ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Badge label={emp.roleName || emp.role} color="bg-indigo-50 text-indigo-700" />
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      label={emp.isActive ? "Active" : "Inactive"}
                      color={emp.isActive ? "bg-emerald-50 text-emerald-700" : "bg-neutral-100 text-neutral-500"}
                    />
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      className="text-sm text-[#1677ff] hover:underline"
                      onClick={() => { setRoleTarget({ id: emp.id, name: emp.name ?? emp.email }); setNewRole(emp.role); }}
                    >
                      Role
                    </button>
                    <button
                      className={`text-sm hover:underline ${emp.isActive ? "text-rose-600" : "text-emerald-600"}`}
                      onClick={() => handleToggleStatus(emp)}
                      disabled={saving}
                    >
                      {emp.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ---------- Main panel ----------
export function OrganizationPanel() {
  const [tab, setTab] = useState<Tab>("departments");

  const tabs: { key: Tab; label: string }[] = [
    { key: "departments", label: "Departments" },
    { key: "categories", label: "Categories" },
    { key: "employees", label: "Employees" },
  ];

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-neutral-500">Admin setup</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-neutral-950">Organization</h1>
      </div>

      <section className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
        <div className="flex gap-2 border-b border-neutral-100 pb-4">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                tab === t.key
                  ? "bg-[#1677ff] text-white"
                  : "border border-neutral-200 text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === "departments" && <DepartmentsTab />}
          {tab === "categories" && <CategoriesTab />}
          {tab === "employees" && <EmployeesTab />}
        </div>
      </section>
    </div>
  );
}
