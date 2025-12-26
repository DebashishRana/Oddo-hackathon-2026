import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  Code,
  Database,
  Shield,
  CreditCard,
  Bot,
  BarChart3,
  Palette,
  Globe,
  Settings,
  Users,
  MessageSquare,
  Zap,
  ExternalLink,
  Mail
} from "lucide-react"
import Link from "next/link"

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Best SAAS Kit V2 Documentation
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Complete guide to building and deploying AI-powered SAAS applications with our comprehensive starter kit
            </p>
            <div className="flex justify-center gap-2 mt-6">
              <Badge variant="secondary">Next.js 15</Badge>
              <Badge variant="secondary">TypeScript</Badge>
              <Badge variant="secondary">Tailwind CSS</Badge>
              <Badge variant="secondary">PostgreSQL</Badge>
              <Badge variant="secondary">Stripe</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Table of Contents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <nav className="space-y-1">
                    <a href="#overview" className="block text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                      Overview
                    </a>
                    <a href="#features" className="block text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
                      Features
                    </a>
                    <a href="#tech-stack" className="block text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
                      Tech Stack
                    </a>
                    <a href="#prerequisites" className="block text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
                      Prerequisites
                    </a>
                    <a href="#installation" className="block text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
                      Installation
                    </a>
                    <a href="#setup" className="block text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
                      Setup Guide
                    </a>
                    <a href="#project-structure" className="block text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
                      Project Structure
                    </a>
                    <a href="#usage" className="block text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
                      Usage Guide
                    </a>
                    <a href="#customization" className="block text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
                      Customization
                    </a>
                    <a href="#deployment" className="block text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
                      Deployment
                    </a>
                    <a href="#environment" className="block text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
                      Environment Variables
                    </a>
                    <a href="#troubleshooting" className="block text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
                      Troubleshooting
                    </a>
                  </nav>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Overview Section */}
            <section id="overview">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Project Overview
                  </CardTitle>
                  <CardDescription>
                    Best SAAS Kit V2 is a production-ready, feature-complete SAAS starter kit built with Next.js 15, 
                    designed to help developers launch AI-powered applications quickly and efficiently.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    This comprehensive starter kit provides everything you need to build a modern SAAS application, 
                    including authentication, payment processing, AI integration, user management, and a beautiful 
                    responsive interface.
                  </p>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">What makes it special?</h4>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                      <li>• Complete authentication system with Google OAuth</li>
                      <li>• Integrated payment processing with Stripe</li>
                      <li>• AI-powered chat interface with multiple models</li>
                      <li>• Admin panel with analytics and user management</li>
                      <li>• Modern UI with dark/light theme support</li>
                      <li>• Production-ready with comprehensive error handling</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Features Section */}
            <section id="features">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold">Authentication & Security</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            NextAuth.js with Google OAuth, protected routes, session management, and role-based access control.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <CreditCard className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold">Payment & Billing</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Stripe integration with Pro plan subscriptions, billing dashboard, and webhook handling.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Bot className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold">AI Integration</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            OpenRouter API with multiple AI models, interactive chat interface, and credit-based usage system.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <BarChart3 className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold">Analytics & Dashboard</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            User analytics, revenue tracking, credit monitoring, and comprehensive admin panel.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Palette className="h-5 w-5 text-pink-500 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold">Modern UI/UX</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Tailwind CSS v4, ShadCN UI components, dark/light themes, and responsive design.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Database className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold">Database</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Neon PostgreSQL with custom functions, user management, and subscription tracking.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Tech Stack Section */}
            <section id="tech-stack">
              <Card>
                <CardHeader>
                  <CardTitle>Technology Stack</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-blue-600 dark:text-blue-400">Frontend</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Next.js 15 with App Router
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          TypeScript
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Tailwind CSS v4
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          ShadCN UI Components
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Framer Motion
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 text-green-600 dark:text-green-400">Backend & Database</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          NextAuth.js
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Neon PostgreSQL
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          API Routes
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Middleware Protection
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 text-purple-600 dark:text-purple-400">Integrations</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Stripe Payments
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          OpenRouter AI
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Google OAuth
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Vercel Deployment
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Prerequisites Section */}
            <section id="prerequisites">
              <Card>
                <CardHeader>
                  <CardTitle>Prerequisites</CardTitle>
                  <CardDescription>
                    Before you begin, ensure you have the following installed and accounts created
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Required Software</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Node.js (version 18 or higher)
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          npm, yarn, or pnpm
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Git
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Code editor (VS Code recommended)
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Required Accounts</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <ExternalLink className="h-4 w-4 text-blue-500" />
                          <Link href="https://console.cloud.google.com/" target="_blank" className="text-blue-600 hover:text-blue-800">
                            Google Cloud Console
                          </Link>
                        </li>
                        <li className="flex items-center gap-2">
                          <ExternalLink className="h-4 w-4 text-blue-500" />
                          <Link href="https://neon.tech/" target="_blank" className="text-blue-600 hover:text-blue-800">
                            Neon Database
                          </Link>
                        </li>
                        <li className="flex items-center gap-2">
                          <ExternalLink className="h-4 w-4 text-blue-500" />
                          <Link href="https://stripe.com/" target="_blank" className="text-blue-600 hover:text-blue-800">
                            Stripe
                          </Link>
                        </li>
                        <li className="flex items-center gap-2">
                          <ExternalLink className="h-4 w-4 text-blue-500" />
                          <Link href="https://openrouter.ai/" target="_blank" className="text-blue-600 hover:text-blue-800">
                            OpenRouter
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Installation Section */}
            <section id="installation">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Start Installation</CardTitle>
                  <CardDescription>
                    Get your SAAS application running in minutes with these simple steps
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                        Clone the Repository
                      </h4>
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                        <code className="text-sm">
                          git clone https://github.com/zainulabedeen123/Best-Saas-Kit--V2.git<br/>
                          cd Best-Saas-Kit--V2
                        </code>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                        Install Dependencies
                      </h4>
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                        <code className="text-sm">
                          npm install<br/>
                          # or<br/>
                          yarn install<br/>
                          # or<br/>
                          pnpm install
                        </code>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                        Environment Setup
                      </h4>
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                        <code className="text-sm">
                          cp .env.example .env.local
                        </code>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                        Fill in your environment variables in <code>.env.local</code> (see detailed setup below)
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
                        Start Development Server
                      </h4>
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                        <code className="text-sm">
                          npm run dev
                        </code>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                        Open <Link href="http://localhost:3000" className="text-blue-600 hover:text-blue-800">http://localhost:3000</Link> to see your application
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Setup Guide Section */}
            <section id="setup">
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Setup Guide</CardTitle>
                  <CardDescription>
                    Configure all integrations and services for your SAAS application
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {/* Database Setup */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Database className="h-5 w-5 text-green-600" />
                        Database Setup (Neon)
                      </h3>
                      <div className="space-y-4">
                        <div className="border-l-4 border-green-500 pl-4">
                          <h4 className="font-medium mb-2">1. Create Neon Account</h4>
                          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <li>• Go to <Link href="https://neon.tech/" target="_blank" className="text-blue-600 hover:text-blue-800">neon.tech</Link></li>
                            <li>• Sign up for a free account</li>
                            <li>• Create a new project</li>
                          </ul>
                        </div>

                        <div className="border-l-4 border-green-500 pl-4">
                          <h4 className="font-medium mb-2">2. Get Connection String</h4>
                          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <li>• In your Neon dashboard, go to &quot;Connection Details&quot;</li>
                            <li>• Copy the connection string</li>
                            <li>• Add it to your <code>.env.local</code> as <code>DATABASE_URL</code></li>
                          </ul>
                        </div>

                        <div className="border-l-4 border-green-500 pl-4">
                          <h4 className="font-medium mb-2">3. Initialize Database</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            The database tables will be created automatically when you first run the app.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Google OAuth Setup */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Shield className="h-5 w-5 text-blue-600" />
                        Google OAuth Setup
                      </h3>
                      <div className="space-y-4">
                        <div className="border-l-4 border-blue-500 pl-4">
                          <h4 className="font-medium mb-2">1. Google Cloud Console Setup</h4>
                          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <li>• Go to <Link href="https://console.cloud.google.com/" target="_blank" className="text-blue-600 hover:text-blue-800">Google Cloud Console</Link></li>
                            <li>• Create a new project or select existing one</li>
                            <li>• Enable the Google+ API</li>
                          </ul>
                        </div>

                        <div className="border-l-4 border-blue-500 pl-4">
                          <h4 className="font-medium mb-2">2. Create OAuth Credentials</h4>
                          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <li>• Go to &quot;Credentials&quot; → &quot;Create Credentials&quot; → &quot;OAuth 2.0 Client IDs&quot;</li>
                            <li>• Choose &quot;Web application&quot;</li>
                            <li>• Add authorized redirect URIs:</li>
                            <li className="ml-4">- <code>http://localhost:3000/api/auth/callback/google</code> (development)</li>
                            <li className="ml-4">- <code>https://yourdomain.com/api/auth/callback/google</code> (production)</li>
                          </ul>
                        </div>

                        <div className="border-l-4 border-blue-500 pl-4">
                          <h4 className="font-medium mb-2">3. Add to Environment</h4>
                          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 mt-2">
                            <code className="text-sm">
                              GOOGLE_CLIENT_ID=your-google-client-id<br/>
                              GOOGLE_CLIENT_SECRET=your-google-client-secret
                            </code>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stripe Setup */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-purple-600" />
                        Stripe Setup
                      </h3>
                      <div className="space-y-4">
                        <div className="border-l-4 border-purple-500 pl-4">
                          <h4 className="font-medium mb-2">1. Create Stripe Account</h4>
                          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <li>• Sign up at <Link href="https://stripe.com/" target="_blank" className="text-blue-600 hover:text-blue-800">stripe.com</Link></li>
                            <li>• Complete account verification</li>
                          </ul>
                        </div>

                        <div className="border-l-4 border-purple-500 pl-4">
                          <h4 className="font-medium mb-2">2. Get API Keys</h4>
                          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <li>• Go to Developers → API Keys</li>
                            <li>• Copy your publishable and secret keys</li>
                          </ul>
                          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 mt-2">
                            <code className="text-sm">
                              NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...<br/>
                              STRIPE_SECRET_KEY=sk_test_...
                            </code>
                          </div>
                        </div>

                        <div className="border-l-4 border-purple-500 pl-4">
                          <h4 className="font-medium mb-2">3. Setup Webhooks</h4>
                          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <li>• Go to Developers → Webhooks</li>
                            <li>• Add endpoint: <code>https://yourdomain.com/api/stripe/webhook</code></li>
                            <li>• Select events: <code>checkout.session.completed</code>, <code>payment_intent.succeeded</code></li>
                            <li>• Copy webhook secret to <code>.env.local</code></li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* OpenRouter Setup */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Bot className="h-5 w-5 text-orange-600" />
                        OpenRouter Setup
                      </h3>
                      <div className="space-y-4">
                        <div className="border-l-4 border-orange-500 pl-4">
                          <h4 className="font-medium mb-2">1. Create OpenRouter Account</h4>
                          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <li>• Sign up at <Link href="https://openrouter.ai/" target="_blank" className="text-blue-600 hover:text-blue-800">openrouter.ai</Link></li>
                            <li>• Add credits to your account</li>
                          </ul>
                        </div>

                        <div className="border-l-4 border-orange-500 pl-4">
                          <h4 className="font-medium mb-2">2. Get API Key</h4>
                          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <li>• Go to Keys section</li>
                            <li>• Create a new API key</li>
                          </ul>
                          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 mt-2">
                            <code className="text-sm">
                              OPENROUTER_API_KEY=sk-or-v1-...<br/>
                              OPENROUTER_MODEL=qwen/qwen3-235b-a22b-2507
                            </code>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Resend Email Setup */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Mail className="h-5 w-5 text-red-600" />
                        Email Setup (Resend)
                      </h3>
                      <div className="space-y-4">
                        <div className="border-l-4 border-red-500 pl-4">
                          <h4 className="font-medium mb-2">1. Create Resend Account</h4>
                          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <li>• Sign up at <Link href="https://resend.com/" target="_blank" className="text-blue-600 hover:text-blue-800">resend.com</Link></li>
                            <li>• Verify your email address</li>
                            <li>• Add your domain for sending emails</li>
                          </ul>
                        </div>

                        <div className="border-l-4 border-red-500 pl-4">
                          <h4 className="font-medium mb-2">2. Get API Key</h4>
                          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <li>• Go to API Keys section</li>
                            <li>• Create a new API key</li>
                          </ul>
                          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 mt-2">
                            <code className="text-sm">
                              RESEND_API_KEY=re_your-resend-api-key<br/>
                              FROM_EMAIL=onboarding@yourdomain.com<br/>
                              SUPPORT_EMAIL=support@yourdomain.com
                            </code>
                          </div>
                        </div>

                        <div className="border-l-4 border-red-500 pl-4">
                          <h4 className="font-medium mb-2">3. Email Features</h4>
                          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <li>• Welcome emails for new users</li>
                            <li>• Subscription confirmation emails</li>
                            <li>• Contact form submissions</li>
                            <li>• Password reset emails (future feature)</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Project Structure Section */}
            <section id="project-structure">
              <Card>
                <CardHeader>
                  <CardTitle>Project Structure</CardTitle>
                  <CardDescription>
                    Understanding the organization and architecture of the codebase
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm">
{`best-saas-kit-v2/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # Admin panel pages
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # User dashboard
│   │   ├── demo/              # Demo page
│   │   └── page.tsx           # Landing page
│   ├── components/            # React components
│   │   ├── admin/             # Admin components
│   │   ├── auth/              # Auth components
│   │   ├── billing/           # Billing components
│   │   ├── chat/              # AI chat components
│   │   ├── dashboard/         # Dashboard components
│   │   ├── landing/           # Landing page components
│   │   └── ui/                # UI components (ShadCN)
│   ├── lib/                   # Utility functions
│   │   ├── auth.ts            # NextAuth configuration
│   │   ├── database.ts        # Database functions
│   │   ├── stripe.ts          # Stripe utilities
│   │   └── ...
│   ├── hooks/                 # Custom React hooks
│   ├── types/                 # TypeScript type definitions
│   └── middleware.ts          # Next.js middleware
├── public/                    # Static assets
├── .env.example              # Environment variables template
├── .env.local                # Your environment variables (not in git)
├── package.json              # Dependencies and scripts
├── tailwind.config.js        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration`}
                    </pre>
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Key Directories</h4>
                      <ul className="text-sm space-y-1">
                        <li><code>src/app/</code> - Next.js 15 App Router pages and layouts</li>
                        <li><code>src/components/</code> - Reusable React components</li>
                        <li><code>src/lib/</code> - Utility functions and configurations</li>
                        <li><code>src/hooks/</code> - Custom React hooks</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Important Files</h4>
                      <ul className="text-sm space-y-1">
                        <li><code>middleware.ts</code> - Route protection and authentication</li>
                        <li><code>lib/auth.ts</code> - NextAuth.js configuration</li>
                        <li><code>lib/database.ts</code> - Database connection and queries</li>
                        <li><code>lib/stripe.ts</code> - Payment processing utilities</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Usage Guide Section */}
            <section id="usage">
              <Card>
                <CardHeader>
                  <CardTitle>Usage Guide</CardTitle>
                  <CardDescription>
                    How to use and navigate the different features of your SAAS application
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Globe className="h-5 w-5 text-blue-500" />
                        Landing Page
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        The landing page includes:
                      </p>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 ml-4">
                        <li>• Hero section with call-to-action</li>
                        <li>• Features showcase</li>
                        <li>• Pricing section</li>
                        <li>• Testimonials</li>
                        <li>• Footer with links</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Users className="h-5 w-5 text-green-500" />
                        User Authentication
                      </h4>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 ml-4">
                        <li>• Users can sign in with Google OAuth</li>
                        <li>• Automatic user creation in database</li>
                        <li>• Session management with NextAuth</li>
                        <li>• Protected routes for authenticated users</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-purple-500" />
                        Dashboard Features
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          <li>• <strong>Overview:</strong> User stats and quick actions</li>
                          <li>• <strong>Chat:</strong> AI-powered chat interface</li>
                          <li>• <strong>Analytics:</strong> Usage statistics and insights</li>
                        </ul>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          <li>• <strong>Billing:</strong> Subscription management</li>
                          <li>• <strong>Profile:</strong> User profile management</li>
                          <li>• <strong>Settings:</strong> Account preferences</li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Settings className="h-5 w-5 text-orange-500" />
                        Admin Panel
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        Admin users (configured via email) get access to:
                      </p>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 ml-4">
                        <li>• User management and analytics</li>
                        <li>• Revenue tracking</li>
                        <li>• System-wide statistics</li>
                        <li>• User activity monitoring</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-blue-500" />
                        AI Chat
                      </h4>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 ml-4">
                        <li>• Interactive chat interface</li>
                        <li>• Multiple AI models via OpenRouter</li>
                        <li>• Credit-based usage system</li>
                        <li>• Real-time streaming responses</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Customization Section */}
            <section id="customization">
              <Card>
                <CardHeader>
                  <CardTitle>Customization</CardTitle>
                  <CardDescription>
                    How to customize and extend the application for your specific needs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Palette className="h-5 w-5 text-pink-500" />
                        Styling
                      </h4>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                        <li>• Modify <code>src/app/globals.css</code> for global styles</li>
                        <li>• Update <code>tailwind.config.js</code> for Tailwind customization</li>
                        <li>• Edit components in <code>src/components/ui/</code> for UI changes</li>
                        <li>• Customize theme colors and fonts in the configuration files</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Settings className="h-5 w-5 text-blue-500" />
                        Configuration
                      </h4>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                        <li>• Update <code>src/lib/stripe.ts</code> for pricing changes</li>
                        <li>• Modify <code>src/lib/database.ts</code> for database schema changes</li>
                        <li>• Edit <code>src/middleware.ts</code> for route protection</li>
                        <li>• Configure admin emails in environment variables</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Bot className="h-5 w-5 text-purple-500" />
                        AI Models
                      </h4>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                        <li>• Change AI models in <code>.env.local</code> (<code>OPENROUTER_MODEL</code>)</li>
                        <li>• Modify chat interface in <code>src/components/chat/</code></li>
                        <li>• Update credit costs in <code>src/lib/database.ts</code></li>
                        <li>• Add new AI providers by extending the API routes</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Deployment Section */}
            <section id="deployment">
              <Card>
                <CardHeader>
                  <CardTitle>Deployment</CardTitle>
                  <CardDescription>
                    Deploy your SAAS application to production
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Globe className="h-5 w-5 text-blue-500" />
                        Vercel (Recommended)
                      </h4>
                      <div className="space-y-3">
                        <div className="border-l-4 border-blue-500 pl-4">
                          <h5 className="font-medium mb-1">1. Connect Repository</h5>
                          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <li>• Go to <Link href="https://vercel.com/" target="_blank" className="text-blue-600 hover:text-blue-800">vercel.com</Link></li>
                            <li>• Import your GitHub repository</li>
                          </ul>
                        </div>

                        <div className="border-l-4 border-blue-500 pl-4">
                          <h5 className="font-medium mb-1">2. Environment Variables</h5>
                          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <li>• Add all environment variables from <code>.env.local</code></li>
                            <li>• Update <code>NEXTAUTH_URL</code> and <code>NEXT_PUBLIC_SITE_URL</code> to your domain</li>
                          </ul>
                        </div>

                        <div className="border-l-4 border-blue-500 pl-4">
                          <h5 className="font-medium mb-1">3. Deploy</h5>
                          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <li>• Vercel will automatically deploy your application</li>
                            <li>• Set up custom domain if needed</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Other Platforms</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        The application can be deployed to any platform that supports Next.js:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          <li>• <strong>Netlify:</strong> Use <code>npm run build</code> and deploy the <code>.next</code> folder</li>
                          <li>• <strong>Railway:</strong> Connect your GitHub repository</li>
                        </ul>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          <li>• <strong>DigitalOcean App Platform:</strong> Use the Next.js template</li>
                          <li>• <strong>AWS Amplify:</strong> Connect your repository and configure build settings</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Environment Variables Section */}
            <section id="environment">
              <Card>
                <CardHeader>
                  <CardTitle>Environment Variables</CardTitle>
                  <CardDescription>
                    Complete reference for all required and optional environment variables
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 font-semibold">Variable</th>
                          <th className="text-left py-2 font-semibold">Description</th>
                          <th className="text-left py-2 font-semibold">Required</th>
                          <th className="text-left py-2 font-semibold">Example</th>
                        </tr>
                      </thead>
                      <tbody className="space-y-2">
                        <tr className="border-b">
                          <td className="py-2"><code>NEXTAUTH_URL</code></td>
                          <td className="py-2">Your site URL</td>
                          <td className="py-2"><CheckCircle className="h-4 w-4 text-green-500" /></td>
                          <td className="py-2"><code>http://localhost:3000</code></td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2"><code>NEXTAUTH_SECRET</code></td>
                          <td className="py-2">NextAuth secret key</td>
                          <td className="py-2"><CheckCircle className="h-4 w-4 text-green-500" /></td>
                          <td className="py-2"><code>your-secret-key</code></td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2"><code>GOOGLE_CLIENT_ID</code></td>
                          <td className="py-2">Google OAuth client ID</td>
                          <td className="py-2"><CheckCircle className="h-4 w-4 text-green-500" /></td>
                          <td className="py-2"><code>123456789.apps.googleusercontent.com</code></td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2"><code>GOOGLE_CLIENT_SECRET</code></td>
                          <td className="py-2">Google OAuth client secret</td>
                          <td className="py-2"><CheckCircle className="h-4 w-4 text-green-500" /></td>
                          <td className="py-2"><code>GOCSPX-...</code></td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2"><code>DATABASE_URL</code></td>
                          <td className="py-2">Neon PostgreSQL connection string</td>
                          <td className="py-2"><CheckCircle className="h-4 w-4 text-green-500" /></td>
                          <td className="py-2"><code>postgresql://user:pass@host/db</code></td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2"><code>STRIPE_SECRET_KEY</code></td>
                          <td className="py-2">Stripe secret key</td>
                          <td className="py-2"><CheckCircle className="h-4 w-4 text-green-500" /></td>
                          <td className="py-2"><code>sk_test_...</code></td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2"><code>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code></td>
                          <td className="py-2">Stripe publishable key</td>
                          <td className="py-2"><CheckCircle className="h-4 w-4 text-green-500" /></td>
                          <td className="py-2"><code>pk_test_...</code></td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2"><code>STRIPE_WEBHOOK_SECRET</code></td>
                          <td className="py-2">Stripe webhook secret</td>
                          <td className="py-2"><CheckCircle className="h-4 w-4 text-green-500" /></td>
                          <td className="py-2"><code>whsec_...</code></td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2"><code>OPENROUTER_API_KEY</code></td>
                          <td className="py-2">OpenRouter API key</td>
                          <td className="py-2"><CheckCircle className="h-4 w-4 text-green-500" /></td>
                          <td className="py-2"><code>sk-or-v1-...</code></td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2"><code>OPENROUTER_MODEL</code></td>
                          <td className="py-2">AI model to use</td>
                          <td className="py-2"><CheckCircle className="h-4 w-4 text-green-500" /></td>
                          <td className="py-2"><code>qwen/qwen3-235b-a22b-2507</code></td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2"><code>RESEND_API_KEY</code></td>
                          <td className="py-2">Resend email API key</td>
                          <td className="py-2"><CheckCircle className="h-4 w-4 text-green-500" /></td>
                          <td className="py-2"><code>re_your-resend-api-key</code></td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2"><code>FROM_EMAIL</code></td>
                          <td className="py-2">Email address for sending emails</td>
                          <td className="py-2">Optional</td>
                          <td className="py-2"><code>onboarding@yourdomain.com</code></td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2"><code>SUPPORT_EMAIL</code></td>
                          <td className="py-2">Support email address</td>
                          <td className="py-2">Optional</td>
                          <td className="py-2"><code>support@yourdomain.com</code></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Troubleshooting Section */}
            <section id="troubleshooting">
              <Card>
                <CardHeader>
                  <CardTitle>Troubleshooting</CardTitle>
                  <CardDescription>
                    Common issues and their solutions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-red-600 dark:text-red-400">Common Issues</h4>

                      <div className="space-y-4">
                        <div className="border border-red-200 dark:border-red-800 rounded-lg p-4">
                          <h5 className="font-medium mb-2">Database Connection Error</h5>
                          <div className="bg-red-50 dark:bg-red-900/20 rounded p-2 mb-2">
                            <code className="text-sm">Error: connect ECONNREFUSED</code>
                          </div>
                          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <li>• Check your <code>DATABASE_URL</code> in <code>.env.local</code></li>
                            <li>• Ensure your Neon database is running</li>
                            <li>• Verify the connection string format</li>
                          </ul>
                        </div>

                        <div className="border border-red-200 dark:border-red-800 rounded-lg p-4">
                          <h5 className="font-medium mb-2">Google OAuth Error</h5>
                          <div className="bg-red-50 dark:bg-red-900/20 rounded p-2 mb-2">
                            <code className="text-sm">OAuthCallback error</code>
                          </div>
                          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <li>• Verify <code>GOOGLE_CLIENT_ID</code> and <code>GOOGLE_CLIENT_SECRET</code></li>
                            <li>• Check authorized redirect URIs in Google Cloud Console</li>
                            <li>• Ensure <code>NEXTAUTH_URL</code> matches your domain</li>
                          </ul>
                        </div>

                        <div className="border border-red-200 dark:border-red-800 rounded-lg p-4">
                          <h5 className="font-medium mb-2">Stripe Webhook Error</h5>
                          <div className="bg-red-50 dark:bg-red-900/20 rounded p-2 mb-2">
                            <code className="text-sm">Webhook signature verification failed</code>
                          </div>
                          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <li>• Verify <code>STRIPE_WEBHOOK_SECRET</code> in <code>.env.local</code></li>
                            <li>• Check webhook endpoint URL in Stripe dashboard</li>
                            <li>• Ensure webhook is receiving POST requests</li>
                          </ul>
                        </div>

                        <div className="border border-red-200 dark:border-red-800 rounded-lg p-4">
                          <h5 className="font-medium mb-2">AI Chat Not Working</h5>
                          <div className="bg-red-50 dark:bg-red-900/20 rounded p-2 mb-2">
                            <code className="text-sm">OpenRouter API error</code>
                          </div>
                          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <li>• Check <code>OPENROUTER_API_KEY</code> is valid</li>
                            <li>• Verify you have credits in your OpenRouter account</li>
                            <li>• Ensure <code>OPENROUTER_MODEL</code> is available</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 text-blue-600 dark:text-blue-400">Getting Help</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                          <li className="flex items-center gap-2">
                            <ExternalLink className="h-4 w-4 text-blue-500" />
                            <Link href="https://github.com/zainulabedeen123/Best-Saas-Kit--V2/wiki" target="_blank" className="text-blue-600 hover:text-blue-800">
                              Documentation Wiki
                            </Link>
                          </li>
                          <li className="flex items-center gap-2">
                            <ExternalLink className="h-4 w-4 text-blue-500" />
                            <Link href="https://github.com/zainulabedeen123/Best-Saas-Kit--V2/issues" target="_blank" className="text-blue-600 hover:text-blue-800">
                              Report Issues
                            </Link>
                          </li>
                        </ul>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                          <li className="flex items-center gap-2">
                            <ExternalLink className="h-4 w-4 text-blue-500" />
                            <Link href="https://discord.gg/bestsaaskit" target="_blank" className="text-blue-600 hover:text-blue-800">
                              Discord Community
                            </Link>
                          </li>
                          <li className="flex items-center gap-2">
                            <ExternalLink className="h-4 w-4 text-blue-500" />
                            <Link href="mailto:support@bestsaaskit.com" className="text-blue-600 hover:text-blue-800">
                              Email Support
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Footer */}
            <div className="text-center py-8 border-t">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Built with ❤️ by the Best SAAS Kit team
              </p>
              <div className="flex justify-center gap-4 text-sm">
                <Link href="https://bestsaaskit.com" target="_blank" className="text-blue-600 hover:text-blue-800">
                  Website
                </Link>
                <Link href="https://github.com/zainulabedeen123/Best-Saas-Kit--V2" target="_blank" className="text-blue-600 hover:text-blue-800">
                  GitHub
                </Link>
                <Link href="https://discord.gg/bestsaaskit" target="_blank" className="text-blue-600 hover:text-blue-800">
                  Discord
                </Link>
                <Link href="https://twitter.com/bestsaaskit" target="_blank" className="text-blue-600 hover:text-blue-800">
                  Twitter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
