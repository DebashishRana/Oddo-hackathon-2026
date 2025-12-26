import { auth } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getUserStats, getUserCredits } from "@/lib/database";
import { isAdminEmail } from "@/lib/admin-config";
import Link from "next/link";

export const runtime = 'nodejs';
import {
  Users,
  Activity,
  DollarSign,
  BarChart3,
  Settings,
  UserPlus,
  Calendar,
  MessageSquare,
  User
} from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  const user = session?.user;

  // Check if user is admin
  const isAdmin = isAdminEmail(user?.email);

  // Get user's credits
  let userCredits = 0;
  try {
    userCredits = await getUserCredits(user?.id || '');
  } catch (error) {
    console.error("Error fetching user credits:", error);
  }

  // Get admin statistics only if user is admin
  let userStats;
  if (isAdmin) {
    try {
      userStats = await getUserStats();
    } catch (error) {
      console.error("Error fetching user stats:", error);
      userStats = {
        totalUsers: 0,
        activeToday: 0,
        newThisWeek: 0,
        newThisMonth: 0
      };
    }
  }

  // Admin stats
  const adminStats = userStats ? [
    {
      title: "Total Users",
      value: userStats.totalUsers.toLocaleString(),
      change: `+${userStats.newThisMonth} this month`,
      icon: Users,
    },
    {
      title: "Active Today",
      value: userStats.activeToday.toLocaleString(),
      change: "Users logged in today",
      icon: Activity,
    },
    {
      title: "New This Week",
      value: userStats.newThisWeek.toLocaleString(),
      change: "New registrations",
      icon: UserPlus,
    },
    {
      title: "New This Month",
      value: userStats.newThisMonth.toLocaleString(),
      change: "Monthly growth",
      icon: Calendar,
    },
  ] : [];

  // Regular user stats
  const regularUserStats = [
    {
      title: "Your Credits",
      value: userCredits.toLocaleString(),
      change: "Available for AI chat",
      icon: DollarSign,
    },
    {
      title: "AI Chat",
      value: "Ready",
      change: "Start chatting now",
      icon: MessageSquare,
    },
    {
      title: "Profile",
      value: "Complete",
      change: "Manage your account",
      icon: User,
    },
    {
      title: "Settings",
      value: "Customize",
      change: "Personalize your experience",
      icon: Settings,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isAdmin ? "Admin Dashboard" : `Welcome back, ${user?.name?.split(' ')[0] || "User"}!`}
          </h1>
          <p className="text-muted-foreground">
            {isAdmin
              ? "Here's what's happening with your application."
              : "Ready to start chatting with AI? Check your credits and explore the features below."
            }
          </p>
        </div>
        {isAdmin && (
          <div className="flex space-x-2">
            <Button variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </Button>
            <Button>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {(isAdmin ? adminStats : regularUserStats).map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-blue-600">{stat.change}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{isAdmin ? "Admin Actions" : "Quick Start"}</CardTitle>
            <CardDescription>
              {isAdmin
                ? "Manage your application and users"
                : "Get started with AI chat and features"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {isAdmin ? (
              <>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/admin">Admin Panel</Link>
                </Button>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/admin/users">Manage Users</Link>
                </Button>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/dashboard/analytics">View Analytics</Link>
                </Button>
              </>
            ) : (
              <>
                <Button className="w-full" asChild>
                  <Link href="/dashboard/chat">Start AI Chat</Link>
                </Button>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/dashboard/billing">Billing & Plans</Link>
                </Button>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/dashboard/profile">Edit Profile</Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              {isAdmin ? "System activity and updates" : "Your recent actions"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {isAdmin ? (
                <>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">New user registered</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Credits updated</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">System maintenance</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Account created</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Credits available: {userCredits}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm">Ready to chat with AI</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
            <CardDescription>
              Your current plan and usage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Plan</span>
                <span className="text-sm font-medium">Pro</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">API Calls</span>
                <span className="text-sm font-medium">8,234 / 10,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Storage</span>
                <span className="text-sm font-medium">2.1 GB / 5 GB</span>
              </div>
              <Button className="w-full mt-4" size="sm">
                Upgrade Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
