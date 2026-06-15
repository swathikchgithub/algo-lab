"use client";

import type { Frame } from "@/lib/types";
import {
  trappingRainWaterCode,
  trappingRainWaterFrames,
  type TrapView,
} from "@/lib/algorithms/trappingRainWater";
import { containerWaterCode, containerWaterFrames } from "@/lib/algorithms/containerWater";
import {
  sortedSquaresCode,
  sortedSquaresFrames,
  type SquaresView,
} from "@/lib/algorithms/sortedSquares";
import { moveZeroesCode, moveZeroesFrames, type ArrayMutView } from "@/lib/algorithms/moveZeroes";
import { sortColorsCode, sortColorsFrames } from "@/lib/algorithms/sortColors";
import { removeDuplicatesCode, removeDuplicatesFrames } from "@/lib/algorithms/removeDuplicates";
import { threeSumCode, threeSumFrames } from "@/lib/algorithms/threeSum";
import { searchRotatedCode, searchRotatedFrames } from "@/lib/algorithms/searchRotated";
import { findFirstLastCode, findFirstLastFrames } from "@/lib/algorithms/findFirstLast";
import {
  firstUniqueCharCode,
  firstUniqueCharFrames,
  type CharsView,
} from "@/lib/algorithms/firstUniqueChar";
import { validAnagramCode, validAnagramFrames, type AnagramView } from "@/lib/algorithms/validAnagram";
import { romanToIntCode, romanToIntFrames } from "@/lib/algorithms/romanToInt";
import { myAtoiCode, myAtoiFrames } from "@/lib/algorithms/myAtoi";
import {
  dailyTemperaturesCode,
  dailyTemperaturesFrames,
  type DailyTempView,
} from "@/lib/algorithms/dailyTemperatures";
import { QuestionWalkthrough } from "./QuestionWalkthrough";
import { StringWalkthrough } from "./StringWalkthrough";
import type { LegendItem, StageRow } from "./MultiArrayStage";

// Question ids that have a bespoke, question-specific walkthrough. Keep in sync
// with the switch below. The question detail page calls hasQuestionVisualizer()
// to decide whether to embed one (and to hide the generic pattern-demo link).
const SUPPORTED = new Set<string>([
  "trapping-rain-water",
  "container-with-most-water",
  "squares-of-sorted-array",
  "move-zeroes",
  "sort-colors",
  "remove-duplicates-sorted",
  "three-sum",
  "search-in-rotated-sorted-array",
  "find-first-and-last-position",
  "first-unique-character",
  "valid-anagram",
  "roman-to-integer",
  "string-to-integer-atoi",
  "daily-temperatures",
]);

export function hasQuestionVisualizer(id: string): boolean {
  return SUPPORTED.has(id);
}

const TRAP_LEGEND: LegendItem[] = [
  { label: "pointer (l, r)", swatch: "bg-cell-current" },
  { label: "in play / water", swatch: "bg-cell-active" },
  { label: "processed", swatch: "bg-navy-800" },
];

const POINTER_LEGEND: LegendItem[] = [
  { label: "pointer (l, r)", swatch: "bg-cell-current" },
  { label: "in play", swatch: "bg-cell-active" },
  { label: "processed", swatch: "bg-navy-800" },
];

const RESULT_LEGEND: LegendItem[] = [
  { label: "pointer (l, r)", swatch: "bg-cell-current" },
  { label: "in play / filled", swatch: "bg-cell-active" },
  { label: "processed / empty", swatch: "bg-navy-800" },
];

const MOVE_LEGEND: LegendItem[] = [
  { label: "scan (i)", swatch: "bg-cell-current" },
  { label: "packed non-zeros", swatch: "bg-cell-active" },
  { label: "not yet scanned", swatch: "bg-navy-700" },
];

const SORT_LEGEND: LegendItem[] = [
  { label: "cursor (mid)", swatch: "bg-cell-current" },
  { label: "settled (0s, 2s)", swatch: "bg-cell-active" },
  { label: "unknown", swatch: "bg-navy-700" },
];

const DEDUPE_LEGEND: LegendItem[] = [
  { label: "read (i)", swatch: "bg-cell-current" },
  { label: "unique kept", swatch: "bg-cell-active" },
  { label: "not yet read", swatch: "bg-navy-700" },
];

const TRIPLET_LEGEND: LegendItem[] = [
  { label: "anchor (i)", swatch: "bg-cell-current" },
  { label: "window [l, r]", swatch: "bg-cell-active" },
  { label: "out of window", swatch: "bg-navy-800" },
];

const SEARCH_LEGEND: LegendItem[] = [
  { label: "mid", swatch: "bg-cell-current" },
  { label: "window [lo, hi]", swatch: "bg-cell-active" },
  { label: "discarded", swatch: "bg-navy-800" },
];

