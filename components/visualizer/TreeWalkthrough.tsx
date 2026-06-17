"use client";

import { useMemo, useState } from "react";
import type { Frame } from "@/lib/types";
import { PATTERNS } from "@/data/patterns";
import type { BinTreeView } from "@/lib/algorithms/binaryTree";
import { Stepper } from "./Stepper";
import { StringInput } from "./StringInput";
import { Eli5Toggle } from "./Eli5Toggle";
import { Eli5Panel } from "./Eli5Panel";
import { BinaryTreeStage } from "./BinaryTreeStage";
import { MultiArrayStage, type LegendItem } from "./MultiArrayStage";

export interface TreeWalkthroughProps {
  codeLines: string[];
  /** Starting tree as a level-order string, e.g. "1,null,2,3". */
  defaultInput: string;
  /** Labels for the two auxiliary rows under the tree (e.g. "stack", "output"). */
  auxLabel?: string;
  outputLabel?: string;
  patternSlug?: string;
  /** Pure frame generator; receives the raw level-order string. */
  generate: (input: string) => Frame[];
  legend?: LegendItem[];
}

/**
 * Host for binary-tree walkthroughs: editable level-order input → pure frame
 * generator → <Stepper>, drawn as a <BinaryTreeStage> above the algorithm's
 * working stack/queue and output rows. Sibling of QuestionWalkthrough so neither
 * carries the other's substrate.
 */
export function TreeWalkthrough({
  codeLines,
  defaultInput,
  auxLabel = "stack",
  outputLabel = "output",
  patternSlug,
  generate,
  legend,
}: TreeWalkthroughProps) {
  const [input, setInput] = useState<string>(defaultInput);
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

      <StringInput
        initialValue={input}
        label="Tree (level-order, use null for gaps)"
        maxLen={60}
        onApply={(v) => setInput(v)}
      />

      <Stepper
        frames={frames}
        codeLines={codeLines}
        eli5={eli5}
        renderStage={(f) => {
          const v = f.view as unknown as BinTreeView;
          return (
            <div className="flex flex-col gap-3">
              <BinaryTreeStage slots={v.slots} states={v.states} />
              <MultiArrayStage
                legend={legend}
                rows={[
                  { label: auxLabel, values: v.aux, cellStates: v.auxStates },
                  { label: outputLabel, values: v.output, cellStates: v.outputStates },
                ]}
              />
            </div>
          );
        }}
      />
    </div>
  );
}
