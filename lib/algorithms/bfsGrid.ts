import type { CellState, Frame } from "@/lib/types";
import type { GridView, AuxList } from "@/lib/algorithms/views";

// Pure frame generator for BFS on a grid. Given a grid (0 = open, 1 = wall)
// and a start cell, it returns the sequence of animation frames the <Stepper>
// plays plus the order cells were visited. No React.
//
// The `bfsCode` lines below are 1-indexed by `Frame.highlightLine` (line 1 is
// the first entry). Keep them in sync with the frames this function emits.

export const bfsCode = [
  "queue = deque([(start, 0)])", // 1
  "visited = {start}", // 2
  "while queue:", // 3
  "    (r, c), level = queue.popleft()", // 4
  "    for dr, dc in [(1, 0), (0, 1), (-1, 0), (0, -1)]:", // 5
  "        nr, nc = r + dr, c + dc", // 6
  "        if in_bounds(nr, nc) and grid[nr][nc] == 0 and (nr, nc) not in visited:", // 7
  "            visited.add((nr, nc))", // 8
  "            queue.append(((nr, nc), level + 1))", // 9
  "            # discovered one ring further out", // 10
  "    # neighbours explored level by level", // 11
  "# (loop ends when the queue is empty)", // 12
];

const ELI5 =
  "ripples in a pond — explore everything 1 step away, then 2, then 3.";

// Deterministic 4-directional neighbor order: down, right, up, left.
const DIRECTIONS: ReadonlyArray<readonly [number, number]> = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

export interface BfsResult {
  frames: Frame[];
  /** Cells in the order BFS visited (discovered) them. */
  order: Array<[number, number]>;
}

const key = (r: number, c: number): string => `${r},${c}`;

/**
 * Build a GridView for the current BFS state.
 *   - walls            → "visited", label "#"
 *   - cell being processed (`current`) → "current"
 *   - cells in the queue → "active"
 *   - already-processed (visited, not current, not queued) → "visited"
 *   - untouched open   → "default"
 * Labels carry the BFS distance on any discovered open cell.
 */
function buildGrid(
  grid: number[][],
  dist: Map<string, number>,
  queued: Set<string>,
  processed: Set<string>,
  current: readonly [number, number] | null,
): { gridStates: CellState[][]; labels: Array<Array<string | number>> } {
  const gridStates: CellState[][] = [];
  const labels: Array<Array<string | number>> = [];
  for (let r = 0; r < grid.length; r++) {
    const stateRow: CellState[] = [];
    const labelRow: Array<string | number> = [];
    for (let c = 0; c < grid[r].length; c++) {
      const k = key(r, c);
      if (grid[r][c] === 1) {
        stateRow.push("visited");
        labelRow.push("#");
      } else {
        const discovered = dist.has(k);
        labelRow.push(discovered ? (dist.get(k) as number) : "");
        if (current && current[0] === r && current[1] === c) {
          stateRow.push("current");
        } else if (queued.has(k)) {
          stateRow.push("active");
        } else if (processed.has(k)) {
          stateRow.push("visited");
        } else {
          stateRow.push("default");
        }
      }
    }
    gridStates.push(stateRow);
    labels.push(labelRow);
  }
  return { gridStates, labels };
}

/** Render the queue as "r,c" strings, front → back. */
function queueAux(queue: Array<[number, number]>): AuxList {
  return {
    title: "Queue",
    items: queue.map(([r, c]) => `${r},${c}`),
    orientation: "horizontal",
  };
}

function makeView(
  grid: number[][],
  dist: Map<string, number>,
  queue: Array<[number, number]>,
  processed: Set<string>,
  current: readonly [number, number] | null,
): GridView {
  const queued = new Set(queue.map(([r, c]) => key(r, c)));
  const { gridStates, labels } = buildGrid(
    grid,
    dist,
    queued,
    processed,
    current,
  );
  return { grid: gridStates, labels, aux: queueAux(queue) };
}

/** Cast a GridView to the generic Frame.view payload shape. */
const asView = (v: GridView): Record<string, unknown> =>
  v as unknown as Record<string, unknown>;

/**
 * Generate frames for level-by-level BFS over a 4-directional grid.
 *
 * Time:  O(V + E) — each open cell is enqueued once; each checks 4 neighbors.
 * Space: O(V) — visited set, queue, plus one frame per dequeue step.
 */
export function bfsGridFrames(
  grid: number[][],
  start: [number, number],
): BfsResult {
  const rows = grid.length;
  const cols = rows > 0 ? grid[0].length : 0;
  const frames: Frame[] = [];
  const order: Array<[number, number]> = [];

  const inBounds = (r: number, c: number): boolean =>
    r >= 0 && r < rows && c >= 0 && c < cols;

  const [sr, sc] = start;
  const dist = new Map<string, number>();
  const visited = new Set<string>();
  const processed = new Set<string>();
  const queue: Array<[number, number]> = [];

  // Seed BFS from the start cell (assumed open).
  visited.add(key(sr, sc));
  dist.set(key(sr, sc), 0);
  queue.push([sr, sc]);
  order.push([sr, sc]);

  // Initial frame: start enqueued, nothing processed yet.
  frames.push({
    highlightLine: 2,
    variables: { row: sr, col: sc, level: 0, visited: visited.size },
    caption: `Start BFS at (${sr},${sc}) → enqueue at level 0.`,
    eli5Caption: ELI5,
    view: asView(makeView(grid, dist, queue, processed, null)),
  });

  while (queue.length > 0) {
    const [r, c] = queue.shift() as [number, number];
    const level = dist.get(key(r, c)) as number;
    processed.add(key(r, c));

    const enqueued: Array<[number, number]> = [];
    const checks: string[] = [];

    for (const [dr, dc] of DIRECTIONS) {
      const nr = r + dr;
      const nc = c + dc;
      if (!inBounds(nr, nc)) {
        checks.push(`(${nr},${nc}) out of bounds ✗`);
        continue;
      }
      if (grid[nr][nc] === 1) {
        checks.push(`(${nr},${nc}) wall ✗`);
        continue;
      }
      if (visited.has(key(nr, nc))) {
        checks.push(`(${nr},${nc}) seen ✗`);
        continue;
      }
      visited.add(key(nr, nc));
      dist.set(key(nr, nc), level + 1);
      queue.push([nr, nc]);
      order.push([nr, nc]);
      enqueued.push([nr, nc]);
      checks.push(`(${nr},${nc}) open ✓ → enqueue at level ${level + 1}`);
    }

    const enqStr =
      enqueued.length > 0
        ? `enqueue ${enqueued.map(([er, ec]) => `(${er},${ec})`).join(", ")}`
        : "no new neighbors";
    frames.push({
      highlightLine: 4,
      variables: { row: r, col: c, level, visited: visited.size },
      caption: `Dequeue (${r},${c}) at level ${level} → ${enqStr}. ${checks.join(", ")}`,
      eli5Caption: ELI5,
      view: asView(makeView(grid, dist, queue, processed, [r, c])),
    });
  }

  return { frames, order };
}
