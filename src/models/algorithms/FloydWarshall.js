import PathfindingAlgorithm from "./PathfindingAlgorithm";

class FloydWarshall extends PathfindingAlgorithm {
  constructor() {
    super();
    this.distances = null;
    this.next = null;
    this.nodes = null;
    this.currentK = 0;
  }

  start(startNode, endNode) {
    super.start(startNode, endNode);
    this.nodes = Array.from(this.startNode.graph.nodes.values());
    const n = this.nodes.length;

    // Initialize distances and next matrices
    this.distances = Array(n)
      .fill()
      .map(() => Array(n).fill(Infinity));
    this.next = Array(n)
      .fill()
      .map(() => Array(n).fill(null));

    // Set up initial distances and next nodes
    for (let i = 0; i < n; i++) {
      this.distances[i][i] = 0;
      for (const neighbor of this.nodes[i].neighbors) {
        const j = this.nodes.indexOf(neighbor.node);
        this.distances[i][j] = neighbor.edge.weight;
        this.next[i][j] = j;
      }
    }

    this.currentK = 0;
  }

  nextStep() {
    const n = this.nodes.length;
    if (this.currentK >= n) {
      this.finished = true;
      return [];
    }

    const updatedNodes = [];
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (
          this.distances[i][this.currentK] + this.distances[this.currentK][j] <
          this.distances[i][j]
        ) {
          this.distances[i][j] =
            this.distances[i][this.currentK] + this.distances[this.currentK][j];
          this.next[i][j] = this.next[i][this.currentK];
          updatedNodes.push(this.nodes[i], this.nodes[j]);
        }
      }
    }

    this.currentK++;
    return updatedNodes;
  }

  getPath(start, end) {
    if (this.next[start][end] === null) {
      return [];
    }
    const path = [this.nodes[start]];
    while (start !== end) {
      start = this.next[start][end];
      path.push(this.nodes[start]);
    }
    return path;
  }
}

export default FloydWarshall;
