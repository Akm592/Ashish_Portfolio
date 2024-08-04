import PathfindingAlgorithm from "./PathfindingAlgorithm";

class FloydWarshall extends PathfindingAlgorithm {
  constructor() {
    super();
    this.distances = null;
    this.next = null;
    this.currentK = -1;
    this.currentI = 0;
    this.currentJ = 0;
  }

  start(startNode, endNode) {
    super.start(startNode, endNode);

    const nodes = Array.from(this.startNode.graph.nodes.values());
    const n = nodes.length;

    // Initialize distances and next matrices
    this.distances = Array(n)
      .fill()
      .map(() => Array(n).fill(Infinity));
    this.next = Array(n)
      .fill()
      .map(() => Array(n).fill(null));

    // Set up initial distances and next pointers
    for (let i = 0; i < n; i++) {
      this.distances[i][i] = 0;
      for (const { node: neighbor, edge } of nodes[i].neighbors) {
        const j = nodes.indexOf(neighbor);
        this.distances[i][j] = edge.weight || 1; // Assume weight 1 if not specified
        this.next[i][j] = j;
      }
    }

    this.currentK = -1;
    this.currentI = 0;
    this.currentJ = 0;
    this.n = n;
    this.nodes = nodes;
  }

  nextStep() {
    if (this.currentK >= this.n) {
      this.finished = true;
      return [];
    }

    if (this.currentK === -1 || this.currentI >= this.n) {
      this.currentK++;
      this.currentI = 0;
      this.currentJ = 0;
      if (this.currentK >= this.n) {
        this.finished = true;
        return [];
      }
    }

    if (this.currentJ >= this.n) {
      this.currentI++;
      this.currentJ = 0;
      return this.nextStep();
    }

    const i = this.currentI;
    const j = this.currentJ;
    const k = this.currentK;

    const updatedNodes = [];

    if (this.distances[i][k] + this.distances[k][j] < this.distances[i][j]) {
      this.distances[i][j] = this.distances[i][k] + this.distances[k][j];
      this.next[i][j] = this.next[i][k];
      updatedNodes.push(this.nodes[i], this.nodes[j]);
    }

    this.currentJ++;

    return updatedNodes;
  }

  // Helper method to reconstruct the path between two nodes
  getPath(start, end) {
    const startIndex = this.nodes.indexOf(start);
    const endIndex = this.nodes.indexOf(end);

    if (this.next[startIndex][endIndex] === null) {
      return []; // No path exists
    }

    const path = [start];
    let current = startIndex;
    while (current !== endIndex) {
      current = this.next[current][endIndex];
      path.push(this.nodes[current]);
    }

    return path;
  }

  // Helper method to get the shortest distance between two nodes
  getDistance(start, end) {
    const startIndex = this.nodes.indexOf(start);
    const endIndex = this.nodes.indexOf(end);
    return this.distances[startIndex][endIndex];
  }
}

export default FloydWarshall;
