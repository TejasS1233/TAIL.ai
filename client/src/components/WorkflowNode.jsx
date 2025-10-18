import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Settings, Play, Pause, CheckCircle, AlertCircle, Clock, Zap } from "lucide-react";

export const WorkflowNode = ({
  node,
  isSelected,
  executionStatus,
  onSelect,
  onDelete,
  onConfigure,
  zoom = 1,
  canvasOffset = { x: 0, y: 0 },
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = node.icon;

  const getStatusColor = () => {
    switch (executionStatus) {
      case "running":
        return "border-blue-500 bg-blue-50";
      case "success":
        return "border-green-500 bg-green-50";
      case "error":
        return "border-red-500 bg-red-50";
      case "waiting":
        return "border-yellow-500 bg-yellow-50";
      default:
        return isSelected ? "border-primary" : "border-border hover:border-muted-foreground";
    }
  };

  const getStatusIcon = () => {
    switch (executionStatus) {
      case "running":
        return <Clock className="w-3 h-3 text-blue-500 animate-spin" />;
      case "success":
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      case "error":
        return <AlertCircle className="w-3 h-3 text-red-500" />;
      case "waiting":
        return <Pause className="w-3 h-3 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.02 }}
      style={{
        position: "absolute",
        left: node.x * zoom + canvasOffset.x,
        top: node.y * zoom + canvasOffset.y,
        transform: `scale(${zoom})`,
        transformOrigin: "top left",
      }}
      className={`w-56 bg-background border-2 rounded-xl p-4 cursor-pointer shadow-lg transition-all duration-200 ${getStatusColor()}`}
      onClick={() => onSelect(node)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 ${node.color} rounded-lg flex items-center justify-center shadow-sm`}
          >
            <IconComponent className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">{node.label}</h3>
            <p className="text-xs text-muted-foreground truncate">{node.type}</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {getStatusIcon()}
          {(isHovered || isSelected) && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onConfigure(node);
                }}
              >
                <Settings className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-70 hover:opacity-100 text-red-500 hover:text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(node.id);
                }}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Configuration Preview */}
      {node.config && Object.keys(node.config).length > 0 && (
        <div className="mb-3">
          <div className="bg-muted/50 rounded-lg p-2">
            <div className="text-xs text-muted-foreground mb-1">Configuration:</div>
            <div className="space-y-1">
              {Object.entries(node.config)
                .slice(0, 2)
                .map(([key, value]) => (
                  <div key={key} className="flex justify-between text-xs">
                    <span className="text-muted-foreground capitalize">{key}:</span>
                    <span className="font-mono truncate max-w-20" title={String(value)}>
                      {String(value)}
                    </span>
                  </div>
                ))}
              {Object.keys(node.config).length > 2 && (
                <div className="text-xs text-muted-foreground">
                  +{Object.keys(node.config).length - 2} more...
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Execution Stats */}
      {executionStatus && (
        <div className="mb-3">
          <Badge variant="outline" className="text-xs">
            {executionStatus === "running" && (
              <>
                <Zap className="w-3 h-3 mr-1" />
                Executing...
              </>
            )}
            {executionStatus === "success" && (
              <>
                <CheckCircle className="w-3 h-3 mr-1" />
                Completed
              </>
            )}
            {executionStatus === "error" && (
              <>
                <AlertCircle className="w-3 h-3 mr-1" />
                Failed
              </>
            )}
            {executionStatus === "waiting" && (
              <>
                <Clock className="w-3 h-3 mr-1" />
                Waiting
              </>
            )}
          </Badge>
        </div>
      )}

      {/* Connection Points */}
      <div className="absolute -left-3 top-1/2 transform -translate-y-1/2">
        <div className="w-6 h-6 bg-blue-500 rounded-full border-4 border-background shadow-sm flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      </div>
      <div className="absolute -right-3 top-1/2 transform -translate-y-1/2">
        <div className="w-6 h-6 bg-green-500 rounded-full border-4 border-background shadow-sm flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      </div>

      {/* Execution Progress Bar */}
      {executionStatus === "running" && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted rounded-b-xl overflow-hidden">
          <motion.div
            className="h-full bg-blue-500"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </div>
      )}
    </motion.div>
  );
};
