import type { CellState, Frame } from "@/lib/types";

// Pure frame generator for the converging Two Pointers pattern (Two Sum on a
// sorted ascending array). Given a sorted array and a target, it returns the
// sequence of animation frames the <Stepper> plays. No React.
//
// The `twoPointersCode` lines below are 1-indexed by `Frame.highlightLine`
// (line 1 is the first entry). Keep them in sync with the frames emitted.

export const twoPointersCode = [
  "L, R = 0, len(arr) - 1", // 1
  "while L < R:", // 2
  "    total = arr[L] + arr[R]", // 3
  "    if total == target: return [L, R]", // 4
  "    elif total < target: L += 1", // 5
  "    else: R -= 1", // 6
  "    # the two ends walk inward", // 7
  "return None", // 8
];

/** Build the cellStates array for converging pointers at [L, R]. */
function pointerStates(n: number, L: number, R: number): CellState[] {
  const states: CellState[] = [];
  for (let i = 0; i < n; i++) {
    if (i < L || i > R) states.push("visited"); // discarded — dimmed
    else if (i === L || i === R) states.push("current"); // the two pointers — amber
    else states.push("active"); // still in play — blue
  }
  return states;
}

export interface TwoPointersResult {
  frames: Frame[];
  found: boolean;
  indices: [number, number] | null;
}

/**
 * Generate frames for Two Sum on a sorted ascending array using converging
 * pointers L (start) and R (end). Assumes `arr` is already sorted ascending.
 *
 * Time:  O(n) — each step moves L right or R left, so at most n moves.
 * Space: O(n) — one frame per step (for visualization).
 */
export function twoPointersFrames(arr: number[], target: number): TwoPointersResult {
  const n = arr.length;
  const frames: Frame[] = [];

  let L = 0;
  let R = n - 1;

  // Frame 0: initial state — whole array active, pointers at the ends.
  frames.push({
    highlightLine: 1,
    pointers: { L, R },
    cellStates: new Array(n).fill("active"),
    variables: { left: L, right: R, target },
    caption: `Start with the two friends at opposite ends. L=${L}, R=${R}, target=${target}.`,
    eli5Caption: `Two friends stand at the two ends of the hallway and walk toward each other.`,
  });

  while (L < R) {
    const sum = arr[L] + arr[R];

    if (sum === target) {
      frames.push({
        highlightLine: 4,
        pointers: { L, R },
        cellStates: pointerStates(n, L, R),
        variables: { left: L, right: R, sum, target },
        caption: `arr[L]+arr[R] = ${arr[L]}+${arr[R]} = ${sum} === ${target} ✓ → found at indices ${L} and ${R}.`,
        eli5Caption: `The two friends shook hands on the right number! 🎉`,
      });
      return { frames, found: true, indices: [L, R] };
    }

    if (sum < target) {
      frames.push({
        highlightLine: 5,
        pointers: { L, R },
        cellStates: pointerStates(n, L, R),
        variables: { left: L, right: R, sum, target },
        caption: `arr[L]+arr[R] = ${arr[L]}+${arr[R]} = ${sum} < ${target} ✗ → move left in.`,
        eli5Caption: `Sum too small — the left friend steps right.`,
      });
      L++;
    } else {
      frames.push({
        highlightLine: 6,
        pointers: { L, R },
        cellStates: pointerStates(n, L, R),
        variables: { left: L, right: R, sum, target },
        caption: `arr[L]+arr[R] = ${arr[L]}+${arr[R]} = ${sum} > ${target} ✗ → move right in.`,
        eli5Caption: `Sum too big — the right friend steps left.`,
      });
      R--;
    }
  }

  // Not found: pointers crossed.
  frames.push({
    highlightLine: 8,
    pointers: { L, R },
    cellStates: new Array(n).fill("visited"),
    variables: { left: L, right: R, target },
    caption: `L >= R → no pair sums to ${target}. Return null.`,
    eli5Caption: `The friends met in the middle without finding the right number.`,
  });

  return { frames, found: false, indices: null };
}