const SCAN_LEGEND: LegendItem[] = [
  { label: "cursor (i)", swatch: "bg-cell-current" },
  { label: "scanned", swatch: "bg-cell-active" },
  { label: "not yet read", swatch: "bg-navy-700" },
];

const ANAGRAM_LEGEND: LegendItem[] = [
  { label: "current char", swatch: "bg-cell-current" },
  { label: "processed", swatch: "bg-cell-active" },
  { label: "pending", swatch: "bg-navy-700" },
];

const STACK_LEGEND: LegendItem[] = [
  { label: "today (i) / stack top", swatch: "bg-cell-current" },
  { label: "waiting / resolved", swatch: "bg-cell-active" },
  { label: "untouched / empty", swatch: "bg-navy-700" },
];

/** Single-row stage backed by the live (mutating) array in `frame.view.arr`. */
function mutatingRow(frame: Frame, label: string): StageRow {
  const view = frame.view as unknown as ArrayMutView;
  return {
    label,
    values: view.arr,
    cellStates: frame.cellStates ?? [],
    pointers: frame.pointers ?? {},
  };
}

/**
 * Maps a question id to its bespoke walkthrough. Returns null for ids without
 * one (the detail page then falls back to the generic pattern link). Adding a
 * question = a frame generator + a case here, no engine changes.
 */
