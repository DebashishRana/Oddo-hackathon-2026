"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from "recharts";

const COLORS = ["#22c55e", "#facc15", "#64748b"];

type TrendPoint = {
  date: string
  verified: number
  flagged: number
  pending: number
  failed?: number
}

type DashboardAnalyticsProps = {
  trends?: TrendPoint[]
  stats?: {
    verified?: number
    flagged?: number
    pending?: number
  }
}

const fallbackTrends: TrendPoint[] = [
  { date: "No data", verified: 0, flagged: 0, pending: 0 },
];

export default function DashboardAnalytics({ trends = fallbackTrends, stats }: DashboardAnalyticsProps) {
  const verificationTrends = trends.length > 0 ? trends : fallbackTrends
  const statusBreakdown = [
    { name: "Verified", value: Number(stats?.verified || 0) },
    { name: "Flagged", value: Number(stats?.flagged || 0) },
    { name: "Pending", value: Number(stats?.pending || 0) },
  ]
  const flaggedTrends = verificationTrends.map((item) => ({ date: item.date, flagged: item.flagged }))

  return (
    <div className="grid gap-6 md:grid-cols-3 w-full">
      {/* Verifications Over Time */}
      <Card className="bg-card/80">
        <CardHeader>
          <CardTitle className="text-base font-medium">Verifications Over Time</CardTitle>
        </CardHeader>
        <CardContent className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={verificationTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="verified" stroke="#22c55e" strokeWidth={2} name="Verified" />
              <Line type="monotone" dataKey="flagged" stroke="#facc15" strokeWidth={2} name="Flagged" />
              <Line type="monotone" dataKey="pending" stroke="#64748b" strokeWidth={2} name="Pending" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Status Breakdown */}
      <Card className="bg-card/80">
        <CardHeader>
          <CardTitle className="text-base font-medium">Verification Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="h-56 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
              >
                {statusBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Flagged Trends */}
      <Card className="bg-card/80">
        <CardHeader>
          <CardTitle className="text-base font-medium">Flagged Cases Trend</CardTitle>
        </CardHeader>
        <CardContent className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={flaggedTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Bar dataKey="flagged" fill="#facc15" name="Flagged" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
