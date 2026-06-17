import { describe, expect, it } from "vitest";
import { inorderFrames, preorderFrames, postorderFrames } from "./treeTraversal";
import type { BinTreeView } from "./binaryTree";

// Tree: [1,null,2,3]  →  1 with right child 2, whose left child is 3.
const TREE = "1,null,2,3";

describe("tree traversals", () => {
  it("inorder visits left, node, right", () => {
    expect(inorderFrames(TREE).result).toEqual([1, 3, 2]);
  });

  it("preorder visits node, left, right", () => {
    expect(preorderFrames(TREE).result).toEqual([1, 2, 3]);
  });

  it("postorder visits left, right, node", () => {
    expect(postorderFrames(TREE).result).toEqual([3, 2, 1]);
  });

  it("all traversals agree on a balanced tree", () => {
    // [1,2,3,4,5] →      1
    //                   / \
    //                  2   3
    //                 / \
    //                4   5
    expect(inorderFrames("1,2,3,4,5").result).toEqual([4, 2, 5, 1, 3]);
    expect(preorderFrames("1,2,3,4,5").result).toEqual([1, 2, 4, 5, 3]);
    expect(postorderFrames("1,2,3,4,5").result).toEqual([4, 5, 2, 3, 1]);
  });

  it("handles an empty tree", () => {
    expect(inorderFrames("").result).toEqual([]);
    expect(preorderFrames("").result).toEqual([]);
    expect(postorderFrames("").result).toEqual([]);
  });

  it("handles a single node", () => {
    expect(inorderFrames("1").result).toEqual([1]);
  });

  it("emits a tree view and eli5 caption on every frame", () => {
    for (const f of inorderFrames(TREE).frames) {
      expect((f.view as unknown as BinTreeView).slots.length).toBeGreaterThan(0);
      expect(f.eli5Caption.length).toBeGreaterThan(0);
    }
  });
});
