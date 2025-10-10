import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgentMarketplace } from "@/components/AgentMarketplace";
import {
  Search,
  Database,
  Brain,
  Wrench,
  Users,
  Bot,
  Palette,
  Shield,
  Play,
  Code,
  Eye,
  Store,
  BookOpen,
} from "lucide-react";

const agentTypes = [
  {
    id: "retrieval",
    name: "Retrieval Agent",
    description: "RAG pipeline with vector DB + retriever + reader",
    icon: Database,
    color: "bg-blue-500",
    category: "Data",
    complexity: "Beginner",
    useCase: "Document Q&A, Knowledge Base Search",
    demo: "Live RAG Demo",
  },
  {
    id: "reasoning",
    name: "Reasoning Agent",
    description: "Chain-of-thought orchestration with stepwise reasoning",
    icon: Brain,
    color: "bg-purple-500",
    category: "Logic",
    complexity: "Intermediate",
    useCase: "Problem Solving, Analysis",
    demo: "CoT Workflow",
  },
  {
    id: "planner",
    name: "Planner Agent",
    description: "Hierarchical task breakdown and execution",
    icon: Wrench,
    color: "bg-green-500",
    category: "Planning",
    complexity: "Advanced",
    useCase: "Project Management, Goal Decomposition",
    demo: "Task Planning",
  },
  {
    id: "tool-using",
    name: "Tool-Using Agent",
    description: "External APIs, web search, calculators integration",
    icon: Wrench,
    color: "bg-orange-500",
    category: "Integration",
    complexity: "Intermediate",
    useCase: "API Calls, Web Scraping, Calculations",
    demo: "Tool Chain",
  },
  {
    id: "multi-agent",
    name: "Multi-Agent Orchestrator",
    description: "Coordinator that delegates subtasks to specialists",
    icon: Users,
    color: "bg-red-500",
    category: "Orchestration",
    complexity: "Expert",
    useCase: "Complex Workflows, Team Coordination",
    demo: "Agent Swarm",
  },
  {
    id: "autonomous",
    name: "Autonomous Agent",
    description: "Goal-driven loop with memory & long-running state",
    icon: Bot,
    color: "bg-indigo-500",
    category: "Autonomous",
    complexity: "Expert",
    useCase: "Continuous Tasks, Self-Directed Goals",
    demo: "Auto Loop",
  },
  {
    id: "creative",
    name: "Creative Agent",
    description: "Generative output with novelty scoring",
    icon: Palette,
    color: "bg-pink-500",
    category: "Creative",
    complexity: "Intermediate",
    useCase: "Content Generation, Art Creation",
    demo: "Creative Flow",
  },
  {
    id: "safety",
    name: "Safety & Guardrails Agent",
    description: "Content policy enforcement and risk scoring",
    icon: Shield,
    color: "bg-yellow-500",
    category: "Safety",
    complexity: "Advanced",
    useCase: "Content Moderation, Risk Assessment",
    demo: "Safety Check",
  },
];

export default function AgentCatalog() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = ["All", ...new Set(agentTypes.map((agent) => agent.category))];

  const filteredAgents = agentTypes.filter((agent) => {
    const matchesCategory = selectedCategory === "All" || agent.category === selectedCategory;
    const matchesSearch =
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Agent <span className="text-primary">Catalog</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our comprehensive collection of AI agent types. Each agent comes with live
            demos, technical deep-dives, and ready-to-run implementations.
          </p>
        </motion.div>

        <Tabs defaultValue="types" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
            <TabsTrigger value="types" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Agent Types
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="flex items-center gap-2">
              <Store className="w-4 h-4" />
              Marketplace
            </TabsTrigger>
          </TabsList>

          <TabsContent value="types">
            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search agents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Agent Grid */}
            <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" layout>
              {filteredAgents.map((agent, index) => {
                const IconComponent = agent.icon;
                return (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    layout
                  >
                    <Card className="p-6 h-full hover:shadow-lg transition-all duration-300 group cursor-pointer">
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`w-12 h-12 ${agent.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}
                        >
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <Badge variant="outline">{agent.complexity}</Badge>
                      </div>

                      <h3 className="text-xl font-bold mb-2">{agent.name}</h3>
                      <p className="text-muted-foreground mb-4 text-sm">{agent.description}</p>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Category:</span>
                          <Badge variant="secondary">{agent.category}</Badge>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Use Case:</span>
                          <p className="text-xs mt-1">{agent.useCase}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-auto">
                        <Button size="sm" className="flex-1">
                          <Play className="w-4 h-4 mr-2" />
                          {agent.demo}
                        </Button>
                        <Button size="sm" variant="outline">
                          <Code className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>

            {filteredAgents.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No agents found matching your criteria.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="marketplace">
            <AgentMarketplace />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
