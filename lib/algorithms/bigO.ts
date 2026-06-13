import type { CellState, Frame } from "@/lib/types";
import type { ChartView } from "@/lib/algorithms/views";

// Pure frame generator for the Big-O explainer visualizer. For a chosen
// complexity class it walks n = 1..maxN and emits one frame per n, plotting the
// operation count as a normalized point on an ops-vs-input-size chart. No React.
//
// The `bigOCode` lines below are 1-indexed by `Frame.highlightLine`.

export type BigOCurve = "O(1)" | "O(log n)" | "O(n)" | "O(n^2)";

export const bigOCode = [
  "# O(1)     -> one step, no matter how big n gets", // 1
  "# O(log n) -> halve the problem each step", // 2
  "# O(n)     -> one step per element", // 3
  "# O(n^2)   -> a step for every pair of elements", // 4
];

/** Highlighted code line per curve. */
const CURVE_LINE: Record<BigOCurve, number> = {
  "O(1)": 1,
  "O(log n)": 2,
  "O(n)": 3,
  "O(n^2)": 4,
};

/** Pretty label for the chart (superscript for the quadratic curve). */
const CURVE_LABEL: Record<BigOCurve, string> = {
  "O(1)": "O(1)",
  "O(log n)": "O(log n)",
  "O(n)": "O(n)",
  "O(n^2)": "O(n²)",
};

const ELI5 =
  "O(1) = grabbing a book when you know the shelf; O(n) = checking every shelf; O(log n) = the sorted library kills half the shelves per question.";

/** Operation count for a curve at input size n. */
function ops(curve: BigOCurve, n: number): number {
  switch (curve) {
    case "O(1)":
      return 1;
    case "O(log n)":
      return Math.ceil(Math.log2(n + 1));
    case "O(n)":
      return n;
    case "O(n^2)":
      return n * n;
  }
}

/** Input row: indices < n active, index n-1 current, the rest default. */
function inputStates(maxN: number, n: number): CellState[] {
  const states: CellState[] = [];
  for (let i = 0; i < maxN; i++) {
    if (i === n - 1) states.push("current");
    else if (i < n) states.push("active");
    else states.push("default");
  }
  return states;
}

export interface BigOResult {
  frames: Frame[];
}

/**
 * Generate the chart frames for a complexity class over n = 1..maxN.
 *
 * Time:  O(maxN) — one frame per input size; points accumulate incrementally.
 * Space: O(maxN^2) — total points stored across frames (frame k holds k points).
 */
export function bigOFrames(curve: BigOCurve, maxN: number): BigOResult {
  const frames: Frame[] = [];
  const maxOps = ops(curve, maxN);
  const label = CURVE_LABEL[curve];
  const points: Array<{ x: number; y: number }> = [];

  for (let n = 1; n <= maxN; n++) {
    const operations = ops(curve, n);
    points.push({ x: n / maxN, y: operations / maxOps });

    const view: ChartView = {
      curve: label,
      n,
      maxN,
      points: points.slice(), // snapshot of points drawn so far
      ops: operations,
    };

    frames.push({
      highlightLine: CURVE_LINE[curve],
      cellStates: inputStates(maxN, n),
      view: view as unknown as Record<string, unknown>,
      variables: { n, operations },
      caption: `n = ${n} → ${label} performs ${operations} operation${
        operations === 1 ? "" : "s"
      }.`,
      eli5Caption: ELI5,
    });
  }

  return { frames };
}
