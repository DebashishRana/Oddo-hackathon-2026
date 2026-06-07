import { requireAdminAccess } from '@/lib/admin-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, Database, CreditCard, Mail, Shield } from 'lucide-react';
import { getAppBaseUrl, getMarketingBaseUrl, getCookieDomain } from '@/lib/site-url';

export const runtime = 'nodejs';

export default async function AdminSettingsPage() {
  // Require admin access
  await requireAdminAccess();
  const resolvedAppUrl = getAppBaseUrl();
  const resolvedMarketingUrl = getMarketingBaseUrl();
  const cookieDomain = getCookieDomain() || 'Not set';

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">Admin Settings</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage system configuration and settings
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Environment Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Environment Status
            </CardTitle>
            <CardDescription>
              Current environment configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Environment:</span>
              <Badge variant="outline">
                {process.env.NODE_ENV || 'development'}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>App URL:</span>
              <Badge variant="outline">
                {resolvedAppUrl}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Marketing URL:</span>
              <Badge variant="outline">
                {resolvedMarketingUrl}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Cookie Domain:</span>
              <Badge variant="outline">
                {cookieDomain}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Configured Site URL:</span>
              <Badge variant="outline">
                {process.env.NEXT_PUBLIC_SITE_URL || 'Not set'}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Configured App URL:</span>
              <Badge variant="outline">
                {process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'Not set'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Database Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Status
            </CardTitle>
            <CardDescription>
              Database connection information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Database:</span>
              <Badge variant={process.env.DATABASE_URL ? "default" : "destructive"}>
                {process.env.DATABASE_URL ? 'Connected' : 'Not configured'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Stripe Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Stripe Configuration
            </CardTitle>
            <CardDescription>
              Payment processing settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Publishable Key:</span>
              <Badge variant={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? "default" : "destructive"}>
                {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? 'Configured' : 'Missing'}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Secret Key:</span>
              <Badge variant={process.env.STRIPE_SECRET_KEY ? "default" : "destructive"}>
                {process.env.STRIPE_SECRET_KEY ? 'Configured' : 'Missing'}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Webhook Secret:</span>
              <Badge variant={process.env.STRIPE_WEBHOOK_SECRET ? "default" : "destructive"}>
                {process.env.STRIPE_WEBHOOK_SECRET ? 'Configured' : 'Missing'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Email Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Configuration
            </CardTitle>
            <CardDescription>
              Email service settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Resend API:</span>
              <Badge variant={process.env.RESEND_API_KEY ? "default" : "destructive"}>
                {process.env.RESEND_API_KEY ? 'Configured' : 'Missing'}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>From Email:</span>
              <Badge variant="outline">
                {process.env.FROM_EMAIL || 'Not set'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configuration Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration Notes</CardTitle>
          <CardDescription>
            Important information about your current setup
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>• Environment variables are loaded from Vercel environment settings</p>
            <p>• Stripe keys should be production keys for live environment</p>
            <p>• Database URL should point to your production Neon database</p>
            <p>• Make sure all webhook URLs are updated for production domain</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
