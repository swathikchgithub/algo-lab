import type { CellState, Frame } from "@/lib/types";

// Pure frame generator for Daily Temperatures (monotonic decreasing stack of
// indices). Three rows: the temperatures, the stack of waiting-day indices, and
// the answer (days until warmer). Carried in `view`. No React.
//
// `dailyTemperaturesCode` is 1-indexed by `Frame.highlightLine`.

export const dailyTemperaturesCode = [
  "res = [0] * len(temperatures)", // 1
  "stack = []                       # indices awaiting a warmer day", // 2
  "for i, t in enumerate(temperatures):", // 3
  "    while stack and temperatures[stack[-1]] < t:", // 4
  "        j = stack.pop()", // 5
  "        res[j] = i - j           # days waited until warmer", // 6
  "    stack.append(i)", // 7
  "return res", // 8
];

/** Three-row payload for the temps / stack / answer rows. A `type` (not
 *  `interface`) so it's assignable to Frame.view's Record type. */
export type DailyTempView = {
  temps: number[];
  tempStates: CellState[];
  stack: number[];
  stackStates: CellState[];
  res: number[];
  resStates: CellState[];
};

export interface DailyTemperaturesResult {
  frames: Frame[];
  /** answer[i] = days until a warmer temperature, or 0. */
  res: number[];
}

/**
 * Generate frames for Daily Temperatures. Maintain a stack of indices whose
 * warmer day hasn't arrived yet. When today is warmer than the day on top, that
 * day's wait is resolved (i − j); push today and continue.
 *
 * Time:  O(n) — each index is pushed and popped at most once.
 * Space: O(n) — the stack, result, and one frame per step.
 */
export function dailyTemperaturesFrames(temperatures: number[]): DailyTemperaturesResult {
  const temps = [...temperatures];
  const n = temps.length;
  const frames: Frame[] = [];
  const res = new Array(n).fill(0);
  const filled = new Array(n).fill(false);
  const stack: number[] = [];

  const tempStates = (i: number): CellState[] =>
    temps.map((_, k) => {
      if (k === i) return "current";
      if (stack.includes(k)) return "active"; // still waiting
      return k < i ? "visited" : "default";
    });

  const stackStates = (): CellState[] =>
    stack.map((_, k) => (k === stack.length - 1 ? "current" : "active"));

  const resStates = (just: number | null): CellState[] =>
    res.map((_, k) => (k === just ? "current" : filled[k] ? "active" : "default"));

  const snapshot = (i: number, just: number | null): DailyTempView => ({
    temps: [...temps],
    tempStates: tempStates(i),
    stack: [...stack],
    stackStates: stackStates(),
    res: [...res],
    resStates: resStates(just),
  });

  frames.push({
    highlightLine: 2,
    pointers: {},
    cellStates: [],
    variables: { i: 0, stack: "[]" },
    caption: `Empty answer and an empty stack of waiting days.`,
    eli5Caption: `Each day will stand in line until a warmer day shows up.`,
    view: snapshot(-1, null),
  });

  for (let i = 0; i < n; i++) {
    const t = temps[i];
    while (stack.length > 0 && temps[stack[stack.length - 1]] < t) {
      const j = stack.pop()!;
      res[j] = i - j;
      filled[j] = true;
      frames.push({
        highlightLine: 6,
        pointers: { i },
        cellStates: [],
        variables: { i, t, j, "res[j]": res[j], stack: `[${stack.join(",")}]` },
        caption: `temps[${i}]=${t} > temps[${j}]=${temps[j]} → day ${j} waited ${i}−${j} = ${res[j]} days. Pop it.`,
        eli5Caption: `Day ${i} (${t}°) is warmer than waiting day ${j} (${temps[j]}°) — it waited ${res[j]} day(s) and leaves.`,
        view: snapshot(i, j),
      });
    }
    stack.push(i);
    frames.push({
      highlightLine: 7,
      pointers: { i },
      cellStates: [],
      variables: { i, t, stack: `[${stack.join(",")}]` },
      caption: `No warmer day on the stack — push day ${i} to wait.`,
      eli5Caption: `Day ${i} (${t}°) has no warmer day yet, so it joins the line.`,
      view: snapshot(i, null),
    });
  }

  frames.push({
    highlightLine: 8,
    pointers: {},
    cellStates: [],
    variables: { res: `[${res.join(",")}]` },
    caption: `Days still on the stack never warm up → 0. Answer: [${res.join(", ")}].`,
    eli5Caption: `Anyone still waiting never gets a warmer day, so they get 0.`,
    view: snapshot(-1, null),
  });

  return { frames, res };
}
