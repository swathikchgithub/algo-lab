"use client";

import { useMemo, useState } from "react";
import type { GridView } from "@/lib/algorithms/views";
import { PATTERNS } from "@/data/patterns";
import { floodFillCode, floodFillFrames } from "@/lib/algorithms/floodFill";
import { Stepper } from "./Stepper";
import { GridStage } from "./GridStage";
import { Eli5Toggle } from "./Eli5Toggle";
import { Eli5Panel } from "./Eli5Panel";

/** Parse a textarea of integer rows (space- or comma-separated) into a grid. */
function parseGrid(text: string): number[][] | null {
  const rows = text
    .trim()
    .split("\n")
    .map((line) => line.trim().split(/[\s,]+/).filter(Boolean).map(Number));
  if (rows.length === 0 || rows.some((r) => r.length === 0)) return null;
  const w = rows[0].length;
  if (rows.some((r) => r.length !== w)) return null;
  if (rows.some((r) => r.some((c) => !Number.isFinite(c)))) return null;
  if (rows.length > 12 || w > 12) return null;
  return rows;
}

const DEFAULT_GRID = [
  [1, 1, 1],
  [1, 1, 0],
  [1, 0, 1],
];

const numField =
  "w-16 rounded-md border border-navy-600 bg-navy-900 px-2 py-1 font-mono text-sm text-slate-100 focus:border-cell-current focus:outline-none";

/** Self-contained host for Flood Fill: editable grid + sr/sc/color → Stepper. */
export function FloodFillVisualizer() {
  const [grid, setGrid] = useState<number[][]>(DEFAULT_GRID);
  const [text, setText] = useState(DEFAULT_GRID.map((r) => r.join(" ")).join("\n"));
  const [sr, setSr] = useState(1);
  const [sc, setSc] = useState(1);
  const [color, setColor] = useState(2);
  const [error, setError] = useState<string | null>(null);
  const [eli5, setEli5] = useState(false);

  const frames = useMemo(() => floodFillFrames(grid, sr, sc, color).frames, [grid, sr, sc, color]);
  const pattern = PATTERNS["bfs"];

  const apply = () => {
    const parsed = parseGrid(text);
    if (!parsed) {
      setError("Grid must be rows of integers, up to 12×12.");
      return;
    }
    setError(null);
    setGrid(parsed);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-sm text-slate-400">Watch it run</h3>
        <Eli5Toggle on={eli5} onChange={setEli5} />
      </div>

      {eli5 && pattern && <Eli5Panel pattern={pattern} />}

      <div className="rounded-lg border border-navy-600 bg-navy-800 p-4">
        <label className="text-xs text-slate-400">
          Image — integer color per cell
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
            rows={Math.min(8, grid.length + 1)}
            className="mt-1 w-full resize-y rounded-md border border-navy-600 bg-navy-900 p-3 font-mono text-sm text-slate-100 focus:border-cell-current focus:outline-none"
          />
        </label>
        <div className="mt-2 flex flex-wrap items-end gap-3 text-xs text-slate-400">
          <label>sr<input type="number" value={sr} onChange={(e) => setSr(Number(e.target.value))} className={`mt-1 block ${numField}`} /></label>
          <label>sc<input type="number" value={sc} onChange={(e) => setSc(Number(e.target.value))} className={`mt-1 block ${numField}`} /></label>
          <label>color<input type="number" value={color} onChange={(e) => setColor(Number(e.target.value))} className={`mt-1 block ${numField}`} /></label>
          <button
            onClick={apply}
            className="rounded-md bg-cell-current px-4 py-2 text-sm font-semibold text-navy-900 hover:bg-amber-400"
          >
            Run
          </button>
        </div>
        {error && <p className="mt-2 text-xs text-rose-400">{error}</p>}
      </div>

      <Stepper
        frames={frames}
        codeLines={floodFillCode}
        eli5={eli5}
        renderStage={(f) => <GridStage view={f.view as unknown as GridView} />}
      />
    </div>
  );
}
