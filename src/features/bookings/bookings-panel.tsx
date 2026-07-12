"use client";

import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, Clock3, Loader2, Plus, RotateCcw, XCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { AssetSelect } from "@/components/entity-selects";
import { panelBtnDanger, panelBtnPrimary, panelBtnSecondary, panelInput, statusTone } from "@/lib/panel-styles";

type Booking = {
  id: number;
  assetId: number;
  assetName?: string;
  bookedBy: number;
  bookedByName?: string;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  startsAt: string;
  endsAt: string;
  purpose: string | null;
};

type ApiBooking = Partial<Booking> & {
  asset_id?: number;
  asset_name?: string;
  booked_by?: number;
  booker_name?: string;
  starts_at?: string;
  ends_at?: string;
};

const bookingStatuses = ["upcoming", "ongoing", "completed", "cancelled"] as const;

function normalizeBooking(booking: ApiBooking): Booking {
  return {
    id: Number(booking.id),
    assetId: Number(booking.assetId ?? booking.asset_id),
    assetName: booking.assetName ?? booking.asset_name,
    bookedBy: Number(booking.bookedBy ?? booking.booked_by ?? 0),
    bookedByName: booking.bookedByName ?? booking.booker_name,
    status: (booking.status ?? "upcoming") as Booking["status"],
    startsAt: String(booking.startsAt ?? booking.starts_at),
    endsAt: String(booking.endsAt ?? booking.ends_at),
    purpose: booking.purpose ?? null,
  };
}

function messageFrom(payload: { message?: string; error?: { message?: string } }, fallback: string) {
  return payload.message || payload.error?.message || fallback;
}

function localDateTime(value: string) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

function sameDay(left: Date, right: Date) {
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth() && left.getDate() === right.getDate();
}

function dayStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function BookingBadge({ status }: { status: Booking["status"] }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusTone[status]}`}>
      {status}
    </span>
  );
}

function Notice({ tone, children }: { tone: "error" | "success"; children: React.ReactNode }) {
  const Icon = tone === "error" ? XCircle : CheckCircle2;
  return (
    <div className={`flex gap-2 rounded-xl border px-4 py-3 text-sm ${tone === "error" ? "border-rose-200 bg-rose-50 text-rose-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <p>{children}</p>
    </div>
  );
}

