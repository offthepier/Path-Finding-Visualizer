import React from 'react';
import { Node as NodeType, Grid as GridType } from '../types/grid';
import Node from './Node';

interface GridProps {
  grid: GridType;
  onNodeClick: (row: number, col: number) => void;
  mouseIsPressed: boolean;
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  onMouseUp: () => void;
}

const Grid: React.FC<GridProps> = ({
  grid,
  onNodeClick,
  mouseIsPressed,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}) => {
  return (
    <div className="grid gap-0">
      {grid.map((row: NodeType[], rowIdx: number) => (
        <div key={rowIdx} className="flex">
          {row.map((node: NodeType, nodeIdx: number) => (
            <Node
              key={nodeIdx}
              node={node}
              onClick={() => onNodeClick(rowIdx, nodeIdx)}
              onMouseDown={() => onMouseDown(rowIdx, nodeIdx)}
              onMouseEnter={() => onMouseEnter(rowIdx, nodeIdx)}
              onMouseUp={onMouseUp}
              mouseIsPressed={mouseIsPressed}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Grid;