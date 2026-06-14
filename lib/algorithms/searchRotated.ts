import type { CellState, Frame } from "@/lib/types";
import type { ArrayMutView } from "./moveZeroes";

// Pure frame generator for Search in Rotated Sorted Array. Single-row binary
// search with a twist: at each mid, one half is sorted — decide which, then
// whether the target lies in it. The array is shown via `view.arr`. No React.
//
// `searchRotatedCode` is 1-indexed by `Frame.highlightLine`.

export const searchRotatedCode = [
  "lo, hi = 0, len(nums) - 1", // 1
  "while lo <= hi:", // 2
  "    mid = lo + (hi - lo) // 2", // 3
  "    if nums[mid] == target: return mid", // 4
  "    if nums[lo] <= nums[mid]:        # left half sorted", // 5
  "        if nums[lo] <= target < nums[mid]: hi = mid - 1", // 6
  "        else: lo = mid + 1", // 7
  "    else:                            # right half sorted", // 8
  "        if nums[mid] < target <= nums[hi]: lo = mid + 1", // 9
  "        else: hi = mid - 1", // 10
  "return -1", // 11
];

export interface SearchRotatedResult {
  frames: Frame[];
  /** Index of the target, or -1 if absent. */
  index: number;
}

/** Live window [lo, hi] is blue, mid is amber, discarded ends are dimmed. */
function states(n: number, lo: number, hi: number, mid: number): CellState[] {
  const out: CellState[] = [];
  for (let k = 0; k < n; k++) {
    if (k < lo || k > hi) out.push("visited");
    else if (k === mid) out.push("current");
    else out.push("active");
  }
  return out;
}

/**
 * Generate frames for Search in Rotated Sorted Array. Standard binary search,
 * but since the array is rotated we first identify which half is sorted
 * (nums[lo] <= nums[mid]) and only recurse into a half when the target's value
 * falls inside that half's known range.
 *
 * Time:  O(log n) — the window halves each step.
 * Space: O(n) — one frame per step.
 */
export function searchRotatedFrames(nums: number[], target: number): SearchRotatedResult {
  const n = nums.length;
  const arr = [...nums];
  const frames: Frame[] = [];

  let lo = 0;
  let hi = n - 1;

  frames.push({
    highlightLine: 1,
    pointers: { lo, hi },
    cellStates: states(n, lo, hi, -1),
    variables: { lo, hi, target },
    caption: `Search for ${target} in a rotated array. Window = whole array.`,
    eli5Caption: `The list was cut and rotated, but at every middle one half is still perfectly sorted.`,
    view: { arr: [...arr] } satisfies ArrayMutView,
  });

  let index = -1;
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);

    if (arr[mid] === target) {
      index = mid;
      frames.push({
        highlightLine: 4,
        pointers: { lo, mid, hi },
        cellStates: states(n, lo, hi, mid),
        variables: { lo, mid, hi, target, "nums[mid]": arr[mid] },
        caption: `nums[mid]=${arr[mid]} = target ✓ → found at index ${mid}.`,
        eli5Caption: `The middle is exactly ${target} — found it at index ${mid}.`,
        view: { arr: [...arr] } satisfies ArrayMutView,
      });
      break;
    }

    const leftSorted = arr[lo] <= arr[mid];
    if (leftSorted) {
      const inLeft = arr[lo] <= target && target < arr[mid];
      frames.push({
        highlightLine: inLeft ? 6 : 7,
        pointers: { lo, mid, hi },
        cellStates: states(n, lo, hi, mid),
        variables: { lo, mid, hi, target, "nums[mid]": arr[mid] },
        caption:
          `Left half [${arr[lo]}..${arr[mid]}] is sorted. ` +
          (inLeft
            ? `${arr[lo]} ≤ ${target} < ${arr[mid]} ✓ → search left (hi = ${mid - 1}).`
            : `${target} not in [${arr[lo]}, ${arr[mid]}) → search right (lo = ${mid + 1}).`),
        eli5Caption: inLeft
          ? `The left side is sorted and ${target} fits in it — look left.`
          : `The left side is sorted but ${target} isn't in it — look right.`,
        view: { arr: [...arr] } satisfies ArrayMutView,
      });
      if (inLeft) hi = mid - 1;
      else lo = mid + 1;
    } else {
      const inRight = arr[mid] < target && target <= arr[hi];
      frames.push({
        highlightLine: inRight ? 9 : 10,
        pointers: { lo, mid, hi },
        cellStates: states(n, lo, hi, mid),
        variables: { lo, mid, hi, target, "nums[mid]": arr[mid] },
        caption:
          `Right half [${arr[mid]}..${arr[hi]}] is sorted. ` +
          (inRight
            ? `${arr[mid]} < ${target} ≤ ${arr[hi]} ✓ → search right (lo = ${mid + 1}).`
            : `${target} not in (${arr[mid]}, ${arr[hi]}] → search left (hi = ${mid - 1}).`),
        eli5Caption: inRight
          ? `The right side is sorted and ${target} fits in it — look right.`
          : `The right side is sorted but ${target} isn't in it — look left.`,
        view: { arr: [...arr] } satisfies ArrayMutView,
      });
      if (inRight) lo = mid + 1;
      else hi = mid - 1;
    }
  }

  if (index === -1) {
    frames.push({
      highlightLine: 11,
      pointers: {},
      cellStates: new Array(n).fill("visited"),
      variables: { target, result: -1 },
      caption: `Window empty — ${target} is not in the array. Return -1.`,
      eli5Caption: `The window closed without finding ${target}, so it isn't here.`,
      view: { arr: [...arr] } satisfies ArrayMutView,
    });
  }

  return { frames, index };
}
