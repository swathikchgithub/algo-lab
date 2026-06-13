"use client";

import { useMemo, useState } from "react";
import { binarySearchCode, binarySearchFrames } from "@/lib/algorithms/binarySearch";
import { PATTERNS } from "@/data/patterns";
import { Stepper } from "./Stepper";
import { CellRow } from "./CellRow";
import { InputEditor } from "./InputEditor";
import { Eli5Toggle } from "./Eli5Toggle";
import { Eli5Panel } from "./Eli5Panel";

const DEFAULT_ARRAY = [1, 3, 5, 7, 9, 11, 13];
const DEFAULT_TARGET = 13;

/** Full Binary Search visualizer: editable input → frames → Stepper, with ELI5. */
export function BinarySearchVisualizer() {
  const [arr, setArr] = useState<number[]>(DEFAULT_ARRAY);
  const [target, setTarget] = useState<number>(DEFAULT_TARGET);
  const [eli5, setEli5] = useState(false);

  const { frames } = useMemo(() => binarySearchFrames(arr, target), [arr, target]);
  const pattern = PATTERNS["binary-search"];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-sm text-slate-400">Interactive demo</h2>
        <Eli5Toggle on={eli5} onChange={setEli5} />
      </div>

      {eli5 && <Eli5Panel pattern={pattern} />}

      <InputEditor
        initialArray={arr}
        initialTarget={target}
        onApply={(a, t) => {
          setArr(a);
          setTarget(t);
        }}
      />

      <Stepper
        frames={frames}
        codeLines={binarySearchCode}
        eli5={eli5}
        renderStage={(f) => (
          <CellRow values={arr} cellStates={f.cellStates ?? []} pointers={f.pointers ?? {}} />
        )}
      />
    </div>
  );
}
