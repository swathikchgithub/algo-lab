"use client";

import { useMemo, useState } from "react";
import type { ChartView } from "@/lib/algorithms/views";
import { bigOCode, bigOFrames, type BigOCurve } from "@/lib/algorithms/bigO";
import { PATTERNS } from "@/data/patterns";
import { Stepper } from "./Stepper";
import { CellRow } from "./CellRow";
import { ChartStage } from "./ChartStage";
import { Eli5Toggle } from "./Eli5Toggle";
import { Eli5Panel } from "./Eli5Panel";

const CURVES: BigOCurve[] = ["O(1)", "O(log n)", "O(n)", "O(n^2)"];
const MAX_N = 8;

/** Big-O explainer: an array operation up top + a live operations-vs-n chart. */
export function BigOVisualizer() {
  const [curve, setCurve] = useState<BigOCurve>("O(n)");
  const [eli5, setEli5] = useState(false);

  const frames = useMemo(() => bigOFrames(curve, MAX_N).frames, [curve]);
  const inputCells = useMemo(() => Array.from({ length: MAX_N }, (_, i) => i + 1), []);
  const pattern = PATTERNS["big-o"];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-sm text-slate-400">Interactive demo</h2>
        <Eli5Toggle on={eli5} onChange={setEli5} />
      </div>

      {eli5 && pattern && <Eli5Panel pattern={pattern} />}

      <div className="rounded-lg border border-navy-600 bg-navy-800 p-4">
        <span className="text-xs text-slate-400">Complexity class</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {CURVES.map((c) => (
            <button
              key={c}
              onClick={() => setCurve(c)}
              className={`rounded-md px-3 py-1.5 font-mono text-sm ${
                curve === c ? "bg-cell-active text-white" : "bg-navy-700 text-slate-300 hover:bg-navy-600"
              }`}
            >
              {c === "O(n^2)" ? "O(n²)" : c}
            </button>
          ))}
        </div>
      </div>

      <Stepper
        frames={frames}
        codeLines={bigOCode}
        eli5={eli5}
        renderStage={(f) => (
          <div className="flex flex-col gap-4">
            <CellRow values={inputCells} cellStates={f.cellStates ?? []} pointers={{}} />
            <ChartStage view={f.view as unknown as ChartView} />
          </div>
        )}
      />
    </div>
  );
}
