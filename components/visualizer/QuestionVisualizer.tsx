"use client";

import type { Frame } from "@/lib/types";
import {
  trappingRainWaterCode,
  trappingRainWaterFrames,
  type TrapView,
} from "@/lib/algorithms/trappingRainWater";
import { QuestionWalkthrough } from "./QuestionWalkthrough";
import type { LegendItem } from "./MultiArrayStage";

// Question ids that have a bespoke, question-specific walkthrough. Keep in sync
// with the switch below. The question detail page calls hasQuestionVisualizer()
// to decide whether to embed one (and to hide the generic pattern-demo link).
const SUPPORTED = new Set<string>(["trapping-rain-water"]);

export function hasQuestionVisualizer(id: string): boolean {
  return SUPPORTED.has(id);
}

const TRAP_LEGEND: LegendItem[] = [
  { label: "pointer (l, r)", swatch: "bg-cell-current" },
  { label: "in play / water", swatch: "bg-cell-active" },
  { label: "processed", swatch: "bg-navy-800" },
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

    default:
      return null;
  }
}
