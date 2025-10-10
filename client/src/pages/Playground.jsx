import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Play,
  Square,
  RotateCcw,
  Download,
  Settings,
  Terminal,
  Activity,
  Clock,
  Zap,
  Database,
  Code,
} from "lucide-react";

export default function Playground() {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [executionTime, setExecutionTime] = useState(0);
  const [prompt, setPrompt] = useState(
    "Analyze the sentiment of customer reviews and categorize them by product features."
  );
  const intervalRef = useRef(null);

  const mockLogs = [
    { timestamp: "14:32:01", level: "INFO", message: "Initializing retrieval agent..." },
    { timestamp: "14:32:02", level: "INFO", message: "Loading vector database..." },
    { timestamp: "14:32:03", level: "SUCCESS", message: "Retrieved 15 relevant documents" },
    { timestamp: "14:32:04", level: "INFO", message: "Processing with LLM..." },
    { timestamp: "14:32:06", level: "SUCCESS", message: "Generated response (847 tokens)" },
    { timestamp: "14:32:06", level: "INFO", message: "Execution completed successfully" },
  ];

  const handleRun = () => {
    setIsRunning(true);
    setLogs([]);
    setExecutionTime(0);

    // Simulate execution with progressive logs
    mockLogs.forEach((log, index) => {
      setTimeout(
        () => {
          setLogs((prev) => [...prev, log]);
          if (index === mockLogs.length - 1) {
            setIsRunning(false);
          }
        },
        (index + 1) * 800
      );
    });

    // Timer
    intervalRef.current = setInterval(() => {
      setExecutionTime((prev) => prev + 0.1);
    }, 100);

    setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }, mockLogs.length * 800);
  };

  const handleStop = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleReset = () => {
    setLogs([]);
    setExecutionTime(0);
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">AI Agent Playground</h1>
            <p className="text-muted-foreground">
              Test and experiment with live agent workflows in real-time
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Activity className="w-3 h-3" />
              Live Environment
            </Badge>
            <Badge variant={isRunning ? "default" : "secondary"}>
              {isRunning ? "Running" : "Ready"}
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Input Configuration</h2>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Configure
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Prompt</label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full h-32 p-3 border rounded-lg resize-none bg-background"
                    placeholder="Enter your prompt here..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Model</label>
                    <select className="w-full p-2 border rounded-lg bg-background">
                      <option>GPT-4</option>
                      <option>Claude-3</option>
                      <option>Llama-2</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Temperature</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      defaultValue="0.7"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-6">
                <Button
                  onClick={handleRun}
                  disabled={isRunning}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Run Agent
                </Button>
                <Button variant="outline" onClick={handleStop} disabled={!isRunning}>
                  <Square className="w-4 h-4 mr-2" />
                  Stop
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" onClick={() => window.open("/composer", "_blank")}>
                  <Code className="w-4 h-4 mr-2" />
                  Open Composer
                </Button>
              </div>
            </Card>

            {/* Execution Visualization */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Execution Flow</h2>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-mono">{executionTime.toFixed(1)}s</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">6 steps</span>
                  </div>
                </div>
              </div>

              {/* Flow Visualization */}
              <div className="grid grid-cols-6 gap-2 mb-4">
                {["Input", "Retrieve", "Process", "Reason", "Generate", "Output"].map(
                  (step, index) => (
                    <motion.div
                      key={step}
                      className={`p-3 rounded-lg text-center text-sm font-medium ${
                        logs.length > index
                          ? "bg-green-500 text-white"
                          : isRunning && logs.length === index
                            ? "bg-blue-500 text-white animate-pulse"
                            : "bg-muted text-muted-foreground"
                      }`}
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {step}
                    </motion.div>
                  )
                )}
              </div>
            </Card>
          </div>

          {/* Output & Logs Panel */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Metrics</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Execution Time</span>
                  <span className="font-mono text-sm">{executionTime.toFixed(1)}s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Tokens Used</span>
                  <span className="font-mono text-sm">1,247</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Cost</span>
                  <span className="font-mono text-sm">$0.03</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Success Rate</span>
                  <span className="font-mono text-sm text-green-600">98.5%</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <Tabs defaultValue="logs" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="logs">
                    <Terminal className="w-4 h-4 mr-2" />
                    Logs
                  </TabsTrigger>
                  <TabsTrigger value="output">Output</TabsTrigger>
                  <TabsTrigger value="trace">Trace</TabsTrigger>
                </TabsList>

                <TabsContent value="logs" className="mt-4">
                  <div className="bg-black rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm">
                    {logs.map((log, index) => (
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
                    ))}
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

                <TabsContent value="output" className="mt-4">
                  <div className="bg-muted rounded-lg p-4 h-64 overflow-y-auto">
                    {logs.length > 0 ? (
                      <div className="text-sm">
                        <p className="mb-2 font-medium">Analysis Results:</p>
                        <p className="text-muted-foreground">
                          Sentiment analysis completed. Found 73% positive, 18% neutral, 9% negative
                          reviews. Key themes: product quality, shipping speed, customer service.
                        </p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">
                        Output will appear here after execution...
                      </p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="trace" className="mt-4">
                  <div className="bg-muted rounded-lg p-4 h-64 overflow-y-auto">
                    <div className="text-sm space-y-2">
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4" />
                        <span>Vector DB Query: 0.2s</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Code className="w-4 h-4" />
                        <span>LLM Processing: 2.1s</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
