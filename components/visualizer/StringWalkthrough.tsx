"use client";

import { useMemo, useState } from "react";
import type { Frame } from "@/lib/types";
import { PATTERNS } from "@/data/patterns";
import { Stepper } from "./Stepper";
import { StringInput } from "./StringInput";
import { Eli5Toggle } from "./Eli5Toggle";
import { Eli5Panel } from "./Eli5Panel";
import { MultiArrayStage, type LegendItem, type StageRow } from "./MultiArrayStage";

export interface StringWalkthroughProps {
  /** Source lines for the synced code panel (1-indexed by Frame.highlightLine). */
  codeLines: string[];
  /** Starting input string. */
  defaultInput: string;
  /** Label for the text input box. */
  inputLabel?: string;
  /** Optional second string input (e.g. the string `t` to compare against). */
  param?: { label: string; value: string };
  /** Pattern slug for the ELI5 analogy panel, if any. */
  patternSlug?: string;
  /** Pure frame generator for this specific question. The second string `param`
   *  is undefined for questions that don't declare one. */
  generate: (input: string, param?: string) => Frame[];
  /** Derives the stage's labeled rows from a frame + the current input. */
  rows: (frame: Frame, input: string) => StageRow[];
  legend?: LegendItem[];
}

/**
 * String-input sibling of QuestionWalkthrough: editable text → pure frame
 * generator → <Stepper>, drawn with <MultiArrayStage>, plus ELI5. Kept separate
 * from the numeric host so neither carries the other's input concerns.
 */
export function StringWalkthrough({
  codeLines,
  defaultInput,
  inputLabel = "String",
  param,
  patternSlug,
  generate,
  rows,
  legend,
}: StringWalkthroughProps) {
  const [input, setInput] = useState<string>(defaultInput);
  const [paramVal, setParamVal] = useState<string | undefined>(param?.value);
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

      <StringInput
        initialValue={input}
        label={inputLabel}
        param={param}
        onApply={(v, p) => {
          setInput(v);
          setParamVal(p);
        }}
      />

      <Stepper
        frames={frames}
        codeLines={codeLines}
        eli5={eli5}
        renderStage={(f) => <MultiArrayStage rows={rows(f, input)} legend={legend} />}
      />
    </div>
  );
}
