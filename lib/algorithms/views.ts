import type { CellState } from "@/lib/types";

// Typed `Frame.view` payloads for non-array visualizers. Pure TS (no React), so
// both the frame generators (lib/) and the stage components (components/) import
// from here without crossing the layering boundary.

/** A push/pop list shown beside a grid — DFS call stack or BFS queue. */
export interface AuxList {
  title: string;
  items: Array<string | number>;
  orientation: "vertical" | "horizontal";
}

/** DFS / BFS on a grid. A `type` (not `interface`) so it's assignable to
 *  Frame.view's Record type when produced by a helper. */
export type GridView = {
  /** Per-cell visual state, [row][col]. */
  grid: CellState[][];
  /** Optional per-cell label (e.g. visit order, or "#" for a wall). */
  labels?: Array<Array<string | number>>;
  /** Call stack (DFS) or queue (BFS). */
  aux?: AuxList;
};

/** Binary heap drawn as a tree. A `type` (not `interface`) so it's assignable
 *  to Frame.view's Record type when produced by a helper. */
export type TreeView = {
  /** Level-order values (index 0 = root). */
  heap: number[];
  /** Visual state parallel to `heap`. */
  states: CellState[];
};

/** Hash table with separate-chaining buckets. */
export interface BucketView {
  /** buckets[i] = entries currently in bucket i. */
  buckets: Array<Array<string | number>>;
  /** Bucket currently being written to / probed. */
  activeBucket?: number;
}

/** Big-O explainer: an operations-vs-input-size chart. */
export interface ChartView {
  /** Label for the curve, e.g. "O(log n)". */
  curve: string;
  /** Current input size on the x-axis. */
  n: number;
  /** Max input size (x-axis extent). */
  maxN: number;
  /** Points drawn so far, normalized to 0..1 in both axes. */
  points: Array<{ x: number; y: number }>;
  /** Operation count at the current n. */
  ops: number;
}
