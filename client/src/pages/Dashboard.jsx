import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Brain,
  Code,
  PlayCircle,
  BarChart3,
  Clock,
  Zap,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for user's agents and workflows
  const recentWorkflows = [
    {
      id: "wf-001",
      name: "Customer Support Agent",
      type: "Conversational Agent",
      status: "active",
      lastRun: "2 hours ago",
      successRate: 94.5,
      totalRuns: 1247,
    },
    {
      id: "wf-002",
      name: "Research Assistant",
      type: "RAG Pipeline",
      status: "draft",
      lastRun: "1 day ago",
      successRate: 97.2,
      totalRuns: 89,
    },
    {
      id: "wf-003",
      name: "Content Generator",
      type: "Creative Agent",
      status: "active",
      lastRun: "30 minutes ago",
      successRate: 91.8,
      totalRuns: 456,
    },
  ];

  const stats = [
    {
      title: "Active Workflows",
      value: "12",
      change: "+3 this week",
      icon: Brain,
      color: "text-blue-600",
    },
    {
      title: "Total Executions",
      value: "2,847",
      change: "+247 today",
      icon: PlayCircle,
      color: "text-green-600",
    },
    {
      title: "Success Rate",
      value: "94.2%",
      change: "+2.1% this month",
      icon: CheckCircle,
      color: "text-purple-600",
    },
    {
      title: "Avg Response Time",
      value: "1.8s",
      change: "-0.3s improved",
      icon: Zap,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">AI Agent Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your AI agents, workflows, and monitor performance
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/composer">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Workflow
              </Button>
            </Link>
            <Link to="/catalog">
              <Button variant="outline">
                <Brain className="w-4 h-4 mr-2" />
                Browse Agents
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-green-600">{stat.change}</p>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center ${stat.color}`}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Recent Workflows */}
              <div className="lg:col-span-2">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Recent Workflows</h3>
                    <Link to="/composer">
                      <Button variant="outline" size="sm">
                        View All
                      </Button>
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {recentWorkflows.map((workflow) => (
                      <div
                        key={workflow.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Brain className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{workflow.name}</h4>
                            <p className="text-sm text-muted-foreground">{workflow.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <Badge variant={workflow.status === "active" ? "default" : "secondary"}>
                              {workflow.status}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              {workflow.successRate}% success rate
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <PlayCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Quick Actions */}
              <div>
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Link to="/composer">
                      <Button variant="outline" className="w-full justify-start">
                        <Code className="w-4 h-4 mr-2" />
                        Create Workflow
                      </Button>
                    </Link>
                    <Link to="/playground">
                      <Button variant="outline" className="w-full justify-start">
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Test Agent
                      </Button>
                    </Link>
                    <Link to="/catalog">
                      <Button variant="outline" className="w-full justify-start">
                        <Brain className="w-4 h-4 mr-2" />
                        Browse Catalog
                      </Button>
                    </Link>
                    <Link to="/stories">
                      <Button variant="outline" className="w-full justify-start">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        View Stories
                      </Button>
                    </Link>
                  </div>
                </Card>

                {/* Recent Activity */}
                <Card className="p-6 mt-6">
                  <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="text-sm">
                        <p className="font-medium">Customer Support Agent executed</p>
                        <p className="text-muted-foreground">2 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="text-sm">
                        <p className="font-medium">New workflow created</p>
                        <p className="text-muted-foreground">1 hour ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div className="text-sm">
                        <p className="font-medium">Research Assistant updated</p>
                        <p className="text-muted-foreground">3 hours ago</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="workflows">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">All Workflows</h3>
                <Link to="/composer">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Workflow
                  </Button>
                </Link>
              </div>
              <div className="space-y-4">
                {recentWorkflows.map((workflow) => (
                  <div
                    key={workflow.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Brain className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{workflow.name}</h4>
                        <p className="text-sm text-muted-foreground">{workflow.type}</p>
                        <p className="text-xs text-muted-foreground">
                          Last run: {workflow.lastRun} • {workflow.totalRuns} total runs
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge variant={workflow.status === "active" ? "default" : "secondary"}>
                          {workflow.status}
                        </Badge>
                        <p className="text-sm font-medium mt-1">{workflow.successRate}% success</p>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <PlayCircle className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Executions</span>
                    <span className="font-semibold">2,847</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Success Rate</span>
                    <span className="font-semibold text-green-600">94.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Avg Response Time</span>
                    <span className="font-semibold">1.8s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Cost</span>
                    <span className="font-semibold">$24.67</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Top Performing Agents</h3>
                <div className="space-y-3">
                  {recentWorkflows.map((workflow, index) => (
                    <div key={workflow.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">#{index + 1}</span>
                        <span className="text-sm">{workflow.name}</span>
                      </div>
                      <span className="text-sm font-medium text-green-600">
                        {workflow.successRate}%
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Dashboard Settings</h3>
              <p className="text-muted-foreground">
                Configure your dashboard preferences, API keys, and notification settings.
              </p>
              <div className="mt-6">
                <Button variant="outline">
                  <Code className="w-4 h-4 mr-2" />
                  Manage API Keys
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
