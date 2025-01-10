export type NodeType = 
  | 'empty' 
  | 'wall' 
  | 'start' 
  | 'end' 
  | 'visited' 
  | 'path-astar'
  | 'path-dijkstra'
  | 'path-bfs'
  | 'path-dfs'
  | 'path-greedy'
  | 'path-bidirectional'
  | 'path-jump'
  | 'weight';

export interface Node {
  row: number;
  col: number;
  type: NodeType;
  isVisited: boolean;
  distance: number;
  previousNode: Node | null;
  f: number;
  g: number;
  h: number;
  weight: number;
}

export type Grid = Node[][];

export type Algorithm = 
  | 'weighted-astar'
  | 'dijkstra' 
  | 'bfs' 
  | 'dfs' 
  | 'greedy-best-first'
  | 'bidirectional'
  | 'jump-point';

export interface VisualizationSettings {
  speed: number;
  allowDiagonal: boolean;
  weightedNodes: boolean;
  multipleTargets: boolean;
  compareMode: boolean;
  selectedAlgorithms: Algorithm[];
}

export interface PerformanceMetrics {
  visitedNodes: number;
  pathLength: number;
  executionTime: number;
}