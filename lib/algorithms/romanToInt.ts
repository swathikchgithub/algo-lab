import type { CellState, Frame } from "@/lib/types";

// Pure frame generator for Roman to Integer. Single char row: walk the numeral
// left to right, adding each symbol's value — but subtracting when a smaller
// symbol sits just before a larger one (IV, IX, XC, …). The character row is
// carried in `view.chars`. No React.
//
// `romanToIntCode` is 1-indexed by `Frame.highlightLine`.

export const romanToIntCode = [
  "vals = {'I':1,'V':5,'X':10,'L':50,'C':100,'D':500,'M':1000}", // 1
  "total = 0", // 2
  "for i in range(len(s)):", // 3
  "    if i+1 < len(s) and vals[s[i]] < vals[s[i+1]]:", // 4
  "        total -= vals[s[i]]   # discount: smaller before larger", // 5
  "    else:", // 6
  "        total += vals[s[i]]", // 7
  "return total", // 8
];

const VALS: Record<string, number> = {
  I: 1,
  V: 5,
  X: 10,
  L: 50,
  C: 100,
  D: 500,
  M: 1000,
};

export interface RomanToIntResult {
  frames: Frame[];
  /** The decoded integer value. */
  total: number;
}

/**
 * Generate frames for Roman to Integer. Each symbol's value is added, except
 * when it is smaller than the symbol immediately to its right — then it's a
 * subtractive pair (e.g. IV = 5 − 1) and the value is subtracted instead.
 *
 * Time:  O(n) — single left-to-right scan.
 * Space: O(n) — one frame per symbol.
 */
export function romanToIntFrames(s: string): RomanToIntResult {
  const chars = [...s.toUpperCase()];
  const n = chars.length;
  const frames: Frame[] = [];

  frames.push({
    highlightLine: 2,
    pointers: {},
    cellStates: chars.map(() => "default"),
    variables: { total: 0 },
    caption: `Read symbols left to right, adding values — with a discount rule for subtractive pairs.`,
    eli5Caption: `Add up the symbols. But a small symbol just before a bigger one is a discount — subtract it.`,
    view: { chars: [...chars] },
  });

  let total = 0;
  for (let i = 0; i < n; i++) {
    const cur = VALS[chars[i]] ?? 0;
    const nextVal = i + 1 < n ? VALS[chars[i + 1]] ?? 0 : 0;
    const subtract = i + 1 < n && cur < nextVal;

    const cellStates: CellState[] = chars.map((_, k) => {
      if (k === i) return "current";
      if (subtract && k === i + 1) return "current"; // show the discount pair
      return k < i ? "active" : "default";
    });

    if (subtract) {
      total -= cur;
      frames.push({
        highlightLine: 5,
        pointers: { i },
        cellStates,
        variables: { i, symbol: chars[i], value: cur, total },
        caption: `vals['${chars[i]}']=${cur} < vals['${chars[i + 1]}']=${nextVal} → subtract ${cur} (total ${total}).`,
        eli5Caption: `'${chars[i]}' (${cur}) sits before the bigger '${chars[i + 1]}' (${nextVal}) — it's a discount, so subtract.`,
        view: { chars: [...chars] },
      });
    } else {
      total += cur;
      frames.push({
        highlightLine: 7,
        pointers: { i },
        cellStates,
        variables: { i, symbol: chars[i], value: cur, total },
        caption: `add vals['${chars[i]}']=${cur} → total ${total}.`,
        eli5Caption: `'${chars[i]}' is worth ${cur}; add it (total ${total}).`,
        view: { chars: [...chars] },
      });
    }
  }

  frames.push({
    highlightLine: 8,
    pointers: {},
    cellStates: chars.map(() => "active"),
    variables: { total, result: total },
    caption: `Done. The numeral equals ${total}.`,
    eli5Caption: `Add the discounts and the rest together: ${total}.`,
    view: { chars: [...chars] },
  });

  return { frames, total };
}
