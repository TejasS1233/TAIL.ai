import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  Download,
  Activity,
  Clock,
  Zap,
  CheckCircle,
  AlertCircle,
  Database,
  DollarSign,
  BarChart3,
  Terminal,
  FileText,
  Eye,
} from "lucide-react";

export const ExecutionPanel = ({
  isRunning,
  executionLogs,
  executionStats,
  onRun,
  onPause,
  onStop,
  onReset,
  onExport,
}) => {
  const [activeTab, setActiveTab] = useState("logs");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setProgress((prev) => Math.min(prev + Math.random() * 10, 95));
      }, 500);
      return () => clearInterval(interval);
    } else {
      setProgress(100);
    }
  }, [isRunning]);

  const getLogLevelColor = (level) => {
    switch (level) {
      case "SUCCESS":
        return "text-green-400";
      case "ERROR":
        return "text-red-400";
      case "WARNING":
        return "text-yellow-400";
      case "INFO":
        return "text-blue-400";
      default:
        return "text-gray-300";
    }
  };

  const formatDuration = (ms) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const formatCost = (cost) => {
    return `$${cost.toFixed(4)}`;
  };

  return (
    <div className="w-80 border-l bg-muted/30 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Execution</h2>
          <Badge variant={isRunning ? "default" : "secondary"} className="flex items-center gap-1">
            <Activity className="w-3 h-3" />
            {isRunning ? "Running" : "Idle"}
          </Badge>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={onRun}
            disabled={isRunning}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <Play className="w-4 h-4 mr-2" />
            Run
          </Button>
          <Button variant="outline" size="sm" onClick={onPause} disabled={!isRunning}>
            <Pause className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onStop} disabled={!isRunning}>
            <Square className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onReset}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Progress Bar */}
        {isRunning && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </div>

      {/* Stats Overview */}
      {executionStats && (
        <div className="p-4 border-b">
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <div>
                  <div className="text-xs text-muted-foreground">Duration</div>
                  <div className="font-mono text-sm">{formatDuration(executionStats.duration)}</div>
                </div>
              </div>
            </Card>
            <Card className="p-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-green-500" />
                <div>
                  <div className="text-xs text-muted-foreground">Tokens</div>
                  <div className="font-mono text-sm">
                    {executionStats.tokens?.toLocaleString() || 0}
                  </div>
                </div>
              </div>
            </Card>
            <Card className="p-3">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-yellow-500" />
                <div>
                  <div className="text-xs text-muted-foreground">Cost</div>
                  <div className="font-mono text-sm">{formatCost(executionStats.cost || 0)}</div>
                </div>
              </div>
            </Card>
            <Card className="p-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-500" />
                <div>
                  <div className="text-xs text-muted-foreground">Success Rate</div>
                  <div className="font-mono text-sm">
                    {(executionStats.successRate || 0).toFixed(1)}%
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 m-4 mb-0">
          <TabsTrigger value="logs" className="text-xs">
            <Terminal className="w-3 h-3 mr-1" />
            Logs
          </TabsTrigger>
          <TabsTrigger value="metrics" className="text-xs">
            <BarChart3 className="w-3 h-3 mr-1" />
            Metrics
          </TabsTrigger>
          <TabsTrigger value="output" className="text-xs">
            <FileText className="w-3 h-3 mr-1" />
            Output
          </TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="flex-1 p-4 pt-2">
          <div className="bg-black rounded-lg p-3 h-full overflow-y-auto font-mono text-xs">
            <AnimatePresence>
              {executionLogs.length === 0 ? (
                <div className="text-gray-500 text-center py-8">
                  No execution logs yet...
                  <br />
                  <span className="text-xs">Click Run to start workflow</span>
                </div>
              ) : (
                executionLogs.map((log, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`mb-1 ${getLogLevelColor(log.level)}`}
                  >
                    <span className="text-gray-500">[{log.timestamp}]</span>{" "}
                    <span className={getLogLevelColor(log.level)}>{log.level}</span> {log.message}
                    {log.nodeId && <span className="text-gray-400 ml-2">({log.nodeId})</span>}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
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

        <TabsContent value="metrics" className="flex-1 p-4 pt-2">
          <div className="space-y-4">
            {executionStats ? (
              <>
                <Card className="p-3">
                  <h4 className="font-medium text-sm mb-2">Performance Metrics</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg Response Time:</span>
                      <span className="font-mono">
                        {formatDuration(executionStats.avgResponseTime || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Throughput:</span>
                      <span className="font-mono">
                        {(executionStats.throughput || 0).toFixed(1)} req/s
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Error Rate:</span>
                      <span className="font-mono text-red-500">
                        {(executionStats.errorRate || 0).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </Card>

                <Card className="p-3">
                  <h4 className="font-medium text-sm mb-2">Resource Usage</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Memory:</span>
                      <span className="font-mono">
                        {(executionStats.memoryUsage || 0).toFixed(1)} MB
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">CPU:</span>
                      <span className="font-mono">
                        {(executionStats.cpuUsage || 0).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Network:</span>
                      <span className="font-mono">
                        {(executionStats.networkUsage || 0).toFixed(1)} KB
                      </span>
                    </div>
                  </div>
                </Card>
              </>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No metrics available</p>
                <p className="text-xs">Run a workflow to see performance data</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="output" className="flex-1 p-4 pt-2">
          <div className="bg-muted rounded-lg p-3 h-full overflow-y-auto">
            {executionStats?.output ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">Workflow Output</h4>
                  <Button variant="outline" size="sm" onClick={onExport}>
                    <Download className="w-3 h-3 mr-1" />
                    Export
                  </Button>
                </div>
                <div className="bg-background rounded p-3 border">
                  <pre className="text-sm whitespace-pre-wrap">
                    {JSON.stringify(executionStats.output, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No output yet</p>
                <p className="text-xs">Workflow output will appear here</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Recent Runs */}
      <div className="p-4 border-t">
        <h3 className="font-medium text-sm mb-2">Recent Runs</h3>
        <div className="space-y-1">
          {[
            { id: "#1234", duration: "2.3s", status: "success" },
            { id: "#1233", duration: "1.8s", status: "success" },
            { id: "#1232", duration: "4.1s", status: "error" },
          ].map((run) => (
            <div
              key={run.id}
              className="flex justify-between items-center p-2 rounded bg-background text-sm"
            >
              <span className="font-mono">{run.id}</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {run.duration}
                </Badge>
                {run.status === "success" ? (
                  <CheckCircle className="w-3 h-3 text-green-500" />
                ) : (
                  <AlertCircle className="w-3 h-3 text-red-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
