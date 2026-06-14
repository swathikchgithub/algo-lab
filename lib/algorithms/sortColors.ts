import type { CellState, Frame } from "@/lib/types";
import type { ArrayMutView } from "./moveZeroes";

// Pure frame generator for Sort Colors (Dutch National Flag, in-place, three
// pointers). The array MUTATES, so each frame carries the live snapshot in
// `view.arr`. No React.
//
// `sortColorsCode` is 1-indexed by `Frame.highlightLine`.

export const sortColorsCode = [
  "low = mid = 0", // 1
  "high = len(nums) - 1", // 2
  "while mid <= high:", // 3
  "    if nums[mid] == 0:", // 4
  "        nums[low], nums[mid] = nums[mid], nums[low]", // 5
  "        low += 1; mid += 1", // 6
  "    elif nums[mid] == 1:", // 7
  "        mid += 1", // 8
  "    else:", // 9
  "        nums[mid], nums[high] = nums[high], nums[mid]", // 10
  "        high -= 1  # re-check swapped value", // 11
];

export interface SortColorsResult {
  frames: Frame[];
  /** The sorted array — for tests. */
  result: number[];
}

/** Settled regions (the 0s before `mid`, the 2s after `high`) are blue; the
 *  scan cursor `mid` is amber; the unknown middle is default. */
function states(n: number, mid: number, high: number): CellState[] {
  const out: CellState[] = [];
  for (let k = 0; k < n; k++) {
    if (k === mid) out.push("current");
    else if (k < mid || k > high) out.push("active");
    else out.push("default");
  }
  return out;
}

/**
 * Generate frames for Sort Colors via the Dutch National Flag partition.
 * Invariant: [0, low) are 0s, [low, mid) are 1s, [mid, high] are unknown,
 * (high, n) are 2s. The cursor `mid` routes each value to its region.
 *
 * Time:  O(n) — each step advances mid or shrinks high.
 * Space: O(n) — one frame (with an array snapshot) per step.
 */
export function sortColorsFrames(nums: number[]): SortColorsResult {
  const n = nums.length;
  const arr = [...nums];
  const frames: Frame[] = [];

  let low = 0;
  let mid = 0;
  let high = n - 1;

  frames.push({
    highlightLine: 2,
    pointers: { low, mid, high },
    cellStates: states(n, mid, high),
    variables: { low, mid, high },
    caption: `Three pointers: push 0s toward low, 2s toward high, scan with mid.`,
    eli5Caption: `Three buckets at once: 0s to the left wall, 2s to the right wall, 1s settle in the middle.`,
    view: { arr: [...arr] } satisfies ArrayMutView,
  });

  while (mid <= high) {
    const val = arr[mid];
    if (val === 0) {
      [arr[low], arr[mid]] = [arr[mid], arr[low]];
      frames.push({
        highlightLine: 5,
        pointers: { low, mid, high },
        cellStates: states(n, mid, high),
        variables: { low, mid, high, value: val },
        caption: `nums[mid]=0 → swap into the low region; low++, mid++.`,
        eli5Caption: `A 0 — send it to the left wall and move both low and mid forward.`,
        view: { arr: [...arr] } satisfies ArrayMutView,
      });
      low += 1;
      mid += 1;
    } else if (val === 1) {
      frames.push({
        highlightLine: 8,
        pointers: { low, mid, high },
        cellStates: states(n, mid, high),
        variables: { low, mid, high, value: val },
        caption: `nums[mid]=1 → already in the middle; just advance mid.`,
        eli5Caption: `A 1 belongs in the middle, so leave it and move mid forward.`,
        view: { arr: [...arr] } satisfies ArrayMutView,
      });
      mid += 1;
    } else {
      [arr[mid], arr[high]] = [arr[high], arr[mid]];
      frames.push({
        highlightLine: 10,
        pointers: { low, mid, high },
        cellStates: states(n, mid, high),
        variables: { low, mid, high, value: val },
        caption: `nums[mid]=2 → swap into the high region; high-- (re-check the swapped value).`,
        eli5Caption: `A 2 — send it to the right wall and shrink high. Don't advance mid yet.`,
        view: { arr: [...arr] } satisfies ArrayMutView,
      });
      high -= 1;
    }
  }

  frames.push({
    highlightLine: 3,
    pointers: { low, mid, high },
    cellStates: new Array(n).fill("active"),
    variables: { low, mid, high },
    caption: `mid passed high — sorted in one pass: [${arr.join(", ")}].`,
    eli5Caption: `Every color is in its bucket: [${arr.join(", ")}].`,
    view: { arr: [...arr] } satisfies ArrayMutView,
  });

  return { frames, result: arr };
}
