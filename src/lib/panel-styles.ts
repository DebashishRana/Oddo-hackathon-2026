export const panelInput =
  "w-full rounded-xl border border-[var(--af-border)] bg-white px-4 py-3 text-sm text-[var(--af-ink)] outline-none transition placeholder:text-slate-400 focus:border-[var(--af-accent)] focus:ring-4 focus:ring-[var(--af-accent-soft)]";

export const panelBtnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--af-accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(15,118,110,0.22)] transition hover:bg-[var(--af-accent-strong)] disabled:cursor-not-allowed disabled:opacity-60";

export const panelBtnSecondary =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--af-border)] bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60";

export const panelBtnDanger =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-60";

export const statusTone: Record<string, string> = {
  available: "bg-emerald-50 text-emerald-700",
  allocated: "bg-sky-50 text-sky-700",
  reserved: "bg-teal-50 text-teal-700",
  under_maintenance: "bg-amber-50 text-amber-700",
  lost: "bg-rose-50 text-rose-700",
  retired: "bg-slate-100 text-slate-600",
  disposed: "bg-slate-100 text-slate-500",
  pending: "bg-amber-50 text-amber-700",
  approved: "bg-sky-50 text-sky-700",
  rejected: "bg-rose-50 text-rose-700",
  technician_assigned: "bg-indigo-50 text-indigo-700",
  in_progress: "bg-cyan-50 text-cyan-700",
  resolved: "bg-emerald-50 text-emerald-700",
  upcoming: "bg-sky-50 text-sky-700",
  ongoing: "bg-emerald-50 text-emerald-700",
  completed: "bg-slate-100 text-slate-600",
  cancelled: "bg-rose-50 text-rose-600",
  requested: "bg-amber-50 text-amber-700",
  active: "bg-emerald-50 text-emerald-700",
  returned: "bg-slate-100 text-slate-600",
  transferred: "bg-teal-50 text-teal-700",
  open: "bg-sky-50 text-sky-700",
  closed: "bg-slate-100 text-slate-600",
};
