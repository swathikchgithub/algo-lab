import type { CellState, Frame } from "@/lib/types";
import type { ArrayMutView } from "./moveZeroes";

// Pure frame generator for Remove Duplicates from Sorted Array (in-place,
// slow/fast pointers). The array mutates (unique values are written forward), so
// each frame carries the live snapshot in `view.arr`. No React.
//
// `removeDuplicatesCode` is 1-indexed by `Frame.highlightLine`.

export const removeDuplicatesCode = [
  "if not nums: return 0", // 1
  "k = 1  # next write index", // 2
  "for i in range(1, len(nums)):", // 3
  "    if nums[i] != nums[k - 1]:", // 4
  "        nums[k] = nums[i]", // 5
  "        k += 1", // 6
  "return k", // 7
];

export interface RemoveDuplicatesResult {
  frames: Frame[];
  /** New length (count of unique elements) — the algorithm's return value. */
  k: number;
}

/** Unique region [0, k) is blue (settled), the read cursor i is amber, the tail
 *  beyond k is dimmed (leftover, ignored). */
function states(n: number, k: number, i: number): CellState[] {
  const out: CellState[] = [];
  for (let j = 0; j < n; j++) {
    if (j === i) out.push("current");
    else if (j < k) out.push("active");
    else out.push("default");
  }
  return out;
}

/**
 * Generate frames for Remove Duplicates from a sorted array. A write pointer `k`
 * marks the next slot for a new unique value; the read pointer `i` scans and
 * writes forward only when it finds a value different from the last unique one.
 *
 * Time:  O(n) — single scan.
 * Space: O(n) — one frame (with an array snapshot) per step.
 */
export function removeDuplicatesFrames(nums: number[]): RemoveDuplicatesResult {
  const n = nums.length;
  const arr = [...nums];

  if (n === 0) {
    return {
      frames: [
        {
          highlightLine: 1,
          pointers: {},
          cellStates: [],
          variables: { k: 0 },
          caption: `Empty array → length 0.`,
          eli5Caption: `Nothing to dedupe — the answer is 0.`,
          view: { arr: [] } satisfies ArrayMutView,
        },
      ],
      k: 0,
    };
  }

  const frames: Frame[] = [];
  let k = 1;

  frames.push({
    highlightLine: 2,
    pointers: { k: 0, i: 1 },
    cellStates: states(n, 1, 1),
    variables: { k, i: 1 },
    caption: `First element is always unique. Write index k=1; scan from i=1.`,
    eli5Caption: `The slow writer keeps the unique values; the fast reader looks for something new.`,
    view: { arr: [...arr] } satisfies ArrayMutView,
  });

  for (let i = 1; i < n; i++) {
    if (arr[i] !== arr[k - 1]) {
      arr[k] = arr[i];
      frames.push({
        highlightLine: 5,
        pointers: { k, i },
        cellStates: states(n, k, i),
        variables: { k, i, value: arr[i] },
        caption: `nums[i]=${arr[i]} ≠ nums[k−1]=${arr[k - 1]} → new value; write to slot ${k}, k → ${k + 1}.`,
        eli5Caption: `${arr[i]} is new, so the writer copies it forward and steps ahead.`,
        view: { arr: [...arr] } satisfies ArrayMutView,
      });
      k += 1;
    } else {
      frames.push({
        highlightLine: 4,
        pointers: { k, i },
        cellStates: states(n, k, i),
        variables: { k, i, value: arr[i] },
        caption: `nums[i]=${arr[i]} = nums[k−1]=${arr[k - 1]} → duplicate; skip.`,
        eli5Caption: `${arr[i]} is a repeat, so the reader moves on and the writer stays put.`,
        view: { arr: [...arr] } satisfies ArrayMutView,
      });
    }
  }

  // Final frame: dim the leftover tail beyond k — only the first k matter.
  const finalStates: CellState[] = arr.map((_, j) => (j < k ? "active" : "visited"));
  frames.push({
    highlightLine: 7,
    pointers: { k },
    cellStates: finalStates,
    variables: { k, i: n },
    caption: `${k} unique elements: [${arr.slice(0, k).join(", ")}]. (Tail ignored.)`,
    eli5Caption: `The first ${k} slots hold the unique values: [${arr.slice(0, k).join(", ")}].`,
    view: { arr: [...arr] } satisfies ArrayMutView,
  });

  return { frames, k };
}
