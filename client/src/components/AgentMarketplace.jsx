import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Star,
  Download,
  Play,
  Eye,
  Code,
  Users,
  Clock,
  Zap,
  TrendingUp,
  Filter,
  SortAsc,
  Heart,
  Share,
  BookOpen,
} from "lucide-react";

const agentMarketplace = [
  {
    id: "customer-support-agent",
    name: "Customer Support Agent",
    description: "Intelligent customer service agent with sentiment analysis and escalation logic",
    author: "AI Labs Team",
    category: "Customer Service",
    tags: ["support", "sentiment", "escalation", "chat"],
    rating: 4.8,
    downloads: 12500,
    price: "Free",
    complexity: "Intermediate",
    lastUpdated: "2 days ago",
    featured: true,
    preview: {
      nodes: 8,
      connections: 12,
      avgResponseTime: "1.2s",
      successRate: "94.5%",
    },
    capabilities: [
      "Natural language understanding",
      "Sentiment analysis",
      "Automatic escalation",
      "Multi-language support",
      "Integration with CRM systems",
    ],
    useCases: [
      "E-commerce customer support",
      "SaaS help desk",
      "Technical support",
      "Order management",
    ],
  },
  {
    id: "research-assistant",
    name: "Research Assistant Pro",
    description:
      "Advanced research agent that can gather, analyze, and synthesize information from multiple sources",
    author: "Research Labs",
    category: "Research & Analysis",
    tags: ["research", "analysis", "synthesis", "academic"],
    rating: 4.9,
    downloads: 8900,
    price: "$29/month",
    complexity: "Advanced",
    lastUpdated: "1 week ago",
    featured: true,
    preview: {
      nodes: 15,
      connections: 22,
      avgResponseTime: "3.8s",
      successRate: "97.2%",
    },
    capabilities: [
      "Multi-source data gathering",
      "Citation management",
      "Fact verification",
      "Literature review",
      "Report generation",
    ],
    useCases: ["Academic research", "Market analysis", "Competitive intelligence", "Due diligence"],
  },
  {
    id: "content-creator",
    name: "Content Creator Suite",
    description:
      "Creative agent for generating blog posts, social media content, and marketing materials",
    author: "Creative AI",
    category: "Content Creation",
    tags: ["content", "marketing", "social", "creative"],
    rating: 4.6,
    downloads: 15200,
    price: "Free",
    complexity: "Beginner",
    lastUpdated: "3 days ago",
    featured: false,
    preview: {
      nodes: 6,
      connections: 8,
      avgResponseTime: "2.1s",
      successRate: "91.8%",
    },
    capabilities: [
      "Multi-format content generation",
      "SEO optimization",
      "Brand voice consistency",
      "Image generation integration",
      "Content scheduling",
    ],
    useCases: [
      "Blog writing",
      "Social media management",
      "Email marketing",
      "Product descriptions",
    ],
  },
  {
    id: "data-analyst",
    name: "Data Analysis Agent",
    description: "Powerful agent for data processing, visualization, and insights generation",
    author: "DataFlow Inc",
    category: "Data & Analytics",
    tags: ["data", "analytics", "visualization", "insights"],
    rating: 4.7,
    downloads: 6800,
    price: "$49/month",
    complexity: "Advanced",
    lastUpdated: "5 days ago",
    featured: false,
    preview: {
      nodes: 12,
      connections: 18,
      avgResponseTime: "4.2s",
      successRate: "96.1%",
    },
    capabilities: [
      "Automated data cleaning",
      "Statistical analysis",
      "Interactive visualizations",
      "Predictive modeling",
      "Report automation",
    ],
    useCases: [
      "Business intelligence",
      "Financial analysis",
      "Performance monitoring",
      "Trend analysis",
    ],
  },
  {
    id: "code-reviewer",
    name: "AI Code Reviewer",
    description:
      "Intelligent code review agent that analyzes code quality, security, and best practices",
    author: "DevTools Pro",
    category: "Development",
    tags: ["code", "review", "security", "quality"],
    rating: 4.5,
    downloads: 9300,
    price: "$19/month",
    complexity: "Intermediate",
    lastUpdated: "1 day ago",
    featured: false,
    preview: {
      nodes: 10,
      connections: 14,
      avgResponseTime: "1.8s",
      successRate: "93.7%",
    },
    capabilities: [
      "Code quality analysis",
      "Security vulnerability detection",
      "Performance optimization",
      "Best practices enforcement",
      "Documentation generation",
    ],
    useCases: [
      "Pull request reviews",
      "Code auditing",
      "Security scanning",
      "Refactoring assistance",
    ],
  },
  {
    id: "sales-assistant",
    name: "Sales Assistant AI",
    description: "Intelligent sales agent for lead qualification, follow-ups, and deal management",
    author: "SalesForce AI",
    category: "Sales & Marketing",
    tags: ["sales", "leads", "crm", "automation"],
    rating: 4.4,
    downloads: 11700,
    price: "$39/month",
    complexity: "Intermediate",
    lastUpdated: "4 days ago",
    featured: true,
    preview: {
      nodes: 9,
      connections: 13,
      avgResponseTime: "1.5s",
      successRate: "89.3%",
    },
    capabilities: [
      "Lead scoring and qualification",
      "Automated follow-ups",
      "Deal pipeline management",
      "Proposal generation",
      "Performance analytics",
    ],
    useCases: ["Lead nurturing", "Sales automation", "Customer onboarding", "Upselling campaigns"],
  },
];

