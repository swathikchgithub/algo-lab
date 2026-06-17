import type { CellState, Frame } from "@/lib/types";
import type { GridView } from "./views";

// Pure frame generator for Flood Fill (BFS). Recolors the 4-connected region of
// the start cell's color. The grid is carried in `view` as a GridStage payload:
// per-cell states for highlighting and labels for the live color values. No React.

export const floodFillCode = [
  "start = image[sr][sc]", // 1
  "if start == color: return image      # nothing to do", // 2
  "q = deque([(sr, sc)]); image[sr][sc] = color", // 3
  "while q:", // 4
  "    x, y = q.popleft()", // 5
  "    for dx, dy in ((1,0),(-1,0),(0,1),(0,-1)):", // 6
  "        nx, ny = x + dx, y + dy", // 7
  "        if in_bounds(nx, ny) and image[nx][ny] == start:", // 8
  "            image[nx][ny] = color; q.append((nx, ny))", // 9
  "return image", // 10
];

export interface FloodFillResult {
  frames: Frame[];
  result: number[][];
}

const DIRS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

/**
 * Generate frames for Flood Fill via BFS from (sr, sc).
 * Time O(rows·cols) · Space O(rows·cols).
 */
export function floodFillFrames(image: number[][], sr: number, sc: number, color: number): FloodFillResult {
  const img = image.map((row) => [...row]);
  const rows = img.length;
  const cols = rows ? img[0].length : 0;
  const frames: Frame[] = [];
  const filled = new Set<string>();

  const view = (current: [number, number] | null, queue: Array<[number, number]>): GridView => ({
    grid: img.map((row, r) =>
      row.map((_, c): CellState => {
        if (current && current[0] === r && current[1] === c) return "current";
        return filled.has(`${r},${c}`) ? "active" : "default";
      }),
    ),
    labels: img.map((row) => row.map((v) => v)),
    aux: { items: queue.map(([x, y]) => `${x},${y}`), title: "queue", orientation: "horizontal" },
  });

  if (rows === 0 || sr < 0 || sr >= rows || sc < 0 || sc >= cols) {
    frames.push({
      highlightLine: 10,
      pointers: {},
      cellStates: [],
      variables: { note: "start out of bounds" },
      caption: `Start (${sr}, ${sc}) is out of bounds — nothing to fill.`,
      eli5Caption: `That starting square isn't on the grid.`,
      view: view(null, []),
    });
    return { frames, result: img };
  }

  const start = img[sr][sc];
  frames.push({
    highlightLine: 1,
    pointers: {},
    cellStates: [],
    variables: { sr, sc, start, color },
    caption: `Start color at (${sr}, ${sc}) is ${start}. Fill its connected region with ${color}.`,
    eli5Caption: `Like a paint bucket: recolor every square touching this one that shares its color.`,
    view: view([sr, sc], []),
  });

  if (start === color) {
    frames.push({
      highlightLine: 2,
      pointers: {},
      cellStates: [],
      variables: { start, color },
      caption: `start == color (${color}) → already filled; return unchanged.`,
      eli5Caption: `It's already that color — nothing to do.`,
      view: view([sr, sc], []),
    });
    return { frames, result: img };
  }

  const queue: Array<[number, number]> = [[sr, sc]];
  img[sr][sc] = color;
  filled.add(`${sr},${sc}`);
  frames.push({
    highlightLine: 3,
    pointers: {},
    cellStates: [],
    variables: { queue: `[(${sr},${sc})]` },
    caption: `Paint the start cell ${color} and enqueue it.`,
    eli5Caption: `Recolor the first square and start spreading out from it.`,
    view: view([sr, sc], queue),
  });

  while (queue.length) {
    const [x, y] = queue.shift()!;
    frames.push({
      highlightLine: 5,
      pointers: {},
      cellStates: [],
      variables: { x, y, queue: `${queue.length} left` },
      caption: `Process (${x}, ${y}); check its four neighbours.`,
      eli5Caption: `Look at the squares above, below, left, and right of (${x}, ${y}).`,
      view: view([x, y], queue),
    });
    for (const [dx, dy] of DIRS) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < rows && ny >= 0 && ny < cols && img[nx][ny] === start) {
        img[nx][ny] = color;
        filled.add(`${nx},${ny}`);
        queue.push([nx, ny]);
        frames.push({
          highlightLine: 9,
          pointers: {},
          cellStates: [],
          variables: { nx, ny, color, queue: `${queue.length} in queue` },
          caption: `(${nx}, ${ny}) matches ${start} → paint it ${color} and enqueue.`,
          eli5Caption: `That neighbour is the same color, so recolor it and spread further.`,
          view: view([nx, ny], queue),
        });
      }
    }
  }

  frames.push({
    highlightLine: 10,
    pointers: {},
    cellStates: [],
    variables: { done: "true" },
    caption: `Queue empty — the whole region is recolored.`,
    eli5Caption: `Every connected square has been painted ${color}.`,
    view: view(null, []),
  });

  return { frames, result: img };
}
