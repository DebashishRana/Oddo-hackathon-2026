"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle, Clock, Eye, FileText, RefreshCw, ShieldCheck, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardAnalytics from "./DashboardAnalytics";

type VerificationRow = {
  id: number;
  document_type: string;
  status: "pending" | "verified" | "flagged" | "failed";
  risk_score: "Low" | "Medium" | "High";
  confidence: number | string | null;
  source: string;
  masked_document_id: string;
  scanner_event_id?: string | null;
  source_app?: string | null;
  scanner_version?: string | null;
  scanner_timestamp?: string | null;
  reason_codes?: string[];
  action_required?: string | null;
  action_history?: unknown[];
  audit_trail?: Array<{
    type: string;
    at: string;
    actor: string;
    hash: string;
  }>;
  received_at: string;
  created_at: string;
  updated_at: string;
};

type VerificationStats = {
  total: number;
  verified: number;
  flagged: number;
  pending: number;
  failed: number;
  high_risk: number;
};

type TrendPoint = {
  date: string;
  verified: number;
  flagged: number;
  pending: number;
  failed?: number;
};

type ApiState = {
  verifications: VerificationRow[];
  stats: VerificationStats;
  trends: TrendPoint[];
};

const emptyState: ApiState = {
  verifications: [],
  stats: {
    total: 0,
    verified: 0,
    flagged: 0,
    pending: 0,
    failed: 0,
    high_risk: 0,
  },
  trends: [],
};

const statusOptions = ["all", "pending", "verified", "flagged", "failed"];
const documentOptions = ["all", "Aadhaar", "PAN", "Passport"];
const riskOptions = ["all", "Low", "Medium", "High"];
const sourceOptions = ["all", "Pending", "UIDAI_FORMAT_FALLBACK", "DIGILOCKER_FALLBACK", "NO_DOCUMENT_ID"];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 16) return "Good afternoon";
  return "Good evening";
}

function getStatusClass(status: VerificationRow["status"]) {
  if (status === "verified") return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
  if (status === "flagged") return "border-amber-500/30 bg-amber-500/10 text-amber-300";
  if (status === "failed") return "border-red-500/30 bg-red-500/10 text-red-300";
  return "border-slate-500/30 bg-slate-500/10 text-slate-300";
}

function getRiskClass(risk: VerificationRow["risk_score"]) {
  if (risk === "Low") return "text-emerald-400";
  if (risk === "High") return "text-red-300";
  return "text-amber-300";
}

function formatDate(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
}

