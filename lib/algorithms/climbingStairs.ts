import type { CellState, Frame } from "@/lib/types";

// Pure frame generator for Climbing Stairs. Builds a dp row where dp[i] = ways
// to reach step i = dp[i-1] + dp[i-2]. The row is carried in `view.dp`. No React.
//
// The code panel shows the dp-array form (a faithful equivalent of the rolling
// a,b solution) so the growing row maps line-for-line.

export const climbingStairsCode = [
  "dp = [1, 1] + [0] * (n - 1)     # ways to reach steps 0, 1", // 1
  "for i in range(2, n + 1):", // 2
  "    dp[i] = dp[i-1] + dp[i-2]    # from one or two steps below", // 3
  "return dp[n]", // 4
];

export type StairsView = { dp: number[]; dpStates: CellState[] };

export interface ClimbingStairsResult {
  frames: Frame[];
  /** Number of distinct ways to climb to step n. */
  result: number;
}

/**
 * Generate frames for Climbing Stairs. Each step's count is the sum of the two
 * below it (Fibonacci). dp fills left to right.
 * Time O(n) · Space O(n).
 */
export function climbingStairsFrames(n: number): ClimbingStairsResult {
  const steps = Math.max(1, Math.floor(n));
  const size = steps + 1;
  const dp = new Array(size).fill(0);
  dp[0] = 1;
  if (size > 1) dp[1] = 1;
  const filled = dp.map((_, k) => k <= 1);
  const frames: Frame[] = [];

  const states = (i: number): CellState[] =>
    dp.map((_, k) =>
      k === i ? "current" : k === i - 1 || k === i - 2 ? "active" : filled[k] ? "active" : "default",
    );

  frames.push({
    highlightLine: 1,
    pointers: {},
    cellStates: [],
    variables: { n: steps, dp: `[${dp.map((v, k) => (filled[k] ? v : "·")).join(",")}]` },
    caption: `Ways to reach step 0 and step 1 are both 1. Fill the rest.`,
    eli5Caption: `The number of ways to reach a step is the ways to reach the two steps below it.`,
    view: { dp: [...dp], dpStates: states(1) },
  });

  for (let i = 2; i <= steps; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
    filled[i] = true;
    frames.push({
      highlightLine: 3,
      pointers: {},
      cellStates: [],
      variables: { i, "dp[i-1]": dp[i - 1], "dp[i-2]": dp[i - 2], "dp[i]": dp[i] },
      caption: `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}.`,
      eli5Caption: `Reach step ${i} from step ${i - 1} (${dp[i - 1]} ways) or step ${i - 2} (${dp[i - 2]} ways) → ${dp[i]}.`,
      view: { dp: [...dp], dpStates: states(i) },
    });
  }

  frames.push({
    highlightLine: 4,
    pointers: {},
    cellStates: [],
    variables: { result: dp[steps] },
    caption: `Answer = dp[${steps}] = ${dp[steps]} ways.`,
    eli5Caption: `There are ${dp[steps]} different ways to climb ${steps} stairs.`,
    view: { dp: [...dp], dpStates: dp.map(() => "active") },
  });

  return { frames, result: dp[steps] };
}
