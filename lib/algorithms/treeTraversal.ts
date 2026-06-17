import type { CellState, Frame } from "@/lib/types";
import {
  buildTree,
  nodeStates,
  parseLevelOrder,
  rowStates,
  type BinTreeView,
  type TreeNodeT,
} from "./binaryTree";

// Pure frame generators for the three iterative DFS traversals (inorder,
// preorder, postorder), matching the question solutions. Each animates the tree
// plus the explicit stack and the growing output. No React.

export const inorderCode = [
  "res, stack, curr = [], [], root", // 1
  "while curr or stack:", // 2
  "    while curr:                 # dive left, stacking", // 3
  "        stack.append(curr)", // 4
  "        curr = curr.left", // 5
  "    curr = stack.pop()          # leftmost unvisited", // 6
  "    res.append(curr.val)        # visit", // 7
  "    curr = curr.right           # explore right", // 8
  "return res", // 9
];

export const preorderCode = [
  "if not root: return []", // 1
  "res, stack = [], [root]", // 2
  "while stack:", // 3
  "    node = stack.pop()", // 4
  "    res.append(node.val)        # visit on the way down", // 5
  "    if node.right: stack.append(node.right)", // 6
  "    if node.left: stack.append(node.left)", // 7
  "return res", // 8
];

export const postorderCode = [
  "if not root: return []", // 1
  "res, stack = [], [root]", // 2
  "while stack:", // 3
  "    node = stack.pop()", // 4
  "    res.append(node.val)        # node, right, left", // 5
  "    if node.left: stack.append(node.left)", // 6
  "    if node.right: stack.append(node.right)", // 7
  "return res[::-1]                # reverse", // 8
];

export interface TraversalResult {
  frames: Frame[];
  result: number[];
}

/** Snapshot the tree + stack + output into a view payload. */
function snap(
  slots: (number | null)[],
  currentCi: number | null,
  visited: Set<number>,
  auxNodes: TreeNodeT[],
  output: number[],
): BinTreeView {
  const auxCis = new Set(auxNodes.map((n) => n.ci));
  const states = nodeStates(slots, (ci): CellState =>
    ci === currentCi ? "current" : visited.has(ci) ? "visited" : auxCis.has(ci) ? "active" : "default",
  );
  return {
    slots,
    states,
    aux: auxNodes.map((n) => n.val),
    auxStates: rowStates(auxNodes.length),
    output: [...output],
    outputStates: rowStates(output.length),
  };
}

function emptyFrames(line: number): TraversalResult {
  return {
    frames: [
      {
        highlightLine: line,
        pointers: {},
        cellStates: [],
        variables: { result: "[]" },
        caption: `Empty tree → return [].`,
        eli5Caption: `No nodes to visit — the answer is an empty list.`,
        view: { slots: [], states: [], aux: [], auxStates: [], output: [], outputStates: [] },
      },
    ],
    result: [],
  };
}

/**
 * Inorder (left, node, right), iterative. Dive left pushing the path, then pop
 * to visit and turn right.
 * Time O(n) · Space O(h).
 */
