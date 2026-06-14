import type { CellState, Frame } from "@/lib/types";

// Pure frame generator for Move Zeroes (in-place, write-pointer two pointers).
// The array MUTATES as it runs, so each frame carries the current array snapshot
// in `view.arr` (the static input no longer reflects the live state). No React.
//
// `moveZeroesCode` is 1-indexed by `Frame.highlightLine`.

export const moveZeroesCode = [
  "w = 0  # next non-zero slot", // 1
  "for i in range(len(nums)):", // 2
  "    if nums[i] != 0:", // 3
  "        nums[w], nums[i] = nums[i], nums[w]", // 4
  "        w += 1", // 5
];

/** Live array snapshot for in-place algorithms, carried in `Frame.view`. */
export interface ArrayMutView {
  arr: number[];
}

export interface MoveZeroesResult {
  frames: Frame[];
  /** The array after all moves — for tests. */
  result: number[];
}

/** Packed non-zeros [0, w) are blue (settled), the scan index i is amber. */
function states(n: number, w: number, i: number): CellState[] {
  const out: CellState[] = [];
  for (let k = 0; k < n; k++) {
    if (k === i) out.push("current");
    else if (k < w) out.push("active");
    else out.push("default");
  }
  return out;
}

/**
 * Generate frames for Move Zeroes. A write pointer `w` marks the next slot for a
 * non-zero value; the scan pointer `i` walks the array swapping each non-zero
 * into `w`. Zeros are left behind and end up at the tail.
 *
 * Time:  O(n) — single scan.
 * Space: O(n) — one frame (with an array snapshot) per step.
 */
export function moveZeroesFrames(nums: number[]): MoveZeroesResult {
  const n = nums.length;
  const arr = [...nums];
  const frames: Frame[] = [];
  let w = 0;

  frames.push({
    highlightLine: 1,
    pointers: { w: 0, i: 0 },
    cellStates: states(n, 0, 0),
    variables: { w: 0, i: 0 },
    caption: `Write pointer w marks the next non-zero slot. Scan with i.`,
    eli5Caption: `One pointer (w) packs non-zero items to the front as another (i) reads across.`,
    view: { arr: [...arr] } satisfies ArrayMutView,
  });

  for (let i = 0; i < n; i++) {
    if (arr[i] !== 0) {
      const moved = arr[i];
      [arr[w], arr[i]] = [arr[i], arr[w]];
      frames.push({
        highlightLine: 4,
        pointers: { w, i },
        cellStates: states(n, w, i),
        variables: { w, i, value: moved },
        caption: `nums[i]=${moved} ≠ 0 → swap into slot ${w}; w → ${w + 1}.`,
        eli5Caption: `${moved} isn't zero, so pack it into the next front slot (${w}).`,
        view: { arr: [...arr] } satisfies ArrayMutView,
      });
      w += 1;
    } else {
      frames.push({
        highlightLine: 3,
        pointers: { w, i },
        cellStates: states(n, w, i),
        variables: { w, i, value: 0 },
        caption: `nums[i]=0 → skip; leave it for a later swap and advance i.`,
        eli5Caption: `A zero — skip it. It'll get pushed toward the end as we go.`,
        view: { arr: [...arr] } satisfies ArrayMutView,
      });
    }
  }

  frames.push({
    highlightLine: 2,
    pointers: { w },
    cellStates: new Array(n).fill("active"),
    variables: { w, i: n },
    caption: `Done — non-zeros packed in order, zeros at the end: [${arr.join(", ")}].`,
    eli5Caption: `All non-zeros are up front and the zeros settled at the back: [${arr.join(", ")}].`,
    view: { arr: [...arr] } satisfies ArrayMutView,
  });

  return { frames, result: arr };
}
