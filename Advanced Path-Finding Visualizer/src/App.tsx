import React, { useState, useCallback, useEffect } from 'react';
import { Algorithm, Grid as GridType, Node, VisualizationSettings } from './types/grid';
import Grid from './components/Grid';
import Controls from './components/Controls';
import { weightedAstar, dijkstra, bfs, dfs, greedyBestFirst, bidirectional, jumpPointSearch } from './algorithms';

const GRID_ROWS = 20;
const GRID_COLS = 50;

function createNode(row: number, col: number): Node {
  return {
    row,
    col,
    type: 'empty',
    isVisited: false,
    distance: Infinity,
    previousNode: null,
    f: Infinity,
    g: Infinity,
    h: Infinity,
    weight: 1
  };
}

function createInitialGrid(): GridType {
  const grid: GridType = [];
  for (let row = 0; row < GRID_ROWS; row++) {
    const currentRow: Node[] = [];
    for (let col = 0; col < GRID_COLS; col++) {
      currentRow.push(createNode(row, col));
    }
    grid.push(currentRow);
  }
  
  // Set start and end nodes
  const startNode = grid[10][10];
  const endNode = grid[10][40];
  startNode.type = 'start';
  endNode.type = 'end';
  
  return grid;
}

function App() {
  const [grid, setGrid] = useState<GridType>(createInitialGrid);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm>('weighted-astar');
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [pathCost, setPathCost] = useState<number | null>(null);
  const [settings, setSettings] = useState<VisualizationSettings>({
    speed: 3,
    allowDiagonal: false,
    weightedNodes: false,
    multipleTargets: false,
    compareMode: false,
    selectedAlgorithms: []
  });
  const [algorithmResults, setAlgorithmResults] = useState<AlgorithmResult[]>([]);

  const getNewGridWithWallToggled = (grid: GridType, row: number, col: number): GridType => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    if (node.type === 'start' || node.type === 'end') return newGrid;
    
    let newType: NodeType;
    if (settings.weightedNodes) {
      if (node.type === 'empty') newType = 'weight';
      else if (node.type === 'weight') newType = 'wall';
      else newType = 'empty';
    } else {
      newType = node.type === 'wall' ? 'empty' : 'wall';
    }
    
    const newNode = {
      ...node,
      type: newType,
      weight: newType === 'weight' ? 5 : 1
    };
    newGrid[row][col] = newNode;
    return newGrid;
  };

  const handleMouseDown = (row: number, col: number) => {
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);
    setMouseIsPressed(true);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (!mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);
  };

  const handleMouseUp = () => {
    setMouseIsPressed(false);
  };

  const animateAlgorithm = (visitedNodesInOrder: Node[], nodesInShortestPath: Node[], algorithm: Algorithm) => {
    const speed = 6 - settings.speed;
    
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPath, algorithm);
        }, speed * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        if (node.type !== 'start' && node.type !== 'end') {
          setGrid(prev => {
            const newGrid = prev.slice();
            const newNode = { ...newGrid[node.row][node.col], type: 'visited' as const };
            newGrid[node.row][node.col] = newNode;
            return newGrid;
          });
        }
      }, speed * i);
    }
  };

  const animateShortestPath = (nodesInShortestPath: Node[], algorithm: Algorithm) => {
    const speed = 6 - settings.speed;
    
    for (let i = 0; i < nodesInShortestPath.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPath[i];
        if (node.type !== 'start' && node.type !== 'end') {
          setGrid(prev => {
            const newGrid = prev.slice();
            const newNode = {
              ...newGrid[node.row][node.col],
              type: `path-${algorithm}` as NodeType
            };
            newGrid[node.row][node.col] = newNode;
            return newGrid;
          });
        }
        if (i === nodesInShortestPath.length - 1) {
          setIsVisualizing(false);
        }
      }, speed * i);
    }
  };

  const runAlgorithm = (algorithm: Algorithm, grid: GridType): [Node[], Node[], number] => {
    const startNode = grid.flat().find(node => node.type === 'start')!;
    const endNode = grid.flat().find(node => node.type === 'end')!;
    let visitedNodesInOrder: Node[] = [];
    let nodesInShortestPath: Node[] = [];
    let cost = 0;

    switch (algorithm) {
      case 'weighted-astar':
        [visitedNodesInOrder, nodesInShortestPath] = weightedAstar(grid, startNode, endNode, settings.allowDiagonal);
        break;
      case 'dijkstra':
        [visitedNodesInOrder, nodesInShortestPath] = dijkstra(grid, startNode, endNode);
        break;
      case 'bfs':
        [visitedNodesInOrder, nodesInShortestPath] = bfs(grid, startNode, endNode);
        break;
      case 'dfs':
        [visitedNodesInOrder, nodesInShortestPath] = dfs(grid, startNode, endNode);
        break;
      case 'greedy-best-first':
        [visitedNodesInOrder, nodesInShortestPath] = greedyBestFirst(grid, startNode, endNode);
        break;
      case 'bidirectional':
        [visitedNodesInOrder, nodesInShortestPath] = bidirectional(grid, startNode, endNode);
        break;
      case 'jump-point':
        [visitedNodesInOrder, nodesInShortestPath] = jumpPointSearch(grid, startNode, endNode, settings.allowDiagonal);
        break;
    }

    // Calculate path cost
    for (let i = 0; i < nodesInShortestPath.length - 1; i++) {
      const node = nodesInShortestPath[i];
      cost += node.type === 'weight' ? node.weight : 1;
    }

    return [visitedNodesInOrder, nodesInShortestPath, cost];
  };

  const clearGrid = () => {
    setGrid(createInitialGrid());
    setPathCost(null);
    setAlgorithmResults([]);
  };

  const generateRandomMaze = () => {
    const newGrid = createInitialGrid();
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        if (newGrid[row][col].type !== 'start' && newGrid[row][col].type !== 'end') {
          const rand = Math.random();
          if (settings.weightedNodes) {
            if (rand < 0.2) newGrid[row][col].type = 'wall';
            else if (rand < 0.4) {
              newGrid[row][col].type = 'weight';
              newGrid[row][col].weight = 5;
            }
          } else {
            if (rand < 0.3) newGrid[row][col].type = 'wall';
          }
        }
      }
    }
    setGrid(newGrid);
  };

  const visualize = () => {
    if (isVisualizing) return;
    
    const freshGrid = grid.map(row =>
      row.map(node => ({
        ...node,
        isVisited: false,
        distance: Infinity,
        previousNode: null,
        f: Infinity,
        g: Infinity,
        h: Infinity,
        type: node.type === 'visited' || node.type.startsWith('path-') ? 'empty' : node.type
      }))
    );
    
    setIsVisualizing(true);
    
    if (settings.compareMode) {
      const algorithmsToRun = settings.selectedAlgorithms.length > 0 
        ? settings.selectedAlgorithms 
        : [selectedAlgorithm];

      const results: AlgorithmResult[] = [];

      algorithmsToRun.forEach(algorithm => {
        const gridCopy = freshGrid.map(row => row.map(node => ({ ...node })));
        const [visitedNodes, shortestPath, cost] = runAlgorithm(algorithm, gridCopy);
        
        // Create a new grid for this algorithm's visualization
        const algorithmGrid = freshGrid.map(row => row.map(node => ({ ...node })));
        
        // Animate on this algorithm's specific grid
        visitedNodes.forEach(node => {
          if (node.type !== 'start' && node.type !== 'end') {
            algorithmGrid[node.row][node.col].type = 'visited';
          }
        });
        
        shortestPath.forEach(node => {
          if (node.type !== 'start' && node.type !== 'end') {
            algorithmGrid[node.row][node.col].type = `path-${algorithm}` as NodeType;
          }
        });

        results.push({
          name: algorithm,
          visitedNodes: visitedNodes.length,
          pathLength: shortestPath.length,
          pathCost: cost,
          grid: algorithmGrid
        });
      });

      setAlgorithmResults(results);
      setIsVisualizing(false);
    } else {
      setAlgorithmResults([]);
      const [visitedNodesInOrder, nodesInShortestPath, cost] = runAlgorithm(selectedAlgorithm, freshGrid);
      setPathCost(cost);
      animateAlgorithm(visitedNodesInOrder, nodesInShortestPath, selectedAlgorithm);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Path-Finding Visualizer
        </h1>
        
        <Controls
          selectedAlgorithm={selectedAlgorithm}
          settings={settings}
          onAlgorithmChange={setSelectedAlgorithm}
          onSettingsChange={(newSettings) => setSettings(prev => ({ ...prev, ...newSettings }))}
          onVisualize={visualize}
          onClear={clearGrid}
          onGenerateMaze={generateRandomMaze}
          isVisualizing={isVisualizing}
        />

        {settings.compareMode && algorithmResults.length > 0 ? (
          <div className="flex flex-col gap-4">
            {algorithmResults.map((result) => (
              <div key={result.name} className="bg-white p-4 rounded-lg shadow-lg">
                <h3 className="font-medium text-lg mb-2 text-gray-800">
                  {result.name.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </h3>
                <Grid
                  grid={result.grid}
                  onNodeClick={() => {}}
                  mouseIsPressed={false}
                  onMouseDown={() => {}}
                  onMouseEnter={() => {}}
                  onMouseUp={() => {}}
                />
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Visited Nodes:</span> {result.visitedNodes}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Path Length:</span> {result.pathLength}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Path Cost:</span> {result.pathCost}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow-lg overflow-auto">
            <Grid
              grid={grid}
              onNodeClick={() => {}}
              mouseIsPressed={mouseIsPressed}
              onMouseDown={handleMouseDown}
              onMouseEnter={handleMouseEnter}
              onMouseUp={handleMouseUp}
            />
            
            {pathCost !== null && !settings.compareMode && (
              <div className="mt-4 text-lg font-semibold text-gray-700">
                Path Cost: {pathCost}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;