const categories = [
  "All",
  "Customer Service",
  "Research & Analysis",
  "Content Creation",
  "Data & Analytics",
  "Development",
  "Sales & Marketing",
];
const complexityLevels = ["All", "Beginner", "Intermediate", "Advanced"];
const priceFilters = ["All", "Free", "Paid"];

export const AgentMarketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedComplexity, setSelectedComplexity] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");

  const filteredAgents = agentMarketplace
    .filter((agent) => {
      const matchesSearch =
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === "All" || agent.category === selectedCategory;
      const matchesComplexity =
        selectedComplexity === "All" || agent.complexity === selectedComplexity;
      const matchesPrice =
        selectedPrice === "All" ||
        (selectedPrice === "Free" && agent.price === "Free") ||
        (selectedPrice === "Paid" && agent.price !== "Free");

      return matchesSearch && matchesCategory && matchesComplexity && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "downloads":
          return b.downloads - a.downloads;
        case "newest":
          return new Date(b.lastUpdated) - new Date(a.lastUpdated);
        case "featured":
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        default:
          return 0;
      }
    });

  const AgentCard = ({ agent }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Card className="p-6 h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                {agent.name}
              </h3>
              {agent.featured && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-2">{agent.description}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>by {agent.author}</span>
              <span>•</span>
              <span>{agent.lastUpdated}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="font-semibold">{agent.rating}</span>
            <span className="text-xs text-muted-foreground">rating</span>
          </div>
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-blue-500" />
            <span className="font-semibold">{agent.downloads.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">downloads</span>
          </div>
        </div>

        {/* Preview Stats */}
        <div className="bg-muted/50 rounded-lg p-3 mb-4">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nodes:</span>
              <span className="font-mono">{agent.preview.nodes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Response:</span>
              <span className="font-mono">{agent.preview.avgResponseTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Connections:</span>
              <span className="font-mono">{agent.preview.connections}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Success:</span>
              <span className="font-mono text-green-600">{agent.preview.successRate}</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {agent.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {agent.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{agent.tags.length - 3}
            </Badge>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{agent.complexity}</Badge>
            <span className="font-bold text-primary">{agent.price}</span>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Eye className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Heart className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Share className="w-4 h-4" />
            </Button>
            <Button size="sm" className="ml-2">
              <Play className="w-4 h-4 mr-1" />
              Try
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">
          Agent <span className="text-primary">Marketplace</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Discover, customize, and deploy pre-built AI agents for your workflows. From customer
          support to data analysis, find the perfect agent for your needs.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-muted/30 rounded-xl p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search agents, tags, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-background"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Complexity Filter */}
          <select
            value={selectedComplexity}
            onChange={(e) => setSelectedComplexity(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-background"
          >
            {complexityLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>

          {/* Price Filter */}
          <select
            value={selectedPrice}
            onChange={(e) => setSelectedPrice(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-background"
          >
            {priceFilters.map((price) => (
              <option key={price} value={price}>
                {price}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-background"
          >
            <option value="featured">Featured</option>
            <option value="rating">Highest Rated</option>
            <option value="downloads">Most Downloaded</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <span className="text-sm text-muted-foreground">
            {filteredAgents.length} agents found
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              List
            </Button>
          </div>
        </div>
      </div>

      {/* Featured Agents */}
      {searchTerm === "" && selectedCategory === "All" && (
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-5 h-5 text-yellow-500" />
            <h2 className="text-2xl font-bold">Featured Agents</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agentMarketplace
              .filter((agent) => agent.featured)
              .map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
          </div>
        </div>
      )}

      {/* All Agents */}
      <div>
        <h2 className="text-2xl font-bold mb-6">
          {searchTerm ? `Search Results for "${searchTerm}"` : "All Agents"}
        </h2>
        {filteredAgents.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No agents found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria or filters</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
