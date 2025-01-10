import { Node, Grid } from '../types/grid';

// Helper functions
function getAllNodes(grid: Grid): Node[] {
  const nodes: Node[] = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

function getUnvisitedNeighbors(node: Node, grid: Grid, allowDiagonal: boolean): Node[] {
  const neighbors: Node[] = [];
  const { row, col } = node;
  
  // Orthogonal neighbors
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  
  // Diagonal neighbors
  if (allowDiagonal) {
    if (row > 0 && col > 0) neighbors.push(grid[row - 1][col - 1]);
    if (row > 0 && col < grid[0].length - 1) neighbors.push(grid[row - 1][col + 1]);
    if (row < grid.length - 1 && col > 0) neighbors.push(grid[row + 1][col - 1]);
    if (row < grid.length - 1 && col < grid[0].length - 1) neighbors.push(grid[row + 1][col + 1]);
  }
  
  return neighbors.filter(neighbor => !neighbor.isVisited && neighbor.type !== 'wall');
}

function manhattan(nodeA: Node, nodeB: Node): number {
  return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
}

function getNodesInShortestPathOrder(finishNode: Node): Node[] {
  const nodesInShortestPathOrder: Node[] = [];
  let currentNode: Node | null = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}

export function weightedAstar(grid: Grid, startNode: Node, endNode: Node, allowDiagonal: boolean): [Node[], Node[]] {
  const visitedNodesInOrder: Node[] = [];
  const openSet: Node[] = [startNode];
  startNode.g = 0;
  startNode.f = manhattan(startNode, endNode);

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift()!;
    
    if (current.type === 'wall') continue;
    current.isVisited = true;
    visitedNodesInOrder.push(current);

    if (current === endNode) {
      return [visitedNodesInOrder, getNodesInShortestPathOrder(endNode)];
    }

    const neighbors = getUnvisitedNeighbors(current, grid, allowDiagonal);
    for (const neighbor of neighbors) {
      const weight = neighbor.type === 'weight' ? neighbor.weight : 1;
      const tentativeG = current.g + weight;

      if (!neighbor.isVisited || tentativeG < neighbor.g) {
        neighbor.previousNode = current;
        neighbor.g = tentativeG;
        neighbor.h = manhattan(neighbor, endNode);
        neighbor.f = neighbor.g + neighbor.h;

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    }
  }
  return [visitedNodesInOrder, []];
}

export function dijkstra(grid: Grid, startNode: Node, endNode: Node): [Node[], Node[]] {
  const visitedNodesInOrder: Node[] = [];
  startNode.distance = 0;
  const unvisitedNodes = getAllNodes(grid);

  while (unvisitedNodes.length) {
    unvisitedNodes.sort((a, b) => a.distance - b.distance);
    const closestNode = unvisitedNodes.shift()!;
    
    if (closestNode.type === 'wall') continue;
    if (closestNode.distance === Infinity) return [visitedNodesInOrder, []];
    
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    
    if (closestNode === endNode) {
      return [visitedNodesInOrder, getNodesInShortestPathOrder(endNode)];
    }
    
    const neighbors = getUnvisitedNeighbors(closestNode, grid, false);
    for (const neighbor of neighbors) {
      const weight = neighbor.type === 'weight' ? neighbor.weight : 1;
      const distance = closestNode.distance + weight;
      if (distance < neighbor.distance) {
        neighbor.distance = distance;
        neighbor.previousNode = closestNode;
      }
    }
  }
  return [visitedNodesInOrder, []];
}

export function bfs(grid: Grid, startNode: Node, endNode: Node): [Node[], Node[]] {
  const visitedNodesInOrder: Node[] = [];
  const queue: Node[] = [startNode];
  startNode.isVisited = true;
  visitedNodesInOrder.push(startNode);

  while (queue.length) {
    const currentNode = queue.shift()!;
    if (currentNode === endNode) {
      return [visitedNodesInOrder, getNodesInShortestPathOrder(endNode)];
    }

    const neighbors = getUnvisitedNeighbors(currentNode, grid, false);
    for (const neighbor of neighbors) {
      neighbor.isVisited = true;
      neighbor.previousNode = currentNode;
      visitedNodesInOrder.push(neighbor);
      queue.push(neighbor);
    }
  }
  return [visitedNodesInOrder, []];
}

export function dfs(grid: Grid, startNode: Node, endNode: Node): [Node[], Node[]] {
  const visitedNodesInOrder: Node[] = [];
  const stack: Node[] = [startNode];
  startNode.isVisited = true;
  visitedNodesInOrder.push(startNode);

  while (stack.length) {
    const currentNode = stack.pop()!;
    if (currentNode === endNode) {
      return [visitedNodesInOrder, getNodesInShortestPathOrder(endNode)];
    }

    const neighbors = getUnvisitedNeighbors(currentNode, grid, false);
    for (const neighbor of neighbors) {
      neighbor.isVisited = true;
      neighbor.previousNode = currentNode;
      visitedNodesInOrder.push(neighbor);
      stack.push(neighbor);
    }
  }
  return [visitedNodesInOrder, []];
}

export function greedyBestFirst(grid: Grid, startNode: Node, endNode: Node): [Node[], Node[]] {
  const visitedNodesInOrder: Node[] = [];
  const openSet: Node[] = [startNode];
  const visitedSet = new Set<Node>();
  
  startNode.h = manhattan(startNode, endNode);
  visitedNodesInOrder.push(startNode);
  visitedSet.add(startNode);

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.h - b.h);
    const current = openSet.shift()!;
    
    if (current === endNode) {
      return [visitedNodesInOrder, getNodesInShortestPathOrder(endNode)];
    }

    const neighbors = getUnvisitedNeighbors(current, grid, false);
    for (const neighbor of neighbors) {
      if (!visitedSet.has(neighbor)) {
        neighbor.previousNode = current;
        neighbor.h = manhattan(neighbor, endNode);
        visitedNodesInOrder.push(neighbor);
        visitedSet.add(neighbor);
        openSet.push(neighbor);
      }
    }
  }
  return [visitedNodesInOrder, []];
}

