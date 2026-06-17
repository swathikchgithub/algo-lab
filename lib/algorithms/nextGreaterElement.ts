import type { CellState, Frame } from "@/lib/types";

// Pure frame generator for Next Greater Element I. Phase 1 scans nums2 with a
// decreasing monotonic stack, recording each value's next-greater into a map.
// Phase 2 looks up each nums1 value. Four rows carried in `view`. No React.

export const nextGreaterElementCode = [
  "nxt = {}                         # value -> next greater", // 1
  "stack = []", // 2
  "for x in nums2:", // 3
  "    while stack and stack[-1] < x:", // 4
  "        nxt[stack.pop()] = x", // 5
  "    stack.append(x)", // 6
  "return [nxt.get(x, -1) for x in nums1]", // 7
];

export type NgeView = {
  nums2: number[];
  nums2States: CellState[];
  stack: number[];
  stackStates: CellState[];
  nums1: number[];
  nums1States: CellState[];
  ans: (number | string)[];
  ansStates: CellState[];
};

export interface NgeResult {
  frames: Frame[];
  result: number[];
}

/**
 * Generate frames for Next Greater Element I.
 * Time O(n + m) · Space O(n).
 */
export function nextGreaterElementFrames(nums1: number[], nums2: number[]): NgeResult {
  const frames: Frame[] = [];
  const nxt = new Map<number, number>();
  const stack: number[] = [];

  const m = nums2.length;
  const k = nums1.length;
  const nxtLabel = () => (nxt.size ? [...nxt.entries()].map(([a, b]) => `${a}→${b}`).join(" ") : "{}");

  // Phase 1 view: nums1/ans are inactive (dimmed) placeholders.
  const phase1 = (cur2: number, justResolved: number | null): NgeView => ({
    nums2,
    nums2States: nums2.map((_, i) => (i === cur2 ? "current" : i < cur2 ? "visited" : "default")),
    stack: [...stack],
    stackStates: stack.map((v, i) => (v === justResolved ? "current" : i === stack.length - 1 ? "current" : "active")),
    nums1,
    nums1States: nums1.map(() => "visited"),
    ans: nums1.map(() => "·"),
    ansStates: nums1.map(() => "default"),
  });

  frames.push({
    highlightLine: 2,
    pointers: {},
    cellStates: [],
    variables: { stack: "[]", nxt: "{}" },
    caption: `Phase 1: scan nums2 with a decreasing stack, recording next-greater values.`,
    eli5Caption: `Walk nums2; when a bigger number appears, it's the "next greater" for smaller ones waiting on the stack.`,
    view: phase1(-1, null),
  });

  for (let i = 0; i < m; i++) {
    const x = nums2[i];
    while (stack.length && stack[stack.length - 1] < x) {
      const popped = stack.pop()!;
      nxt.set(popped, x);
      frames.push({
        highlightLine: 5,
        pointers: {},
        cellStates: [],
        variables: { x, popped, nxt: nxtLabel(), stack: `[${stack.join(",")}]` },
        caption: `${x} > ${popped} on top → next greater of ${popped} is ${x}. Pop it.`,
        eli5Caption: `${x} is the first bigger number after ${popped}, so record ${popped}→${x}.`,
        view: phase1(i, popped),
      });
    }
    stack.push(x);
    frames.push({
      highlightLine: 6,
      pointers: {},
      cellStates: [],
      variables: { x, nxt: nxtLabel(), stack: `[${stack.join(",")}]` },
      caption: `Push ${x} — it waits for a bigger number to its right.`,
      eli5Caption: `Nothing bigger yet for ${x}; it joins the stack to wait.`,
      view: phase1(i, null),
    });
  }

  // Phase 2: look up each nums1 value.
  const ans: number[] = [];
  const phase2 = (curIdx: number): NgeView => ({
    nums2,
    nums2States: nums2.map(() => "visited"),
    stack: [...stack],
    stackStates: stack.map(() => "visited"),
    nums1,
    nums1States: nums1.map((_, i) => (i === curIdx ? "current" : i < curIdx ? "visited" : "default")),
    ans: nums1.map((_, i) => (i < ans.length ? ans[i] : "·")),
    ansStates: nums1.map((_, i) => (i === curIdx ? "current" : i < ans.length ? "active" : "default")),
  });

  for (let i = 0; i < k; i++) {
    const v = nums1[i];
    const g = nxt.has(v) ? nxt.get(v)! : -1;
    ans.push(g);
    frames.push({
      highlightLine: 7,
      pointers: {},
      cellStates: [],
      variables: { "nums1[i]": v, "nxt.get": g, nxt: nxtLabel() },
      caption: `Phase 2: nxt.get(${v}, -1) = ${g}.`,
      eli5Caption: g === -1 ? `${v} had nothing bigger to its right → -1.` : `${v}'s next greater is ${g}.`,
      view: phase2(i),
    });
  }

  frames.push({
    highlightLine: 7,
    pointers: {},
    cellStates: [],
    variables: { result: `[${ans.join(",")}]` },
    caption: `Answer for nums1: [${ans.join(", ")}].`,
    eli5Caption: `Next-greater for each nums1 value: [${ans.join(", ")}].`,
    view: phase2(k),
  });

  return { frames, result: ans };
}
