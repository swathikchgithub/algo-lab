import type { CellState, Frame } from "@/lib/types";
import {
  buildTree,
  nodeStates,
  parseLevelOrder,
  rowStates,
  type BinTreeView,
  type TreeNodeT,
} from "./binaryTree";

// Pure frame generators for the recursive tree-property questions (max/min
// depth, diameter, balanced). All animate a post-order DFS on the shared tree
// stage: the call path is the "call stack" row and each node's returned value
// lands in the "returns" row as it resolves. No React.

export const maxDepthCode = [
  "if not root: return 0", // 1
  "return 1 + max(max_depth(root.left), max_depth(root.right))", // 2
];

export const minDepthCode = [
  "if not root: return 0", // 1
  "if not root.left:  return 1 + min_depth(root.right)", // 2
  "if not root.right: return 1 + min_depth(root.left)", // 3
  "return 1 + min(min_depth(root.left), min_depth(root.right))", // 4
];

export const diameterCode = [
  "best = 0", // 1
  "def height(node):", // 2
  "    if not node: return 0", // 3
  "    left = height(node.left)", // 4
  "    right = height(node.right)", // 5
  "    best = max(best, left + right)   # path bending here", // 6
  "    return 1 + max(left, right)", // 7
  "height(root); return best", // 8
];

export const balancedCode = [
  "def height(node):                    # -1 = unbalanced", // 1
  "    if not node: return 0", // 2
  "    left = height(node.left)", // 3
  "    if left == -1: return -1", // 4
  "    right = height(node.right)", // 5
  "    if right == -1: return -1", // 6
  "    if abs(left - right) > 1: return -1", // 7
  "    return 1 + max(left, right)", // 8
  "return height(root) != -1", // 9
];

export interface TreePropResult {
  frames: Frame[];
  result: number | boolean;
}

interface Ctx {
  frames: Frame[];
  slots: (number | null)[];
  path: TreeNodeT[];
  resolved: Map<number, number>;
  returns: number[];
}

function ctxFor(input: string): { ctx: Ctx; root: TreeNodeT | null } {
  const { root, slots } = buildTree(parseLevelOrder(input));
  return { ctx: { frames: [], slots, path: [], resolved: new Map(), returns: [] }, root };
}

function snap(ctx: Ctx, currentCi: number | null): BinTreeView {
  const pathCis = new Set(ctx.path.map((n) => n.ci));
  const states = nodeStates(ctx.slots, (ci): CellState =>
    ci === currentCi ? "current" : ctx.resolved.has(ci) ? "visited" : pathCis.has(ci) ? "active" : "default",
  );
  return {
    slots: ctx.slots,
    states,
    aux: ctx.path.map((n) => n.val),
    auxStates: rowStates(ctx.path.length),
    output: [...ctx.returns],
    outputStates: rowStates(ctx.returns.length),
  };
}

function emit(
  ctx: Ctx,
  line: number,
  currentCi: number | null,
  caption: string,
  eli5: string,
  vars: Record<string, string | number>,
) {
  ctx.frames.push({
    highlightLine: line,
    pointers: {},
    cellStates: [],
    variables: vars,
    caption,
    eli5Caption: eli5,
    view: snap(ctx, currentCi),
  });
}

/** Record a node's resolved return value and emit the resolve frame. */
function resolve(ctx: Ctx, node: TreeNodeT, value: number, line: number, caption: string, eli5: string, vars: Record<string, string | number>) {
  ctx.path.pop();
  ctx.resolved.set(node.ci, value);
  ctx.returns.push(value);
  emit(ctx, line, node.ci, caption, eli5, vars);
}

export function maxDepthFrames(input: string): TreePropResult {
  const { ctx, root } = ctxFor(input);
  if (!root) {
    emit(ctx, 1, null, `Empty tree → depth 0.`, `No nodes, so the depth is 0.`, { result: 0 });
    return { frames: ctx.frames, result: 0 };
  }
  const h = (node: TreeNodeT | null): number => {
    if (!node) return 0;
    ctx.path.push(node);
    emit(ctx, 1, node.ci, `Enter ${node.val}; ask both children for their depth.`, `Ask ${node.val}'s children how deep they go.`, { node: node.val });
    const L = h(node.left);
    const R = h(node.right);
    const v = 1 + Math.max(L, R);
    resolve(ctx, node, v, 2, `depth(${node.val}) = 1 + max(${L}, ${R}) = ${v}.`, `${node.val} is ${v} deep — one more than its deeper child.`, { node: node.val, left: L, right: R, depth: v });
    return v;
  };
  const result = h(root);
  emit(ctx, 2, null, `Maximum depth = ${result}.`, `The tree is ${result} levels deep.`, { result });
  return { frames: ctx.frames, result };
}

