import type { CellState, Frame } from "@/lib/types";

// Pure frame generator for Valid Anagram. Two char rows (s and t) share one
// frequency map: pass 1 adds for each char of s, pass 2 subtracts for each char
// of t. If a count would go negative, t isn't an anagram of s. No React.
//
// `validAnagramCode` is 1-indexed by `Frame.highlightLine`.

export const validAnagramCode = [
  "if len(s) != len(t): return False", // 1
  "counts = {}", // 2
  "for ch in s:                      # add", // 3
  "    counts[ch] = counts.get(ch, 0) + 1", // 4
  "for ch in t:                      # subtract", // 5
  "    if counts.get(ch, 0) == 0: return False", // 6
  "    counts[ch] -= 1", // 7
  "return True", // 8
];

/** Two-row payload (s and t) plus their per-cell states, carried in `Frame.view`.
 *  A `type` (not `interface`) so it's assignable to Frame.view's Record type. */
export type AnagramView = {
  s: string[];
  t: string[];
  sStates: CellState[];
  tStates: CellState[];
  sPtr: number | null;
  tPtr: number | null;
};

export interface ValidAnagramResult {
  frames: Frame[];
  /** Whether t is an anagram of s. */
  isAnagram: boolean;
}

function rowStates(len: number, cursor: number | null, scannedThrough: number): CellState[] {
  return Array.from({ length: len }, (_, k) => {
    if (k === cursor) return "current";
    if (k < scannedThrough) return "active";
    return "default";
  });
}

function countsLabel(counts: Map<string, number>): string {
  const entries = [...counts.entries()].filter(([, n]) => n !== 0);
  return entries.length ? entries.map(([c, n]) => `${c}:${n}`).join(" ") : "{}";
}

/**
 * Generate frames for Valid Anagram. One pass adds each character of s to the
 * count map, a second subtracts each character of t. Equal letters with equal
 * frequencies leave every count at zero — that's an anagram.
 *
 * Time:  O(n) — two linear passes.
 * Space: O(1) — bounded by the alphabet (plus one frame per step).
 */
export function validAnagramFrames(s: string, t: string): ValidAnagramResult {
  const sc = [...s];
  const tc = [...t];
  const frames: Frame[] = [];
  const counts = new Map<string, number>();

  const view = (sCur: number | null, sThru: number, tCur: number | null, tThru: number): AnagramView => ({
    s: [...sc],
    t: [...tc],
    sStates: rowStates(sc.length, sCur, sThru),
    tStates: rowStates(tc.length, tCur, tThru),
    sPtr: sCur,
    tPtr: tCur,
  });

  // Line 1 — length gate.
  if (sc.length !== tc.length) {
    frames.push({
      highlightLine: 1,
      pointers: {},
      cellStates: [],
      variables: { "len(s)": sc.length, "len(t)": tc.length, result: "False" },
      caption: `len(s)=${sc.length} ≠ len(t)=${tc.length} → different sizes can't be anagrams. Return False.`,
      eli5Caption: `The two words aren't even the same length, so they can't be anagrams.`,
      view: view(null, 0, null, 0),
    });
    return { frames, isAnagram: false };
  }

  frames.push({
    highlightLine: 2,
    pointers: {},
    cellStates: [],
    variables: { "len(s)": sc.length, "len(t)": tc.length, counts: "{}" },
    caption: `Same length. Tally s, then spend the tally on t.`,
    eli5Caption: `Tip both bags of letter-tiles out. Count s's tiles, then match t's against them.`,
    view: view(null, 0, null, 0),
  });

  // Pass 1 — add for each char of s.
  for (let i = 0; i < sc.length; i++) {
    const ch = sc[i];
    counts.set(ch, (counts.get(ch) ?? 0) + 1);
    frames.push({
      highlightLine: 4,
      pointers: {},
      cellStates: [],
      variables: { phase: "add (s)", i, ch, counts: countsLabel(counts) },
      caption: `add '${ch}' → counts['${ch}'] = ${counts.get(ch)}.`,
      eli5Caption: `Put one '${ch}' tile from s on the table (now ${counts.get(ch)}).`,
      view: view(i, i, null, 0),
    });
  }

  // Pass 2 — subtract for each char of t.
  for (let i = 0; i < tc.length; i++) {
    const ch = tc[i];
    const have = counts.get(ch) ?? 0;
    if (have === 0) {
      frames.push({
        highlightLine: 6,
        pointers: {},
        cellStates: [],
        variables: { phase: "subtract (t)", i, ch, "counts[ch]": 0, result: "False" },
        caption: `counts['${ch}'] = 0 → t needs a '${ch}' that s doesn't have. Return False.`,
        eli5Caption: `t wants a '${ch}' tile, but there are none left — not an anagram.`,
        view: view(null, sc.length, i, i),
      });
      return { frames, isAnagram: false };
    }
    counts.set(ch, have - 1);
    frames.push({
      highlightLine: 7,
      pointers: {},
      cellStates: [],
      variables: { phase: "subtract (t)", i, ch, counts: countsLabel(counts) },
      caption: `subtract '${ch}' → counts['${ch}'] = ${counts.get(ch)}.`,
      eli5Caption: `Match t's '${ch}' to a tile on the table and remove it.`,
      view: view(null, sc.length, i, i),
    });
  }

  frames.push({
    highlightLine: 8,
    pointers: {},
    cellStates: [],
    variables: { counts: countsLabel(counts), result: "True" },
    caption: `Every tile matched and nothing's left over → t is an anagram of s. Return True.`,
    eli5Caption: `Every tile paired up with nothing left — they're anagrams!`,
    view: view(null, sc.length, null, tc.length),
  });

  return { frames, isAnagram: true };
}