export function inorderFrames(input: string): TraversalResult {
  const { root, slots } = buildTree(parseLevelOrder(input));
  if (!root) return emptyFrames(9);

  const frames: Frame[] = [];
  const res: number[] = [];
  const visited = new Set<number>();
  const stack: TreeNodeT[] = [];
  let curr: TreeNodeT | null = root;

  frames.push({
    highlightLine: 1,
    pointers: {},
    cellStates: [],
    variables: { curr: root.val, stack: "[]", res: "[]" },
    caption: `Start at the root with an empty stack.`,
    eli5Caption: `Hug the left wall, dropping breadcrumbs; read a step when you can't go left.`,
    view: snap(slots, root.ci, visited, stack, res),
  });

  while (curr || stack.length) {
    while (curr) {
      stack.push(curr);
      frames.push({
        highlightLine: 4,
        pointers: {},
        cellStates: [],
        variables: { curr: curr.val, stack: `[${stack.map((n) => n.val).join(",")}]`, res: `[${res.join(",")}]` },
        caption: `Push ${curr.val} and go left.`,
        eli5Caption: `Walk further left, remembering ${curr.val} on the stack.`,
        view: snap(slots, curr.ci, visited, stack, res),
      });
      curr = curr.left;
    }
    curr = stack.pop()!;
    res.push(curr.val);
    visited.add(curr.ci);
    frames.push({
      highlightLine: 7,
      pointers: {},
      cellStates: [],
      variables: { curr: curr.val, stack: `[${stack.map((n) => n.val).join(",")}]`, res: `[${res.join(",")}]` },
      caption: `Pop ${curr.val} — visit it, then explore its right subtree.`,
      eli5Caption: `Can't go left, so read ${curr.val}, then turn right.`,
      view: snap(slots, curr.ci, visited, stack, res),
    });
    curr = curr.right;
  }

  frames.push(finalFrame(9, slots, visited, res, res));
  return { frames, result: res };
}

/** Shared driver for preorder/postorder (both pop-then-push children). */
function rootStackTraversal(
  input: string,
  code: "pre" | "post",
): TraversalResult {
  const { root, slots } = buildTree(parseLevelOrder(input));
  if (!root) return emptyFrames(8);

  const frames: Frame[] = [];
  const res: number[] = [];
  const visited = new Set<number>();
  const stack: TreeNodeT[] = [root];

  frames.push({
    highlightLine: 2,
    pointers: {},
    cellStates: [],
    variables: { stack: `[${root.val}]`, res: "[]" },
    caption: `Start with the root on the stack.`,
    eli5Caption:
      code === "pre"
        ? `Visit a node as soon as you pop it, then stack its children (right first).`
        : `Collect node, right, left — then reverse at the end for left, right, node.`,
    view: snap(slots, root.ci, visited, stack, res),
  });

  while (stack.length) {
    const node = stack.pop()!;
    res.push(node.val);
    visited.add(node.ci);
    // preorder pushes right then left; postorder pushes left then right.
    const children =
      code === "pre"
        ? [node.right, node.left]
        : [node.left, node.right];
    for (const c of children) if (c) stack.push(c);
    frames.push({
      highlightLine: 5,
      pointers: {},
      cellStates: [],
      variables: { node: node.val, stack: `[${stack.map((n) => n.val).join(",")}]`, res: `[${res.join(",")}]` },
      caption: `Pop ${node.val} → record it; push its children.`,
      eli5Caption: `Read ${node.val}, then stack its children to visit next.`,
      view: snap(slots, node.ci, visited, stack, res),
    });
  }

  if (code === "post") {
    res.reverse();
    frames.push({
      highlightLine: 8,
      pointers: {},
      cellStates: [],
      variables: { res: `[${res.join(",")}]` },
      caption: `Reverse the collected order → postorder (left, right, node): [${res.join(", ")}].`,
      eli5Caption: `Flip the list around to get the true postorder: [${res.join(", ")}].`,
      view: snap(slots, null, visited, [], res),
    });
    return { frames, result: res };
  }

  frames.push(finalFrame(8, slots, visited, res, res));
  return { frames, result: res };
}

export const preorderFrames = (input: string) => rootStackTraversal(input, "pre");
export const postorderFrames = (input: string) => rootStackTraversal(input, "post");

function finalFrame(
  line: number,
  slots: (number | null)[],
  visited: Set<number>,
  output: number[],
  result: number[],
): Frame {
  return {
    highlightLine: line,
    pointers: {},
    cellStates: [],
    variables: { result: `[${result.join(",")}]` },
    caption: `Done. Traversal: [${result.join(", ")}].`,
    eli5Caption: `Every node visited in order: [${result.join(", ")}].`,
    view: snap(slots, null, visited, [], output),
  };
}
