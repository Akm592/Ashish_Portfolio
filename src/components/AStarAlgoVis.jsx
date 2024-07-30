import React, { useEffect, useState } from "react";

const GRID_ROWS = 25;
const GRID_COLS = 40;

const CityVisualization = () => {
  const [grid, setGrid] = useState([]);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [path, setPath] = useState([]);

  useEffect(() => {
    generateRandomGrid();
  }, []);

  const generateRandomGrid = () => {
    const newGrid = [];
    for (let y = 0; y < GRID_ROWS; y++) {
      const row = [];
      for (let x = 0; x < GRID_COLS; x++) {
        row.push(Math.random() < 0.3 ? 1 : 0); // 30% chance of being a wall
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
    setStart(null);
    setEnd(null);
    setPath([]);
  };

  const handleCellClick = (x, y) => {
    if (grid[y][x] === 1) return; // Don't allow clicking on walls

    if (!start) {
      setStart({ x, y });
    } else if (!end) {
      setEnd({ x, y });
    } else {
      setStart({ x, y });
      setEnd(null);
      setPath([]);
    }
  };

  const findPath = () => {
    if (!start || !end) return;

    const astar = new AStar(grid);
    const newPath = astar.findPath(start, end);
    setPath(newPath || []);
  };

  const getCellClass = (x, y) => {
    if (start && start.x === x && start.y === y) return "bg-green-500";
    if (end && end.x === x && end.y === y) return "bg-red-500";
    if (path.some((p) => p.x === x && p.y === y)) return "bg-blue-500";
    return grid[y][x] === 1 ? "bg-gray-800" : "bg-white";
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div
        className="grid gap-1 mb-4"
        style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)` }}
      >
        {grid.map((row, y) =>
          row.map((_, x) => (
            <div
              key={`${x}-${y}`}
              className={`w-5 h-5 border border-gray-200 ${getCellClass(x, y)}`}
              onClick={() => handleCellClick(x, y)}
            />
          ))
        )}
      </div>
      <div className="flex space-x-4">
        <button
          onClick={generateRandomGrid}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Generate New Grid
        </button>
        <button
          onClick={findPath}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          disabled={!start || !end}
        >
          Find A* Path
        </button>
      </div>
    </div>
  );
};

class AStar {
  constructor(grid) {
    this.grid = grid;
    this.nodes = new Map();
    this.openSet = [];
    this.closedSet = new Set();
  }

  findPath(start, end) {
    this.nodes.clear();
    this.openSet = [];
    this.closedSet.clear();

    const startNode = this.getNode(start);
    const endNode = this.getNode(end);

    startNode.g = 0;
    startNode.f = this.heuristic(startNode, endNode);

    this.openSet.push(startNode);

    while (this.openSet.length > 0) {
      let current = this.openSet[0];
      let currentIndex = 0;

      for (let i = 1; i < this.openSet.length; i++) {
        if (this.openSet[i].f < current.f) {
          current = this.openSet[i];
          currentIndex = i;
        }
      }

      if (current === endNode) {
        return this.reconstructPath(current);
      }

      this.openSet.splice(currentIndex, 1);
      this.closedSet.add(current);

      for (const neighbor of this.getNeighbors(current)) {
        if (this.closedSet.has(neighbor)) continue;

        const tentativeG = current.g + 1;

        if (!this.openSet.includes(neighbor)) {
          this.openSet.push(neighbor);
        } else if (tentativeG >= neighbor.g) {
          continue;
        }

        neighbor.parent = current;
        neighbor.g = tentativeG;
        neighbor.f = neighbor.g + this.heuristic(neighbor, endNode);
      }
    }

    return null; // No path found
  }

  getNode({ x, y }) {
    const key = `${x},${y}`;
    if (!this.nodes.has(key)) {
      this.nodes.set(key, { x, y, f: 0, g: 0, h: 0, parent: null });
    }
    return this.nodes.get(key);
  }

  getNeighbors(node) {
    const neighbors = [];
    const { x, y } = node;
    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];

    for (const [dx, dy] of directions) {
      const newX = x + dx;
      const newY = y + dy;

      if (
        newX >= 0 &&
        newX < this.grid[0].length &&
        newY >= 0 &&
        newY < this.grid.length &&
        this.grid[newY][newX] !== 1
      ) {
        neighbors.push(this.getNode({ x: newX, y: newY }));
      }
    }

    return neighbors;
  }

  heuristic(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  reconstructPath(node) {
    const path = [];
    let current = node;

    while (current) {
      path.unshift({ x: current.x, y: current.y });
      current = current.parent;
    }

    return path;
  }
}

export default CityVisualization;
