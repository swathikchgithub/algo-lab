import type { CellState, Frame } from "@/lib/types";

// Pure frame generator for String to Integer (atoi). Single char row scanned as
// a small state machine: skip leading spaces → optional sign → digits → clamp to
// the 32-bit signed range. The character row is carried in `view.chars`. No React.
//
// `myAtoiCode` is 1-indexed by `Frame.highlightLine`.

const INT_MIN = -(2 ** 31); // -2147483648
const INT_MAX = 2 ** 31 - 1; // 2147483647

export const myAtoiCode = [
  "i, n = 0, len(s)", // 1
  "while i < n and s[i] == ' ': i += 1      # 1) skip spaces", // 2
  "sign = 1", // 3
  "if i < n and s[i] in '+-':               # 2) sign", // 4
  "    sign = -1 if s[i] == '-' else 1; i += 1", // 5
  "num = 0", // 6
  "while i < n and s[i].isdigit():          # 3) digits", // 7
  "    num = num * 10 + int(s[i]); i += 1", // 8
  "num *= sign", // 9
  "return max(-2**31, min(2**31 - 1, num))  # 4) clamp", // 10
];

export interface MyAtoiResult {
  frames: Frame[];
  /** The parsed, sign-applied, clamped integer. */
  value: number;
}

function isDigit(ch: string): boolean {
  return ch >= "0" && ch <= "9";
}

/** Cursor i is amber, already-consumed chars are blue, the rest are default. */
function states(chars: string[], i: number): CellState[] {
  return chars.map((_, k) => (k === i ? "current" : k < i ? "active" : "default"));
}

/**
 * Generate frames for atoi. Processes in fixed order — whitespace, sign, digits
 * — accumulating digits as num*10 + d, then applies the sign and clamps to
 * [-2^31, 2^31 - 1].
 *
 * Time:  O(n) — single scan.
 * Space: O(n) — one frame per step.
 */
export function myAtoiFrames(s: string): MyAtoiResult {
  const chars = [...s];
  const n = chars.length;
  const frames: Frame[] = [];

  let i = 0;
  let sign = 1;
  let num = 0;

  frames.push({
    highlightLine: 1,
    pointers: { i },
    cellStates: states(chars, i),
    variables: { i, n, sign, num },
    caption: `Parse in fixed order: skip spaces, read a sign, then digits.`,
    eli5Caption: `Read the number slowly: ignore front spaces, note a +/−, then collect digits.`,
    view: { chars: [...chars] },
  });

  // 1) Skip leading spaces.
  while (i < n && chars[i] === " ") {
    frames.push({
      highlightLine: 2,
      pointers: { i },
      cellStates: states(chars, i),
      variables: { i, sign, num },
      caption: `s[${i}] is a space → skip it.`,
      eli5Caption: `Blank space at the front — ignore it and move on.`,
      view: { chars: [...chars] },
    });
    i += 1;
  }

  // 2) Optional sign.
  if (i < n && (chars[i] === "+" || chars[i] === "-")) {
    sign = chars[i] === "-" ? -1 : 1;
    frames.push({
      highlightLine: 5,
      pointers: { i },
      cellStates: states(chars, i),
      variables: { i, sign, num },
      caption: `s[${i}]='${chars[i]}' → sign = ${sign}.`,
      eli5Caption: `A '${chars[i]}' sign — remember the number is ${sign < 0 ? "negative" : "positive"}.`,
      view: { chars: [...chars] },
    });
    i += 1;
  } else {
    frames.push({
      highlightLine: 4,
      pointers: { i },
      cellStates: states(chars, i),
      variables: { i, sign, num },
      caption: `No leading +/- → sign stays +1.`,
      eli5Caption: `No sign in front, so it's a positive number.`,
      view: { chars: [...chars] },
    });
  }

  // 3) Read digits.
  while (i < n && isDigit(chars[i])) {
    num = num * 10 + Number(chars[i]);
    frames.push({
      highlightLine: 8,
      pointers: { i },
      cellStates: states(chars, i),
      variables: { i, sign, num },
      caption: `digit '${chars[i]}' → num = num·10 + ${chars[i]} = ${num}.`,
      eli5Caption: `Another digit '${chars[i]}' — shift the running number and add it: ${num}.`,
      view: { chars: [...chars] },
    });
    i += 1;
  }

  // 4) Apply sign + clamp.
  const signed = num * sign;
  const value = Math.max(INT_MIN, Math.min(INT_MAX, signed));
  const clamped = value !== signed;
  frames.push({
    highlightLine: 10,
    pointers: {},
    cellStates: chars.map((_, k) => (k < i ? "active" : "visited")),
    variables: { sign, num, signed, result: value },
    caption: clamped
      ? `${signed} is outside [${INT_MIN}, ${INT_MAX}] → clamp to ${value}.`
      : `Apply sign → ${signed}. Within range, so the answer is ${value}.`,
    eli5Caption: clamped
      ? `That's past the meter's limit — peg it at ${value}.`
      : `Apply the sign and we're done: ${value}.`,
    view: { chars: [...chars] },
  });

  return { frames, value };
}
