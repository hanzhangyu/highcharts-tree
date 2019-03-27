import {TreeNodeData} from "../types";
import TreeNode from "./TreeNode";
import Dictionary from "./Dictionary";

export default class Tree<T extends TreeNodeData> {
  public static getTree<T extends TreeNodeData>(tree?: Tree<T>, data?: T) {
    return tree && tree.root ? tree : new Tree(data).build();
  }

  private static nodeSize = 1;
  private static siblingDistance = 0.0;
  private static treeDistance = 0.0;

  private static initializeNodes<T extends TreeNodeData>(
    node: TreeNode<T>,
    depth: number = 0
  ) {
    node.x = -1;
    node.y = depth;
    node.mod = 0;

    if (!node.toggle) return;
    for (const child of node.children) {
      Tree.initializeNodes(child, depth + 1);
    }
  }

  private static checkForConflicts<T extends TreeNodeData>(node: TreeNode<T>) {
    const nodeContour: Dictionary<number, number> = new Dictionary();
    Tree.getLeftContour(node, 0, nodeContour);
    let sibling = node.getLeftMostSibling();
    let shiftValue = 0.0;
    while (sibling != null && sibling !== node) {
      const siblingContour: Dictionary<number, number> = new Dictionary();
      Tree.getRightContour(sibling, 0, siblingContour);

      for (
        let level = node.y + 1;
        level <=
        Math.min(
          Math.max.apply(null, siblingContour.keys()),
          Math.max.apply(null, nodeContour.keys())
        );
        level++
      ) {
        const distance =
          nodeContour.get(level) - siblingContour.get(level) - Tree.nodeSize;
        if (distance + shiftValue < Tree.treeDistance) {
          shiftValue = Tree.treeDistance - distance;
        }
      }

      if (shiftValue > 0) {
        node.x += shiftValue;
        node.mod += shiftValue;
        // update the mod in nodeContour
        nodeContour.keys(key => {
          nodeContour.set(key, nodeContour.get(key) + shiftValue);
        });

        Tree.centerNodesBetween(node, sibling);
        shiftValue = 0;
      }

      sibling = sibling.getNextSibling();
    }
  }

  private static getLeftContour<T extends TreeNodeData>(
    node: TreeNode<T>,
    modSum: number,
    values: Dictionary<number, number>
  ) {
    if (!values.containsKey(node.y)) values.set(node.y, node.x + modSum);
    else {
      values.set(node.y, Math.min(values.get(node.y), node.x + modSum));
    }

    modSum += node.mod;

    if (node.toggle) {
      for (const child of node.children) {
        Tree.getLeftContour(child, modSum, values);
      }
    }
  }

  private static getRightContour<T extends TreeNodeData>(
    node: TreeNode<T>,
    modSum: number,
    values: Dictionary<number, number>
  ) {
    if (!values.containsKey(node.y)) values.set(node.y, node.x + modSum);
    else {
      values.set(node.y, Math.max(values.get(node.y), node.x + modSum));
    }

    modSum += node.mod;

    if (node.toggle) {
      for (const child of node.children) {
        Tree.getRightContour(child, modSum, values);
      }
    }
  }

  private static centerNodesBetween<T extends TreeNodeData>(
    leftNode: TreeNode<T>,
    rightNode: TreeNode<T>
  ) {
    const leftIndex = leftNode.parent.children.indexOf(rightNode);
    const rightIndex = leftNode.parent.children.indexOf(leftNode);
    const numNodesBetween = rightIndex - leftIndex - 1;

    if (numNodesBetween > 0) {
      const distanceBetweenNodes =
        (leftNode.x - rightNode.x) / (numNodesBetween + 1);
      for (let i = leftIndex + 1; i < rightIndex; i++) {
        const middleNode = leftNode.parent.children[i];
        const desiredX = rightNode.x + distanceBetweenNodes * (i - leftIndex);
        const offset = desiredX - middleNode.x;
        middleNode.x += offset;
        middleNode.mod += offset;
      }

      Tree.checkForConflicts(leftNode);
    }
  }

  public root: TreeNode<T>;

  private treeMod = 0;

  constructor(treeNode: T) {
    this.root = this.buildTree(treeNode);
  }

  public build() {
    Tree.initializeNodes(this.root);
    this.calculateInitialX(this.root);
    this.calculateXWithMod(this.root);
    this.calculateFinalPositions(this.root);

    return this;
  }

  private calculateInitialX(node: TreeNode<T>) {
    if (node.toggle) {
      for (const child of node.children) {
        this.calculateInitialX(child);
      }
    }

    if (node.isLeaf() || !node.toggle) {
      // if there is a previous sibling in this set, set X to previous sibling + designated distance
      if (!node.isLeftMost()) {
        node.x =
          node.getPreviousSibling().x + Tree.nodeSize + Tree.siblingDistance;
      } else node.x = 0; // if this is the first node in a set, set X to 0
    } else if (node.children.length === 1) {
      // if this is the first node in a set, set it's X value equal to it's child's X value
      if (node.isLeftMost()) {
        node.x = node.children[0].x;
      } else {
        node.x =
          node.getPreviousSibling().x + Tree.nodeSize + Tree.siblingDistance;
        node.mod = node.x - node.children[0].x;
      }
    } else {
      const leftChild = node.getLeftMostChild();
      const rightChild = node.getRightMostChild();
      const mid = (leftChild.x + rightChild.x) / 2;

      if (node.isLeftMost()) {
        node.x = mid;
      } else {
        node.x =
          node.getPreviousSibling().x + Tree.nodeSize + Tree.siblingDistance;
        node.mod = node.x - mid;
      }
    }

    if (node.children.length > 0 && !node.isLeftMost() && node.toggle) {
      // Since subtrees can overlap, check for conflicts and shift tree right if needed
      Tree.checkForConflicts(node);
    }
  }

  private calculateXWithMod(node: TreeNode<T>, modSum: number = 0) {
    node.x += modSum;
    if (node.x < 0 && node.x * -1 > this.treeMod) this.treeMod = node.x * -1;
    modSum += node.mod;
    if (node.toggle) {
      for (const child of node.children) {
        this.calculateXWithMod(child, modSum);
      }
    }
  }

  private calculateFinalPositions(node: TreeNode<T>) {
    node.x += this.treeMod;

    if (node.toggle) {
      for (const child of node.children) {
        this.calculateFinalPositions(child);
      }
    }

    if (node.isLeaf() || !node.toggle) {
      node.width = node.x;
      node.height = node.y;
    } else {
      const childWidths = node.children
        .map(n => n.width)
        .sort((p1, p2) => p2 - p1);
      const childHeight = node.children
        .map(n => n.height)
        .sort((p1, p2) => p2 - p1);
      node.width = childWidths[0];
      node.height = childHeight[0];
    }
  }

  // Build tree as linked list and return root node.
  private buildTree(data: T, parent?: TreeNode<T>) {
    const currentNode = new TreeNode(data, parent);
    currentNode.children = data.children
      ? data.children.map(childData =>
          this.buildTree(childData as T, currentNode)
        )
      : [];
    return currentNode;
  }
}
