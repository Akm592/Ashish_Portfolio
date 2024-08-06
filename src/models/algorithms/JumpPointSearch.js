import PathfindingAlgorithm from "./PathfindingAlgorithm";

class JumpPointSearch extends PathfindingAlgorithm {
  constructor() {
    super();
    this.openList = [];
    this.closedSet = new Set();
  }

  start(startNode, endNode) {
    super.start(startNode, endNode);
    this.openList = [this.startNode];
    this.closedSet.clear();
    this.startNode.g = 0;
    this.startNode.f = this.heuristic(this.startNode, this.endNode);
  }

  nextStep() {
    if (this.openList.length === 0) {
      this.finished = true;
      return [];
    }

    const current = this.openList.reduce((min, node) =>
      node.f < min.f ? node : min
    );
    const currentIndex = this.openList.indexOf(current);
    this.openList.splice(currentIndex, 1);
    this.closedSet.add(current);

    if (current === this.endNode) {
      this.finished = true;
      return [current];
    }

    const neighbors = this.identifySuccessors(current);
    const updatedNodes = [current, ...neighbors];

    for (const neighbor of neighbors) {
      if (this.closedSet.has(neighbor)) continue;

      const tentativeG = current.g + this.distance(current, neighbor);

      if (!this.openList.includes(neighbor) || tentativeG < neighbor.g) {
        neighbor.parent = current;
        neighbor.g = tentativeG;
        neighbor.f = neighbor.g + this.heuristic(neighbor, this.endNode);

        if (!this.openList.includes(neighbor)) {
          this.openList.push(neighbor);
        }
      }
    }

    return updatedNodes;
  }

  identifySuccessors(node) {
    const successors = [];
    const neighbors = this.pruneNeighbors(node);

    for (const neighbor of neighbors) {
      const jumpPoint = this.jump(neighbor, node);
      if (jumpPoint) {
        successors.push(jumpPoint);
      }
    }

    return successors;
  }

  pruneNeighbors(node) {
    // Implementation depends on your graph structure
    // This is a simplified version
    return node.neighbors
      .map((n) => n.node)
      .filter((n) => !this.closedSet.has(n));
  }

  jump(node, parent) {
    if (!node || this.closedSet.has(node)) return null;
    if (node === this.endNode) return node;

    const dx = node.longitude - parent.longitude;
    const dy = node.latitude - parent.latitude;

    // Diagonal case
    if (dx !== 0 && dy !== 0) {
      if (
        (this.isWalkable(node.longitude - dx, node.latitude + dy) &&
          !this.isWalkable(node.longitude - dx, node.latitude)) ||
        (this.isWalkable(node.longitude + dx, node.latitude - dy) &&
          !this.isWalkable(node.longitude, node.latitude - dy))
      ) {
        return node;
      }
    } else {
      // Horizontal case
      if (dx !== 0) {
        if (
          (this.isWalkable(node.longitude + dx, node.latitude + 1) &&
            !this.isWalkable(node.longitude, node.latitude + 1)) ||
          (this.isWalkable(node.longitude + dx, node.latitude - 1) &&
            !this.isWalkable(node.longitude, node.latitude - 1))
        ) {
          return node;
        }
        // Vertical case
      } else {
        if (
          (this.isWalkable(node.longitude + 1, node.latitude + dy) &&
            !this.isWalkable(node.longitude + 1, node.latitude)) ||
          (this.isWalkable(node.longitude - 1, node.latitude + dy) &&
            !this.isWalkable(node.longitude - 1, node.latitude))
        ) {
          return node;
        }
      }
    }

    // Continue jumping
    const nextNode = this.getNodeAt(node.longitude + dx, node.latitude + dy);
    return this.jump(nextNode, node);
  }

  isWalkable(x, y) {
    // Implementation depends on your graph structure
    const node = this.getNodeAt(x, y);
    return node && !this.closedSet.has(node);
  }

  getNodeAt(x, y) {
    // Implementation depends on your graph structure
    // This is a placeholder
    return this.graph.nodes.find((n) => n.longitude === x && n.latitude === y);
  }

  heuristic(a, b) {
    return Math.hypot(a.longitude - b.longitude, a.latitude - b.latitude);
  }

  distance(a, b) {
    return Math.hypot(a.longitude - b.longitude, a.latitude - b.latitude);
  }
}

export default JumpPointSearch;
