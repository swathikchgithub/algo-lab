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
import { QuestionWalkthrough } from "./QuestionWalkthrough";
import type { LegendItem, StageRow } from "./MultiArrayStage";

// Question ids that have a bespoke, question-specific walkthrough. Keep in sync
// with the switch below. The question detail page calls hasQuestionVisualizer()
// to decide whether to embed one (and to hide the generic pattern-demo link).
const SUPPORTED = new Set<string>([
  "trapping-rain-water",
  "container-with-most-water",
  "squares-of-sorted-array",
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

    default:
      return null;
  }
}