export default function AdminDashboardMockup() {
  const [data, setData] = useState<ApiState>(emptyState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<VerificationRow | null>(null);
  const [status, setStatus] = useState("all");
  const [documentType, setDocumentType] = useState("all");
  const [risk, setRisk] = useState("all");
  const [source, setSource] = useState("all");

  const query = useMemo(() => {
    const params = new URLSearchParams({ limit: "50" });
    if (status !== "all") params.set("status", status);
    if (documentType !== "all") params.set("document_type", documentType);
    if (risk !== "all") params.set("risk", risk);
    if (source !== "all") params.set("source", source);
    return params.toString();
  }, [documentType, risk, source, status]);

  const fetchVerifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/verifications?${query}`, { cache: "no-store" });
      const body = await response.json();
      if (!response.ok || !body.success) {
        throw new Error(body?.message || "Unable to load verification queue");
      }
      setData(body.data || emptyState);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load verification queue");
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchVerifications();
    const interval = window.setInterval(fetchVerifications, 10000);
    return () => window.clearInterval(interval);
  }, [fetchVerifications]);

  const statCards = [
    { label: "Total Verifications", value: data.stats.total, icon: FileText, tone: "text-blue-400" },
    { label: "Verified", value: data.stats.verified, icon: CheckCircle, tone: "text-emerald-400" },
    { label: "Flagged", value: data.stats.flagged, icon: AlertTriangle, tone: "text-amber-300" },
    { label: "Pending", value: data.stats.pending, icon: Clock, tone: "text-slate-300" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex w-full max-w-none flex-col gap-8 px-0 md:px-2 xl:px-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{getGreeting()}, Admin</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Scanner verification queue with cross-check status, risk, and audit trail.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchVerifications} disabled={loading}>
            <RefreshCw className={loading ? "animate-spin" : ""} />
            Refresh
          </Button>
        </div>

        <DashboardAnalytics trends={data.trends} stats={data.stats} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.label} className="bg-card/80">
                <CardHeader className="flex flex-row items-center gap-3 pb-2">
                  <Icon className={`h-5 w-5 ${card.tone}`} />
                  <CardTitle className="text-sm font-medium">{card.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <div className="mt-1 text-xs text-muted-foreground">Live scanner pipeline</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="rounded-lg border border-border bg-card/80 p-4 shadow">
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-semibold">Verification Queue</h2>
                <p className="text-sm text-muted-foreground">Auto-refreshes every 10 seconds.</p>
              </div>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                {[
                  ["Status", status, setStatus, statusOptions],
                  ["Document", documentType, setDocumentType, documentOptions],
                  ["Risk", risk, setRisk, riskOptions],
                  ["Source", source, setSource, sourceOptions],
                ].map(([label, value, setter, options]) => (
                  <label key={label as string} className="text-xs text-muted-foreground">
                    {label as string}
                    <select
                      className="mt-1 h-9 w-full rounded-md border border-input bg-background px-2 text-sm text-foreground"
                      value={value as string}
                      onChange={(event) => (setter as (next: string) => void)(event.target.value)}
                    >
                      {(options as string[]).map((option) => (
                        <option key={option} value={option}>
                          {option === "all" ? "All" : option}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
            </div>

            {error ? <div className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</div> : null}

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="px-3 py-2 text-left font-medium">Event</th>
                    <th className="px-3 py-2 text-left font-medium">Document</th>
                    <th className="px-3 py-2 text-left font-medium">Status</th>
                    <th className="px-3 py-2 text-left font-medium">Risk</th>
                    <th className="px-3 py-2 text-left font-medium">Source</th>
                    <th className="px-3 py-2 text-left font-medium">Updated</th>
                    <th className="px-3 py-2 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && data.verifications.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-3 py-8 text-center text-muted-foreground">Loading verification queue...</td>
                    </tr>
                  ) : data.verifications.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-3 py-8 text-center text-muted-foreground">No verification events found.</td>
                    </tr>
                  ) : (
                    data.verifications.map((verification) => (
                      <tr key={verification.id} className="border-b border-border">
                        <td className="px-3 py-3 font-medium">#{verification.id}</td>
                        <td className="px-3 py-3">
                          <div>{verification.document_type}</div>
                          <div className="text-xs text-muted-foreground">{verification.masked_document_id}</div>
                        </td>
                        <td className="px-3 py-3">
                          <Badge variant="outline" className={getStatusClass(verification.status)}>{verification.status}</Badge>
                        </td>
                        <td className={`px-3 py-3 font-medium ${getRiskClass(verification.risk_score)}`}>{verification.risk_score}</td>
                        <td className="px-3 py-3">{verification.source}</td>
                        <td className="px-3 py-3 text-muted-foreground">{formatDate(verification.updated_at)}</td>
                        <td className="px-3 py-3 text-right">
                          <Button variant="ghost" size="sm" onClick={() => setSelected(verification)}>
                            <Eye />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <aside className="rounded-lg border border-border bg-card/80 p-4 shadow">
            {selected ? (
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">Event #{selected.id}</h2>
                    <p className="text-sm text-muted-foreground">{selected.document_type} verification</p>
                  </div>
                  {selected.status === "verified" ? <ShieldCheck className="h-5 w-5 text-emerald-400" /> : <XCircle className="h-5 w-5 text-amber-300" />}
                </div>

                <div className="grid gap-3 text-sm">
                  <Detail label="Masked ID" value={selected.masked_document_id} />
                  <Detail label="Source" value={selected.source} />
                  <Detail label="Confidence" value={selected.confidence == null ? "-" : String(selected.confidence)} />
                  <Detail label="Scanner" value={[selected.source_app, selected.scanner_version].filter(Boolean).join(" / ") || "-"} />
                  <Detail label="Scanned" value={formatDate(selected.scanner_timestamp)} />
                  <Detail label="Action" value={selected.action_required || "None"} />
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-semibold">Reason Codes</h3>
                  <div className="flex flex-wrap gap-2">
                    {(selected.reason_codes || []).length > 0 ? (
                      selected.reason_codes?.map((reason) => (
                        <Badge key={reason} variant="outline">{reason}</Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">No reason codes yet.</span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-semibold">Audit Trail</h3>
                  <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
                    {(selected.audit_trail || []).length > 0 ? (
                      selected.audit_trail?.slice().reverse().map((event) => (
                        <div key={event.hash} className="rounded-md border border-border p-3">
                          <div className="text-sm font-medium">{event.type}</div>
                          <div className="mt-1 text-xs text-muted-foreground">{event.actor} - {formatDate(event.at)}</div>
                          <div className="mt-2 truncate font-mono text-[11px] text-muted-foreground">{event.hash}</div>
                        </div>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">No audit events yet.</span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex min-h-72 flex-col items-center justify-center text-center text-muted-foreground">
                <ShieldCheck className="mb-3 h-8 w-8" />
                <p className="text-sm">Select a verification to inspect the cross-check result and audit chain.</p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border p-3">
      <div className="text-xs uppercase text-muted-foreground">{label}</div>
      <div className="mt-1 break-words font-medium">{value}</div>
    </div>
  );
}
