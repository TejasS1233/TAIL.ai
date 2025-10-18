import React, { useState, useCallback, useRef } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Play,
  Save,
  Share,
  Download,
  Plus,
  Settings,
  Trash2,
  GitBranch,
  Clock,
  Zap,
  Database,
  Brain,
  Wrench,
  Users,
  Bot,
  Palette,
  Shield,
  MessageSquare,
  Search,
  Code,
  FileText,
  Globe,
  Calculator,
  Image,
  Music,
  Video,
  Mail,
  Calendar,
  Map,
  BarChart,
  Key,
  AlertTriangle,
  CheckCircle,
  X,
  Copy,
  Edit,
  Maximize2,
  Minimize2,
  Eye,
  Link,
} from "lucide-react";

const nodeCategories = {
  LLMs: [
    {
      id: "openai",
      label: "OpenAI",
      icon: Brain,
      color: "bg-green-500",
      description: "GPT-3.5, GPT-4 models",
    },
    {
      id: "anthropic",
      label: "Anthropic",
      icon: Brain,
      color: "bg-orange-500",
      description: "Claude models",
    },
    {
      id: "cohere",
      label: "Cohere",
      icon: Brain,
      color: "bg-blue-500",
      description: "Command models",
    },
    {
      id: "huggingface",
      label: "HuggingFace",
      icon: Brain,
      color: "bg-yellow-500",
      description: "Open source models",
    },
    {
      id: "ollama",
      label: "Ollama",
      icon: Brain,
      color: "bg-purple-500",
      description: "Local models",
    },
  ],
  Chains: [
    {
      id: "llm-chain",
      label: "LLM Chain",
      icon: Link,
      color: "bg-indigo-500",
      description: "Basic LLM chain",
    },
    {
      id: "sequential-chain",
      label: "Sequential Chain",
      icon: GitBranch,
      color: "bg-teal-500",
      description: "Sequential processing",
    },
    {
      id: "router-chain",
      label: "Router Chain",
      icon: GitBranch,
      color: "bg-pink-500",
      description: "Conditional routing",
    },
  ],
  Agents: [
    {
      id: "zero-shot-agent",
      label: "Zero Shot Agent",
      icon: Bot,
      color: "bg-red-500",
      description: "ReAct agent",
    },
    {
      id: "conversational-agent",
      label: "Conversational Agent",
      icon: MessageSquare,
      color: "bg-cyan-500",
      description: "Chat agent with memory",
    },
    {
      id: "plan-execute-agent",
      label: "Plan & Execute Agent",
      icon: Calendar,
      color: "bg-lime-500",
      description: "Planning agent",
    },
  ],
  Memory: [
    {
      id: "conversation-buffer",
      label: "Conversation Buffer",
      icon: Database,
      color: "bg-gray-500",
      description: "Simple memory buffer",
    },
    {
      id: "conversation-summary",
      label: "Conversation Summary",
      icon: FileText,
      color: "bg-slate-500",
      description: "Summarized memory",
    },
    {
      id: "vector-store",
      label: "Vector Store Memory",
      icon: Database,
      color: "bg-emerald-500",
      description: "Vector-based memory",
    },
  ],
  Tools: [
    {
      id: "search-tool",
      label: "Search Tool",
      icon: Search,
      color: "bg-blue-600",
      description: "Web search capability",
    },
    {
      id: "calculator",
      label: "Calculator",
      icon: Calculator,
      color: "bg-green-600",
      description: "Math calculations",
    },
    {
      id: "code-interpreter",
      label: "Code Interpreter",
      icon: Code,
      color: "bg-purple-600",
      description: "Execute Python code",
    },
    {
      id: "web-scraper",
      label: "Web Scraper",
      icon: Globe,
      color: "bg-orange-600",
      description: "Scrape web content",
    },
    {
      id: "file-reader",
      label: "File Reader",
      icon: FileText,
      color: "bg-red-600",
      description: "Read file contents",
    },
    {
      id: "image-generator",
      label: "Image Generator",
      icon: Image,
      color: "bg-pink-600",
      description: "Generate images",
    },
    {
      id: "email-tool",
      label: "Email Tool",
      icon: Mail,
      color: "bg-cyan-600",
      description: "Send emails",
    },
  ],
  Retrievers: [
    {
      id: "vector-retriever",
      label: "Vector Retriever",
      icon: Database,
      color: "bg-indigo-600",
      description: "Vector similarity search",
    },
    {
      id: "bm25-retriever",
      label: "BM25 Retriever",
      icon: Search,
      color: "bg-teal-600",
      description: "Keyword-based retrieval",
    },
    {
      id: "ensemble-retriever",
      label: "Ensemble Retriever",
      icon: Users,
      color: "bg-amber-600",
      description: "Multiple retrieval methods",
    },
  ],
  "Text Splitters": [
    {
      id: "recursive-splitter",
      label: "Recursive Splitter",
      icon: Wrench,
      color: "bg-gray-600",
      description: "Recursive text splitting",
    },
    {
      id: "token-splitter",
      label: "Token Splitter",
      icon: Wrench,
      color: "bg-slate-600",
      description: "Token-based splitting",
    },
  ],
  Embeddings: [
    {
      id: "openai-embeddings",
      label: "OpenAI Embeddings",
      icon: BarChart,
      color: "bg-green-700",
      description: "OpenAI embedding models",
    },
    {
      id: "huggingface-embeddings",
      label: "HuggingFace Embeddings",
      icon: BarChart,
      color: "bg-yellow-700",
      description: "HF embedding models",
    },
  ],
  "Vector Stores": [
    {
      id: "chroma",
      label: "Chroma",
      icon: Database,
      color: "bg-purple-700",
      description: "Chroma vector database",
    },
    {
      id: "pinecone",
      label: "Pinecone",
      icon: Database,
      color: "bg-blue-700",
      description: "Pinecone vector database",
    },
    {
      id: "faiss",
      label: "FAISS",
      icon: Database,
      color: "bg-red-700",
      description: "Facebook AI Similarity Search",
    },
  ],
  "Input/Output": [
    {
      id: "text-input",
      label: "Text Input",
      icon: MessageSquare,
      color: "bg-blue-500",
      description: "Text input node",
    },
    {
      id: "chat-input",
      label: "Chat Input",
      icon: MessageSquare,
      color: "bg-green-500",
      description: "Chat message input",
    },
    {
      id: "file-input",
      label: "File Input",
      icon: FileText,
      color: "bg-orange-500",
      description: "File upload input",
    },
    {
      id: "text-output",
      label: "Text Output",
      icon: FileText,
      color: "bg-red-500",
      description: "Text output display",
    },
    {
      id: "chat-output",
      label: "Chat Output",
      icon: MessageSquare,
      color: "bg-purple-500",
      description: "Chat response output",
    },
  ],
};

