"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, Download, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerificationLog {
  id: number;
  method: string;
  encrypted_value: string;
  value_type: string;
  scanner_version?: string | null;
  source?: string | null;
  scanner_timestamp?: string | null;
  metadata?: {
    document_type?: string;
    status?: string;
    confidence?: number;
    user_name?: string;
    user_email?: string;
    risk_score?: string;
  };
  received_at: string;
}

interface LogStats {
  total: number;
  verified: number;
  flagged: number;
  pending: number;
}

export default function LogsPageClient() {
  const [logs, setLogs] = useState<VerificationLog[]>([]);
  const [stats, setStats] = useState<LogStats>({
    total: 0,
    verified: 0,
    flagged: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch("/api/logs?limit=100");
        const data = await res.json();
        const allLogs = data.logs || [];
        setLogs(allLogs);

        // Calculate stats
        const verified = allLogs.filter(
          (log: VerificationLog) => log.metadata?.status === "verified"
        ).length;
        const flagged = allLogs.filter(
          (log: VerificationLog) => log.metadata?.status === "flagged"
        ).length;
        const pending = allLogs.filter(
          (log: VerificationLog) => log.metadata?.status === "pending"
        ).length;

        setStats({
          total: allLogs.length,
          verified,
          flagged,
          pending,
        });
      } catch (err) {
        console.error("Failed to fetch logs:", err);
      }
    }

    // Initial fetch
    setLoading(true);
    fetchLogs().finally(() => setLoading(false));

    // Set up polling interval (5 seconds)
    const pollInterval = setInterval(() => {
      fetchLogs();
    }, 5000);

    // Cleanup interval on unmount
    return () => clearInterval(pollInterval);
  }, []);

  const filteredLogs = filterStatus
    ? logs.filter((log) => log.metadata?.status === filterStatus)
    : logs;

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "verified":
        return "text-green-400";
      case "flagged":
        return "text-yellow-400";
      case "pending":
        return "text-gray-400";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusBgColor = (status?: string) => {
    switch (status) {
      case "verified":
        return "bg-green-500/10 border-green-500/30";
      case "flagged":
        return "bg-yellow-500/10 border-yellow-500/30";
      case "pending":
        return "bg-gray-500/10 border-gray-500/30";
      default:
        return "bg-muted/20";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Verification Logs</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage all document verification events
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Download CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Verifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>
        <Card className="bg-card/80 border-green-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-400">
              Verified
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">{stats.verified}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.total > 0
                ? ((stats.verified / stats.total) * 100).toFixed(1)
                : 0}
              %
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card/80 border-yellow-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-400">
              Flagged
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-400">{stats.flagged}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.total > 0
                ? ((stats.flagged / stats.total) * 100).toFixed(1)
                : 0}
              %
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card/80 border-gray-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-400">{stats.pending}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.total > 0
                ? ((stats.pending / stats.total) * 100).toFixed(1)
                : 0}
              %
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <div className="flex gap-2">
          <Button
            variant={filterStatus === null ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus(null)}
          >
            All
          </Button>
          <Button
            variant={filterStatus === "verified" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("verified")}
            className={
              filterStatus === "verified"
                ? "bg-green-500/20 border-green-500/30"
                : ""
            }
          >
            Verified ({stats.verified})
          </Button>
          <Button
            variant={filterStatus === "flagged" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("flagged")}
            className={
              filterStatus === "flagged"
                ? "bg-yellow-500/20 border-yellow-500/30"
                : ""
            }
          >
            Flagged ({stats.flagged})
          </Button>
          <Button
            variant={filterStatus === "pending" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("pending")}
            className={
              filterStatus === "pending"
                ? "bg-gray-500/20 border-gray-500/30"
                : ""
            }
          >
            Pending ({stats.pending})
          </Button>
        </div>
      </div>

      {/* Logs List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading logs...
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No logs found for the selected filter.
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className={cn(
                "bg-card/80 border rounded-lg overflow-hidden transition-all",
                getStatusBgColor(log.metadata?.status)
              )}
            >
              {/* Log Header */}
              <button
                onClick={() =>
                  setExpandedId(expandedId === log.id ? null : log.id)
                }
                className="w-full p-4 flex items-center justify-between hover:bg-muted/10 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1 text-left">
                  {/* User Info */}
                  <div className="flex-1">
                    <div className="font-semibold">
                      {log.metadata?.user_name || "Unknown User"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {log.metadata?.user_email || "N/A"}
                    </div>
                  </div>

                  {/* Document Type */}
                  <div>
                    <div className="text-sm font-medium">
                      {log.metadata?.document_type || "N/A"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Document Type
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    <div
                      className={cn(
                        "text-sm font-semibold capitalize",
                        getStatusColor(log.metadata?.status)
                      )}
                    >
                      {log.metadata?.status || "Unknown"}
                    </div>
                    <div className="text-xs text-muted-foreground">Status</div>
                  </div>

                  {/* Confidence */}
                  <div>
                    <div className="text-sm font-medium">
                      {typeof log.metadata?.confidence === "number"
                        ? `${(log.metadata.confidence * 100).toFixed(1)}%`
                        : "N/A"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Confidence
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div>
                    <div className="text-sm font-medium">
                      {log.scanner_timestamp
                        ? new Date(log.scanner_timestamp).toLocaleDateString()
                        : new Date(log.received_at).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Date</div>
                  </div>
                </div>

                {/* Expand Icon */}
                <ChevronDown
                  className={cn(
                    "h-5 w-5 text-muted-foreground transition-transform",
                    expandedId === log.id ? "rotate-180" : ""
                  )}
                />
              </button>

              {/* Log Details */}
              {expandedId === log.id && (
                <div className="border-t border-border/50 p-4 bg-muted/5 space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Log ID
                      </div>
                      <div className="font-mono text-sm">{log.id}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Method
                      </div>
                      <div className="text-sm capitalize">{log.method}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Value Type
                      </div>
                      <div className="text-sm">{log.value_type}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Scanner Version
                      </div>
                      <div className="text-sm">
                        {log.scanner_version || "N/A"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Source
                      </div>
                      <div className="text-sm">{log.source || "N/A"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Risk Score
                      </div>
                      <div className="text-sm">
                        {log.metadata?.risk_score || "N/A"}
                      </div>
                    </div>
                  </div>

                  {/* Timestamps */}
                  <div className="border-t border-border/50 pt-4">
                    <div className="text-xs text-muted-foreground mb-2">
                      Timestamps
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Scan Time</div>
                        <div>
                          {log.scanner_timestamp
                            ? new Date(log.scanner_timestamp).toLocaleString()
                            : "N/A"}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">
                          Received At
                        </div>
                        <div>
                          {new Date(log.received_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="border-t border-border/50 pt-4 flex gap-2">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      Approve
                    </Button>
                    <Button size="sm" variant="outline">
                      Flag
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
