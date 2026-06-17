import type { CellState, Frame } from "@/lib/types";

// Pure frame generator for Merge Two Sorted Lists. Two pointers walk the input
// lists, repeatedly taking the smaller head into the merged result. Three rows
// (list1, list2, merged) carried in `view`. No React. The code panel shows the
// linked-list solution; visually we splice values into the result.

export const mergeListsCode = [
  "dummy = ListNode(); tail = dummy", // 1
  "while list1 and list2:", // 2
  "    if list1.val <= list2.val:", // 3
  "        tail.next = list1; list1 = list1.next", // 4
  "    else:", // 5
  "        tail.next = list2; list2 = list2.next", // 6
  "    tail = tail.next", // 7
  "tail.next = list1 or list2        # leftover tail", // 8
  "return dummy.next", // 9
];

export type MergeView = {
  list1: number[];
  list1States: CellState[];
  list2: number[];
  list2States: CellState[];
  merged: number[];
  mergedStates: CellState[];
};

export interface MergeListsResult {
  frames: Frame[];
  result: number[];
}

function consumeStates(len: number, ptr: number): CellState[] {
  return Array.from({ length: len }, (_, k) => (k === ptr ? "current" : k < ptr ? "visited" : "default"));
}

function mergedStates(len: number): CellState[] {
  return Array.from({ length: len }, (_, k) => (k === len - 1 ? "current" : "active"));
}

/**
 * Generate frames for Merge Two Sorted Lists.
 * Time O(n + m) · Space O(n + m).
 */
export function mergeListsFrames(list1: number[], list2: number[]): MergeListsResult {
  const frames: Frame[] = [];
  const merged: number[] = [];
  let i = 0;
  let j = 0;

  const snap = (): MergeView => ({
    list1,
    list1States: consumeStates(list1.length, i),
    list2,
    list2States: consumeStates(list2.length, j),
    merged: [...merged],
    mergedStates: mergedStates(merged.length),
  });

  frames.push({
    highlightLine: 1,
    pointers: {},
    cellStates: [],
    variables: { merged: "[]" },
    caption: `Walk both lists, always taking the smaller head into the merged result.`,
    eli5Caption: `Two sorted lines; repeatedly take whichever front item is smaller.`,
    view: snap(),
  });

  while (i < list1.length && j < list2.length) {
    const takeLeft = list1[i] <= list2[j];
    const a = list1[i];
    const b = list2[j];
    merged.push(takeLeft ? a : b);
    frames.push({
      highlightLine: takeLeft ? 4 : 6,
      pointers: {},
      cellStates: [],
      variables: { list1: a, list2: b, merged: `[${merged.join(",")}]` },
      caption: takeLeft
        ? `${a} ≤ ${b} → take ${a} from list1.`
        : `${a} > ${b} → take ${b} from list2.`,
      eli5Caption: `Smaller head is ${takeLeft ? a : b} — append it and advance that list.`,
      view: snap(),
    });
    if (takeLeft) i += 1;
    else j += 1;
  }

  if (i < list1.length || j < list2.length) {
    while (i < list1.length) merged.push(list1[i++]);
    while (j < list2.length) merged.push(list2[j++]);
    frames.push({
      highlightLine: 8,
      pointers: {},
      cellStates: [],
      variables: { merged: `[${merged.join(",")}]` },
      caption: `One list is empty — attach the rest of the other. Merged: [${merged.join(", ")}].`,
      eli5Caption: `One line ran out, so the remaining sorted tail just gets appended.`,
      view: snap(),
    });
  }

  frames.push({
    highlightLine: 9,
    pointers: {},
    cellStates: [],
    variables: { result: `[${merged.join(",")}]` },
    caption: `Merged list: [${merged.join(", ")}].`,
    eli5Caption: `Both lines merged in order: [${merged.join(", ")}].`,
    view: snap(),
  });

  return { frames, result: merged };
}
