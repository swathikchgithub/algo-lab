import type { CellState, Frame } from "@/lib/types";
import type { ArrayMutView } from "./moveZeroes";

// Pure frame generator for Find First and Last Position. Runs binary search
// twice over the same array: once leaning left (first occurrence), once leaning
// right (last). Single row; the array is shown via `view.arr`. No React.
//
// `findFirstLastCode` is 1-indexed by `Frame.highlightLine`.

export const findFirstLastCode = [
  "def bound(find_left):", // 1
  "    lo, hi, ans = 0, len(nums) - 1, -1", // 2
  "    while lo <= hi:", // 3
  "        mid = lo + (hi - lo) // 2", // 4
  "        if nums[mid] == target:", // 5
  "            ans = mid                 # record, keep searching", // 6
  "            if find_left: hi = mid - 1", // 7
  "            else: lo = mid + 1", // 8
  "        elif nums[mid] < target: lo = mid + 1", // 9
  "        else: hi = mid - 1", // 10
  "    return ans", // 11
  "return [bound(True), bound(False)]", // 12
];

export interface FindFirstLastResult {
  frames: Frame[];
  /** [firstIndex, lastIndex], each -1 if the target is absent. */
  range: [number, number];
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

/** One leaning binary-search pass; appends its frames and returns the boundary. */
function boundPass(
  arr: number[],
  target: number,
  findLeft: boolean,
  frames: Frame[],
): number {
  const n = arr.length;
  const passLabel = findLeft ? "find first →" : "find last ←";
  let lo = 0;
  let hi = n - 1;
  let ans = -1;

  frames.push({
    highlightLine: 2,
    pointers: { lo, hi },
    cellStates: states(n, lo, hi, -1),
    variables: { pass: passLabel, lo, hi, ans, target },
    caption: `${findLeft ? "Pass 1 — first occurrence (lean left)" : "Pass 2 — last occurrence (lean right)"}. Window = whole array.`,
    eli5Caption: findLeft
      ? `Play the halving game, but on a match keep looking LEFT to find where ${target} first appears.`
      : `Halving game again, but on a match keep looking RIGHT to find where ${target} last appears.`,
    view: { arr: [...arr] } satisfies ArrayMutView,
  });

  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (arr[mid] === target) {
      ans = mid;
      frames.push({
        highlightLine: findLeft ? 7 : 8,
        pointers: { lo, mid, hi },
        cellStates: states(n, lo, hi, mid),
        variables: { pass: passLabel, lo, mid, hi, ans, target },
        caption: `nums[mid]=${arr[mid]} = target → record ans=${mid}, then lean ${findLeft ? "left (hi = " + (mid - 1) + ")" : "right (lo = " + (mid + 1) + ")"}.`,
        eli5Caption: `Found a ${target} at ${mid}. Remember it, but keep searching ${findLeft ? "left" : "right"} for an earlier/later one.`,
        view: { arr: [...arr] } satisfies ArrayMutView,
      });
      if (findLeft) hi = mid - 1;
      else lo = mid + 1;
    } else if (arr[mid] < target) {
      frames.push({
        highlightLine: 9,
        pointers: { lo, mid, hi },
        cellStates: states(n, lo, hi, mid),
        variables: { pass: passLabel, lo, mid, hi, ans, target },
        caption: `nums[mid]=${arr[mid]} < ${target} → go right (lo = ${mid + 1}).`,
        eli5Caption: `The middle is too small — look in the right half.`,
        view: { arr: [...arr] } satisfies ArrayMutView,
      });
      lo = mid + 1;
    } else {
      frames.push({
        highlightLine: 10,
        pointers: { lo, mid, hi },
        cellStates: states(n, lo, hi, mid),
        variables: { pass: passLabel, lo, mid, hi, ans, target },
        caption: `nums[mid]=${arr[mid]} > ${target} → go left (hi = ${mid - 1}).`,
        eli5Caption: `The middle is too big — look in the left half.`,
        view: { arr: [...arr] } satisfies ArrayMutView,
      });
      hi = mid - 1;
    }
  }

  return ans;
}

/**
 * Generate frames for Find First and Last Position. Two leaning binary searches
 * share the array: the first records a match then keeps going left, the second
 * records then keeps going right. Their answers are the boundary indices.
 *
 * Time:  O(log n) — two halving passes.
 * Space: O(n) — one frame per step.
 */
export function findFirstLastFrames(nums: number[], target: number): FindFirstLastResult {
  const arr = [...nums];
  const n = arr.length;
  const frames: Frame[] = [];

  const first = boundPass(arr, target, true, frames);
  const last = boundPass(arr, target, false, frames);

  frames.push({
    highlightLine: 12,
    pointers: {},
    cellStates: new Array(n).fill(first === -1 ? "visited" : "active"),
    variables: { target, result: `[${first}, ${last}]` },
    caption:
      first === -1
        ? `${target} not present → [-1, -1].`
        : `First at ${first}, last at ${last} → [${first}, ${last}].`,
    eli5Caption:
      first === -1
        ? `Neither pass found ${target}, so the answer is [-1, -1].`
        : `${target} runs from index ${first} to ${last}.`,
    view: { arr: [...arr] } satisfies ArrayMutView,
  });

  return { frames, range: [first, last] };
}
