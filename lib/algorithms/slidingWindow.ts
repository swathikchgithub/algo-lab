import type { CellState, Frame } from "@/lib/types";

// Pure frame generator for the fixed-size Sliding Window (max sum of any
// contiguous window of size k). Returns the sequence of animation frames the
// <Stepper> plays. No React.
//
// The `slidingWindowCode` lines below are 1-indexed by `Frame.highlightLine`
// (line 1 is the first entry). Keep them in sync with the frames emitted.

export const slidingWindowCode = [
  "window_sum = 0", // 1
  "for i in range(k): window_sum += arr[i]", // 2
  "max_sum = window_sum", // 3
  "for r in range(k, n):", // 4
  "    window_sum += arr[r] - arr[r - k]", // 5
  "    max_sum = max(max_sum, window_sum)", // 6
  "    # one house in, one house out", // 7
  "return max_sum", // 8
];

/** Build cellStates for the window [l..r]: visited before l, active inside,
 *  current at the newest index r, default after r. */
function windowStates(n: number, l: number, r: number): CellState[] {
  const states: CellState[] = [];
  for (let i = 0; i < n; i++) {
    if (i < l) states.push("visited"); // slid past — dimmed
    else if (i === r) states.push("current"); // newest cell — amber
    else if (i <= r) states.push("active"); // inside window — blue
    else states.push("default"); // not yet reached
  }
  return states;
}

export interface SlidingWindowResult {
  frames: Frame[];
  maxSum: number;
}

/**
 * Generate frames for the maximum-sum fixed window of size k.
 *
 * Time:  O(n) — first window in O(k), then each slide is O(1).
 * Space: O(n) — one frame per slide (for visualization).
 */
export function slidingWindowFrames(arr: number[], k: number): SlidingWindowResult {
  const n = arr.length;
  const frames: Frame[] = [];

  // Guard: k must be a valid window size for this array.
  if (k <= 0 || k > n) {
    frames.push({
      highlightLine: 1,
      pointers: {},
      cellStates: new Array(n).fill("default"),
      variables: { k, n },
      caption: `k must be between 1 and the array length (got k=${k}, length=${n}).`,
      eli5Caption: `The train window has to fit on the street — pick a size between 1 and ${n}.`,
    });
    return { frames, maxSum: 0 };
  }

  // First full window [0..k-1].
  let windowSum = 0;
  for (let i = 0; i < k; i++) windowSum += arr[i];
  let maxSum = windowSum;

  let l = 0;
  let r = k - 1;

  frames.push({
    highlightLine: 3,
    pointers: { L: l, R: r },
    cellStates: windowStates(n, l, r),
    variables: { k, windowSum, maxSum, L: l, R: r },
    caption: `First window [${l}..${r}] sum = ${windowSum}. maxSum = ${maxSum}.`,
    eli5Caption: `Look through the train window at the first ${k} houses and add them up.`,
  });

  // Slide the window one step at a time.
  for (r = k; r < n; r++) {
    l = r - k + 1;
    const added = arr[r];
    const removed = arr[r - k];
    windowSum += added - removed;

    const prevMax = maxSum;
    const improved = windowSum > maxSum;
    if (improved) maxSum = windowSum;

    frames.push({
      highlightLine: improved ? 6 : 5,
      pointers: { L: l, R: r },
      cellStates: windowStates(n, l, r),
      variables: { k, windowSum, maxSum, L: l, R: r },
      caption: improved
        ? `Window [${l}..${r}] sum = ${windowSum} > maxSum ${prevMax} ✓ → maxSum = ${windowSum}.`
        : `Window [${l}..${r}] sum = ${windowSum} ≤ maxSum ${prevMax} ✗ → keep maxSum ${prevMax}.`,
      eli5Caption: `The train moves: add the new house (${added}), drop the old one (${removed}).`,
    });
  }

  return { frames, maxSum };
}
