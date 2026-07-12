"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "@/lib/api";

type Notification = {
  id: number;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  createdAt: string;
};

type ActivityLog = {
  id: number;
  actorName?: string;
  action: string;
  entityType: string;
  entityId: number;
  metadata: Record<string, unknown>;
  createdAt: string;
};

const btnPrimary =
  "rounded-full bg-[#1677ff] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0b63db] disabled:opacity-60";
const btnSecondary =
  "rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100";

function ErrorMsg({ msg }: { msg: string }) {
  return <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{msg}</p>;
}

function SuccessMsg({ msg }: { msg: string }) {
  return <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{msg}</p>;
}

type TabKey = "notifications" | "activity";

export function NotificationsPanel() {
  const [tab, setTab] = useState<TabKey>("notifications");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const r = await apiFetch("/api/notifications");
      const p = await r.json();
      setNotifications(p?.data?.notifications ?? []);
    } catch {
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadLogs = useCallback(async () => {
    setLogsLoading(true);
    try {
      const r = await apiFetch("/api/notifications/activity");
      const p = await r.json();
      setLogs(p?.data?.logs ?? []);
    } catch {
      // Activity logs might need admin role — fail silently
      setLogs([]);
    } finally {
      setLogsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    if (tab === "activity") loadLogs();
  }, [tab, loadLogs]);

  async function handleMarkRead(id: number) {
    try {
      const r = await apiFetch(`/api/notifications/${id}/read`, { method: "POST", body: JSON.stringify({}) });
      const p = await r.json();
      if (!r.ok) throw new Error(p?.message || "Failed");
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed");
    }
  }

  async function handleMarkAllRead() {
    try {
      const r = await apiFetch("/api/notifications/read-all", { method: "POST", body: JSON.stringify({}) });
      const p = await r.json();
      if (!r.ok) throw new Error(p?.message || "Failed");
      setSuccess("All notifications marked as read.");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed");
    }
  }

  const unread = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-neutral-500">Alerts and activity</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-neutral-950">Notifications</h1>
      </div>

      {success && <SuccessMsg msg={success} />}
      {error && <ErrorMsg msg={error} />}

      <section className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            {[
              { key: "notifications" as TabKey, label: `Notifications${unread > 0 ? ` (${unread})` : ""}` },
              { key: "activity" as TabKey, label: "Activity Log" },
            ].map((t) => (
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
          {tab === "notifications" && unread > 0 && (
            <button className={btnSecondary} onClick={handleMarkAllRead}>Mark all read</button>
          )}
        </div>
      </section>

      {tab === "notifications" && (
        <section className="rounded-[28px] border border-neutral-200 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
          {loading ? (
            <div className="p-6 space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-16 animate-pulse rounded-[20px] bg-neutral-100" />
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-neutral-400">No notifications</p>
          ) : (
            <div className="space-y-0">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start justify-between gap-4 border-b border-neutral-100 px-6 py-4 last:border-0 ${!n.isRead ? "bg-blue-50/30" : ""}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-medium ${n.isRead ? "text-neutral-700" : "text-neutral-950"}`}>{n.title}</p>
                      {!n.isRead && (
                        <span className="h-2 w-2 rounded-full bg-[#1677ff] flex-shrink-0" />
                      )}
                    </div>
                    <p className="mt-1 text-sm text-neutral-500">{n.body}</p>
                    <p className="mt-1 text-xs text-neutral-400">{new Date(n.createdAt).toLocaleString()}</p>
                  </div>
                  {!n.isRead && (
                    <button
                      className="flex-shrink-0 rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-100"
                      onClick={() => handleMarkRead(n.id)}
                    >
                      Mark read
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {tab === "activity" && (
        <section className="rounded-[28px] border border-neutral-200 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
          {logsLoading ? (
            <div className="p-6 space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 animate-pulse rounded-[20px] bg-neutral-100" />
              ))}
            </div>
          ) : logs.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-neutral-400">No activity logs (admin/manager access required)</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-neutral-50 text-xs uppercase tracking-[0.18em] text-neutral-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Action</th>
                    <th className="px-4 py-3 font-semibold">Entity</th>
                    <th className="px-4 py-3 font-semibold">Actor</th>
                    <th className="px-4 py-3 font-semibold">When</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-t border-neutral-100">
                      <td className="px-4 py-3 text-sm font-medium text-neutral-950">{log.action}</td>
                      <td className="px-4 py-3 text-sm text-neutral-600">{log.entityType} #{log.entityId}</td>
                      <td className="px-4 py-3 text-sm text-neutral-500">{log.actorName ?? "—"}</td>
                      <td className="px-4 py-3 text-sm text-neutral-400">{new Date(log.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
