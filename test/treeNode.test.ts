import { TreeDataNode } from "./helper/types";
import anyTest, { TestInterface } from "ava";
import TreeNode from "../src/TreeNode";

const NAMESPACE = "TreeNode: ";

const test = anyTest as TestInterface<{
  parentNode: TreeNode<TreeDataNode>;
  childNode1: TreeNode<TreeDataNode>;
  childNode2: TreeNode<TreeDataNode>;
  childNode3: TreeNode<TreeDataNode>;
}>;

test.before(t => {
  const parentNode = new TreeNode({
    id: 0,
    content: {
      title: "parent title",
      data: ["parent data"]
    }
  });
  const childNode1 = new TreeNode(
    {
      id: 1,
      content: {
        title: "child title 1",
        data: ["child data 1"]
      }
    },
    parentNode
  );
  const childNode2 = new TreeNode(
    {
      id: 2,
      content: {
        title: "child title 2",
        data: ["child data 2"]
      }
    },
    parentNode
  );
  const childNode3 = new TreeNode(
    {
      id: 3,
      content: {
        title: "child title 3",
        data: ["child data 3"]
      }
    },
    parentNode
  );

  parentNode.children = [childNode1, childNode2, childNode3];

  t.context = {
    parentNode,
    childNode1,
    childNode2,
    childNode3
  };
});

test(`${NAMESPACE}test for isLeaf`, t => {
  t.true(t.context.childNode1.isLeaf());
  t.false(t.context.parentNode.isLeaf());
});

test(`${NAMESPACE}test for isLeftMost`, t => {
  t.true(t.context.childNode1.isLeftMost());
});

test(`${NAMESPACE}test for isRightMost`, t => {
  t.true(t.context.childNode3.isRightMost());
});

test(`${NAMESPACE}test for getPreviousSibling`, t => {
  t.is(t.context.childNode3.getPreviousSibling(), t.context.childNode2);
  t.is(t.context.childNode1.getPreviousSibling(), null);
  t.is(t.context.parentNode.getPreviousSibling(), null);
});

test(`${NAMESPACE}test for getNextSibling`, t => {
  t.is(t.context.childNode1.getNextSibling(), t.context.childNode2);
  t.is(t.context.childNode3.getNextSibling(), null);
  t.is(t.context.parentNode.getNextSibling(), null);
});

test(`${NAMESPACE}test for getLeftMostSibling`, t => {
  t.is(t.context.childNode1.getLeftMostSibling(), t.context.childNode1);
  t.is(t.context.childNode3.getLeftMostSibling(), t.context.childNode1);
  t.is(t.context.parentNode.getLeftMostSibling(), null);
});

test(`${NAMESPACE}test for getLeftMostChild`, t => {
  t.is(t.context.parentNode.getLeftMostChild(), t.context.childNode1);
  t.is(t.context.childNode3.getLeftMostChild(), null);
});

test(`${NAMESPACE}test for getRightMostChild`, t => {
  t.is(t.context.parentNode.getRightMostChild(), t.context.childNode3);
  t.is(t.context.childNode3.getRightMostChild(), null);
});
