import type { CellState, Frame } from "@/lib/types";

// Pure frame generator for Trapping Rain Water solved with converging two
// pointers. Given an elevation map it returns the frames the <Stepper> plays.
// No React. This is a QUESTION-specific walkthrough (not a generic pattern
// demo): it animates the actual leftMax/rightMax algorithm and shows the water
// trapped above each bar building up on a second row.
//
// `trappingRainWaterCode` is 1-indexed by `Frame.highlightLine` and mirrors the
// question's own Python solution so the code panel matches the written answer.

export const trappingRainWaterCode = [
  "l, r = 0, len(height) - 1", // 1
  "left_max = right_max = water = 0", // 2
  "while l < r:", // 3
  "    if height[l] < height[r]:", // 4
  "        left_max = max(left_max, height[l])", // 5
  "        water += left_max - height[l]", // 6
  "        l += 1", // 7
  "    else:", // 8
  "        right_max = max(right_max, height[r])", // 9
  "        water += right_max - height[r]", // 10
  "        r -= 1", // 11
  "return water", // 12
];

/** Second-row payload (water trapped above each bar), carried in `Frame.view`. */
export interface TrapView {
  /** Water units sitting on top of each bar so far, parallel to `height`. */
  trapped: number[];
  /** Per-cell visual state for the water row, parallel to `trapped`. */
  trappedStates: CellState[];
}

export interface TrappingRainWaterResult {
  frames: Frame[];
  /** Total trapped water — the algorithm's return value. */
  water: number;
}

/** Visual state for the height row: dimmed once a pointer has passed a bar,
 *  amber on the two active pointers, blue for bars still in play. */
function heightStates(n: number, l: number, r: number): CellState[] {
  const states: CellState[] = [];
  for (let i = 0; i < n; i++) {
    if (i < l || i > r) states.push("visited"); // already processed — dimmed
    else if (i === l || i === r) states.push("current"); // the two pointers — amber
    else states.push("active"); // still in play — blue
  }
  return states;
}

/** Visual state for the water row: amber on the bar just filled, blue on every
 *  bar that already holds water, default otherwise. */
function waterStates(trapped: number[], justFilled: number | null): CellState[] {
  return trapped.map((w, i) => {
    if (i === justFilled && w > 0) return "current";
    return w > 0 ? "active" : "default";
  });
}

/**
 * Generate frames for Trapping Rain Water using converging pointers with
 * running leftMax / rightMax. Whichever side has the smaller bar is the
 * limiting wall, so water is added there and that pointer advances.
 *
 * Time:  O(n) — each step advances l or r, so at most n steps.
 * Space: O(n) — one frame per step plus the per-index trapped row (for the view).
 */
export function trappingRainWaterFrames(height: number[]): TrappingRainWaterResult {
  const n = height.length;
  const frames: Frame[] = [];
  const trapped = new Array(n).fill(0);

  let l = 0;
  let r = n - 1;
  let leftMax = 0;
  let rightMax = 0;
  let water = 0;

  // Frame 0: initial state — pointers at both ends, no water yet.
  frames.push({
    highlightLine: 2,
    pointers: { L: l, R: r },
    cellStates: heightStates(n, l, r),
    variables: { l, r, leftMax, rightMax, water },
    caption: `Start with pointers at both ends. l=${l}, r=${r}, no water trapped yet.`,
    eli5Caption: `Stand at the two outer walls. Water can only rise as high as the shorter wall, so we'll always work from the lower side.`,
    view: { trapped: [...trapped], trappedStates: waterStates(trapped, null) } satisfies TrapView,
  });

  while (l < r) {
    if (height[l] < height[r]) {
      leftMax = Math.max(leftMax, height[l]);
      const added = leftMax - height[l];
      water += added;
      trapped[l] = added;
      const filled = l;
      frames.push({
        highlightLine: 6,
        pointers: { L: l, R: r },
        cellStates: heightStates(n, l, r),
        variables: { l, r, leftMax, rightMax, water },
        caption:
          `height[l]=${height[l]} < height[r]=${height[r]} ✓ → left wall bounds. ` +
          `left_max=${leftMax}; water += ${leftMax}−${height[l]} = ${added} (total ${water})`,
        eli5Caption:
          `The left wall (${leftMax}) is shorter, so it caps the water here. ` +
          `Bar is ${height[l]} tall → ${added} unit${added === 1 ? "" : "s"} of water sit on top.`,
        view: { trapped: [...trapped], trappedStates: waterStates(trapped, filled) } satisfies TrapView,
      });
      l += 1;
    } else {
      rightMax = Math.max(rightMax, height[r]);
      const added = rightMax - height[r];
      water += added;
      trapped[r] = added;
      const filled = r;
      frames.push({
        highlightLine: 10,
        pointers: { L: l, R: r },
        cellStates: heightStates(n, l, r),
        variables: { l, r, leftMax, rightMax, water },
        caption:
          `height[l]=${height[l]} ≥ height[r]=${height[r]} → right wall bounds. ` +
          `right_max=${rightMax}; water += ${rightMax}−${height[r]} = ${added} (total ${water})`,
        eli5Caption:
          `The right wall (${rightMax}) is shorter (or equal), so it caps the water here. ` +
          `Bar is ${height[r]} tall → ${added} unit${added === 1 ? "" : "s"} of water sit on top.`,
        view: { trapped: [...trapped], trappedStates: waterStates(trapped, filled) } satisfies TrapView,
      });
      r -= 1;
    }
  }

  // Final frame: pointers met, total is locked in.
  frames.push({
    highlightLine: 12,
    pointers: { L: l, R: r },
    cellStates: new Array(n).fill("visited"),
    variables: { l, r, leftMax, rightMax, water },
    caption: `Pointers met (l = r). Total trapped water = ${water}.`,
    eli5Caption: `The two walls met in the middle. Add up every puddle: ${water} units of water.`,
    view: { trapped: [...trapped], trappedStates: waterStates(trapped, null) } satisfies TrapView,
  });

  return { frames, water };
}
