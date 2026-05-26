"use client"

import { useEffect, useState } from "react"

interface LogMetadata {
  document_type?: string
  status?: string
  confidence?: string | number
}

interface Log {
  id: number
  method: string
  encrypted_value: string
  value_type: string
  scanner_version?: string | null
  source?: string | null
  scanner_timestamp?: string | null
  metadata?: LogMetadata
  received_at: string
}

export default function LogsTable() {
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true)
      const res = await fetch("/api/logs?limit=50")
      const data = await res.json()
      setLogs(data.logs || [])
      setLoading(false)
    }
    fetchLogs()
  }, [])

  return (
    <div className="bg-card/80 rounded-2xl p-6 shadow border border-border mt-8">
      <h2 className="text-lg font-semibold mb-4">Verification Logs</h2>
      {loading ? (
        <div className="text-muted-foreground">Loading...</div>
      ) : logs.length === 0 ? (
        <div className="text-muted-foreground">No logs found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-muted-foreground border-b border-border">
                <th className="px-3 py-2 text-left font-medium">ID</th>
                <th className="px-3 py-2 text-left font-medium">Document Type</th>
                <th className="px-3 py-2 text-left font-medium">Status</th>
                <th className="px-3 py-2 text-left font-medium">Confidence</th>
                <th className="px-3 py-2 text-left font-medium">Source</th>
                <th className="px-3 py-2 text-left font-medium">Scan Time</th>
                <th className="px-3 py-2 text-left font-medium">Received At</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-border">
                  <td className="px-3 py-2">{log.id}</td>
                  <td className="px-3 py-2">{log.metadata?.document_type || '-'}</td>
                  <td className="px-3 py-2">{log.metadata?.status || '-'}</td>
                  <td className="px-3 py-2">{log.metadata?.confidence || '-'}</td>
                  <td className="px-3 py-2">{log.source || '-'}</td>
                  <td className="px-3 py-2">{log.scanner_timestamp ? new Date(log.scanner_timestamp).toLocaleString() : '-'}</td>
                  <td className="px-3 py-2">{new Date(log.received_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