export function minDepthFrames(input: string): TreePropResult {
  const { ctx, root } = ctxFor(input);
  if (!root) {
    emit(ctx, 1, null, `Empty tree → depth 0.`, `No nodes, so the minimum depth is 0.`, { result: 0 });
    return { frames: ctx.frames, result: 0 };
  }
  const h = (node: TreeNodeT | null): number => {
    if (!node) return 0;
    ctx.path.push(node);
    emit(ctx, 1, node.ci, `Enter ${node.val}.`, `Look at ${node.val}; the shortest path can't stop at a missing child.`, { node: node.val });
    let v: number;
    let line: number;
    let why: string;
    if (!node.left) {
      const R = h(node.right);
      v = 1 + R;
      line = 2;
      why = `no left child → 1 + min_depth(right) = 1 + ${R} = ${v}`;
    } else if (!node.right) {
      const L = h(node.left);
      v = 1 + L;
      line = 3;
      why = `no right child → 1 + min_depth(left) = 1 + ${L} = ${v}`;
    } else {
      const L = h(node.left);
      const R = h(node.right);
      v = 1 + Math.min(L, R);
      line = 4;
      why = `two children → 1 + min(${L}, ${R}) = ${v}`;
    }
    resolve(ctx, node, v, line, `min_depth(${node.val}): ${why}.`, `${node.val}'s shortest path to a leaf is ${v}.`, { node: node.val, depth: v });
    return v;
  };
  const result = h(root);
  emit(ctx, 1, null, `Minimum depth = ${result}.`, `The nearest leaf is ${result} levels down.`, { result });
  return { frames: ctx.frames, result };
}

export function diameterFrames(input: string): TreePropResult {
  const { ctx, root } = ctxFor(input);
  if (!root) {
    emit(ctx, 8, null, `Empty tree → diameter 0.`, `No nodes, so the diameter is 0.`, { result: 0 });
    return { frames: ctx.frames, result: 0 };
  }
  let best = 0;
  const h = (node: TreeNodeT | null): number => {
    if (!node) return 0;
    ctx.path.push(node);
    emit(ctx, 3, node.ci, `Enter ${node.val}.`, `Measure how far down each side of ${node.val} reaches.`, { node: node.val, best });
    const L = h(node.left);
    const R = h(node.right);
    best = Math.max(best, L + R);
    const v = 1 + Math.max(L, R);
    resolve(ctx, node, v, 7, `At ${node.val}: path through = ${L} + ${R} = ${L + R} (best ${best}); height = ${v}.`, `A path bending through ${node.val} spans ${L + R} edges. Best so far: ${best}.`, { node: node.val, left: L, right: R, best, height: v });
    return v;
  };
  h(root);
  emit(ctx, 8, null, `Diameter (longest path, in edges) = ${best}.`, `The longest path anywhere in the tree is ${best} edges.`, { result: best });
  return { frames: ctx.frames, result: best };
}

export function balancedFrames(input: string): TreePropResult {
  const { ctx, root } = ctxFor(input);
  if (!root) {
    emit(ctx, 9, null, `Empty tree is balanced → True.`, `An empty tree is trivially balanced.`, { result: "True" });
    return { frames: ctx.frames, result: true };
  }
  const h = (node: TreeNodeT | null): number => {
    if (!node) return 0;
    ctx.path.push(node);
    emit(ctx, 2, node.ci, `Enter ${node.val}.`, `Check ${node.val}: are its two sides within 1 of each other?`, { node: node.val });
    const L = h(node.left);
    if (L === -1) {
      resolve(ctx, node, -1, 4, `Left subtree of ${node.val} is unbalanced → propagate -1.`, `${node.val}'s left side is already lopsided — bail out.`, { node: node.val });
      return -1;
    }
    const R = h(node.right);
    if (R === -1) {
      resolve(ctx, node, -1, 6, `Right subtree of ${node.val} is unbalanced → propagate -1.`, `${node.val}'s right side is lopsided — bail out.`, { node: node.val });
      return -1;
    }
    if (Math.abs(L - R) > 1) {
      resolve(ctx, node, -1, 7, `|${L} − ${R}| > 1 at ${node.val} → unbalanced (-1).`, `${node.val}'s two sides differ by more than 1 — not balanced.`, { node: node.val, left: L, right: R });
      return -1;
    }
    const v = 1 + Math.max(L, R);
    resolve(ctx, node, v, 8, `${node.val} balanced: |${L} − ${R}| ≤ 1; height = ${v}.`, `${node.val}'s sides are within 1 — height ${v}.`, { node: node.val, left: L, right: R, height: v });
    return v;
  };
  const result = h(root) !== -1;
  emit(ctx, 9, null, `Balanced? ${result ? "True" : "False"}.`, result ? `Every node's two sides stayed within 1 — balanced.` : `Some node's sides differed by more than 1 — not balanced.`, { result: String(result) });
  return { frames: ctx.frames, result };
}
