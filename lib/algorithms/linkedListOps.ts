import type { CellState, Frame } from "@/lib/types";
import { forwardList, type LinkedListView } from "./linkedList";

// Pure frame generators for the single-list questions: reverse (pointer flip),
// middle (slow/fast), and cycle detection (Floyd). The list is carried in
// `view`; flipping pointers or looping back is just mutating `next`. No React.

export const reverseListCode = [
  "prev = None", // 1
  "curr = head", // 2
  "while curr:", // 3
  "    nxt = curr.next      # save the rest", // 4
  "    curr.next = prev     # flip backward", // 5
  "    prev = curr", // 6
  "    curr = nxt", // 7
  "return prev              # new head", // 8
];

export const middleNodeCode = [
  "slow = fast = head", // 1
  "while fast and fast.next:", // 2
  "    slow = slow.next      # one step", // 3
  "    fast = fast.next.next # two steps", // 4
  "return slow               # (second) middle", // 5
];

export const hasCycleCode = [
  "slow = fast = head", // 1
  "while fast and fast.next:", // 2
  "    slow = slow.next       # one step", // 3
  "    fast = fast.next.next  # two steps", // 4
  "    if slow is fast: return True", // 5
  "return False", // 6
];

export interface ListResult {
  frames: Frame[];
  result: number[] | boolean;
}

function view(
  vals: number[],
  next: (number | null)[],
  states: CellState[],
  badges: Record<string, number | null>,
): LinkedListView {
  return { vals: [...vals], next: [...next], states: [...states], badges };
}

function emptyFrame(line: number, caption: string, eli5: string, result: number[] | boolean): ListResult {
  return {
    frames: [
      {
        highlightLine: line,
        pointers: {},
        cellStates: [],
        variables: { result: Array.isArray(result) ? `[${result.join(",")}]` : String(result) },
        caption,
        eli5Caption: eli5,
        view: { vals: [], next: [], states: [], badges: {} },
      },
    ],
    result,
  };
}

/** Reverse a singly linked list by flipping each `next` pointer backward. */
export function reverseListFrames(vals: number[]): ListResult {
  const n = vals.length;
  if (n === 0) return emptyFrame(8, "Empty list → new head is None.", "Nothing to reverse.", []);

  const { next } = forwardList(vals);
  const frames: Frame[] = [];
  const processed = new Set<number>();

  const states = (curr: number | null): CellState[] =>
    vals.map((_, i) => (i === curr ? "current" : processed.has(i) ? "active" : "default"));

  let prev: number | null = null;
  let curr: number | null = 0;

  frames.push({
    highlightLine: 2,
    pointers: {},
    cellStates: [],
    variables: { prev: "None", curr: vals[0] },
    caption: `Start: prev = None, curr = head. Flip each arrow to point backward.`,
    eli5Caption: `Walk the list flipping every arrow to point at the node behind it.`,
    view: view(vals, next, states(curr), { prev, curr, nxt: next[0] ?? null }),
  });

  while (curr !== null) {
    const nxt: number | null = next[curr];
    next[curr] = prev; // flip
    processed.add(curr);
    frames.push({
      highlightLine: 5,
      pointers: {},
      cellStates: [],
      variables: { prev: prev === null ? "None" : vals[prev], curr: vals[curr], nxt: nxt === null ? "None" : vals[nxt] },
      caption: `Flip ${vals[curr]}.next → ${prev === null ? "None" : vals[prev]}; advance prev & curr.`,
      eli5Caption: `Point ${vals[curr]} back at ${prev === null ? "nothing" : vals[prev]}, then step forward.`,
      view: view(vals, next, states(curr), { prev, curr, nxt }),
    });
    prev = curr;
    curr = nxt;
  }

  // New head is `prev`; follow flipped links to read the reversed order.
  const result: number[] = [];
  for (let p: number | null = prev; p !== null; p = next[p]) result.push(vals[p]);
  frames.push({
    highlightLine: 8,
    pointers: {},
    cellStates: [],
    variables: { result: `[${result.join(",")}]` },
    caption: `curr is None — reversed. New head = ${vals[prev!]}. Result: [${result.join(", ")}].`,
    eli5Caption: `All arrows flipped; the old tail is the new head: [${result.join(", ")}].`,
    view: view(vals, next, vals.map(() => "active"), { head: prev }),
  });

  return { frames, result };
}

