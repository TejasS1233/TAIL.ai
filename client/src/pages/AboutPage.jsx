import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Brain,
  Zap,
  Users,
  Code,
  Database,
  Bot,
  ArrowRight,
  CheckCircle,
  Star,
  Globe,
} from "lucide-react";

export default function AboutPage() {
  const features = [
    {
      icon: Brain,
      title: "Advanced AI Agents",
      description:
        "Build sophisticated AI agents with retrieval, reasoning, planning, and tool-using capabilities",
    },
    {
      icon: Code,
      title: "Visual Workflow Builder",
      description:
        "Drag-and-drop interface for creating complex LangGraph-compatible workflows without coding",
    },
    {
      icon: Zap,
      title: "Real-time Execution",
      description:
        "Execute workflows with live monitoring, performance metrics, and detailed execution logs",
    },
    {
      icon: Database,
      title: "Comprehensive Integrations",
      description:
        "Connect to OpenAI, Anthropic, vector databases, search engines, and 60+ other components",
    },
    {
      icon: Users,
      title: "Agent Marketplace",
      description:
        "Discover and deploy pre-built agents for customer support, research, content creation, and more",
    },
    {
      icon: Bot,
      title: "Production Ready",
      description:
        "Export workflows as JSON, integrate with existing systems, and scale to production workloads",
    },
  ];

  const stats = [
    { number: "60+", label: "AI Components" },
    { number: "8", label: "Agent Types" },
    { number: "100%", label: "Visual Interface" },
    { number: "∞", label: "Possibilities" },
  ];

  const useCases = [
    {
      title: "Customer Support Automation",
      description:
        "Deploy intelligent agents that handle customer inquiries with sentiment analysis and escalation logic",
      tags: ["Support", "NLP", "Automation"],
    },
    {
      title: "Research & Analysis",
      description:
        "Build agents that gather, analyze, and synthesize information from multiple sources automatically",
      tags: ["Research", "Analysis", "Data"],
    },
    {
      title: "Content Generation",
      description:
        "Create agents for blog posts, social media content, and marketing materials with brand consistency",
      tags: ["Content", "Marketing", "Creative"],
    },
    {
      title: "Data Processing",
      description:
        "Automate data cleaning, visualization, and insights generation with intelligent processing agents",
      tags: ["Data", "Analytics", "Insights"],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <Badge className="mb-4">About Agentic AI Lab</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            The Future of <span className="text-primary">AI Agent Development</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Agentic AI Lab is a comprehensive platform for building, testing, and deploying AI
            agents visually. Create sophisticated workflows without coding, from simple chatbots to
            complex multi-agent systems.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Core Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Use Cases</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {useCases.map((useCase, index) => (
              <Card key={index} className="p-6">
                <h3 className="text-xl font-semibold mb-3">{useCase.title}</h3>
                <p className="text-muted-foreground mb-4">{useCase.description}</p>
                <div className="flex flex-wrap gap-2">
                  {useCase.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="bg-muted/30 rounded-2xl p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Why Choose Agentic AI Lab?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built by AI engineers, for AI engineers. Experience the most comprehensive visual AI
              agent development platform available.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">No Code Required</h3>
              <p className="text-sm text-muted-foreground">
                Build complex AI workflows with our intuitive drag-and-drop interface
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Production Ready</h3>
              <p className="text-sm text-muted-foreground">
                Export workflows and deploy to any infrastructure with full monitoring
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Open Ecosystem</h3>
              <p className="text-sm text-muted-foreground">
                Compatible with LangGraph, LangChain, and all major AI providers
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Build the Future?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of developers already building next-generation AI applications with
            Agentic AI Lab. Start creating your first agent workflow today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/catalog">
              <Button size="lg" className="min-w-48">
                <Brain className="w-5 h-5 mr-2" />
                Explore Agents
              </Button>
            </Link>
            <Link to="/composer">
              <Button size="lg" variant="outline" className="min-w-48">
                <Code className="w-5 h-5 mr-2" />
                Start Building
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
