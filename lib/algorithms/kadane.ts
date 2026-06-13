import type { CellState, Frame } from "@/lib/types";

// Pure frame generator for Kadane's algorithm (Maximum Subarray). Given an
// array it returns the sequence of animation frames the <Stepper> plays. No
// React.
//
// The `kadaneCode` below is 1-indexed by `Frame.highlightLine` (line 1 is the
// first entry). Keep it in sync with the frames this function emits.

export const kadaneCode = [
  "cur, best = arr[0], arr[0]", // 1
  "start, best_l, best_r = 0, 0, 0", // 2
  "for i in range(1, n):", // 3
  "    if cur + arr[i] < arr[i]: cur, start = arr[i], i", // 4
  "    else: cur += arr[i]", // 5
  "    if cur > best: best, best_l, best_r = cur, start, i", // 6
  "    # drop the bag when carrying it would hurt", // 7
  "return best", // 8
];

/**
 * Build the cellStates array for the running subarray.
 *
 * - [start..i]            => "active" (the current run we're carrying)
 * - i                     => "current" (the cell just considered)
 * - indices before start  => "visited" (dropped bags)
 * - indices after i        => "default" (not yet reached)
 */
function runStates(n: number, start: number, i: number): CellState[] {
  const states: CellState[] = [];
  for (let k = 0; k < n; k++) {
    if (k > i) states.push("default"); // not yet reached
    else if (k < start) states.push("visited"); // dropped
    else if (k === i) states.push("current"); // current cell — amber
    else states.push("active"); // live run — blue
  }
  return states;
}

const ELI5 =
  "You're carrying a money bag; if it ever goes negative, drop it and start a fresh one.";

export interface KadaneResult {
  frames: Frame[];
  maxSum: number;
  bestRange: [number, number];
}

/**
 * Generate frames for Kadane's maximum-subarray scan.
 *
 * Time:  O(n) — a single left-to-right pass over the array.
 * Space: O(n) — one frame per element (for visualization).
 */
export function kadaneFrames(arr: number[]): KadaneResult {
  const n = arr.length;
  const frames: Frame[] = [];

  let cur = arr[0];
  let best = arr[0];
  let start = 0;
  let bestL = 0;
  let bestR = 0;

  // Frame 0: initialise with the first element.
  frames.push({
    highlightLine: 1,
    pointers: { i: 0 },
    cellStates: runStates(n, start, 0),
    variables: { i: 0, cur, best },
    caption: `Start the bag at index 0: cur = ${cur}, best = ${best}.`,
    eli5Caption: ELI5,
  });

  for (let i = 1; i < n; i++) {
    const extend = cur + arr[i];

    if (extend < arr[i]) {
      // Drop the bag and start fresh at i.
      cur = arr[i];
      start = i;
      frames.push({
        highlightLine: 4,
        pointers: { i },
        cellStates: runStates(n, start, i),
        variables: { i, cur, best },
        caption: `cur(${extend - arr[i]})+${arr[i]} = ${extend} < ${arr[i]} ✗ → drop the bag, start fresh at ${arr[i]}`,
        eli5Caption: ELI5,
      });
    } else {
      cur = extend;
      frames.push({
        highlightLine: 5,
        pointers: { i },
        cellStates: runStates(n, start, i),
        variables: { i, cur, best },
        caption: `cur(${extend - arr[i]})+${arr[i]} = ${extend} ≥ ${arr[i]} ✓ → keep carrying, cur = ${cur}`,
        eli5Caption: ELI5,
      });
    }

    if (cur > best) {
      const prevBest = best;
      best = cur;
      bestL = start;
      bestR = i;
      frames.push({
        highlightLine: 6,
        pointers: { i },
        cellStates: runStates(n, start, i),
        variables: { i, cur, best },
        caption: `cur ${cur} > best ${prevBest} ✓ → best = ${best}`,
        eli5Caption: ELI5,
      });
    }
  }

  // Final frame: highlight the winning subarray.
  const finalStates: CellState[] = [];
  for (let k = 0; k < n; k++) {
    finalStates.push(k >= bestL && k <= bestR ? "active" : "visited");
  }
  frames.push({
    highlightLine: 8,
    pointers: { i: n - 1 },
    cellStates: finalStates,
    variables: { i: n - 1, cur, best },
    caption: `Done. Best subarray is indices [${bestL}, ${bestR}] with sum ${best}.`,
    eli5Caption: `The heaviest bag you ever carried was worth ${best}.`,
  });

  return { frames, maxSum: best, bestRange: [bestL, bestR] };
}
