import type { CellState, Frame } from "@/lib/types";
import type { ArrayMutView } from "./moveZeroes";

// Pure frame generator shared by plain Binary Search and Search Insert Position
// — identical search, differing only in what they return when the target is
// absent (-1 vs the insertion point `lo`). Single row via `view.arr`. No React.
//
// The code arrays below are 1-indexed by `Frame.highlightLine` and share lines
// 1–8; only the final return line differs.

const SHARED = [
  "lo, hi = 0, len(nums) - 1", // 1
  "while lo <= hi:", // 2
  "    mid = lo + (hi - lo) // 2     # avoid overflow", // 3
  "    if nums[mid] == target: return mid", // 4
  "    if nums[mid] < target:", // 5
  "        lo = mid + 1              # search right half", // 6
  "    else:", // 7
  "        hi = mid - 1              # search left half", // 8
];

export const binarySearchCode = [...SHARED, "return -1"]; // 9
export const searchInsertCode = [...SHARED, "return lo                      # insert position"]; // 9

export type BinarySearchMode = "find" | "insert";

export interface BinarySearchResult {
  frames: Frame[];
  /** Index of the target; or -1 ("find") / insertion point ("insert") if absent. */
  result: number;
}

/** Window [lo, hi] is blue, mid is amber, discarded ends are dimmed. */
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
 * Generate frames for binary search on a sorted array. Each step compares the
 * middle element to the target and discards half the window.
 *
 * Time:  O(log n) — the window halves each step.
 * Space: O(n) — one frame per step.
 */
export function binarySearchFrames(
  nums: number[],
  target: number,
  mode: BinarySearchMode = "find",
): BinarySearchResult {
  const arr = [...nums];
  const n = arr.length;
  const frames: Frame[] = [];

  let lo = 0;
  let hi = n - 1;

  frames.push({
    highlightLine: 1,
    pointers: { lo, hi },
    cellStates: states(n, lo, hi, -1),
    variables: { lo, hi, target },
    caption: `Search for ${target}. Window is the whole sorted array.`,
    eli5Caption: `Guess the middle each time; every guess throws away half the array.`,
    view: { arr: [...arr] } satisfies ArrayMutView,
  });

  let result = -1;
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (arr[mid] === target) {
      result = mid;
      frames.push({
        highlightLine: 4,
        pointers: { lo, mid, hi },
        cellStates: states(n, lo, hi, mid),
        variables: { lo, mid, hi, "nums[mid]": arr[mid], target },
        caption: `nums[mid]=${arr[mid]} = target ✓ → found at index ${mid}.`,
        eli5Caption: `The middle is exactly ${target} — found it at index ${mid}.`,
        view: { arr: [...arr] } satisfies ArrayMutView,
      });
      break;
    }
    const goRight = arr[mid] < target;
    frames.push({
      highlightLine: goRight ? 6 : 8,
      pointers: { lo, mid, hi },
      cellStates: states(n, lo, hi, mid),
      variables: { lo, mid, hi, "nums[mid]": arr[mid], target },
      caption: goRight
        ? `nums[mid]=${arr[mid]} < ${target} → search right (lo = ${mid + 1}).`
        : `nums[mid]=${arr[mid]} > ${target} → search left (hi = ${mid - 1}).`,
      eli5Caption: goRight
        ? `Middle is too small — look in the right half.`
        : `Middle is too big — look in the left half.`,
      view: { arr: [...arr] } satisfies ArrayMutView,
    });
    if (goRight) lo = mid + 1;
    else hi = mid - 1;
  }

  if (result === -1) {
    const insertAt = lo;
    result = mode === "insert" ? insertAt : -1;
    frames.push({
      highlightLine: 9,
      pointers: { lo },
      cellStates: new Array(n).fill("visited"),
      variables: { target, result },
      caption:
        mode === "insert"
          ? `Window empty — ${target} not present. It belongs at index ${insertAt}.`
          : `Window empty — ${target} is not in the array. Return -1.`,
      eli5Caption:
        mode === "insert"
          ? `${target} isn't here, but this is where it would slot in: index ${insertAt}.`
          : `The window closed without finding ${target}, so it isn't here.`,
      view: { arr: [...arr] } satisfies ArrayMutView,
    });
  }

  return { frames, result };
}