const workflowTemplates = [
  {
    id: "rag-pipeline",
    name: "RAG Pipeline",
    description: "Retrieval Augmented Generation",
    complexity: "Beginner",
    nodes: [
      {
        id: "input-1",
        type: "text-input",
        x: 100,
        y: 200,
        config: { placeholder: "Enter your question..." },
      },
      {
        id: "retriever-1",
        type: "vector-retriever",
        x: 300,
        y: 200,
        config: { top_k: 5, collection: "documents" },
      },
      {
        id: "llm-1",
        type: "openai",
        x: 500,
        y: 200,
        config: { model: "gpt-3.5-turbo", temperature: 0.7 },
      },
      { id: "output-1", type: "text-output", x: 700, y: 200, config: {} },
    ],
    connections: [
      { from: "input-1", to: "retriever-1" },
      { from: "retriever-1", to: "llm-1" },
      { from: "llm-1", to: "output-1" },
    ],
  },
  {
    id: "conversational-agent",
    name: "Conversational Agent",
    description: "Chat agent with memory and tools",
    complexity: "Intermediate",
    nodes: [
      { id: "chat-input-1", type: "chat-input", x: 100, y: 150, config: {} },
      {
        id: "memory-1",
        type: "conversation-buffer",
        x: 100,
        y: 300,
        config: { max_token_limit: 2000 },
      },
      { id: "agent-1", type: "conversational-agent", x: 350, y: 200, config: { model: "gpt-4" } },
      { id: "search-1", type: "search-tool", x: 350, y: 350, config: { engine: "google" } },
      { id: "calculator-1", type: "calculator", x: 500, y: 350, config: {} },
      { id: "chat-output-1", type: "chat-output", x: 600, y: 200, config: {} },
    ],
    connections: [
      { from: "chat-input-1", to: "agent-1" },
      { from: "memory-1", to: "agent-1" },
      { from: "agent-1", to: "search-1" },
      { from: "agent-1", to: "calculator-1" },
      { from: "agent-1", to: "chat-output-1" },
    ],
  },
  {
    id: "document-qa",
    name: "Document Q&A System",
    description: "Upload documents and ask questions",
    complexity: "Advanced",
    nodes: [
      {
        id: "file-input-1",
        type: "file-input",
        x: 50,
        y: 100,
        config: { accept: ".pdf,.txt,.docx" },
      },
      {
        id: "splitter-1",
        type: "recursive-splitter",
        x: 200,
        y: 100,
        config: { chunk_size: 1000, chunk_overlap: 200 },
      },
      {
        id: "embeddings-1",
        type: "openai-embeddings",
        x: 350,
        y: 100,
        config: { model: "text-embedding-ada-002" },
      },
      {
        id: "vectorstore-1",
        type: "chroma",
        x: 500,
        y: 100,
        config: { collection_name: "documents" },
      },
      {
        id: "question-input-1",
        type: "text-input",
        x: 50,
        y: 300,
        config: { placeholder: "Ask a question about the document..." },
      },
      { id: "retriever-1", type: "vector-retriever", x: 300, y: 300, config: { top_k: 3 } },
      { id: "llm-1", type: "openai", x: 500, y: 300, config: { model: "gpt-4", temperature: 0.1 } },
      { id: "output-1", type: "text-output", x: 650, y: 300, config: {} },
    ],
    connections: [
      { from: "file-input-1", to: "splitter-1" },
      { from: "splitter-1", to: "embeddings-1" },
      { from: "embeddings-1", to: "vectorstore-1" },
      { from: "question-input-1", to: "retriever-1" },
      { from: "vectorstore-1", to: "retriever-1" },
      { from: "retriever-1", to: "llm-1" },
      { from: "llm-1", to: "output-1" },
    ],
  },
];

