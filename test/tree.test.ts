import { TreeDataNode } from "./helper/types";
import anyTest, { TestInterface } from "ava";
import { dataForShift, dataForShiftOvermuch } from "./helper/data";
import Tree from "../src/Tree";
import TreeNode from "../src/TreeNode";

interface TreeDataNodeWithResult extends TreeDataNode {
  result: {
    x: number;
    y: number;
    width: number;
  };
}

const NAMESPACE = "Tree: ";

const test = anyTest as TestInterface<{
  tree: Tree<TreeDataNodeWithResult>;
  treeNode7: TreeNode<TreeDataNodeWithResult>;
}>;

test.before(t => {
  const tree = new Tree(dataForShift);
  t.context.treeNode7 = tree.root.children[2].children[1];
  t.context.tree = tree.build();
});

test(`${NAMESPACE}test for getTree`, t => {
  const instantiatedTree = Tree.getTree(t.context.tree);
  t.is(instantiatedTree, t.context.tree);
  const newTree = Tree.getTree(null, dataForShift);
  t.not(newTree, instantiatedTree as any);
  t.deepEqual(newTree, instantiatedTree as any);
});

test(`${NAMESPACE}test for fix shift`, t => {
  const newTree = Tree.getTree(null, dataForShiftOvermuch);
  t.is(newTree.root.children[1].children[0].x, 0);
});

test(`${NAMESPACE}test for node move`, t => {
  const loop = (node: TreeNode<TreeDataNodeWithResult>) => {
    t.is(node.x, node.item.result.x);
    t.is(node.y, node.item.result.y);
    t.is(node.width, node.item.result.width);
    if (node.children) {
      node.children.forEach((child: TreeNode<TreeDataNodeWithResult>) =>
        loop(child)
      );
    }
  };
  loop(t.context.tree.root);
});

test(`${NAMESPACE}test for toggle`, t => {
  const treeNode7 = t.context.treeNode7;
  treeNode7.toggle = false; // close id: 7
  t.context.tree.build();
  t.is(treeNode7.x, treeNode7.item.result.x - 0.5);
  t.is(treeNode7.parent.x, treeNode7.parent.item.result.x - 0.25);
  t.is(
    treeNode7.parent.parent.x,
    treeNode7.parent.parent.item.result.x - 0.125
  );
});
