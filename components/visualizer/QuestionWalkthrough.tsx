"use client";

import { useMemo, useState } from "react";
import type { Frame } from "@/lib/types";
import { PATTERNS } from "@/data/patterns";
import { Stepper } from "./Stepper";
import { ArrayInput } from "./ArrayInput";
import { Eli5Toggle } from "./Eli5Toggle";
import { Eli5Panel } from "./Eli5Panel";
import { MultiArrayStage, type LegendItem, type StageRow } from "./MultiArrayStage";

export interface QuestionWalkthroughProps {
  /** Source lines for the synced code panel (1-indexed by Frame.highlightLine). */
  codeLines: string[];
  /** Starting input array. */
  defaultInput: number[];
  /** Pattern slug for the ELI5 analogy panel, if any. */
  patternSlug?: string;
  /** Pure frame generator for this specific question. */
  generate: (input: number[]) => Frame[];
  /** Derives the stage's labeled rows from a frame + the current input. */
  rows: (frame: Frame, input: number[]) => StageRow[];
  legend?: LegendItem[];
}

/**
 * Generic host for a question-specific algorithm walkthrough: editable input →
 * pure frame generator → <Stepper>, drawn with <MultiArrayStage>, plus ELI5.
 * Adding a new question's visualizer is a generator + a config in
 * QuestionVisualizer — no playback or animation code here.
 */
export function QuestionWalkthrough({
  codeLines,
  defaultInput,
  patternSlug,
  generate,
  rows,
  legend,
}: QuestionWalkthroughProps) {
  const [input, setInput] = useState<number[]>(defaultInput);
  const [eli5, setEli5] = useState(false);

  const frames = useMemo(() => generate(input), [input, generate]);
  const pattern = patternSlug ? PATTERNS[patternSlug] : undefined;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-sm text-slate-400">Watch it run</h3>
        <Eli5Toggle on={eli5} onChange={setEli5} />
      </div>

      {eli5 && pattern && <Eli5Panel pattern={pattern} />}

      <ArrayInput initialArray={input} onApply={(a) => setInput(a)} />

      <Stepper
        frames={frames}
        codeLines={codeLines}
        eli5={eli5}
        renderStage={(f) => <MultiArrayStage rows={rows(f, input)} legend={legend} />}
      />
    </div>
  );
}
