import PathfindingAlgorithm from "./PathfindingAlgorithm";

class BellmanFord extends PathfindingAlgorithm {
  constructor() {
    super();
    this.nodes = [];
    this.currentIteration = 0;
  }

  start(startNode, endNode) {
    super.start(startNode, endNode);
    this.nodes = Array.from(
      this.startNode.edges.reduce((set, edge) => {
        set.add(edge.node1);
        set.add(edge.node2);
        return set;
      }, new Set())
    );

    this.nodes.forEach((node) => {
      node.distanceFromStart = node === this.startNode ? 0 : Infinity;
      node.parent = null;
    });

    this.currentIteration = 0;
  }

  nextStep() {
    if (this.currentIteration >= this.nodes.length - 1) {
      this.finished = true;
      return [];
    }

    const updatedNodes = [];

    for (const edge of this.getAllEdges()) {
      const u = edge.node1;
      const v = edge.node2;
      const weight = this.getEdgeWeight(edge);

      if (u.distanceFromStart + weight < v.distanceFromStart) {
        v.distanceFromStart = u.distanceFromStart + weight;
        v.parent = u;
        edge.visited = true;
        updatedNodes.push(v);
      }

      // For undirected graphs, we need to check the reverse direction too
      if (u.distanceFromStart > v.distanceFromStart + weight) {
        u.distanceFromStart = v.distanceFromStart + weight;
        u.parent = v;
        edge.visited = true;
        updatedNodes.push(u);
      }
    }

    this.currentIteration++;

    return updatedNodes;
  }

  getAllEdges() {
    const edges = new Set();
    for (const node of this.nodes) {
      for (const edge of node.edges) {
        edges.add(edge);
      }
    }
    return Array.from(edges);
  }

  getEdgeWeight(edge) {
    // Assuming the weight is the Euclidean distance between nodes
    const dx = edge.node1.longitude - edge.node2.longitude;
    const dy = edge.node1.latitude - edge.node2.latitude;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

export default BellmanFord;