/** Find the middle node with slow/fast pointers. Returns values from middle on. */
export function middleNodeFrames(vals: number[]): ListResult {
  const n = vals.length;
  if (n === 0) return emptyFrame(5, "Empty list → None.", "Nothing to find.", []);

  const { next } = forwardList(vals);
  const frames: Frame[] = [];

  const states = (slow: number, fast: number | null): CellState[] =>
    vals.map((_, i) => (i === slow ? "current" : i === fast ? "active" : "default"));

  let slow = 0;
  let fast: number | null = 0;

  frames.push({
    highlightLine: 1,
    pointers: {},
    cellStates: [],
    variables: { slow: vals[0], fast: vals[0] },
    caption: `slow and fast both start at the head. fast moves twice as quickly.`,
    eli5Caption: `Two runners from the start; the fast one goes double speed.`,
    view: view(vals, next, states(slow, fast), { slow, fast }),
  });

  while (fast !== null && next[fast] !== null) {
    slow = next[slow]!;
    fast = next[next[fast]!];
    frames.push({
      highlightLine: 4,
      pointers: {},
      cellStates: [],
      variables: { slow: vals[slow], fast: fast === null ? "None" : vals[fast] },
      caption: `slow → ${vals[slow]} (one step); fast → ${fast === null ? "None" : vals[fast]} (two steps).`,
      eli5Caption: `Slow steps once to ${vals[slow]}; fast leaps to ${fast === null ? "the end" : vals[fast]}.`,
      view: view(vals, next, states(slow, fast), { slow, fast }),
    });
  }

  const result = vals.slice(slow);
  frames.push({
    highlightLine: 5,
    pointers: {},
    cellStates: [],
    variables: { result: `[${result.join(",")}]` },
    caption: `fast reached the end → slow is the middle: ${vals[slow]}. Return [${result.join(", ")}].`,
    eli5Caption: `When fast hits the end, slow sits at the middle: ${vals[slow]}.`,
    view: view(vals, next, vals.map((_, i) => (i === slow ? "current" : i > slow ? "active" : "visited")), { slow }),
  });

  return { frames, result };
}

/** Detect a cycle with Floyd's tortoise & hare. `pos` is the slot the tail links
 *  back to, or -1 for no cycle. */
export function hasCycleFrames(vals: number[], pos: number): ListResult {
  const n = vals.length;
  if (n === 0) return emptyFrame(6, "Empty list → no cycle.", "Nothing to loop.", false);

  const { next } = forwardList(vals);
  if (pos >= 0 && pos < n) next[n - 1] = pos; // close the loop

  const frames: Frame[] = [];
  const states = (slow: number, fast: number | null): CellState[] =>
    vals.map((_, i) => (i === slow && i === fast ? "current" : i === slow ? "current" : i === fast ? "active" : "default"));

  let slow = 0;
  let fast: number | null = 0;

  frames.push({
    highlightLine: 1,
    pointers: {},
    cellStates: [],
    variables: { slow: vals[0], fast: vals[0] },
    caption: `Floyd's: slow moves one step, fast two. If they ever meet, there's a cycle.`,
    eli5Caption: `A slow and a fast runner on a track — if it loops, the fast one laps the slow one.`,
    view: view(vals, next, states(slow, fast), { slow, fast }),
  });

  let guard = 0;
  while (fast !== null && next[fast] !== null && guard++ < 4 * n + 4) {
    slow = next[slow]!;
    fast = next[next[fast]!];
    const met = slow === fast;
    frames.push({
      highlightLine: met ? 5 : 4,
      pointers: {},
      cellStates: [],
      variables: { slow: vals[slow], fast: fast === null ? "None" : vals[fast!] },
      caption: met
        ? `slow and fast both at ${vals[slow]} → they met. There's a cycle → True.`
        : `slow → ${vals[slow]}; fast → ${fast === null ? "None" : vals[fast!]}.`,
      eli5Caption: met
        ? `The runners landed on the same node — the track loops!`
        : `Slow at ${vals[slow]}, fast at ${fast === null ? "the end" : vals[fast!]}.`,
      view: view(vals, next, states(slow, fast), { slow, fast }),
    });
    if (met) return { frames, result: true };
  }

  frames.push({
    highlightLine: 6,
    pointers: {},
    cellStates: [],
    variables: { result: "False" },
    caption: `fast reached the end without meeting slow → no cycle → False.`,
    eli5Caption: `The fast runner ran off the end, so the track doesn't loop.`,
    view: view(vals, next, vals.map(() => "visited"), {}),
  });
  return { frames, result: false };
}
