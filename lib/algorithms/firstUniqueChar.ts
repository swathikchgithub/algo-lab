import type { CellState, Frame } from "@/lib/types";

// Pure frame generator for First Unique Character. Two passes over a string:
// tally each character's frequency, then scan left-to-right for the first with
// count 1. The character row is carried in `view.chars`. No React.
//
// `firstUniqueCharCode` is 1-indexed by `Frame.highlightLine`. It expands
// Python's `Counter(s)` into an explicit tally loop to make pass 1 visible.

export const firstUniqueCharCode = [
  "counts = {}", // 1
  "for ch in s:                  # pass 1: tally", // 2
  "    counts[ch] += 1", // 3
  "for i, ch in enumerate(s):    # pass 2: first unique", // 4
  "    if counts[ch] == 1:", // 5
  "        return i", // 6
  "return -1", // 7
];

/** Character-row payload, carried in `Frame.view`. */
export interface CharsView {
  chars: string[];
}

export interface FirstUniqueCharResult {
  frames: Frame[];
  /** Index of the first unique character, or -1. */
  index: number;
}

/** Render the running counts map as a compact, stable-ordered readout string. */
function countsLabel(counts: Map<string, number>): string {
  return [...counts.entries()].map(([c, n]) => `${c}:${n}`).join(" ");
}

/**
 * Generate frames for First Unique Character. Pass 1 builds a frequency map;
 * pass 2 returns the index of the first character whose count is exactly 1.
 *
 * Time:  O(n) — two linear passes.
 * Space: O(1) — at most 26 distinct lowercase letters (plus one frame per step).
 */
export function firstUniqueCharFrames(s: string): FirstUniqueCharResult {
  const chars = [...s];
  const n = chars.length;
  const frames: Frame[] = [];
  const counts = new Map<string, number>();

  const tallyStates = (cur: number): CellState[] =>
    chars.map((_, k) => (k === cur ? "current" : k < cur ? "active" : "default"));

  frames.push({
    highlightLine: 1,
    pointers: {},
    cellStates: chars.map(() => "default"),
    variables: { counts: "{}" },
    caption: `Pass 1: tally how many times each character appears.`,
    eli5Caption: `First, count how many times each letter shows up in the word.`,
    view: { chars: [...chars] } satisfies CharsView,
  });

  // Pass 1 — tally frequencies.
  for (let i = 0; i < n; i++) {
    const ch = chars[i];
    counts.set(ch, (counts.get(ch) ?? 0) + 1);
    frames.push({
      highlightLine: 3,
      pointers: { i },
      cellStates: tallyStates(i),
      variables: { i, ch, counts: countsLabel(counts) },
      caption: `tally '${ch}' → count is now ${counts.get(ch)}.`,
      eli5Caption: `Saw '${ch}' — bump its tally to ${counts.get(ch)}.`,
      view: { chars: [...chars] } satisfies CharsView,
    });
  }

  // Pass 2 — first character with count 1.
  let index = -1;
  for (let i = 0; i < n; i++) {
    const ch = chars[i];
    const c = counts.get(ch)!;
    const hit = c === 1;
    frames.push({
      highlightLine: hit ? 6 : 5,
      pointers: { i },
      cellStates: chars.map((_, k) => (k === i ? "current" : k < i ? "visited" : "default")),
      variables: { i, ch, "counts[ch]": c, counts: countsLabel(counts) },
      caption: hit
        ? `counts['${ch}'] = 1 ✓ → first unique character is at index ${i}.`
        : `counts['${ch}'] = ${c} ≠ 1 → '${ch}' repeats; keep scanning.`,
      eli5Caption: hit
        ? `'${ch}' shows up exactly once — that's the answer, index ${i}.`
        : `'${ch}' appears ${c} times, not unique — move on.`,
      view: { chars: [...chars] } satisfies CharsView,
    });
    if (hit) {
      index = i;
      break;
    }
  }

  if (index === -1) {
    frames.push({
      highlightLine: 7,
      pointers: {},
      cellStates: chars.map(() => "visited"),
      variables: { counts: countsLabel(counts), result: -1 },
      caption: `No character has count 1 → return -1.`,
      eli5Caption: `Every letter repeats, so there's no unique character. Return -1.`,
      view: { chars: [...chars] } satisfies CharsView,
    });
  }

  return { frames, index };
}
