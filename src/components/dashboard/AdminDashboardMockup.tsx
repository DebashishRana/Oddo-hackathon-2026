"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, AlertTriangle, FileText, CheckCircle, Clock } from "lucide-react";
import DashboardAnalytics from "./DashboardAnalytics";
import LogsTable from "@/components/dashboard/LogsTable";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 16) return "Good afternoon";
  return "Good evening";
}

export default function AdminDashboardMockup() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex flex-col gap-8 px-0 md:px-2 xl:px-4 w-full max-w-none mx-auto" style={{ marginLeft: '-1vw', marginRight: '-1vw', width: '80vw' }}>
        {/* Greeting */}
        <div className="mb-2">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {getGreeting()}, Admin
          </h1>
        </div>

        {/* Analytics Section */}
        <div className="w-full">
          <DashboardAnalytics />
        </div>

        {/* Top Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full">
          <Card className="bg-card/80">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <FileText className="h-6 w-6 text-blue-400" />
              <CardTitle className="text-base font-medium">Total Verifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <div className="text-xs text-muted-foreground mt-1">+5% this week</div>
            </CardContent>
          </Card>
          <Card className="bg-card/80">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <CheckCircle className="h-6 w-6 text-green-400" />
              <CardTitle className="text-base font-medium">Verified</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,100</div>
              <div className="text-xs text-muted-foreground mt-1">+3% this week</div>
            </CardContent>
          </Card>
          <Card className="bg-card/80">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <AlertTriangle className="h-6 w-6 text-yellow-400" />
              <CardTitle className="text-base font-medium">Flagged</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <div className="text-xs text-muted-foreground mt-1">-2% this week</div>
            </CardContent>
          </Card>
          <Card className="bg-card/80">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <Clock className="h-6 w-6 text-gray-400" />
              <CardTitle className="text-base font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <div className="text-xs text-muted-foreground mt-1">0% change</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Verifications Table Mockup */}
        <div className="bg-card/80 rounded-2xl p-6 shadow border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Verifications</h2>
            <button className="text-blue-400 hover:underline text-sm">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-muted-foreground border-b border-border">
                  <th className="px-3 py-2 text-left font-medium">Request ID</th>
                  <th className="px-3 py-2 text-left font-medium">Applicant</th>
                  <th className="px-3 py-2 text-left font-medium">Document</th>
                  <th className="px-3 py-2 text-left font-medium">Date</th>
                  <th className="px-3 py-2 text-left font-medium">Status</th>
                  <th className="px-3 py-2 text-left font-medium">Risk Score</th>
                  <th className="px-3 py-2 text-left font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {/* Example rows */}
                <tr className="border-b border-border">
                  <td className="px-3 py-2">REQ-00123</td>
                  <td className="px-3 py-2">Jane Doe</td>
                  <td className="px-3 py-2">Aadhaar</td>
                  <td className="px-3 py-2">2026-04-24</td>
                  <td className="px-3 py-2 text-green-400">Verified</td>
                  <td className="px-3 py-2">Low</td>
                  <td className="px-3 py-2"><button className="text-blue-400 hover:underline">View</button></td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-3 py-2">REQ-00124</td>
                  <td className="px-3 py-2">John Smith</td>
                  <td className="px-3 py-2">PAN</td>
                  <td className="px-3 py-2">2026-04-24</td>
                  <td className="px-3 py-2 text-yellow-400">Flagged</td>
                  <td className="px-3 py-2">Medium</td>
                  <td className="px-3 py-2"><button className="text-blue-400 hover:underline">Review</button></td>
                </tr>
                <tr>
                  <td className="px-3 py-2">REQ-00125</td>
                  <td className="px-3 py-2">Priya Patel</td>
                  <td className="px-3 py-2">Passport</td>
                  <td className="px-3 py-2">2026-04-23</td>
                  <td className="px-3 py-2 text-gray-400">Pending</td>
                  <td className="px-3 py-2">High</td>
                  <td className="px-3 py-2"><button className="text-blue-400 hover:underline">Verify</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Dashboard Logs Section */}
        <div className="bg-card/80 rounded-2xl p-6 shadow border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Dashboard Logs</h2>
            <button className="text-blue-400 hover:underline text-sm">View All</button>
          </div>
          <div className="overflow-x-auto">
            <LogsTable />
          </div>
        </div>
      </div>
    </div>
  );
}
