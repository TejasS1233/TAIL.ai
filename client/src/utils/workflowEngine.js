export class WorkflowEngine {
  constructor() {
    this.isRunning = false;
    this.currentExecution = null;
    this.executionHistory = [];
  }

  getNodeExecutionTime(nodeType) {
    const baseTimes = {
      openai: () => 1500 + Math.random() * 2000,
      anthropic: () => 2000 + Math.random() * 2500,
      cohere: () => 1200 + Math.random() * 1800,
      huggingface: () => 3000 + Math.random() * 4000,
      ollama: () => 5000 + Math.random() * 10000,

      "vector-retriever": () => 200 + Math.random() * 500,
      "bm25-retriever": () => 100 + Math.random() * 300,
      chroma: () => 150 + Math.random() * 350,
      pinecone: () => 300 + Math.random() * 700,
      faiss: () => 50 + Math.random() * 150,

      "recursive-splitter": () => 100 + Math.random() * 200,
      "token-splitter": () => 80 + Math.random() * 120,
      "openai-embeddings": () => 500 + Math.random() * 1000,
      "huggingface-embeddings": () => 800 + Math.random() * 1200,

      "search-tool": () => 1000 + Math.random() * 2000,
      calculator: () => 10 + Math.random() * 40,
      "code-interpreter": () => 2000 + Math.random() * 5000,
      "web-scraper": () => 3000 + Math.random() * 7000,
      "file-reader": () => 200 + Math.random() * 800,
      "image-generator": () => 8000 + Math.random() * 15000,
      "email-tool": () => 500 + Math.random() * 1500,

      "zero-shot-agent": () => 2000 + Math.random() * 4000,
      "conversational-agent": () => 1800 + Math.random() * 3200,
      "plan-execute-agent": () => 3000 + Math.random() * 6000,

      "conversation-buffer": () => 50 + Math.random() * 100,
      "conversation-summary": () => 800 + Math.random() * 1200,
      "vector-store": () => 200 + Math.random() * 400,

      "text-input": () => 10 + Math.random() * 20,
      "chat-input": () => 10 + Math.random() * 20,
      "file-input": () => 100 + Math.random() * 500,
      "text-output": () => 20 + Math.random() * 50,
      "chat-output": () => 30 + Math.random() * 70,

      default: () => 500 + Math.random() * 1000,
    };

    return baseTimes[nodeType] || baseTimes["default"];
  }

  calculateTokenUsage(nodeType, config = {}) {
    const baseTokens = {
      openai: () => {
        const model = config.model || "gpt-3.5-turbo";
        const multiplier = model.includes("gpt-4") ? 1.5 : 1;
        return Math.floor((800 + Math.random() * 1200) * multiplier);
      },
      anthropic: () => Math.floor(900 + Math.random() * 1400),
      cohere: () => Math.floor(700 + Math.random() * 1000),
      huggingface: () => Math.floor(600 + Math.random() * 900),
      ollama: () => Math.floor(500 + Math.random() * 800),
      default: () => Math.floor(100 + Math.random() * 200),
    };

    return (baseTokens[nodeType] || baseTokens["default"])();
  }

  calculateCost(nodeType, tokens, config = {}) {
    const pricing = {
      openai: {
        "gpt-3.5-turbo": { input: 0.0015, output: 0.002 },
        "gpt-4": { input: 0.03, output: 0.06 },
        "gpt-4-turbo": { input: 0.01, output: 0.03 },
      },
      anthropic: {
        "claude-3-haiku": { input: 0.00025, output: 0.00125 },
        "claude-3-sonnet": { input: 0.003, output: 0.015 },
        "claude-3-opus": { input: 0.015, output: 0.075 },
      },
      cohere: {
        command: { input: 0.0015, output: 0.002 },
        "command-light": { input: 0.0003, output: 0.0006 },
      },
    };

    if (!pricing[nodeType]) return 0;

    const model = config.model || Object.keys(pricing[nodeType])[0];
    const modelPricing = pricing[nodeType][model];

    if (!modelPricing) return 0;

    const inputTokens = Math.floor(tokens * 0.7);
    const outputTokens = Math.floor(tokens * 0.3);

    return (inputTokens * modelPricing.input + outputTokens * modelPricing.output) / 1000;
  }

  generateExecutionLogs(node, phase, error = null) {
    const timestamp = new Date().toLocaleTimeString();
    const logs = [];

    switch (phase) {
      case "start":
        logs.push({
          timestamp,
          level: "INFO",
          message: `Starting execution of ${node.label}`,
          nodeId: node.id,
        });

        if (node.config && Object.keys(node.config).length > 0) {
          logs.push({
            timestamp,
            level: "INFO",
            message: `Configuration: ${JSON.stringify(node.config)}`,
            nodeId: node.id,
          });
        }
        break;

      case "processing":{
        const processingMessages = {
          openai: "Sending request to OpenAI API...",
          anthropic: "Calling Anthropic Claude API...",
          "vector-retriever": "Querying vector database...",
          "search-tool": "Performing web search...",
          "code-interpreter": "Executing Python code...",
          "image-generator": "Generating image...",
          default: "Processing request...",
        };

        logs.push({
          timestamp,
          level: "INFO",
          message: processingMessages[node.type] || processingMessages["default"],
          nodeId: node.id,
        });
        break;
      }
      case "success": {
        const tokens = this.calculateTokenUsage(node.type, node.config);
        const cost = this.calculateCost(node.type, tokens, node.config);

        logs.push({
          timestamp,
          level: "SUCCESS",
          message: `Completed ${node.label} successfully`,
          nodeId: node.id,
          metadata: { tokens, cost },
        });

        if (tokens > 0) {
          logs.push({
            timestamp,
            level: "INFO",
            message: `Token usage: ${tokens} tokens, Cost: $${cost.toFixed(4)}`,
            nodeId: node.id,
          });
        }
        break;
      }
      case "error":
        logs.push({
          timestamp,
          level: "ERROR",
          message: `Error in ${node.label}: ${error || "Unknown error"}`,
          nodeId: node.id,
        });
        break;

      case "warning":
        logs.push({
          timestamp,
          level: "WARNING",
          message: `Warning in ${node.label}: ${error || "Performance degraded"}`,
          nodeId: node.id,
        });
        break;
    }

    return logs;
  }

  async executeWorkflow(nodes, connections, onProgress, onLog, onNodeStatusChange) {
    if (this.isRunning) {
      throw new Error("Workflow is already running");
    }

    this.isRunning = true;
    const executionId = `exec_${Date.now()}`;
    let totalTokens = 0;
    let totalCost = 0;
    let successfulNodes = 0;
    let failedNodes = 0;
    const startTime = Date.now();

    this.currentExecution = {
      id: executionId,
      startTime,
      nodes: nodes.length,
      status: "running",
    };

    try {
      if (nodes.length === 0) {
        throw new Error("No nodes to execute");
      }

      const requiredNodes = nodes
        .filter((node) => ["openai", "anthropic", "cohere"].includes(node.type));

      for (const node of requiredNodes) {
        if (!node.config?.apiKey) {
          onLog([
            {
              timestamp: new Date().toLocaleTimeString(),
              level: "WARNING",
              message: `Missing API key for ${node.type}. Using mock responses.`,
              nodeId: null,
            },
          ]);
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        try {
          onNodeStatusChange(node.id, "running");

          const startLogs = this.generateExecutionLogs(node, "start");
          onLog(startLogs);

          await new Promise((resolve) => setTimeout(resolve, 200));

          const processingLogs = this.generateExecutionLogs(node, "processing");
          onLog(processingLogs);

          const executionTime = this.getNodeExecutionTime(node.type)();
          await new Promise((resolve) => setTimeout(resolve, executionTime));

          if (Math.random() < 0.05) {
            const errorMessages = [
              "Rate limit exceeded",
              "Network timeout",
              "Invalid configuration",
              "Service temporarily unavailable",
            ];
            const error = errorMessages[Math.floor(Math.random() * errorMessages.length)];

            onNodeStatusChange(node.id, "error");
            const errorLogs = this.generateExecutionLogs(node, "error", error);
            onLog(errorLogs);
            failedNodes++;
            continue;
          }

          if (Math.random() < 0.1) {
            const warningLogs = this.generateExecutionLogs(
              node,
              "warning",
              "High latency detected"
            );
            onLog(warningLogs);
          }

          const successLogs = this.generateExecutionLogs(node, "success");
          onLog(successLogs);

          const nodeTokens = this.calculateTokenUsage(node.type, node.config);
          const nodeCost = this.calculateCost(node.type, nodeTokens, node.config);
          totalTokens += nodeTokens;
          totalCost += nodeCost;
          successfulNodes++;

          onNodeStatusChange(node.id, "success");

          onProgress({
            completed: i + 1,
            total: nodes.length,
            percentage: ((i + 1) / nodes.length) * 100,
          });
        } catch (nodeError) {
          onNodeStatusChange(node.id, "error");
          const errorLogs = this.generateExecutionLogs(node, "error", nodeError.message);
          onLog(errorLogs);
          failedNodes++;
        }
      }

      const endTime = Date.now();
      const duration = endTime - startTime;
      const successRate = (successfulNodes / nodes.length) * 100;

      const summaryLogs = [
        {
          timestamp: new Date().toLocaleTimeString(),
          level: "SUCCESS",
          message: `Workflow completed. ${successfulNodes}/${nodes.length} nodes successful (${successRate.toFixed(1)}%)`,
          nodeId: null,
        },
      ];

      if (totalTokens > 0) {
        summaryLogs.push({
          timestamp: new Date().toLocaleTimeString(),
          level: "INFO",
          message: `Total usage: ${totalTokens.toLocaleString()} tokens, $${totalCost.toFixed(4)}`,
          nodeId: null,
        });
      }

      onLog(summaryLogs);

      this.executionHistory.push({
        id: executionId,
        startTime,
        endTime,
        duration,
        nodes: nodes.length,
        successfulNodes,
        failedNodes,
        totalTokens,
        totalCost,
        successRate,
      });

      return {
        success: true,
        duration,
        tokens: totalTokens,
        cost: totalCost,
        successRate,
        executionId,
      };
    } catch (error) {
      onLog([
        {
          timestamp: new Date().toLocaleTimeString(),
          level: "ERROR",
          message: `Workflow execution failed: ${error.message}`,
          nodeId: null,
        },
      ]);

      return {
        success: false,
        error: error.message,
        executionId,
      };
    } finally {
      this.isRunning = false;
      this.currentExecution = null;
    }
  }

  getExecutionStats() {
    if (this.executionHistory.length === 0) return null;

    const recent = this.executionHistory.slice(-10);
    const avgDuration = recent.reduce((sum, exec) => sum + exec.duration, 0) / recent.length;
    const avgSuccessRate = recent.reduce((sum, exec) => sum + exec.successRate, 0) / recent.length;
    const totalCost = recent.reduce((sum, exec) => sum + exec.totalCost, 0);
    const totalTokens = recent.reduce((sum, exec) => sum + exec.totalTokens, 0);

    return {
      totalExecutions: this.executionHistory.length,
      avgDuration,
      avgSuccessRate,
      totalCost,
      totalTokens,
      recentExecutions: recent,
    };
  }

  stopExecution() {
    if (this.isRunning) {
      this.isRunning = false;
      this.currentExecution = null;
      return true;
    }
    return false;
  }

  getCurrentExecution() {
    return this.currentExecution;
  }
}

export const workflowEngine = new WorkflowEngine();