const llmConfigs = {
  openai: {
    apiKey: { type: "password", label: "OpenAI API Key", required: true },
    model: {
      type: "select",
      label: "Model",
      options: ["gpt-3.5-turbo", "gpt-4", "gpt-4-turbo"],
      default: "gpt-3.5-turbo",
    },
    temperature: { type: "slider", label: "Temperature", min: 0, max: 2, step: 0.1, default: 0.7 },
    max_tokens: { type: "number", label: "Max Tokens", default: 1000 },
    top_p: { type: "slider", label: "Top P", min: 0, max: 1, step: 0.1, default: 1 },
    frequency_penalty: {
      type: "slider",
      label: "Frequency Penalty",
      min: -2,
      max: 2,
      step: 0.1,
      default: 0,
    },
    presence_penalty: {
      type: "slider",
      label: "Presence Penalty",
      min: -2,
      max: 2,
      step: 0.1,
      default: 0,
    },
  },
  anthropic: {
    apiKey: { type: "password", label: "Anthropic API Key", required: true },
    model: {
      type: "select",
      label: "Model",
      options: ["claude-3-haiku", "claude-3-sonnet", "claude-3-opus"],
      default: "claude-3-sonnet",
    },
    temperature: { type: "slider", label: "Temperature", min: 0, max: 1, step: 0.1, default: 0.7 },
    max_tokens: { type: "number", label: "Max Tokens", default: 1000 },
  },
  cohere: {
    apiKey: { type: "password", label: "Cohere API Key", required: true },
    model: {
      type: "select",
      label: "Model",
      options: ["command", "command-light", "command-nightly"],
      default: "command",
    },
    temperature: { type: "slider", label: "Temperature", min: 0, max: 5, step: 0.1, default: 0.75 },
    max_tokens: { type: "number", label: "Max Tokens", default: 1000 },
  },
};

