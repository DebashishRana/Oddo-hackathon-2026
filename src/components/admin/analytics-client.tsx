"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface UserStatus {
  subscription_status: string;
  count: string;
}

interface DailySignup {
  date: string;
  count: string;
}

interface MonthlyRevenue {
  month: string;
  revenue: string;
}

interface CreditDistribution {
  credit_range: string;
  user_count: string;
}

interface AnalyticsData {
  users: {
    total: number;
    byStatus: UserStatus[];
    dailySignups: DailySignup[];
    activeUsers: number;
    proUsers: number;
    freeUsers: number;
    [key: string]: unknown;
  };
  revenue: {
    total: number;
    monthlyRevenue: MonthlyRevenue[];
    proUsers: number;
    [key: string]: unknown;
  };
  credits: {
    total: number;
    average: number;
    distribution: CreditDistribution[];
    [key: string]: unknown;
  };
}

interface GrowthMetrics {
  growthRate: number;
  conversionRate: number;
  retentionRate: number;
  currentMonth: number;
  lastMonth: number;
  proUsers: number;
  totalUsers: number;
  retainedUsers?: number;
  [key: string]: unknown;
}

interface AnalyticsClientProps {
  analyticsData: AnalyticsData;
  growthMetrics: GrowthMetrics;
}

export function AnalyticsClient({ analyticsData, growthMetrics }: AnalyticsClientProps) {
  const { users, revenue, credits } = analyticsData;

  // Format dates for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatMonth = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      {/* User Growth Chart */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Daily Signups (Last 30 Days)</CardTitle>
            <CardDescription>New user registrations per day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {users.dailySignups.slice(0, 10).map((day: DailySignup) => (
                <div key={day.date} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {formatDate(day.date)}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ 
                          width: `${Math.min((parseInt(day.count) / Math.max(...users.dailySignups.map((d: DailySignup) => parseInt(d.count)))) * 100, 100)}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8 text-right">
                      {day.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>Revenue generated per month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {revenue.monthlyRevenue.slice(0, 6).map((month: MonthlyRevenue) => (
                <div key={month.month} className="flex items-center justify-between">\n                  <span className="text-sm text-muted-foreground">
                    {formatMonth(month.month)}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ 
                          width: `${Math.min((parseInt(month.revenue) / Math.max(...revenue.monthlyRevenue.map((m: MonthlyRevenue) => parseInt(m.revenue)))) * 100, 100)}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium w-16 text-right">
                      ${month.revenue}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Distribution */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
            <CardDescription>Users by subscription status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.byStatus.map((status: UserStatus) => {
                const percentage = (parseInt(status.count) / users.total) * 100;
                return (
                  <div key={status.subscription_status} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant={status.subscription_status === 'pro' ? 'default' : 'secondary'}>
                          {status.subscription_status === 'pro' ? 'Pro' : 'Free'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {status.count} users
                        </span>
                      </div>
                      <span className="text-sm font-medium">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Credits Distribution</CardTitle>
            <CardDescription>Users by credit balance ranges</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {credits.distribution.map((range: CreditDistribution) => {
                const totalUsers = credits.distribution.reduce((sum: number, r: CreditDistribution) => sum + parseInt(r.user_count), 0);
                const percentage = (parseInt(range.user_count) / totalUsers) * 100;
                return (
                  <div key={range.credit_range} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">
                          {range.credit_range} credits
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {range.user_count} users
                        </span>
                      </div>
                      <span className="text-sm font-medium">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Growth Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Growth Metrics</CardTitle>
          <CardDescription>Key performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {growthMetrics.growthRate > 0 ? '+' : ''}{growthMetrics.growthRate.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Growth Rate</div>
              <div className="text-xs text-muted-foreground mt-1">
                {growthMetrics.currentMonth} this month vs {growthMetrics.lastMonth} last month
              </div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {growthMetrics.conversionRate.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Conversion Rate</div>
              <div className="text-xs text-muted-foreground mt-1">
                {growthMetrics.proUsers} Pro / {growthMetrics.totalUsers} Total
              </div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {growthMetrics.retentionRate.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Retention Rate</div>
              <div className="text-xs text-muted-foreground mt-1">
                {growthMetrics.retainedUsers ?? 0} retained users
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
          <CardDescription>Summary of key metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 text-center">
            <div>
              <div className="text-lg font-semibold">{users.total}</div>
              <div className="text-sm text-muted-foreground">Total Users</div>
            </div>
            <div>
              <div className="text-lg font-semibold">${revenue.total.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Revenue</div>
            </div>
            <div>
              <div className="text-lg font-semibold">{credits.total.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Credits</div>
            </div>
            <div>
              <div className="text-lg font-semibold">{users.activeUsers}</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
