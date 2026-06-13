import type { CellState, Frame } from "@/lib/types";

// Pure frame generator for the Next Greater Element via a decreasing
// monotonic stack of indices. Given an array, it returns the sequence of
// animation frames the <Stepper> plays plus the computed answer. No React.
//
// The `monotonicStackCode` lines below are 1-indexed by `Frame.highlightLine`
// (line 1 is the first entry). Keep them in sync with the frames this
// function emits.

export const monotonicStackCode = [
  "for i in range(n):", // 1
  "    while stack and arr[stack[-1]] < arr[i]:", // 2
  "        j = stack.pop()", // 3
  "        next_greater[j] = arr[i]", // 4
  "    # stop popping once the top is >= arr[i]", // 5
  "    stack.append(i)", // 6
  "    # i waits for its next-greater element", // 7
  "# leftover indices have no greater element -> -1", // 8
];

/** Substrate view payload for the stack panel: stack values, bottom→top. */
export interface MonotonicStackView extends Record<string, unknown> {
  stack: number[];
}

export interface MonotonicStackResult {
  frames: Frame[];
  /** nextGreater[i] = next greater element to the right of i, or -1. */
  nextGreater: number[];
}

/**
 * Build the cellStates array.
 *   - `i`               → "current" (amber)
 *   - indices in stack  → "active"  (blue, still waiting for a greater value)
 *   - resolved indices  → "visited" (dimmed, popped + got their answer)
 *   - not yet reached   → "default"
 */
function buildCellStates(
  n: number,
  i: number,
  stack: number[],
  resolved: boolean[],
): CellState[] {
  const inStack = new Set(stack);
  const states: CellState[] = [];
  for (let k = 0; k < n; k++) {
    if (k === i) states.push("current");
    else if (inStack.has(k)) states.push("active");
    else if (resolved[k]) states.push("visited");
    else states.push("default");
  }
  return states;
}

/** Map a stack of indices to the values it holds, bottom→top. */
function stackValues(arr: number[], stack: number[]): number[] {
  return stack.map((idx) => arr[idx]);
}

const ELI5 =
  "A stack of pancakes — toss smaller pancakes off before adding a bigger one.";

/**
 * Generate frames for Next Greater Element using a decreasing monotonic stack.
 *
 * Time:  O(n) — each index is pushed and popped at most once.
 * Space: O(n) — the stack plus one frame per push/pop step.
 */
export function monotonicStackFrames(arr: number[]): MonotonicStackResult {
  const n = arr.length;
  const frames: Frame[] = [];
  const nextGreater: number[] = new Array(n).fill(-1);
  const resolved: boolean[] = new Array(n).fill(false);
  const stack: number[] = []; // indices, values strictly decreasing bottom→top

  // Frame 0: initial state, nothing visited yet.
  frames.push({
    highlightLine: 1,
    pointers: {},
    cellStates: buildCellStates(n, -1, stack, resolved),
    view: { stack: [] } satisfies MonotonicStackView,
    variables: { i: -1, "arr[i]": "—" },
    caption: `Start with an empty stack. Scan left → right looking for each element's next greater neighbour.`,
    eli5Caption: ELI5,
  });

  for (let i = 0; i < n; i++) {
    const val = arr[i];

    // Pop every smaller element on top of the stack; each gets its answer.
    while (stack.length > 0 && arr[stack[stack.length - 1]] < val) {
      const j = stack.pop() as number;
      nextGreater[j] = val;
      resolved[j] = true;
      frames.push({
        highlightLine: 4,
        pointers: { i },
        cellStates: buildCellStates(n, i, stack, resolved),
        view: { stack: stackValues(arr, stack) } satisfies MonotonicStackView,
        variables: { i, "arr[i]": val },
        caption: `arr[i]=${val} > stack top ${arr[j]} ✓ → pop, nextGreater[${j}]=${val}.`,
        eli5Caption: ELI5,
      });
    }

    // Push the current index; it now sits on top waiting for a greater value.
    const topBefore =
      stack.length > 0 ? arr[stack[stack.length - 1]] : undefined;
    stack.push(i);
    const cmp =
      topBefore === undefined
        ? `stack empty → push ${val}`
        : `arr[i]=${val} < stack top ${topBefore} ✗ → push ${val}`;
    frames.push({
      highlightLine: 6,
      pointers: { i },
      cellStates: buildCellStates(n, i, stack, resolved),
      view: { stack: stackValues(arr, stack) } satisfies MonotonicStackView,
      variables: { i, "arr[i]": val },
      caption: cmp,
      eli5Caption: ELI5,
    });
  }

  // Whatever remains in the stack never found a greater element → stays -1.
  frames.push({
    highlightLine: 8,
    pointers: {},
    cellStates: buildCellStates(n, -1, stack, resolved),
    view: { stack: stackValues(arr, stack) } satisfies MonotonicStackView,
    variables: { i: n, "arr[i]": "—" },
    caption:
      stack.length > 0
        ? `Stack leftovers [${stackValues(arr, stack).join(", ")}] have no greater element → -1.`
        : `Done — every element found its next greater neighbour.`,
    eli5Caption: ELI5,
  });

  return { frames, nextGreater };
}
