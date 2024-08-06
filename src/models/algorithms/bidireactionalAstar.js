import PathfindingAlgorithm from "./PathfindingAlgorithm";

class PriorityQueue {
  constructor(comparator = (a, b) => a > b) {
    this.heap = [];
    this.comparator = comparator;
  }

  push(value) {
    this.heap.push(value);
    this.bubbleUp();
  }

  pop() {
    const top = this.heap[0];
    const bottom = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = bottom;
      this.bubbleDown();
    }
    return top;
  }

  peek() {
    return this.heap[0];
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  bubbleUp() {
    let index = this.heap.length - 1;
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.comparator(this.heap[index], this.heap[parentIndex])) {
        [this.heap[index], this.heap[parentIndex]] = [
          this.heap[parentIndex],
          this.heap[index],
        ];
        index = parentIndex;
      } else {
        break;
      }
    }
  }

  bubbleDown() {
    let index = 0;
    while (true) {
      const leftChildIndex = 2 * index + 1;
      const rightChildIndex = 2 * index + 2;
      let smallestChildIndex = index;

      if (
        leftChildIndex < this.heap.length &&
        this.comparator(
          this.heap[leftChildIndex],
          this.heap[smallestChildIndex]
        )
      ) {
        smallestChildIndex = leftChildIndex;
      }

      if (
        rightChildIndex < this.heap.length &&
        this.comparator(
          this.heap[rightChildIndex],
          this.heap[smallestChildIndex]
        )
      ) {
        smallestChildIndex = rightChildIndex;
      }

      if (smallestChildIndex !== index) {
        [this.heap[index], this.heap[smallestChildIndex]] = [
          this.heap[smallestChildIndex],
          this.heap[index],
        ];
        index = smallestChildIndex;
      } else {
        break;
      }
    }
  }

  contains(value) {
    return this.heap.includes(value);
  }

  update(value) {
    const index = this.heap.indexOf(value);
    if (index !== -1) {
      this.bubbleUp();
      this.bubbleDown();
    }
  }

  clear() {
    this.heap = [];
  }
}

class BidirectionalAStar extends PathfindingAlgorithm {
  constructor() {
    super();
    this.openSetStart = new PriorityQueue((a, b) => a.f < b.f);
    this.openSetEnd = new PriorityQueue((a, b) => a.f < b.f);
    this.closedSetStart = new Set();
    this.closedSetEnd = new Set();
  }

  start(startNode, endNode) {
    super.start(startNode, endNode);
    this.openSetStart.clear();
    this.openSetEnd.clear();
    this.closedSetStart.clear();
    this.closedSetEnd.clear();

    startNode.g = 0;
    startNode.f = this.heuristic(startNode, endNode);
    this.openSetStart.push(startNode);

    endNode.g = 0;
    endNode.f = this.heuristic(endNode, startNode);
    this.openSetEnd.push(endNode);
  }

  heuristic(a, b) {
    // Manhattan distance
    return (
      Math.abs(a.latitude - b.latitude) + Math.abs(a.longitude - b.longitude)
    );
  }

  nextStep() {
    if (this.finished) return [];

    const updatedNodes = [];

    if (!this.openSetStart.isEmpty() && !this.openSetEnd.isEmpty()) {
      if (this.openSetStart.peek().f <= this.openSetEnd.peek().f) {
        updatedNodes.push(
          ...this.expandNode(
            this.openSetStart,
            this.closedSetStart,
            this.openSetEnd,
            this.endNode,
            true
          )
        );
      } else {
        updatedNodes.push(
          ...this.expandNode(
            this.openSetEnd,
            this.closedSetEnd,
            this.openSetStart,
            this.startNode,
            false
          )
        );
      }
    }

    return updatedNodes;
  }

  expandNode(openSet, closedSet, oppositeOpenSet, targetNode, isForward) {
    const current = openSet.pop();
    closedSet.add(current);

    const updatedNodes = [current];

    if (oppositeOpenSet.contains(current)) {
      this.finished = true;
      return updatedNodes;
    }

    for (const { node: neighbor, edge } of current.neighbors) {
      if (closedSet.has(neighbor)) continue;

      const tentativeG = current.g + edge.weight;

      if (!openSet.contains(neighbor) || tentativeG < neighbor.g) {
        neighbor.parent = current;
        neighbor.g = tentativeG;
        neighbor.f = neighbor.g + this.heuristic(neighbor, targetNode);

        if (!openSet.contains(neighbor)) {
          openSet.push(neighbor);
        } else {
          openSet.update(neighbor);
        }

        updatedNodes.push(neighbor);
      }
    }

    return updatedNodes;
  }
}

export default BidirectionalAStar;
