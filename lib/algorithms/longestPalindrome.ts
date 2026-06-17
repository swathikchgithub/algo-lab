import type { CellState, Frame } from "@/lib/types";
import type { CharsView } from "./firstUniqueChar";

// Pure frame generator for Longest Palindrome (by rearrangement). Tally letter
// frequencies, then take every complete pair; one leftover odd letter may sit
// in the center. The character row is carried in `view.chars`. No React.
//
// `longestPalindromeCode` is 1-indexed by `Frame.highlightLine`.

export const longestPalindromeCode = [
  "counts = Counter(s)", // 1
  "length = 0", // 2
  "has_odd = False", // 3
  "for c in counts.values():", // 4
  "    length += c - (c % 2)        # take all complete pairs", // 5
  "    if c % 2 == 1: has_odd = True", // 6
  "return length + 1 if has_odd else length   # one odd center", // 7
];

export interface LongestPalindromeResult {
  frames: Frame[];
  /** Length of the longest palindrome buildable from s's letters. */
  length: number;
}

/**
 * Generate frames for Longest Palindrome. Pass 1 tallies frequencies; pass 2
 * adds each letter's complete pairs (c − c%2). If any letter has an odd count,
 * one extra center character is allowed (+1).
 *
 * Time:  O(n) — a tally pass plus a pass over distinct letters.
 * Space: O(1) — bounded by the alphabet (plus one frame per step).
 */
export function longestPalindromeFrames(s: string): LongestPalindromeResult {
  const chars = [...s];
  const n = chars.length;
  const frames: Frame[] = [];
  const counts = new Map<string, number>();
  const order: string[] = [];

  for (const ch of chars) {
    if (!counts.has(ch)) order.push(ch);
    counts.set(ch, (counts.get(ch) ?? 0) + 1);
  }

  const countsLabel = () => order.map((c) => `${c}:${counts.get(c)}`).join(" ");

  // Highlight every cell holding the given character.
  const highlightChar = (ch: string | null): CellState[] =>
    chars.map((c) => (ch !== null && c === ch ? "current" : "default"));

  frames.push({
    highlightLine: 1,
    pointers: {},
    cellStates: chars.map(() => "default"),
    variables: { counts: countsLabel() },
    caption: `Tally each letter's frequency: ${countsLabel()}.`,
    eli5Caption: `Count how many of each letter you have — palindromes are built from matching pairs.`,
    view: { chars: [...chars] } satisfies CharsView,
  });

  let length = 0;
  let hasOdd = false;
  for (const ch of order) {
    const c = counts.get(ch)!;
    const pairs = c - (c % 2);
    length += pairs;
    const odd = c % 2 === 1;
    if (odd) hasOdd = true;
    frames.push({
      highlightLine: odd ? 6 : 5,
      pointers: {},
      cellStates: highlightChar(ch),
      variables: { ch, count: c, pairs, length, has_odd: String(hasOdd) },
      caption: odd
        ? `'${ch}' ×${c} → use ${pairs} (${pairs / 2} pair${pairs === 2 ? "" : "s"}); odd count, a '${ch}' could be the center.`
        : `'${ch}' ×${c} → use all ${pairs} (${pairs / 2} pair${pairs === 2 ? "" : "s"}). length = ${length}.`,
      eli5Caption: odd
        ? `'${ch}' appears ${c} times — use ${pairs} on the sides; the leftover one can sit in the middle.`
        : `'${ch}' appears ${c} times — all of them pair up. Running length ${length}.`,
      view: { chars: [...chars] } satisfies CharsView,
    });
  }

  length += hasOdd ? 1 : 0;
  frames.push({
    highlightLine: 7,
    pointers: {},
    cellStates: chars.map(() => "active"),
    variables: { length, has_odd: String(hasOdd), result: length },
    caption: hasOdd
      ? `An odd letter exists → add 1 center character. Longest palindrome length = ${length}.`
      : `All counts even → no center. Longest palindrome length = ${length}.`,
    eli5Caption: `The longest palindrome you can build has length ${length}.`,
    view: { chars: [...chars] } satisfies CharsView,
  });

  return { frames, length: n === 0 ? 0 : length };
}
