import type { CellState, Frame } from "@/lib/types";

// Pure frame generator for Binary Search. Given a sorted array and a target,
// it returns the sequence of animation frames the <Stepper> plays. No React.
//
// The `codeLines` below are 1-indexed by `Frame.highlightLine` (line 1 is the
// first entry). Keep them in sync with the frames this function emits.

export const binarySearchCode = [
  "lo, hi = 0, len(arr) - 1", // 1
  "while lo <= hi:", // 2
  "    mid = lo + (hi - lo) // 2", // 3
  "    if arr[mid] == target: return mid", // 4
  "    elif arr[mid] < target: lo = mid + 1", // 5
  "    else: hi = mid - 1", // 6
  "    # the search window halves each step", // 7
  "return -1", // 8
];

/** Build the cellStates array for a given [lo, hi] window and mid. */
function windowStates(n: number, lo: number, hi: number, mid: number): CellState[] {
  const states: CellState[] = [];
  for (let i = 0; i < n; i++) {
    if (i < lo || i > hi) states.push("visited"); // discarded half — dimmed
    else if (i === mid) states.push("current"); // mid — amber
    else states.push("active"); // live window — blue
  }
  return states;
}

export interface BinarySearchResult {
  frames: Frame[];
  found: boolean;
  index: number;
}

/**
 * Generate frames for binary search over a sorted ascending array.
 *
 * Time:  O(log n) — the search window halves each iteration.
 * Space: O(log n) — one frame per iteration (for visualization).
 */
export function binarySearchFrames(arr: number[], target: number): BinarySearchResult {
  const n = arr.length;
  const frames: Frame[] = [];

  let lo = 0;
  let hi = n - 1;
  let foundIndex = -1;

  // Frame 0: initial window.
  frames.push({
    highlightLine: 1,
    pointers: { L: lo, R: hi },
    cellStates: windowStates(n, lo, hi, -1),
    variables: { lo, hi, target },
    caption: `Search the whole array for ${target}. lo=${lo}, hi=${hi}.`,
    eli5Caption: `We're guessing a number. The answer is somewhere between the two ends.`,
  });

  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    const val = arr[mid];

    // Show the mid being chosen.
    frames.push({
      highlightLine: 3,
      pointers: { L: lo, M: mid, R: hi },
      cellStates: windowStates(n, lo, hi, mid),
      variables: { lo, hi, mid, "arr[mid]": val, target },
      caption: `Check the middle: mid=${mid}, arr[mid]=${val}.`,
      eli5Caption: `Guess the middle of what's left: ${val}.`,
    });

    if (val === target) {
      foundIndex = mid;
      frames.push({
        highlightLine: 4,
        pointers: { L: lo, M: mid, R: hi },
        cellStates: windowStates(n, lo, hi, mid),
        variables: { lo, hi, mid, "arr[mid]": val, target },
        caption: `${val} === ${target} ✓ → found at index ${mid}.`,
        eli5Caption: `That's the number! 🎉 Found it.`,
      });
      return { frames, found: true, index: foundIndex };
    }

    if (val < target) {
      frames.push({
        highlightLine: 5,
        pointers: { L: lo, M: mid, R: hi },
        cellStates: windowStates(n, lo, hi, mid),
        variables: { lo, hi, mid, "arr[mid]": val, target },
        caption: `${val} < ${target} ✗ → discard left half, lo = ${mid + 1}.`,
        eli5Caption: `Too small — throw away the left half. The answer can't be there!`,
      });
      lo = mid + 1;
    } else {
      frames.push({
        highlightLine: 6,
        pointers: { L: lo, M: mid, R: hi },
        cellStates: windowStates(n, lo, hi, mid),
        variables: { lo, hi, mid, "arr[mid]": val, target },
        caption: `${val} > ${target} ✗ → discard right half, hi = ${mid - 1}.`,
        eli5Caption: `Too big — throw away the right half. The answer can't be there!`,
      });
      hi = mid - 1;
    }
  }

  // Not found: window collapsed.
  frames.push({
    highlightLine: 8,
    pointers: {},
    cellStates: new Array(n).fill("visited"),
    variables: { lo, hi, target },
    caption: `lo > hi → ${target} is not in the array. Return -1.`,
    eli5Caption: `Nothing left to check — the number isn't here.`,
  });

  return { frames, found: false, index: -1 };
}
