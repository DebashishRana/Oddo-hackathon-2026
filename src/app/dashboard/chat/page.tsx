import { ChatInterface } from "@/components/chat/chat-interface";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Brain, 
  Sparkles,
  Clock,
  BarChart3
} from "lucide-react";

export default function ChatPage() {
  const features = [
    {
      icon: Brain,
      title: "Advanced AI Model",
      description: "Powered by Qwen3-235B for intelligent responses"
    },
    {
      icon: Zap,
      title: "Real-time Responses",
      description: "Get instant answers to your questions"
    },
    {
      icon: Sparkles,
      title: "Context Aware",
      description: "Maintains conversation context for better understanding"
    },
    {
      icon: Clock,
      title: "24/7 Available",
      description: "AI assistant ready whenever you need help"
    }
  ];

  const usageStats = [
    { label: "Messages Today", value: "12", limit: "100" },
    { label: "Tokens Used", value: "2,450", limit: "10,000" },
    { label: "Conversations", value: "3", limit: "∞" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Chat Assistant</h1>
        <p className="text-muted-foreground">
          Interact with our advanced AI model for assistance, analysis, and creative tasks.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Chat Interface - Takes up 3 columns */}
        <div className="lg:col-span-3">
          <ChatInterface 
            className="h-[600px]"
            title="AI Assistant"
            placeholder="Ask me anything about your business, get help with tasks, or explore ideas..."
          />
        </div>

        {/* Sidebar - Takes up 1 column */}
        <div className="space-y-6">
          {/* Usage Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="h-4 w-4" />
                Usage Today
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {usageStats.map((stat, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{stat.label}</span>
                    <span className="font-medium">{stat.value}/{stat.limit}</span>
                  </div>
                  {stat.limit !== "∞" && (
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ 
                          width: `${(parseInt(stat.value.replace(',', '')) / parseInt(stat.limit.replace(',', ''))) * 100}%` 
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">AI Capabilities</CardTitle>
              <CardDescription>
                What our AI assistant can help you with
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg shrink-0">
                    <feature.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">{feature.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Model Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Current Model</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Model</span>
                <Badge variant="secondary">Qwen3-235B</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Provider</span>
                <Badge variant="outline">OpenRouter</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Online</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid gap-2">
                <button className="text-left p-2 text-sm hover:bg-muted rounded-md transition-colors">
                  💡 Generate business ideas
                </button>
                <button className="text-left p-2 text-sm hover:bg-muted rounded-md transition-colors">
                  📊 Analyze data trends
                </button>
                <button className="text-left p-2 text-sm hover:bg-muted rounded-md transition-colors">
                  ✍️ Write marketing copy
                </button>
                <button className="text-left p-2 text-sm hover:bg-muted rounded-md transition-colors">
                  🔍 Research topics
                </button>
                <button className="text-left p-2 text-sm hover:bg-muted rounded-md transition-colors">
                  🎯 Plan strategies
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
