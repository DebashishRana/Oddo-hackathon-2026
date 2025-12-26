import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Play, Code, Zap } from "lucide-react"

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" asChild>
              <Link href="/" className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Live Demo</h1>
            <div></div>
          </div>
        </div>
      </header>

      {/* Demo Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Experience the
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              {" "}AI SAAS Kit
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore the features and capabilities of our comprehensive toolkit for building AI-powered applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Authentication Demo */}
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-primary" />
                <span>Authentication</span>
              </CardTitle>
              <CardDescription>
                Complete auth system with Clerk.com integration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full" variant="outline">
                  <Play className="w-4 h-4 mr-2" />
                  Try Sign In
                </Button>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/auth/signup">
                    <Play className="w-4 h-4 mr-2" />
                    Try Sign Up
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AI Features Demo */}
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Code className="w-5 h-5 text-primary" />
                <span>AI Integration</span>
              </CardTitle>
              <CardDescription>
                OpenRouter integration with multiple AI models
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full" variant="outline">
                  <Play className="w-4 h-4 mr-2" />
                  Chat Interface
                </Button>
                <Button className="w-full" variant="outline">
                  <Play className="w-4 h-4 mr-2" />
                  Code Generation
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Dashboard Demo */}
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-primary" />
                <span>Dashboard</span>
              </CardTitle>
              <CardDescription>
                Modern dashboard with analytics and management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full" variant="outline">
                  <Play className="w-4 h-4 mr-2" />
                  View Dashboard
                </Button>
                <Button className="w-full" variant="outline">
                  <Play className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coming Soon */}
        <div className="text-center">
          <div className="bg-muted/30 rounded-2xl p-8 border border-border">
            <h3 className="text-2xl font-bold mb-4">Interactive Demo Coming Soon</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              We&apos;re building a fully interactive demo where you can test all features. 
              For now, you can explore the source code and documentation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="https://github.com/your-repo">
                  <Code className="w-4 h-4 mr-2" />
                  View Source Code
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/docs">
                  View Documentation
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