export function QuestionVisualizer({ questionId }: { questionId: string }) {
  switch (questionId) {
    case "trapping-rain-water":
      return (
        <QuestionWalkthrough
          codeLines={trappingRainWaterCode}
          defaultInput={[4, 2, 0, 3, 2, 5]}
          patternSlug="two-pointers"
          generate={(input) => trappingRainWaterFrames(input).frames}
          legend={TRAP_LEGEND}
          rows={(frame: Frame, input) => {
            const view = frame.view as unknown as TrapView;
            return [
              {
                label: "height",
                values: input,
                cellStates: frame.cellStates ?? [],
                pointers: frame.pointers ?? {},
              },
              {
                label: "water",
                values: view.trapped,
                cellStates: view.trappedStates,
              },
            ];
          }}
        />
      );

    case "container-with-most-water":
      return (
        <QuestionWalkthrough
          codeLines={containerWaterCode}
          defaultInput={[1, 8, 6, 2, 5, 4, 8, 3, 7]}
          patternSlug="two-pointers"
          generate={(input) => containerWaterFrames(input).frames}
          legend={POINTER_LEGEND}
          rows={(frame: Frame, input) => [
            {
              label: "height",
              values: input,
              cellStates: frame.cellStates ?? [],
              pointers: frame.pointers ?? {},
            },
          ]}
        />
      );

    case "squares-of-sorted-array":
      return (
        <QuestionWalkthrough
          codeLines={sortedSquaresCode}
          defaultInput={[-4, -1, 0, 3, 10]}
          patternSlug="two-pointers"
          generate={(input) => sortedSquaresFrames(input).frames}
          legend={RESULT_LEGEND}
          rows={(frame: Frame, input): StageRow[] => {
            const view = frame.view as unknown as SquaresView;
            const p = frame.pointers ?? {};
            const numsPointers: Record<string, number> = {};
            if (p.L !== undefined) numsPointers.L = p.L;
            if (p.R !== undefined) numsPointers.R = p.R;
            return [
              {
                label: "nums",
                values: input,
                cellStates: frame.cellStates ?? [],
                pointers: numsPointers,
              },
              {
                // Unfilled slots (default state) render as an empty placeholder.
                label: "res",
                values: view.res.map((v, i) => (view.resStates[i] === "default" ? "·" : v)),
                cellStates: view.resStates,
                pointers: p.pos !== undefined ? { pos: p.pos } : {},
              },
            ];
          }}
        />
      );

    case "move-zeroes":
      return (
        <QuestionWalkthrough
          codeLines={moveZeroesCode}
          defaultInput={[0, 1, 0, 3, 12]}
          patternSlug="two-pointers"
          generate={(input) => moveZeroesFrames(input).frames}
          legend={MOVE_LEGEND}
          rows={(frame: Frame) => [mutatingRow(frame, "nums")]}
        />
      );

    case "sort-colors":
      return (
        <QuestionWalkthrough
          codeLines={sortColorsCode}
          defaultInput={[2, 0, 2, 1, 1, 0]}
          patternSlug="two-pointers"
          generate={(input) => sortColorsFrames(input).frames}
          legend={SORT_LEGEND}
          rows={(frame: Frame) => [mutatingRow(frame, "nums")]}
        />
      );

    case "remove-duplicates-sorted":
      return (
        <QuestionWalkthrough
          codeLines={removeDuplicatesCode}
          defaultInput={[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]}
          patternSlug="two-pointers"
          generate={(input) => removeDuplicatesFrames(input).frames}
          legend={DEDUPE_LEGEND}
          rows={(frame: Frame) => [mutatingRow(frame, "nums")]}
        />
      );

    case "three-sum":
      return (
        <QuestionWalkthrough
          codeLines={threeSumCode}
          defaultInput={[-1, 0, 1, 2, -1, -4]}
          patternSlug="two-pointers"
          generate={(input) => threeSumFrames(input).frames}
          legend={TRIPLET_LEGEND}
          rows={(frame: Frame) => [mutatingRow(frame, "nums")]}
        />
      );

    case "search-in-rotated-sorted-array":
      return (
        <QuestionWalkthrough
          codeLines={searchRotatedCode}
          defaultInput={[4, 5, 6, 7, 0, 1, 2]}
          param={{ label: "target", value: 0 }}
          patternSlug="binary-search"
          generate={(input, target) => searchRotatedFrames(input, target ?? 0).frames}
          legend={SEARCH_LEGEND}
          rows={(frame: Frame) => [mutatingRow(frame, "nums")]}
        />
      );

    case "find-first-and-last-position":
      return (
        <QuestionWalkthrough
          codeLines={findFirstLastCode}
          defaultInput={[5, 7, 7, 8, 8, 10]}
          param={{ label: "target", value: 8 }}
          patternSlug="binary-search"
          generate={(input, target) => findFirstLastFrames(input, target ?? 0).frames}
          legend={SEARCH_LEGEND}
          rows={(frame: Frame) => [mutatingRow(frame, "nums")]}
        />
      );

    case "first-unique-character":
      return (
        <StringWalkthrough
          codeLines={firstUniqueCharCode}
          defaultInput="leetcode"
          inputLabel="String"
          patternSlug="string-hashing"
          generate={(input) => firstUniqueCharFrames(input).frames}
          legend={SCAN_LEGEND}
          rows={(frame: Frame) => [
            {
              label: "s",
              values: (frame.view as unknown as CharsView).chars,
              cellStates: frame.cellStates ?? [],
              pointers: frame.pointers ?? {},
            },
          ]}
        />
      );

    case "daily-temperatures":
      return (
        <QuestionWalkthrough
          codeLines={dailyTemperaturesCode}
          defaultInput={[73, 74, 75, 71, 69, 72, 76, 73]}
          patternSlug="monotonic-stack"
          generate={(input) => dailyTemperaturesFrames(input).frames}
          legend={STACK_LEGEND}
          rows={(frame: Frame): StageRow[] => {
            const v = frame.view as unknown as DailyTempView;
            return [
              {
                label: "temps",
                values: v.temps,
                cellStates: v.tempStates,
                pointers: frame.pointers?.i !== undefined ? { i: frame.pointers.i } : {},
              },
              {
                label: "stack(idx)",
                values: v.stack,
                cellStates: v.stackStates,
                pointers: v.stack.length ? { top: v.stack.length - 1 } : {},
              },
              {
                label: "answer",
                values: v.res.map((n, k) => (v.resStates[k] === "default" ? "·" : n)),
                cellStates: v.resStates,
              },
            ];
          }}
        />
      );

    case "string-to-integer-atoi":
      return (
        <StringWalkthrough
          codeLines={myAtoiCode}
          defaultInput="   -42"
          inputLabel="String"
          trim={false}
          patternSlug="string-hashing"
          generate={(input) => myAtoiFrames(input).frames}
          legend={SCAN_LEGEND}
          rows={(frame: Frame) => [
            {
              label: "s",
              values: (frame.view as unknown as CharsView).chars.map((c) => (c === " " ? "␣" : c)),
              cellStates: frame.cellStates ?? [],
              pointers: frame.pointers ?? {},
            },
          ]}
        />
      );

    case "roman-to-integer":
      return (
        <StringWalkthrough
          codeLines={romanToIntCode}
          defaultInput="MCMXCIV"
          inputLabel="Roman numeral"
          patternSlug="string-hashing"
          generate={(input) => romanToIntFrames(input).frames}
          legend={SCAN_LEGEND}
          rows={(frame: Frame) => [
            {
              label: "s",
              values: (frame.view as unknown as CharsView).chars,
              cellStates: frame.cellStates ?? [],
              pointers: frame.pointers ?? {},
            },
          ]}
        />
      );

    case "valid-anagram":
      return (
        <StringWalkthrough
          codeLines={validAnagramCode}
          defaultInput="anagram"
          inputLabel="s"
          param={{ label: "t", value: "nagaram" }}
          patternSlug="string-hashing"
          generate={(s, t) => validAnagramFrames(s, t ?? "").frames}
          legend={ANAGRAM_LEGEND}
          rows={(frame: Frame): StageRow[] => {
            const v = frame.view as unknown as AnagramView;
            return [
              {
                label: "s",
                values: v.s,
                cellStates: v.sStates,
                pointers: v.sPtr !== null ? { i: v.sPtr } : {},
              },
              {
                label: "t",
                values: v.t,
                cellStates: v.tStates,
                pointers: v.tPtr !== null ? { i: v.tPtr } : {},
              },
            ];
          }}
        />
      );

    default:
      return null;
  }
}
