import type { CellState, Frame } from "@/lib/types";

// Pure frame generator for Container With Most Water (converging two pointers).
// Single-row walkthrough: heights with l/r pointers, tracking the best area and
// always advancing the shorter wall. No React.
//
// `containerWaterCode` is 1-indexed by `Frame.highlightLine`.

export const containerWaterCode = [
  "l, r, best = 0, len(height) - 1, 0", // 1
  "while l < r:", // 2
  "    area = (r - l) * min(height[l], height[r])", // 3
  "    best = max(best, area)", // 4
  "    if height[l] < height[r]:", // 5
  "        l += 1  # move the shorter wall", // 6
  "    else:", // 7
  "        r -= 1", // 8
  "return best", // 9
];

export interface ContainerWaterResult {
  frames: Frame[];
  /** Maximum area found — the algorithm's return value. */
  best: number;
}

/** Dimmed once a pointer has passed, amber on the two pointers, blue in between. */
function states(n: number, l: number, r: number): CellState[] {
  const out: CellState[] = [];
  for (let i = 0; i < n; i++) {
    if (i < l || i > r) out.push("visited");
    else if (i === l || i === r) out.push("current");
    else out.push("active");
  }
  return out;
}

/**
 * Generate frames for Container With Most Water. At each step the area between
 * the two walls is width × shorter wall; we keep the best and advance whichever
 * wall is shorter (the only move that can possibly increase the area).
 *
 * Time:  O(n) — each step advances l or r.
 * Space: O(n) — one frame per step.
 */
export function containerWaterFrames(height: number[]): ContainerWaterResult {
  const n = height.length;
  const frames: Frame[] = [];

  let l = 0;
  let r = n - 1;
  let best = 0;

  frames.push({
    highlightLine: 1,
    pointers: { L: l, R: r },
    cellStates: states(n, l, r),
    variables: { l, r, best },
    caption: `Start with the widest container: l=${l}, r=${r}.`,
    eli5Caption: `Two walls as far apart as possible. The water is capped by the shorter wall.`,
  });

  while (l < r) {
    const width = r - l;
    const minH = Math.min(height[l], height[r]);
    const area = width * minH;
    best = Math.max(best, area);
    const moveLeft = height[l] < height[r];
    frames.push({
      highlightLine: 4,
      pointers: { L: l, R: r },
      cellStates: states(n, l, r),
      variables: { l, r, width, minH, area, best },
      caption:
        `area = (${r}−${l}) × min(${height[l]}, ${height[r]}) = ${width} × ${minH} = ${area}; ` +
        `best = ${best}. Shorter wall is on the ${moveLeft ? "left" : "right"} → move it in.`,
      eli5Caption:
        `This container holds ${area} (width ${width}, capped at height ${minH}). ` +
        `Move the shorter ${moveLeft ? "left" : "right"} wall inward and hope for a taller one.`,
    });
    if (moveLeft) l += 1;
    else r -= 1;
  }

  frames.push({
    highlightLine: 9,
    pointers: { L: l, R: r },
    cellStates: new Array(n).fill("visited"),
    variables: { l, r, best },
    caption: `Pointers met. Largest area = ${best}.`,
    eli5Caption: `The walls met in the middle. The biggest container we saw holds ${best}.`,
  });

  return { frames, best };
}