export default function WorkflowComposer() {
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [draggedNode, setDraggedNode] = useState(null);
  const [canvasOffset, _setCanvasOffset] = useState({ x: 0, y: 0 });
  const [zoom, _setZoom] = useState(1);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [apiKeys, setApiKeys] = useState({});
  const [executionLogs, setExecutionLogs] = useState([]);
  const canvasRef = useRef(null);

  const loadTemplate = useCallback((template) => {
    setNodes(
      template.nodes.map((node) => ({
        ...node,
        id: `${node.id}-${Date.now()}`,
        config: { ...node.config },
      }))
    );
    setConnections(template.connections);
    setActiveTemplate(template.id);
  }, []);

  const addNodeToCanvas = useCallback((nodeType, position) => {
    const newNode = {
      id: `${nodeType.id}-${Date.now()}`,
      type: nodeType.id,
      label: nodeType.label,
      x: position.x,
      y: position.y,
      config: {},
      icon: nodeType.icon,
      color: nodeType.color,
    };
    setNodes((prev) => [...prev, newNode]);
  }, []);

  const handleCanvasDrop = useCallback(
    (e) => {
      e.preventDefault();
      if (!draggedNode) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const position = {
        x: (e.clientX - rect.left - canvasOffset.x) / zoom,
        y: (e.clientY - rect.top - canvasOffset.y) / zoom,
      };

      addNodeToCanvas(draggedNode, position);
      setDraggedNode(null);
    },
    [draggedNode, canvasOffset, zoom, addNodeToCanvas]
  );

  const handleRunWorkflow = useCallback(async () => {
    const requiredKeys = new Set();
    nodes.forEach((node) => {
      if (llmConfigs[node.type]) {
        requiredKeys.add(node.type);
      }
    });

    const missingKeys = Array.from(requiredKeys).filter((key) => !apiKeys[key]);
    if (missingKeys.length > 0) {
      setShowApiKeyDialog(true);
      return;
    }
    // Function to export the workflow as image
    // const exportImage = async (format) => {
    //   if (!workflowRef.current) return;
    //   setIsExporting(true);

    //   try {
    //     const node = workflowRef.current;

    //     // Options to handle large workflows
    //     const options = {
    //       cacheBust: true,
    //       width: node.scrollWidth,
    //       height: node.scrollHeight,
    //       style: {
    //         transform: "scale(1)",
    //         transformOrigin: "top left",
    //         backgroundColor: "#fff", // white background
    //       },
    //     };

    //     if (format === "png") {
    //       const dataUrl = await toPng(node, options);
    //       const link = document.createElement("a");
    //       link.download = "workflow.png";
    //       link.href = dataUrl;
    //       link.click();
    //     } else if (format === "svg") {
    //       const dataUrl = await toSvg(node, options);
    //       const blob = new Blob([dataUrl], { type: "image/svg+xml" });
    //       const link = document.createElement("a");
    //       link.download = "workflow.svg";
    //       link.href = URL.createObjectURL(blob);
    //       link.click();
    //     }
    //   } catch (error) {
    //     console.error("❌ Export failed:", error);
    //     alert("Failed to export the workflow. Please try again.");
    //   } finally {
    //     setIsExporting(false);
    //   }
    // };
    setIsRunning(true);
    setExecutionLogs([]);

    const logs = [
      {
        timestamp: new Date().toLocaleTimeString(),
        level: "INFO",
        message: "Starting workflow execution...",
      },
      {
        timestamp: new Date().toLocaleTimeString(),
        level: "INFO",
        message: `Processing ${nodes.length} nodes...`,
      },
    ];

    for (let i = 0; i < nodes.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      logs.push({
        timestamp: new Date().toLocaleTimeString(),
        level: "SUCCESS",
        message: `Executed ${nodes[i].label} (${nodes[i].id})`,
      });
      setExecutionLogs([...logs]);
    }

    logs.push({
      timestamp: new Date().toLocaleTimeString(),
      level: "SUCCESS",
      message: "Workflow completed successfully!",
    });
    setExecutionLogs(logs);
    setIsRunning(false);
  }, [nodes, apiKeys]);

  const renderNodeConfig = (node) => {
    if (!node || !llmConfigs[node.type]) return null;

    const config = llmConfigs[node.type];

    return (
      <div className="space-y-4">
        {Object.entries(config).map(([key, field]) => (
          <div key={key}>
            <Label className="text-sm font-medium">{field.label}</Label>
            {field.type === "password" && (
              <Input
                type="password"
                placeholder={`Enter ${field.label}`}
                value={node.config[key] || ""}
                onChange={(e) => {
                  const updatedNodes = nodes.map((n) =>
                    n.id === node.id ? { ...n, config: { ...n.config, [key]: e.target.value } } : n
                  );
                  setNodes(updatedNodes);
                }}
              />
            )}
            {field.type === "select" && (
              <Select
                value={node.config[key] || field.default}
                onValueChange={(value) => {
                  const updatedNodes = nodes.map((n) =>
                    n.id === node.id ? { ...n, config: { ...n.config, [key]: value } } : n
                  );
                  setNodes(updatedNodes);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {field.options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {field.type === "slider" && (
              <div className="space-y-2">
                <Slider
                  value={[node.config[key] || field.default]}
                  onValueChange={([value]) => {
                    const updatedNodes = nodes.map((n) =>
                      n.id === node.id ? { ...n, config: { ...n.config, [key]: value } } : n
                    );
                    setNodes(updatedNodes);
                  }}
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground text-center">
                  {node.config[key] || field.default}
                </div>
              </div>
            )}
            {field.type === "number" && (
              <Input
                type="number"
                value={node.config[key] || field.default}
                onChange={(e) => {
                  const updatedNodes = nodes.map((n) =>
                    n.id === node.id
                      ? { ...n, config: { ...n.config, [key]: parseInt(e.target.value) } }
                      : n
                  );
                  setNodes(updatedNodes);
                }}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      <div className="w-80 border-r bg-muted/30 flex flex-col">
        <div className="flex-shrink-0 p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Components</h2>
            <Button variant="outline" size="sm" onClick={() => setShowApiKeyDialog(true)}>
              <Key className="w-4 h-4 mr-2" />
              API Keys
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <Tabs defaultValue="nodes" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="nodes">Nodes</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="nodes" className="space-y-4 mt-4">
              {Object.entries(nodeCategories).map(([category, nodeTypes]) => (
                <div key={category}>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">{category}</h3>
                  <div className="space-y-1">
                    {nodeTypes.map((node) => {
                      const IconComponent = node.icon;
                      return (
                        <motion.div
                          key={node.id}
                          draggable
                          onDragStart={() => setDraggedNode(node)}
                          onDragEnd={() => setDraggedNode(null)}
                          whileHover={{ scale: 1.02 }}
                          className="flex items-center gap-3 p-2 rounded-lg border bg-background cursor-grab hover:shadow-sm active:cursor-grabbing"
                        >
                          <div
                            className={`w-8 h-8 ${node.color} rounded-lg flex items-center justify-center`}
                          >
                            <IconComponent className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm">{node.label}</div>
                            <div className="text-xs text-muted-foreground truncate">
                              {node.description}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="templates" className="space-y-2 mt-4">
              {workflowTemplates.map((template) => (
                <Card
                  key={template.id}
                  className={`p-3 cursor-pointer hover:shadow-sm transition-all ${
                    activeTemplate === template.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => loadTemplate(template)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-sm">{template.name}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {template.complexity}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{template.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <GitBranch className="w-3 h-3" />
                    {template.nodes.length} nodes
                  </div>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="border-b bg-background p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">Workflow Composer</h1>
              <Badge variant="outline">LangFlow Compatible</Badge>
              {nodes.length > 0 && <Badge variant="secondary">{nodes.length} nodes</Badge>}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export JSON
              </Button>
              <Button
                size="sm"
                onClick={handleRunWorkflow}
                disabled={isRunning || nodes.length === 0}
                className="bg-green-600 hover:bg-green-700"
              >
                {isRunning ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Run Workflow
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div
          ref={canvasRef}
          className="flex-1 relative overflow-hidden"
          style={{
            backgroundImage: "radial-gradient(circle, #e5e7eb 1px, transparent 1px)",
            backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
            backgroundPosition: `${canvasOffset.x}px ${canvasOffset.y}px`,
          }}
          onDrop={handleCanvasDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {nodes.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Plus className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Start Building Your Workflow</h3>
                <p className="text-muted-foreground mb-4 max-w-md">
                  Drag components from the left panel or load a template to begin
                </p>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" onClick={() => loadTemplate(workflowTemplates[0])}>
                    <GitBranch className="w-4 h-4 mr-2" />
                    Load RAG Template
                  </Button>
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="absolute inset-0">
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {connections.map((conn, index) => {
                  const fromNode = nodes.find((n) => n.id.startsWith(conn.from));
                  const toNode = nodes.find((n) => n.id.startsWith(conn.to));
                  if (!fromNode || !toNode) return null;

                  const x1 = (fromNode.x + 100) * zoom + canvasOffset.x;
                  const y1 = (fromNode.y + 25) * zoom + canvasOffset.y;
                  const x2 = toNode.x * zoom + canvasOffset.x;
                  const y2 = (toNode.y + 25) * zoom + canvasOffset.y;

                  return (
                    <line
                      key={index}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#6366f1"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                    />
                  );
                })}
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 3.5, 0 7" fill="#6366f1" />
                  </marker>
                </defs>
              </svg>

              {nodes.map((node) => {
                const IconComponent = node.icon;
                return (
                  <motion.div
                    key={node.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{
                      position: "absolute",
                      left: node.x * zoom + canvasOffset.x,
                      top: node.y * zoom + canvasOffset.y,
                      transform: `scale(${zoom})`,
                    }}
                    className={`w-48 bg-background border-2 rounded-lg p-3 cursor-pointer shadow-sm ${
                      selectedNode?.id === node.id
                        ? "border-primary"
                        : "border-border hover:border-muted-foreground"
                    }`}
                    onClick={() => setSelectedNode(node)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={`w-6 h-6 ${node.color} rounded flex items-center justify-center`}
                      >
                        <IconComponent className="w-3 h-3 text-white" />
                      </div>
                      <span className="font-medium text-sm">{node.label}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setNodes(nodes.filter((n) => n.id !== node.id));
                        }}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground">{node.type}</div>
                    <div className="absolute -left-2 top-1/2 w-4 h-4 bg-blue-500 rounded-full border-2 border-background"></div>
                    <div className="absolute -right-2 top-1/2 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
                  </motion.div>
                );
              })}
            </div>
          )}
          <AnimatePresence>
            {nodes.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <MiniMap 
                  nodes={nodes}
                  canvasDimensions={canvasDimensions}
                  canvasOffset={canvasOffset}
                  zoom={zoom}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="w-80 border-l bg-muted/30 flex flex-col">
        <Tabs defaultValue="properties" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2 m-4 mb-0 flex-shrink-0">
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="execution">Execution</TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="flex-1 overflow-y-auto p-4 m-0">
            {selectedNode ? (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className={`w-8 h-8 ${selectedNode.color} rounded-lg flex items-center justify-center`}
                  >
                    <selectedNode.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{selectedNode.label}</h3>
                    <p className="text-xs text-muted-foreground">{selectedNode.id}</p>
                  </div>
                </div>
                {renderNodeConfig(selectedNode)}
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Select a node to configure its properties</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="execution" className="flex-1 overflow-y-auto p-4 m-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Execution Logs</h3>
              <Badge variant={isRunning ? "default" : "secondary"}>
                {isRunning ? "Running" : "Idle"}
              </Badge>
            </div>

            <div className="bg-black rounded-lg p-3 h-64 overflow-y-auto font-mono text-xs">
              {executionLogs.length === 0 ? (
                <div className="text-gray-500">No execution logs yet...</div>
              ) : (
                executionLogs.map((log, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`mb-1 ${
                      log.level === "SUCCESS"
                        ? "text-green-400"
                        : log.level === "ERROR"
                          ? "text-red-400"
                          : "text-gray-300"
                    }`}
                  >
                    <span className="text-gray-500">[{log.timestamp}]</span>{" "}
                    <span
                      className={`${
                        log.level === "SUCCESS"
                          ? "text-green-400"
                          : log.level === "ERROR"
                            ? "text-red-400"
                            : "text-blue-400"
                      }`}
                    >
                      {log.level}
                    </span>{" "}
                    {log.message}
                  </motion.div>
                ))
              )}
              {isRunning && (
                <motion.div
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="text-gray-400"
                >
                  ▋
                </motion.div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Configure API Keys</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Enter your API keys to enable LLM nodes. Keys are stored locally and never sent to our
              servers.
            </div>

            {Object.entries(llmConfigs).map(([provider, config]) => (
              <div key={provider}>
                <Label className="text-sm font-medium capitalize">{provider}</Label>
                <Input
                  type="password"
                  placeholder={`Enter ${provider} API key`}
                  value={apiKeys[provider] || ""}
                  onChange={(e) => setApiKeys((prev) => ({ ...prev, [provider]: e.target.value }))}
                />
              </div>
            ))}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowApiKeyDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowApiKeyDialog(false)}>Save Keys</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}