export function BookingsPanel() {
  const [tab, setTab] = useState<"list" | "calendar">("list");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [assetId, setAssetId] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [purpose, setPurpose] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [rescheduleTarget, setRescheduleTarget] = useState<number | null>(null);
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");
  const [rescheduleSaving, setRescheduleSaving] = useState(false);
  const [calendarAssetId, setCalendarAssetId] = useState("");
  const [calendarBookings, setCalendarBookings] = useState<Booking[]>([]);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [calendarError, setCalendarError] = useState<string | null>(null);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.set("status", filterStatus);
      const response = await apiFetch(`/api/bookings${params.size ? `?${params}` : ""}`);
      const payload = await response.json();
      if (!response.ok) throw new Error(messageFrom(payload, "Could not load bookings."));
      setBookings((payload?.data?.bookings ?? []).map(normalizeBooking));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not load bookings.");
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  const loadCalendar = useCallback(async (selectedAssetId: string) => {
    if (!selectedAssetId) {
      setCalendarBookings([]);
      return;
    }
    setCalendarLoading(true);
    setCalendarError(null);
    try {
      const response = await apiFetch(`/api/bookings/calendar/${selectedAssetId}`);
      const payload = await response.json();
      if (!response.ok) throw new Error(messageFrom(payload, "Could not load this asset's calendar."));
      setCalendarBookings((payload?.data?.bookings ?? []).map(normalizeBooking));
    } catch (caught) {
      setCalendarError(caught instanceof Error ? caught.message : "Could not load this asset's calendar.");
    } finally {
      setCalendarLoading(false);
    }
  }, []);

  useEffect(() => { void loadBookings(); }, [loadBookings]);
  useEffect(() => { void loadCalendar(calendarAssetId); }, [calendarAssetId, loadCalendar]);

  const calendarDays = useMemo(() => Array.from({ length: 7 }, (_, index) => {
    const date = dayStart(new Date());
    date.setDate(date.getDate() + index);
    return date;
  }), []);

  async function handleCreate() {
    if (!assetId || !startsAt || !endsAt) {
      setFormError("Choose a bookable asset and provide both a start and end time.");
      return;
    }
    if (new Date(endsAt) <= new Date(startsAt)) {
      setFormError("The end time must be after the start time.");
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      const response = await apiFetch("/api/bookings", {
        method: "POST",
        body: JSON.stringify({ assetId: Number(assetId), startsAt, endsAt, purpose: purpose.trim() || null }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(messageFrom(payload, "Could not create booking."));
      setSuccess("Booking created successfully.");
      setShowForm(false);
      setAssetId(""); setStartsAt(""); setEndsAt(""); setPurpose("");
      await Promise.all([loadBookings(), loadCalendar(calendarAssetId)]);
    } catch (caught) {
      setFormError(caught instanceof Error ? caught.message : "Could not create booking.");
    } finally {
      setSaving(false);
    }
  }

  async function handleCancel(id: number) {
    setError(null);
    try {
      const response = await apiFetch(`/api/bookings/${id}/cancel`, { method: "PATCH", body: JSON.stringify({}) });
      const payload = await response.json();
      if (!response.ok) throw new Error(messageFrom(payload, "Could not cancel booking."));
      setSuccess("Booking cancelled.");
      await Promise.all([loadBookings(), loadCalendar(calendarAssetId)]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not cancel booking.");
    }
  }

  async function handleReschedule(id: number) {
    if (!newStart || !newEnd) {
      setError("Provide a new start and end time.");
      return;
    }
    if (new Date(newEnd) <= new Date(newStart)) {
      setError("The new end time must be after the start time.");
      return;
    }
    setRescheduleSaving(true);
    setError(null);
    try {
      const response = await apiFetch(`/api/bookings/${id}/reschedule`, {
        method: "PATCH",
        body: JSON.stringify({ startsAt: newStart, endsAt: newEnd }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(messageFrom(payload, "Could not reschedule booking."));
      setSuccess("Booking rescheduled.");
      setRescheduleTarget(null);
      await Promise.all([loadBookings(), loadCalendar(calendarAssetId)]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not reschedule booking.");
    } finally {
      setRescheduleSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--af-muted)]">Shared resource scheduling</p>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--af-ink)]">Bookings</h1>
          <p className="mt-1 text-sm text-[var(--af-muted)]">Reserve bookable assets and keep shared time visible.</p>
        </div>
        <button className={panelBtnPrimary} onClick={() => { setShowForm((open) => !open); setFormError(null); }}>
          <Plus className="h-4 w-4" /> {showForm ? "Close form" : "New booking"}
        </button>
      </header>

      {success && <Notice tone="success">{success}</Notice>}
      {error && <Notice tone="error">{error}</Notice>}

      {showForm && (
        <section className="af-panel p-5">
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-[var(--af-accent)]" />
            <h2 className="font-display text-xl font-semibold text-[var(--af-ink)]">Create booking</h2>
          </div>
          {formError && <div className="mb-4"><Notice tone="error">{formError}</Notice></div>}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Bookable asset <span className="text-rose-600">*</span></label>
              <AssetSelect className={panelInput} value={assetId} onChange={setAssetId} bookableOnly placeholder="Select a bookable asset" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Purpose</label>
              <input className={panelInput} value={purpose} onChange={(event) => setPurpose(event.target.value)} placeholder="e.g. Client presentation" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Starts at <span className="text-rose-600">*</span></label>
              <input className={panelInput} type="datetime-local" value={startsAt} onChange={(event) => setStartsAt(event.target.value)} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Ends at <span className="text-rose-600">*</span></label>
              <input className={panelInput} type="datetime-local" value={endsAt} onChange={(event) => setEndsAt(event.target.value)} />
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button className={panelBtnPrimary} onClick={() => void handleCreate()} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarDays className="h-4 w-4" />}
              {saving ? "Saving…" : "Create booking"}
            </button>
            <button className={panelBtnSecondary} onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </section>
      )}

      <nav className="flex w-fit rounded-xl border border-[var(--af-border)] bg-white p-1" aria-label="Booking views">
        <button className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${tab === "list" ? "bg-[var(--af-accent-soft)] text-[var(--af-accent-strong)]" : "text-slate-600 hover:bg-slate-50"}`} onClick={() => setTab("list")}>
          Bookings list
        </button>
        <button className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${tab === "calendar" ? "bg-[var(--af-accent-soft)] text-[var(--af-accent-strong)]" : "text-slate-600 hover:bg-slate-50"}`} onClick={() => setTab("calendar")}>
          Calendar
        </button>
      </nav>

      {tab === "list" ? (
        <section className="af-panel overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--af-border)] p-5">
            <div>
              <h2 className="font-display text-xl font-semibold text-[var(--af-ink)]">Bookings list</h2>
              <p className="mt-1 text-sm text-[var(--af-muted)]">Manage upcoming and active reservations.</p>
            </div>
            <select className={`${panelInput} w-auto min-w-44`} value={filterStatus} onChange={(event) => setFilterStatus(event.target.value)}>
              <option value="">All statuses</option>
              {bookingStatuses.map((status) => <option key={status} value={status}>{status[0].toUpperCase() + status.slice(1)}</option>)}
            </select>
          </div>
          {loading ? <div className="space-y-3 p-5">{Array.from({ length: 4 }, (_, index) => <div key={index} className="h-16 animate-pulse rounded-xl bg-slate-100" />)}</div> : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[880px] text-left text-sm">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-[0.14em] text-slate-500">
                  <tr><th className="px-5 py-3 font-semibold">Asset</th><th className="px-5 py-3 font-semibold">Booked by</th><th className="px-5 py-3 font-semibold">When</th><th className="px-5 py-3 font-semibold">Purpose</th><th className="px-5 py-3 font-semibold">Status</th><th className="px-5 py-3 font-semibold">Actions</th></tr>
                </thead>
                <tbody>
                  {bookings.length === 0 ? <tr><td colSpan={6} className="px-5 py-12 text-center text-[var(--af-muted)]">No bookings match this filter.</td></tr> : bookings.map((booking) => (
                    <Fragment key={booking.id}>
                      <tr className="border-t border-[var(--af-border)] align-top">
                        <td className="px-5 py-4 font-semibold text-[var(--af-ink)]">{booking.assetName ?? `Asset #${booking.assetId}`}</td>
                        <td className="px-5 py-4 text-slate-600">{booking.bookedByName ?? `Employee #${booking.bookedBy}`}</td>
                        <td className="px-5 py-4 text-slate-600"><span className="block">{formatDateTime(booking.startsAt)}</span><span className="block text-xs text-[var(--af-muted)]">to {formatDateTime(booking.endsAt)}</span></td>
                        <td className="max-w-48 px-5 py-4 text-slate-600">{booking.purpose ?? "—"}</td>
                        <td className="px-5 py-4"><BookingBadge status={booking.status} /></td>
                        <td className="px-5 py-4">
                          {(booking.status === "upcoming" || booking.status === "ongoing") && <div className="flex gap-2">
                            <button className={`${panelBtnSecondary} px-3 py-1.5 text-xs`} onClick={() => {
                              if (rescheduleTarget === booking.id) setRescheduleTarget(null);
                              else { setRescheduleTarget(booking.id); setNewStart(localDateTime(booking.startsAt)); setNewEnd(localDateTime(booking.endsAt)); }
                            }}><RotateCcw className="h-3.5 w-3.5" /> Reschedule</button>
                            <button className={`${panelBtnDanger} px-3 py-1.5 text-xs`} onClick={() => void handleCancel(booking.id)}><XCircle className="h-3.5 w-3.5" /> Cancel</button>
                          </div>}
                        </td>
                      </tr>
                      {rescheduleTarget === booking.id && <tr className="border-t border-[var(--af-border)] bg-teal-50/40"><td colSpan={6} className="px-5 py-4">
                        <div className="flex flex-wrap items-end gap-3">
                          <div><label className="mb-1 block text-xs font-semibold text-slate-600">New start</label><input className={panelInput} type="datetime-local" value={newStart} onChange={(event) => setNewStart(event.target.value)} /></div>
                          <div><label className="mb-1 block text-xs font-semibold text-slate-600">New end</label><input className={panelInput} type="datetime-local" value={newEnd} onChange={(event) => setNewEnd(event.target.value)} /></div>
                          <button className={panelBtnPrimary} onClick={() => void handleReschedule(booking.id)} disabled={rescheduleSaving}>{rescheduleSaving ? "Saving…" : "Confirm reschedule"}</button>
                        </div>
                      </td></tr>}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ) : (
        <section className="af-panel p-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div><h2 className="font-display text-xl font-semibold text-[var(--af-ink)]">Asset calendar</h2><p className="mt-1 text-sm text-[var(--af-muted)]">The next seven days of active reservations.</p></div>
            <div className="w-full sm:w-80"><label className="mb-1.5 block text-sm font-medium text-slate-700">Bookable asset</label><AssetSelect className={panelInput} value={calendarAssetId} onChange={setCalendarAssetId} bookableOnly placeholder="Choose an asset to view" /></div>
          </div>
          {calendarError && <div className="mt-4"><Notice tone="error">{calendarError}</Notice></div>}
          {!calendarAssetId ? <div className="mt-5 flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-[var(--af-border)] text-center"><CalendarDays className="mb-3 h-8 w-8 text-[var(--af-accent)]" /><p className="font-semibold text-[var(--af-ink)]">Choose a bookable asset</p><p className="mt-1 text-sm text-[var(--af-muted)]">Its reservations will appear in this seven-day schedule.</p></div> : calendarLoading ? <div className="mt-5 flex min-h-64 items-center justify-center text-[var(--af-muted)]"><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading calendar…</div> : (
            <div className="mt-5 overflow-x-auto"><div className="min-w-[840px]">
              <div className="grid grid-cols-[72px_repeat(7,minmax(110px,1fr))] border-l border-t border-[var(--af-border)]">
                <div className="border-b border-r border-[var(--af-border)] bg-slate-50 p-3 text-xs font-semibold text-slate-500">Time</div>
                {calendarDays.map((day) => <div key={day.toISOString()} className={`border-b border-r border-[var(--af-border)] p-3 text-center ${sameDay(day, new Date()) ? "bg-teal-50" : "bg-slate-50"}`}><p className="text-xs font-semibold uppercase text-slate-500">{new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(day)}</p><p className="font-display text-lg font-semibold text-[var(--af-ink)]">{day.getDate()}</p></div>)}
                <div className="border-r border-[var(--af-border)] bg-slate-50 pt-3 text-right text-xs text-slate-500">{Array.from({ length: 12 }, (_, index) => <div key={index} className="h-16 pr-2">{`${String(index + 8).padStart(2, "0")}:00`}</div>)}</div>
                {calendarDays.map((day) => <div key={day.toISOString()} className="relative h-[768px] border-r border-[var(--af-border)]" style={{ backgroundImage: "repeating-linear-gradient(to bottom, transparent 0, transparent 63px, var(--af-border) 64px)" }}>
                  {calendarBookings.filter((booking) => { const start = new Date(booking.startsAt); const end = new Date(booking.endsAt); const nextDay = new Date(day); nextDay.setDate(nextDay.getDate() + 1); return start < nextDay && end > day; }).map((booking) => {
                    const start = new Date(booking.startsAt); const end = new Date(booking.endsAt); const gridStart = new Date(day); gridStart.setHours(8, 0, 0, 0); const gridEnd = new Date(day); gridEnd.setHours(20, 0, 0, 0);
                    const visibleStart = new Date(Math.max(start.getTime(), gridStart.getTime())); const visibleEnd = new Date(Math.min(end.getTime(), gridEnd.getTime()));
                    if (visibleEnd <= visibleStart) return null;
                    const top = ((visibleStart.getTime() - gridStart.getTime()) / 3_600_000) * 64; const height = Math.max(((visibleEnd.getTime() - visibleStart.getTime()) / 3_600_000) * 64, 52);
                    return <div key={`${booking.id}-${day.toISOString()}`} className="absolute inset-x-1 overflow-hidden rounded-lg border border-teal-200 bg-teal-50 p-2 text-xs text-teal-950 shadow-sm" style={{ top, height }} title={`${formatDateTime(booking.startsAt)} – ${formatDateTime(booking.endsAt)}`}><div className="flex items-center justify-between gap-1"><span className="font-bold">{formatTime(booking.startsAt)}–{formatTime(booking.endsAt)}</span><BookingBadge status={booking.status} /></div><p className="mt-1 truncate font-medium">{booking.bookedByName ?? `Employee #${booking.bookedBy}`}</p>{booking.purpose && <p className="truncate text-teal-700">{booking.purpose}</p>}</div>;
                  })}
                </div>)}
              </div>
              {calendarBookings.length === 0 && <p className="mt-4 text-center text-sm text-[var(--af-muted)]">No upcoming reservations for this asset.</p>}
            </div></div>
          )}
          <div className="mt-4 flex items-center gap-2 text-xs text-[var(--af-muted)]"><Clock3 className="h-3.5 w-3.5" /> Timeline displays 08:00–20:00 local time; all bookings retain their precise start and end times.</div>
        </section>
      )}
    </div>
  );
}
