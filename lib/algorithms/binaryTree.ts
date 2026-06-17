import type { CellState } from "@/lib/types";

// Shared utilities for binary-tree visualizers: parse a LeetCode level-order
// array (with `null` gaps), build a node graph, and lay nodes out by their
// index in the conceptual complete binary tree (root = 0, children of i are
// 2i+1 / 2i+2) so a stage can position them. Pure — no React.

export interface TreeNodeT {
  val: number;
  /** Index in the complete-binary-tree layout (root = 0). */
  ci: number;
  left: TreeNodeT | null;
  right: TreeNodeT | null;
}

/** View payload for the tree stage + the algorithm's stack/queue and output. */
export type BinTreeView = {
  /** Values indexed by complete-tree index; null where no node sits. */
  slots: (number | null)[];
  /** Per-slot visual state, parallel to `slots`. */
  states: CellState[];
  /** The algorithm's working stack/queue (node values), bottom-to-top. */
  aux: number[];
  auxStates: CellState[];
  /** Traversal output so far. */
  output: number[];
  outputStates: CellState[];
};

/** Parse "1,null,2,3" → [1, null, 2, 3]. Blank tokens are ignored. */
export function parseLevelOrder(s: string): (number | null)[] {
  return s
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t.length > 0)
    .map((t) => (t === "null" ? null : Number(t)));
}

export interface BuiltTree {
  root: TreeNodeT | null;
  /** slots[ci] = value, or null; length = maxCi + 1 (>= 1 when non-empty). */
  slots: (number | null)[];
}

/** Build a tree (with complete-tree indices) from a level-order array. */
export function buildTree(vals: (number | null)[]): BuiltTree {
  if (vals.length === 0 || vals[0] === null) return { root: null, slots: [] };

  const root: TreeNodeT = { val: vals[0]!, ci: 0, left: null, right: null };
  const queue: TreeNodeT[] = [root];
  let maxCi = 0;
  let i = 1;

  while (queue.length > 0 && i < vals.length) {
    const node = queue.shift()!;
    // Left child.
    if (i < vals.length) {
      if (vals[i] !== null) {
        const child: TreeNodeT = { val: vals[i]!, ci: 2 * node.ci + 1, left: null, right: null };
        node.left = child;
        queue.push(child);
        maxCi = Math.max(maxCi, child.ci);
      }
      i += 1;
    }
    // Right child.
    if (i < vals.length) {
      if (vals[i] !== null) {
        const child: TreeNodeT = { val: vals[i]!, ci: 2 * node.ci + 2, left: null, right: null };
        node.right = child;
        queue.push(child);
        maxCi = Math.max(maxCi, child.ci);
      }
      i += 1;
    }
  }

  const slots: (number | null)[] = new Array(maxCi + 1).fill(null);
  const stack: (TreeNodeT | null)[] = [root];
  while (stack.length) {
    const node = stack.pop();
    if (!node) continue;
    slots[node.ci] = node.val;
    stack.push(node.left, node.right);
  }

  return { root, slots };
}

/** Build a states array (length = slots.length) from a labeller over ci. */
export function nodeStates(
  slots: (number | null)[],
  label: (ci: number) => CellState,
): CellState[] {
  return slots.map((v, ci) => (v === null ? "default" : label(ci)));
}

/** Standard list-row states: the last item is the focus (amber), rest blue. */
export function rowStates(len: number, focusLast = true): CellState[] {
  return Array.from({ length: len }, (_, k) =>
    focusLast && k === len - 1 ? "current" : "active",
  );
}
