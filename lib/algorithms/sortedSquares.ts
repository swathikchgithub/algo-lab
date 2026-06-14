import type { CellState, Frame } from "@/lib/types";

// Pure frame generator for Squares of a Sorted Array. Two-row walkthrough: the
// sorted input with l/r pointers, and a result row filled back-to-front with
// the larger of the two end squares. No React.
//
// `sortedSquaresCode` is 1-indexed by `Frame.highlightLine`.

export const sortedSquaresCode = [
  "n = len(nums)", // 1
  "res = [0] * n", // 2
  "l, r = 0, n - 1", // 3
  "for pos in range(n - 1, -1, -1):", // 4
  "    if abs(nums[l]) > abs(nums[r]):", // 5
  "        res[pos] = nums[l] ** 2", // 6
  "        l += 1", // 7
  "    else:", // 8
  "        res[pos] = nums[r] ** 2", // 9
  "        r -= 1", // 10
  "return res", // 11
];

/** Second-row payload (the result array being built), carried in `Frame.view`. */
export interface SquaresView {
  /** Squares placed so far; 0 in slots not yet filled (parallel to `res`). */
  res: number[];
  /** Per-cell visual state for the result row, parallel to `res`. */
  resStates: CellState[];
}

export interface SortedSquaresResult {
  frames: Frame[];
  /** The fully sorted squares — the algorithm's return value. */
  res: number[];
}

/** Input row: dimmed once a pointer has passed, amber on l/r, blue in between. */
function inputStates(n: number, l: number, r: number): CellState[] {
  const out: CellState[] = [];
  for (let i = 0; i < n; i++) {
    if (i < l || i > r) out.push("visited");
    else if (i === l || i === r) out.push("current");
    else out.push("active");
  }
  return out;
}

/** Result row: amber on the slot just written, blue on filled slots, default
 *  (rendered as an empty slot) on slots not yet written. */
function resStates(filled: boolean[], justWritten: number | null): CellState[] {
  return filled.map((f, i) => {
    if (i === justWritten) return "current";
    return f ? "active" : "default";
  });
}

/**
 * Generate frames for Squares of a Sorted Array. The largest squares come from
 * the most extreme values (the two ends), so we compare |nums[l]| vs |nums[r]|,
 * write the bigger square into the current back slot, and advance that pointer.
 *
 * Time:  O(n) — one write per position.
 * Space: O(n) — the result array plus one frame per step.
 */
export function sortedSquaresFrames(nums: number[]): SortedSquaresResult {
  const n = nums.length;
  const frames: Frame[] = [];
  const res = new Array(n).fill(0);
  const filled = new Array(n).fill(false);

  let l = 0;
  let r = n - 1;

  frames.push({
    highlightLine: 3,
    pointers: { L: l, R: r },
    cellStates: inputStates(n, l, r),
    variables: { l, r, pos: n - 1 },
    caption: `Empty result of length ${n}. Pointers at both ends; fill the result from the back.`,
    eli5Caption: `The biggest squares come from the most extreme numbers — the two ends. Fill the answer from the back.`,
    view: { res: [...res], resStates: resStates(filled, null) } satisfies SquaresView,
  });

  for (let pos = n - 1; pos >= 0; pos--) {
    const leftWins = Math.abs(nums[l]) > Math.abs(nums[r]);
    const pick = leftWins ? nums[l] : nums[r];
    res[pos] = pick * pick;
    filled[pos] = true;
    frames.push({
      highlightLine: leftWins ? 6 : 9,
      pointers: { L: l, R: r, pos },
      cellStates: inputStates(n, l, r),
      variables: { l, r, pos, square: res[pos] },
      caption:
        `|nums[l]|=${Math.abs(nums[l])} ${leftWins ? ">" : "≤"} |nums[r]|=${Math.abs(nums[r])} → ` +
        `res[${pos}] = ${pick}² = ${res[pos]}; move ${leftWins ? "l →" : "← r"}.`,
      eli5Caption:
        `${Math.abs(pick)} is the more extreme end, so its square (${res[pos]}) is the biggest left — ` +
        `it goes in slot ${pos}.`,
      view: { res: [...res], resStates: resStates(filled, pos) } satisfies SquaresView,
    });
    if (leftWins) l += 1;
    else r -= 1;
  }

  frames.push({
    highlightLine: 11,
    pointers: {},
    cellStates: new Array(n).fill("visited"),
    variables: { l, r, pos: 0 },
    caption: `Result filled: [${res.join(", ")}] — sorted ascending.`,
    eli5Caption: `Every slot is filled, smallest to largest: [${res.join(", ")}].`,
    view: { res: [...res], resStates: resStates(filled, null) } satisfies SquaresView,
  });

  return { frames, res };
}
