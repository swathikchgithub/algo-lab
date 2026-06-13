import type { CellState, Frame } from "@/lib/types";
import type { GridView } from "@/lib/algorithms/views";

// Pure frame generator for iterative DFS on a grid. Given a grid of 0 (open)
// and 1 (wall) cells plus a start cell, it walks 4-directional neighbours using
// an explicit stack + visited set, and returns the animation frames the
// <Stepper> plays plus the visit order. No React.
//
// The `dfsCode` lines below are 1-indexed by `Frame.highlightLine` (line 1 is
// the first entry). Keep them in sync with the frames this function emits.

export const dfsCode = [
  "stack = [start]", // 1
  "visited = {start}", // 2
  "while stack:", // 3
  "    r, c = stack[-1]", // 4
  "    nxt = unvisited_open_neighbor(r, c)", // 5
  "    if nxt:", // 6
  "        visited.add(nxt)", // 7
  "        stack.append(nxt)", // 8
  "    else:", // 9
  "        stack.pop()  # dead end -> backtrack", // 10
  "    # always dive into the deepest open path first", // 11
  "# (loop ends when the stack is empty)", // 12
];

/** Substrate view payload for the grid + call-stack panel. */
type DfsView = GridView & Record<string, unknown>;

export interface DfsResult {
  frames: Frame[];
  /** Cells in the order DFS first visited them. */
  order: Array<[number, number]>;
}

const ELI5 =
  "Like exploring a maze: keep going deeper down one path until a dead end, then backtrack to the last fork.";

// Deterministic neighbour order: down, right, up, left.
const DIRS: Array<[number, number]> = [
  [1, 0], // down
  [0, 1], // right
  [-1, 0], // up
  [0, -1], // left
];

const key = (r: number, c: number): string => `${r},${c}`;

function inBounds(grid: number[][], r: number, c: number): boolean {
  return r >= 0 && r < grid.length && c >= 0 && c < grid[r].length;
}

/**
 * Build the GridView for the current step.
 *   - walls                     → "visited" + "#" label
 *   - the cell being visited    → "current" (amber)
 *   - cells on the stack        → "active"  (blue frontier, discovered)
 *   - finished/visited cells    → "visited" (dimmed) + visit-order number
 *   - untouched open cells      → "default"
 */
function buildView(
  grid: number[][],
  current: [number, number] | null,
  stack: Array<[number, number]>,
  visitOrder: Map<string, number>,
): DfsView {
  const onStack = new Set(stack.map(([r, c]) => key(r, c)));
  const cur = current ? key(current[0], current[1]) : null;

  const cells: CellState[][] = [];
  const labels: Array<Array<string | number>> = [];

  for (let r = 0; r < grid.length; r++) {
    const rowStates: CellState[] = [];
    const rowLabels: Array<string | number> = [];
    for (let c = 0; c < grid[r].length; c++) {
      const k = key(r, c);
      if (grid[r][c] === 1) {
        rowStates.push("visited");
        rowLabels.push("#");
      } else if (k === cur) {
        rowStates.push("current");
        rowLabels.push(visitOrder.has(k) ? (visitOrder.get(k) as number) : "");
      } else if (onStack.has(k)) {
        rowStates.push("active");
        rowLabels.push(visitOrder.has(k) ? (visitOrder.get(k) as number) : "");
      } else if (visitOrder.has(k)) {
        rowStates.push("visited");
        rowLabels.push(visitOrder.get(k) as number);
      } else {
        rowStates.push("default");
        rowLabels.push("");
      }
    }
    cells.push(rowStates);
    labels.push(rowLabels);
  }

  return {
    grid: cells,
    labels,
    aux: {
      title: "Call stack",
      items: stack.map(([r, c]) => `${r},${c}`),
      orientation: "vertical",
    },
  };
}

/**
 * Generate frames for 4-directional DFS on a grid.
 *
 * Time:  O(R*C) — each open cell is pushed and popped at most once.
 * Space: O(R*C) — visited set + stack + one frame per visit/backtrack step.
 */
export function dfsGridFrames(
  grid: number[][],
  start: [number, number],
): DfsResult {
  const frames: Frame[] = [];
  const order: Array<[number, number]> = [];
  const visited = new Set<string>();
  const visitOrder = new Map<string, number>();
  const stack: Array<[number, number]> = [];

  const [sr, sc] = start;
  const startOpen = inBounds(grid, sr, sc) && grid[sr][sc] === 0;

  // Frame 0: initial state, only the start cell discovered.
  if (startOpen) {
    visited.add(key(sr, sc));
    visitOrder.set(key(sr, sc), 0);
    order.push([sr, sc]);
    stack.push([sr, sc]);
  }

  frames.push({
    highlightLine: 1,
    view: buildView(grid, null, stack, visitOrder),
    variables: { row: sr, col: sc, visited: visited.size },
    caption: startOpen
      ? `Push start (${sr},${sc}) onto the stack and mark it visited.`
      : `Start (${sr},${sc}) is a wall or out of bounds ✗ → nothing to explore.`,
    eli5Caption: ELI5,
  });

  while (stack.length > 0) {
    const [r, c] = stack[stack.length - 1];

    // Find the first unvisited, open, in-bounds neighbour in deterministic order.
    let next: [number, number] | null = null;
    for (const [dr, dc] of DIRS) {
      const nr = r + dr;
      const nc = c + dc;
      if (
        inBounds(grid, nr, nc) &&
        grid[nr][nc] === 0 &&
        !visited.has(key(nr, nc))
      ) {
        next = [nr, nc];
        break;
      }
    }

    if (next) {
      const [nr, nc] = next;
      visited.add(key(nr, nc));
      visitOrder.set(key(nr, nc), order.length);
      order.push([nr, nc]);
      stack.push([nr, nc]);
      frames.push({
        highlightLine: 8,
        view: buildView(grid, [nr, nc], stack, visitOrder),
        variables: { row: nr, col: nc, visited: visited.size },
        caption: `Visit (${nr},${nc}) → open & unvisited neighbour of (${r},${c}) ✓ → push.`,
        eli5Caption: ELI5,
      });
    } else {
      stack.pop();
      const top = stack.length > 0 ? stack[stack.length - 1] : null;
      frames.push({
        highlightLine: 10,
        view: buildView(grid, top, stack, visitOrder),
        variables: {
          row: top ? top[0] : r,
          col: top ? top[1] : c,
          visited: visited.size,
        },
        caption: top
          ? `Dead end at (${r},${c}) → no open neighbours ✗ → backtrack to (${top[0]},${top[1]}).`
          : `Dead end at (${r},${c}) → no open neighbours ✗ → stack empty, DFS done.`,
        eli5Caption: ELI5,
      });
    }
  }

  return { frames, order };
}
