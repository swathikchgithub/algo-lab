import type { CellState } from "@/lib/types";

// Shared model for linked-list visualizers. Nodes are laid out left-to-right by
// slot; `next[slot]` is the successor slot (or null), so flipping pointers
// (reverse) or looping back (cycle) is just mutating `next`. Pure — no React.

export type LinkedListView = {
  /** Node values by slot (display order, fixed). */
  vals: number[];
  /** next[slot] = successor slot index, or null for the end. */
  next: (number | null)[];
  /** Per-slot visual state, parallel to `vals`. */
  states: CellState[];
  /** Pointer name → slot index (or null when the pointer is past the end). */
  badges: Record<string, number | null>;
};

/** A fresh forward-linked view over `vals` (next[i] = i+1, last → null). */
export function forwardList(vals: number[]): { next: (number | null)[]; states: CellState[] } {
  const next = vals.map((_, i) => (i + 1 < vals.length ? i + 1 : null));
  const states = vals.map(() => "default" as CellState);
  return { next, states };
}