export function bidirectional(grid: Grid, startNode: Node, endNode: Node): [Node[], Node[]] {
  const visitedNodesInOrder: Node[] = [];
  const startQueue: Node[] = [startNode];
  const endQueue: Node[] = [endNode];
  
  const startVisited = new Set<Node>([startNode]);
  const endVisited = new Set<Node>([endNode]);
  
  visitedNodesInOrder.push(startNode);
  visitedNodesInOrder.push(endNode);

  while (startQueue.length && endQueue.length) {
    // Expand from start
    const currentStart = startQueue.shift()!;
    const startNeighbors = getUnvisitedNeighbors(currentStart, grid, false);
    
    for (const neighbor of startNeighbors) {
      if (!startVisited.has(neighbor)) {
        neighbor.previousNode = currentStart;
        startVisited.add(neighbor);
        visitedNodesInOrder.push(neighbor);
        startQueue.push(neighbor);
        
        if (endVisited.has(neighbor)) {
          return [visitedNodesInOrder, getNodesInShortestPathOrder(neighbor)];
        }
      }
    }

    // Expand from end
    const currentEnd = endQueue.shift()!;
    const endNeighbors = getUnvisitedNeighbors(currentEnd, grid, false);
    
    for (const neighbor of endNeighbors) {
      if (!endVisited.has(neighbor)) {
        neighbor.previousNode = currentEnd;
        endVisited.add(neighbor);
        visitedNodesInOrder.push(neighbor);
        endQueue.push(neighbor);
        
        if (startVisited.has(neighbor)) {
          return [visitedNodesInOrder, getNodesInShortestPathOrder(neighbor)];
        }
      }
    }
  }
  return [visitedNodesInOrder, []];
}

