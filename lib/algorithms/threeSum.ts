import type { CellState, Frame } from "@/lib/types";
import type { ArrayMutView } from "./moveZeroes";

// Pure frame generator for 3Sum. Sort, then for each anchor i run converging
// pointers l/r on the remaining subarray looking for pairs that cancel the
// anchor (sum to zero). The displayed row is the SORTED array, carried in
// `view.arr`. No React.
//
// `threeSumCode` is 1-indexed by `Frame.highlightLine`.

export const threeSumCode = [
  "nums.sort()", // 1
  "res = []", // 2
  "for i in range(len(nums) - 2):", // 3
  "    if i > 0 and nums[i] == nums[i-1]: continue", // 4
  "    l, r = i + 1, len(nums) - 1", // 5
  "    while l < r:", // 6
  "        s = nums[i] + nums[l] + nums[r]", // 7
  "        if s == 0:", // 8
  "            res.append([nums[i], nums[l], nums[r]])", // 9
  "            l += 1; r -= 1  # then skip duplicates", // 10
  "        elif s < 0: l += 1", // 11
  "        else: r -= 1", // 12
  "return res", // 13
];

export interface ThreeSumResult {
  frames: Frame[];
  /** All unique triplets summing to zero — the algorithm's return value. */
  res: number[][];
}

/** Anchor i is amber; the active two-pointer window [l, r] is blue; everything
 *  else (settled anchors, skipped gap) is dimmed. */
function states(n: number, i: number, l: number, r: number): CellState[] {
  const out: CellState[] = [];
  for (let k = 0; k < n; k++) {
    if (k === i) out.push("current");
    else if (k >= l && k <= r) out.push("active");
    else out.push("visited");
  }
  return out;
}

function tripletsLabel(res: number[][]): string {
  return res.length ? res.map((t) => `[${t.join(",")}]`).join(" ") : "none yet";
}

/**
 * Generate frames for 3Sum. After sorting, fix each anchor and converge two
 * pointers; sum < 0 → move l right (need bigger), sum > 0 → move r left (need
 * smaller), sum == 0 → record the triplet and skip duplicate neighbours.
 *
 * Time:  O(n²) — an O(n) two-pointer scan per anchor.
 * Space: O(n) — the sorted snapshot plus one frame per step.
 */
export function threeSumFrames(nums: number[]): ThreeSumResult {
  const arr = [...nums].sort((a, b) => a - b);
  const n = arr.length;
  const res: number[][] = [];
  const frames: Frame[] = [];

  frames.push({
    highlightLine: 1,
    pointers: {},
    cellStates: new Array(n).fill("default"),
    variables: { triplets: tripletsLabel(res) },
    caption: `Sort first: [${arr.join(", ")}]. Now duplicates sit together and pointers can scan.`,
    eli5Caption: `Line everyone up smallest to largest. Then fix one friend and send two more walking inward.`,
    view: { arr: [...arr] } satisfies ArrayMutView,
  });

  for (let i = 0; i < n - 2; i++) {
    if (i > 0 && arr[i] === arr[i - 1]) {
      frames.push({
        highlightLine: 4,
        pointers: { i },
        cellStates: states(n, i, i + 1, n - 1),
        variables: { i, anchor: arr[i], triplets: tripletsLabel(res) },
        caption: `nums[i]=${arr[i]} repeats the previous anchor → skip to avoid duplicate triplets.`,
        eli5Caption: `We already tried anchoring on ${arr[i]} — skip it so we don't repeat triplets.`,
        view: { arr: [...arr] } satisfies ArrayMutView,
      });
      continue;
    }

    let l = i + 1;
    let r = n - 1;
    frames.push({
      highlightLine: 5,
      pointers: { i, L: l, R: r },
      cellStates: states(n, i, l, r),
      variables: { i, anchor: arr[i], l, r, target: -arr[i], triplets: tripletsLabel(res) },
      caption: `Anchor nums[i]=${arr[i]}. Two-pointer the rest for a pair summing to ${-arr[i]}.`,
      eli5Caption: `Fix ${arr[i]}. Now find two numbers to its right that add up to ${-arr[i]}.`,
      view: { arr: [...arr] } satisfies ArrayMutView,
    });

    while (l < r) {
      const s = arr[i] + arr[l] + arr[r];
      if (s === 0) {
        res.push([arr[i], arr[l], arr[r]]);
        frames.push({
          highlightLine: 9,
          pointers: { i, L: l, R: r },
          cellStates: states(n, i, l, r),
          variables: { i, l, r, s, triplets: tripletsLabel(res) },
          caption: `s = ${arr[i]} + ${arr[l]} + ${arr[r]} = 0 ✓ → record [${arr[i]},${arr[l]},${arr[r]}]; move both in.`,
          eli5Caption: `They cancel out to 0 — save the triplet, then move both pointers inward.`,
          view: { arr: [...arr] } satisfies ArrayMutView,
        });
        l += 1;
        r -= 1;
        while (l < r && arr[l] === arr[l - 1]) l += 1;
        while (l < r && arr[r] === arr[r + 1]) r -= 1;
      } else if (s < 0) {
        frames.push({
          highlightLine: 11,
          pointers: { i, L: l, R: r },
          cellStates: states(n, i, l, r),
          variables: { i, l, r, s, triplets: tripletsLabel(res) },
          caption: `s = ${arr[i]} + ${arr[l]} + ${arr[r]} = ${s} < 0 → need bigger; move l right.`,
          eli5Caption: `Too small (${s}). Slide the left pointer right toward bigger numbers.`,
          view: { arr: [...arr] } satisfies ArrayMutView,
        });
        l += 1;
      } else {
        frames.push({
          highlightLine: 12,
          pointers: { i, L: l, R: r },
          cellStates: states(n, i, l, r),
          variables: { i, l, r, s, triplets: tripletsLabel(res) },
          caption: `s = ${arr[i]} + ${arr[l]} + ${arr[r]} = ${s} > 0 → need smaller; move r left.`,
          eli5Caption: `Too big (${s}). Slide the right pointer left toward smaller numbers.`,
          view: { arr: [...arr] } satisfies ArrayMutView,
        });
        r -= 1;
      }
    }
  }

  frames.push({
    highlightLine: 13,
    pointers: {},
    cellStates: new Array(n).fill("visited"),
    variables: { triplets: tripletsLabel(res) },
    caption: `Done. ${res.length} unique triplet${res.length === 1 ? "" : "s"}: ${tripletsLabel(res)}.`,
    eli5Caption: `Every anchor checked. The triplets that sum to zero: ${tripletsLabel(res)}.`,
    view: { arr: [...arr] } satisfies ArrayMutView,
  });

  return { frames, res };
}
