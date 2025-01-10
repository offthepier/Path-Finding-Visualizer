import React from 'react';
import { Node as NodeType } from '../types/grid';

interface NodeProps {
  node: NodeType;
  onClick: () => void;
  onMouseDown: () => void;
  onMouseEnter: () => void;
  onMouseUp: () => void;
  mouseIsPressed: boolean;
}

const Node: React.FC<NodeProps> = ({
  node,
  onClick,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}) => {
  const getNodeClassName = () => {
    const baseClass = 'w-5 h-5 border border-gray-200 transition-colors duration-200';
    switch (node.type) {
      case 'start':
        return `${baseClass} bg-green-500`;
      case 'end':
        return `${baseClass} bg-red-500`;
      case 'wall':
        return `${baseClass} bg-gray-800`;
      case 'weight':
        return `${baseClass} bg-yellow-600`;
      case 'visited':
        return `${baseClass} bg-blue-300`;
      case 'path-weighted-astar':
        return `${baseClass} bg-yellow-400`;
      case 'path-dijkstra':
        return `${baseClass} bg-pink-500`;
      case 'path-bfs':
        return `${baseClass} bg-green-400`;
      case 'path-dfs':
        return `${baseClass} bg-orange-500`;
      case 'path-greedy-best-first':
        return `${baseClass} bg-cyan-500`;
      case 'path-bidirectional':
        return `${baseClass} bg-indigo-500`;
      case 'path-jump-point':
        return `${baseClass} bg-teal-500`;
      default:
        return `${baseClass} bg-white hover:bg-gray-100`;
    }
  };

  return (
    <div
      className={getNodeClassName()}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseUp={onMouseUp}
      onDragStart={(e) => e.preventDefault()}
    />
  );
};

export default Node;