export function jumpPointSearch(grid: Grid, startNode: Node, endNode: Node, allowDiagonal: boolean): [Node[], Node[]] {
  const visitedNodesInOrder: Node[] = [];
  const openSet: Node[] = [startNode];
  const visitedSet = new Set<Node>();
  
  startNode.g = 0;
  startNode.f = manhattan(startNode, endNode);
  visitedSet.add(startNode);

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift()!;
    visitedNodesInOrder.push(current);
    
    if (current === endNode) {
      return [visitedNodesInOrder, getNodesInShortestPathOrder(endNode)];
    }

    const neighbors = getUnvisitedNeighbors(current, grid, allowDiagonal);
    for (const neighbor of neighbors) {
      if (!visitedSet.has(neighbor)) {
        const jumpPoint = findJumpPoint(neighbor, current, endNode, grid, allowDiagonal);
        if (jumpPoint) {
          const [jx, jy] = jumpPoint;
          const jumpNode = grid[jx][jy];
          
          if (!visitedSet.has(jumpNode)) {
            const ng = current.g + manhattan(current, jumpNode);
            jumpNode.g = ng;
            jumpNode.h = manhattan(jumpNode, endNode);
            jumpNode.f = jumpNode.g + jumpNode.h;
            jumpNode.previousNode = current;
            visitedSet.add(jumpNode);
            openSet.push(jumpNode);
          }
        }
      }
    }
  }
  return [visitedNodesInOrder, []];
}

function findJumpPoint(
  node: Node,
  parent: Node,
  end: Node,
  grid: Grid,
  allowDiagonal: boolean
): [number, number] | null {
  const dx = node.row - parent.row;
  const dy = node.col - parent.col;
  
  if (node.type === 'wall') return null;
  if (node === end) return [node.row, node.col];
  
  if (dx !== 0 && dy !== 0) { // Diagonal
    if (allowDiagonal) {
      if (hasForcePoint(node, dx, dy, grid)) {
        return [node.row, node.col];
      }
      
      // Recursively search in both cardinal directions
      const horizJump = findJumpPoint(
        grid[node.row][node.col + dy],
        node,
        end,
        grid,
        allowDiagonal
      );
      const vertJump = findJumpPoint(
        grid[node.row + dx][node.col],
        node,
        end,
        grid,
        allowDiagonal
      );
      
      if (horizJump || vertJump) {
        return [node.row, node.col];
      }
    }
  } else { // Cardinal
    if (dx !== 0) { // Vertical
      if (hasForcePoint(node, dx, 0, grid)) {
        return [node.row, node.col];
      }
    } else { // Horizontal
      if (hasForcePoint(node, 0, dy, grid)) {
        return [node.row, node.col];
      }
    }
  }
  
  // Continue in the same direction
  const nextRow = node.row + dx;
  const nextCol = node.col + dy;
  
  if (isWalkable(nextRow, nextCol, grid)) {
    return findJumpPoint(grid[nextRow][nextCol], node, end, grid, allowDiagonal);
  }
  
  return null;
}

function isWalkable(row: number, col: number, grid: Grid): boolean {
  return (
    row >= 0 &&
    row < grid.length &&
    col >= 0 &&
    col < grid[0].length &&
    grid[row][col].type !== 'wall'
  );
}

function hasForcePoint(node: Node, dx: number, dy: number, grid: Grid): boolean {
  const row = node.row;
  const col = node.col;
  
  // Check for forced neighbors
  if (dx !== 0) { // Vertical movement
    if (col > 0 && !isWalkable(row, col - 1, grid) && isWalkable(row + dx, col - 1, grid)) return true;
    if (col < grid[0].length - 1 && !isWalkable(row, col + 1, grid) && isWalkable(row + dx, col + 1, grid)) return true;
  } else if (dy !== 0) { // Horizontal movement
    if (row > 0 && !isWalkable(row - 1, col, grid) && isWalkable(row - 1, col + dy, grid)) return true;
    if (row < grid.length - 1 && !isWalkable(row + 1, col, grid) && isWalkable(row + 1, col + dy, grid)) return true;
  }
  
  return false;
}