import React, { useMemo } from "react";
import { motion } from "framer-motion";

const MiniMap = ({ nodes, canvasDimensions, canvasOffset, zoom }) => {
  const minimapWidth = 220;
  const minimapHeight = 160;

  const { boundingBox, scale } = useMemo(() => {
    let nodeMinX = Infinity, nodeMinY = Infinity, nodeMaxX = -Infinity, nodeMaxY = -Infinity;
    if (nodes.length > 0) {
      nodes.forEach(node => {
        nodeMinX = Math.min(nodeMinX, node.x);
        nodeMinY = Math.min(nodeMinY, node.y);
        nodeMaxX = Math.max(nodeMaxX, node.x + 192);
        nodeMaxY = Math.max(nodeMaxY, node.y + 88);
      });
    } else {
      nodeMinX = 0;
      nodeMinY = 0;
      nodeMaxX = canvasDimensions.width > 0 ? canvasDimensions.width / zoom : 1000;
      nodeMaxY = canvasDimensions.height > 0 ? canvasDimensions.height / zoom : 800;
    }

    const viewMinX = -canvasOffset.x / zoom;
    const viewMinY = -canvasOffset.y / zoom;
    const viewMaxX = viewMinX + canvasDimensions.width / zoom;
    const viewMaxY = viewMinY + canvasDimensions.height / zoom;

    const worldMinX = Math.min(nodeMinX, viewMinX);
    const worldMinY = Math.min(nodeMinY, viewMinY);
    const worldMaxX = Math.max(nodeMaxX, viewMaxX);
    const worldMaxY = Math.max(nodeMaxY, viewMaxY);
    
    const padding = 20;
    const box = {
      minX: worldMinX - padding,
      minY: worldMinY - padding,
      width: (worldMaxX - worldMinX) + (padding * 2),
      height: (worldMaxY - worldMinY) + (padding * 2),
    };

    const scaleX = box.width > 0 ? minimapWidth / box.width : 1;
    const scaleY = box.height > 0 ? minimapHeight / box.height : 1;
    
    return { boundingBox: box, scale: Math.min(scaleX, scaleY, 1) };
  }, [nodes, canvasDimensions, canvasOffset, zoom]);

  const viewportStyle = {
    width: (canvasDimensions.width / zoom) * scale,
    height: (canvasDimensions.height / zoom) * scale,
    left: (-canvasOffset.x - boundingBox.minX) * scale,
    top: (-canvasOffset.y - boundingBox.minY) * scale,
    transition: 'all 150ms ease-out',
  };

  return (
    <motion.div
      className="absolute bottom-5 right-5 bg-card/80 border border-border rounded-lg shadow-xl backdrop-blur-sm transition-all hover:shadow-2xl pointer-events-none"
      style={{ width: minimapWidth, height: minimapHeight }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
    >
      <div className="relative w-full h-full overflow-hidden">
        {nodes.map(node => (
          <div
            key={node.id}
            className={`absolute rounded-sm transition-all duration-150`}
            style={{
              left: (node.x - boundingBox.minX) * scale,
              top: (node.y - boundingBox.minY) * scale,
              width: 192 * scale,
              height: 88 * scale,
              backgroundColor: node.color ? `var(--${node.color.split('-')[1]}-${node.color.split('-')[2]})` : 'gray',
              opacity: 0.8,
            }}
          />
        ))}
        <div
          className="absolute border-2 border-primary bg-primary/20 rounded"
          style={viewportStyle}
        />
      </div>
    </motion.div>
  );
};

export default MiniMap;