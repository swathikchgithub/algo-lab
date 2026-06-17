"use client";

import { useMemo, useState } from "react";
import type { Frame } from "@/lib/types";
import { PATTERNS } from "@/data/patterns";
import type { LinkedListView } from "@/lib/algorithms/linkedList";
import { Stepper } from "./Stepper";
import { ArrayInput } from "./ArrayInput";
import { Eli5Toggle } from "./Eli5Toggle";
import { Eli5Panel } from "./Eli5Panel";
import { LinkedListStage } from "./LinkedListStage";

export interface LinkedListWalkthroughProps {
  codeLines: string[];
  defaultInput: number[];
  /** Optional scalar (e.g. cycle position `pos`). */
  param?: { label: string; value: number };
  patternSlug?: string;
  generate: (input: number[], param?: number) => Frame[];
}

/**
 * Host for linked-list walkthroughs: editable values (+ optional scalar) → pure
 * frame generator → <Stepper>, drawn with <LinkedListStage>. Sibling of the
 * other walkthrough hosts.
 */
export function LinkedListWalkthrough({
  codeLines,
  defaultInput,
  param,
  patternSlug,
  generate,
}: LinkedListWalkthroughProps) {
  const [input, setInput] = useState<number[]>(defaultInput);
  const [paramVal, setParamVal] = useState<number | undefined>(param?.value);
  const [eli5, setEli5] = useState(false);

  const frames = useMemo(() => generate(input, paramVal), [input, paramVal, generate]);
  const pattern = patternSlug ? PATTERNS[patternSlug] : undefined;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-sm text-slate-400">Watch it run</h3>
        <Eli5Toggle on={eli5} onChange={setEli5} />
      </div>

      {eli5 && pattern && <Eli5Panel pattern={pattern} />}

      <ArrayInput
        initialArray={input}
        param={param}
        onApply={(a, p) => {
          setInput(a);
          setParamVal(p);
        }}
      />

      <Stepper
        frames={frames}
        codeLines={codeLines}
        eli5={eli5}
        renderStage={(f) => <LinkedListStage view={f.view as unknown as LinkedListView} />}
      />
    </div>
  );
}
