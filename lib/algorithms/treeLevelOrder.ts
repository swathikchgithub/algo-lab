import type { CellState, Frame } from "@/lib/types";
import {
  buildTree,
  nodeStates,
  parseLevelOrder,
  rowStates,
  type BinTreeView,
  type TreeNodeT,
} from "./binaryTree";

// Pure frame generator for Average of Levels (BFS). A queue holds the current
// frontier; each level is summed and averaged. The queue is the "queue" row and
// the per-level averages accumulate in the "averages" row. No React.

export const averageOfLevelsCode = [
  "res, q = [], deque([root])", // 1
  "while q:", // 2
  "    n = len(q)", // 3
  "    total = 0", // 4
  "    for _ in range(n):", // 5
  "        node = q.popleft()", // 6
  "        total += node.val", // 7
  "        if node.left:  q.append(node.left)", // 8
  "        if node.right: q.append(node.right)", // 9
  "    res.append(total / n)        # level average", // 10
  "return res", // 11
];

export interface AverageOfLevelsResult {
  frames: Frame[];
  result: number[];
}

export function averageOfLevelsFrames(input: string): AverageOfLevelsResult {
  const { root, slots } = buildTree(parseLevelOrder(input));
  const frames: Frame[] = [];
  const res: number[] = [];
  const visited = new Set<number>();

  if (!root) {
    frames.push({
      highlightLine: 11,
      pointers: {},
      cellStates: [],
      variables: { result: "[]" },
      caption: `Empty tree → [].`,
      eli5Caption: `No levels to average.`,
      view: { slots: [], states: [], aux: [], auxStates: [], output: [], outputStates: [] },
    });
    return { frames, result: [] };
  }

  let queue: TreeNodeT[] = [root];

  const snap = (currentCi: number | null): BinTreeView => {
    const qCis = new Set(queue.map((n) => n.ci));
    const states = nodeStates(slots, (ci): CellState =>
      ci === currentCi ? "current" : visited.has(ci) ? "visited" : qCis.has(ci) ? "active" : "default",
    );
    return {
      slots,
      states,
      aux: queue.map((n) => n.val),
      auxStates: rowStates(queue.length, false),
      output: [...res],
      outputStates: rowStates(res.length),
    };
  };

  frames.push({
    highlightLine: 1,
    pointers: {},
    cellStates: [],
    variables: { queue: `[${root.val}]` },
    caption: `BFS: process the tree level by level, averaging each level.`,
    eli5Caption: `Sweep across each row of the tree and average the numbers on it.`,
    view: snap(null),
  });

  let level = 0;
  while (queue.length > 0) {
    const n = queue.length;
    let total = 0;
    const next: TreeNodeT[] = [];
    for (let k = 0; k < n; k++) {
      const node = queue[k];
      total += node.val;
      if (node.left) next.push(node.left);
      if (node.right) next.push(node.right);
      frames.push({
        highlightLine: 7,
        pointers: {},
        cellStates: [],
        variables: { level, node: node.val, total, queue: `[${queue.slice(k + 1).map((x) => x.val).join(",")}]` },
        caption: `Level ${level}: add ${node.val} → running total ${total}.`,
        eli5Caption: `Add ${node.val} from this row (total ${total}).`,
        view: snap(node.ci),
      });
      visited.add(node.ci);
    }
    const avg = total / n;
    res.push(avg);
    queue = next;
    frames.push({
      highlightLine: 10,
      pointers: {},
      cellStates: [],
      variables: { level, total, count: n, average: avg, res: `[${res.join(",")}]` },
      caption: `Level ${level} average = ${total} / ${n} = ${avg}.`,
      eli5Caption: `That row averages to ${avg}.`,
      view: snap(null),
    });
    level += 1;
  }

  frames.push({
    highlightLine: 11,
    pointers: {},
    cellStates: [],
    variables: { result: `[${res.join(", ")}]` },
    caption: `Per-level averages: [${res.join(", ")}].`,
    eli5Caption: `The average of each row, top to bottom: [${res.join(", ")}].`,
    view: snap(null),
  });

  return { frames, result: res };
}
