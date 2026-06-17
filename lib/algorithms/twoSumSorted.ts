import type { CellState, Frame } from "@/lib/types";
import type { ArrayMutView } from "./moveZeroes";

// Pure frame generator for Two Sum II (sorted input, converging two pointers).
// Returns 1-indexed positions. Single row via `view.arr`. No React.
//
// `twoSumSortedCode` is 1-indexed by `Frame.highlightLine`.

export const twoSumSortedCode = [
  "l, r = 0, len(numbers) - 1", // 1
  "while l < r:", // 2
  "    s = numbers[l] + numbers[r]", // 3
  "    if s == target: return [l + 1, r + 1]   # 1-indexed", // 4
  "    if s < target: l += 1                    # need bigger", // 5
  "    else: r -= 1                             # need smaller", // 6
  "return []", // 7
];

export interface TwoSumSortedResult {
  frames: Frame[];
  /** 1-indexed [l+1, r+1], or [] if no pair sums to target. */
  result: number[];
}

function states(n: number, l: number, r: number): CellState[] {
  const out: CellState[] = [];
  for (let k = 0; k < n; k++) {
    if (k < l || k > r) out.push("visited");
    else if (k === l || k === r) out.push("current");
    else out.push("active");
  }
  return out;
}

/**
 * Generate frames for Two Sum II. Sum the two ends: too small → advance l, too
 * big → retreat r, equal → done. Assumes `numbers` is sorted ascending.
 *
 * Time:  O(n) — each step moves a pointer inward.
 * Space: O(n) — one frame per step.
 */
export function twoSumSortedFrames(numbers: number[], target: number): TwoSumSortedResult {
  const arr = [...numbers];
  const n = arr.length;
  const frames: Frame[] = [];

  let l = 0;
  let r = n - 1;

  frames.push({
    highlightLine: 1,
    pointers: { l, r },
    cellStates: states(n, l, r),
    variables: { l, r, target },
    caption: `Two pointers at the ends. Looking for a pair summing to ${target}.`,
    eli5Caption: `Two friends start at opposite ends and walk toward each other.`,
    view: { arr: [...arr] } satisfies ArrayMutView,
  });

  let result: number[] = [];
  while (l < r) {
    const s = arr[l] + arr[r];
    if (s === target) {
      result = [l + 1, r + 1];
      frames.push({
        highlightLine: 4,
        pointers: { l, r },
        cellStates: states(n, l, r),
        variables: { l, r, s, target, result: `[${result.join(",")}]` },
        caption: `${arr[l]} + ${arr[r]} = ${s} = target ✓ → return 1-indexed [${result.join(", ")}].`,
        eli5Caption: `${arr[l]} and ${arr[r]} add up to ${target} — that's the pair (positions ${result.join(", ")}).`,
        view: { arr: [...arr] } satisfies ArrayMutView,
      });
      break;
    }
    const tooSmall = s < target;
    frames.push({
      highlightLine: tooSmall ? 5 : 6,
      pointers: { l, r },
      cellStates: states(n, l, r),
      variables: { l, r, s, target },
      caption: tooSmall
        ? `${arr[l]} + ${arr[r]} = ${s} < ${target} → need bigger; move l right.`
        : `${arr[l]} + ${arr[r]} = ${s} > ${target} → need smaller; move r left.`,
      eli5Caption: tooSmall
        ? `Sum too small — the left friend steps toward bigger numbers.`
        : `Sum too big — the right friend steps toward smaller numbers.`,
      view: { arr: [...arr] } satisfies ArrayMutView,
    });
    if (tooSmall) l += 1;
    else r -= 1;
  }

  if (result.length === 0) {
    frames.push({
      highlightLine: 7,
      pointers: {},
      cellStates: new Array(n).fill("visited"),
      variables: { target, result: "[]" },
      caption: `Pointers met with no match — no pair sums to ${target}.`,
      eli5Caption: `The friends met in the middle without finding a pair.`,
      view: { arr: [...arr] } satisfies ArrayMutView,
    });
  }

  return { frames, result };
}
