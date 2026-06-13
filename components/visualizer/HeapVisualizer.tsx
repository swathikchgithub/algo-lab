"use client";

import { useMemo, useState } from "react";
import type { TreeView } from "@/lib/algorithms/views";
import { heapCode, heapInsertFrames } from "@/lib/algorithms/heap";
import { PATTERNS } from "@/data/patterns";
import { Stepper } from "./Stepper";
import { TreeStage } from "./TreeStage";
import { ArrayInput } from "./ArrayInput";
import { Eli5Toggle } from "./Eli5Toggle";
import { Eli5Panel } from "./Eli5Panel";

/** Min-heap insert visualizer: values bubble up into a tree on each insert. */
export function HeapVisualizer() {
  const [values, setValues] = useState<number[]>([5, 3, 8, 1, 9, 2]);
  const [eli5, setEli5] = useState(false);

  const frames = useMemo(() => heapInsertFrames(values).frames, [values]);
  const pattern = PATTERNS["top-k"];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-sm text-slate-400">Interactive demo</h2>
        <Eli5Toggle on={eli5} onChange={setEli5} />
      </div>

      {eli5 && pattern && <Eli5Panel pattern={pattern} />}

      <ArrayInput initialArray={values} onApply={(a) => setValues(a)} />

      <Stepper
        frames={frames}
        codeLines={heapCode}
        eli5={eli5}
        renderStage={(f) => <TreeStage view={f.view as unknown as TreeView} />}
      />
    </div>
  );
}
