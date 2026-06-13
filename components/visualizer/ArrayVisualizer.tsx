"use client";

import { useMemo, useState, type ReactNode } from "react";
import type { Frame } from "@/lib/types";
import { PATTERNS } from "@/data/patterns";
import { Stepper } from "./Stepper";
import { CellRow } from "./CellRow";
import { ArrayInput } from "./ArrayInput";
import { Eli5Toggle } from "./Eli5Toggle";
import { Eli5Panel } from "./Eli5Panel";

export interface ArrayVisualizerProps {
  patternSlug: string;
  codeLines: string[];
  defaultArray: number[];
  /** Optional scalar input (target / k). */
  param?: { label: string; value: number };
  sort?: boolean;
  /** Pure frame generator for this algorithm. */
  generate: (arr: number[], param: number | undefined) => Frame[];
  /** Optional aux panel drawn beside the array (stack/queue/etc.). */
  renderExtra?: (frame: Frame) => ReactNode;
}

/**
 * Config-driven host for any array-substrate visualizer: editable input →
 * frame generator → <Stepper>, with ELI5. Adding one is just a new config in
 * VisualizerSwitch — no playback or animation code.
 */
export function ArrayVisualizer({
  patternSlug,
  codeLines,
  defaultArray,
  param,
  sort,
  generate,
  renderExtra,
}: ArrayVisualizerProps) {
  const [arr, setArr] = useState<number[]>(
    sort ? [...defaultArray].sort((a, b) => a - b) : defaultArray,
  );
  const [paramVal, setParamVal] = useState<number | undefined>(param?.value);
  const [eli5, setEli5] = useState(false);

  const frames = useMemo(() => generate(arr, paramVal), [arr, paramVal, generate]);
  const pattern = PATTERNS[patternSlug];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-sm text-slate-400">Interactive demo</h2>
        <Eli5Toggle on={eli5} onChange={setEli5} />
      </div>

      {eli5 && pattern && <Eli5Panel pattern={pattern} />}

      <ArrayInput
        initialArray={arr}
        param={param}
        sort={sort}
        onApply={(a, p) => {
          setArr(a);
          setParamVal(p);
        }}
      />

      <Stepper
        frames={frames}
        codeLines={codeLines}
        eli5={eli5}
        renderStage={(f) => {
          const row = (
            <CellRow values={arr} cellStates={f.cellStates ?? []} pointers={f.pointers ?? {}} />
          );
          return renderExtra ? (
            <div className="flex flex-wrap items-start gap-4">
              {row}
              {renderExtra(f)}
            </div>
          ) : (
            row
          );
        }}
      />
    </div>
  );
}
