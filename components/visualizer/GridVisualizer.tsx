"use client";

import { useMemo, useState } from "react";
import type { Frame } from "@/lib/types";
import type { GridView } from "@/lib/algorithms/views";
import { PATTERNS } from "@/data/patterns";
import { Stepper } from "./Stepper";
import { GridStage } from "./GridStage";
import { Eli5Toggle } from "./Eli5Toggle";
import { Eli5Panel } from "./Eli5Panel";

interface GridVisualizerProps {
  patternSlug: string;
  codeLines: string[];
  defaultGrid: number[][];
  generate: (grid: number[][], start: [number, number]) => Frame[];
}

/** Parse a textarea of 0/1 rows (space- or comma-separated) into a grid. */
function parseGrid(text: string): number[][] | null {
  const rows = text
    .trim()
    .split("\n")
    .map((line) => line.trim().split(/[\s,]+/).filter(Boolean).map(Number));
  if (rows.length === 0 || rows.some((r) => r.length === 0)) return null;
  const w = rows[0].length;
  if (rows.some((r) => r.length !== w)) return null;
  if (rows.some((r) => r.some((c) => c !== 0 && c !== 1))) return null;
  if (rows.length > 12 || w > 12) return null;
  return rows;
}

/** First open (0) cell, scanning row-major — used as the traversal start. */
function firstOpen(grid: number[][]): [number, number] {
  for (let r = 0; r < grid.length; r++)
    for (let c = 0; c < grid[r].length; c++) if (grid[r][c] === 0) return [r, c];
  return [0, 0];
}

/** Shared host for grid traversals (DFS / BFS): editable grid → frames → Stepper. */
export function GridVisualizer({ patternSlug, codeLines, defaultGrid, generate }: GridVisualizerProps) {
  const [grid, setGrid] = useState<number[][]>(defaultGrid);
  const [text, setText] = useState(defaultGrid.map((r) => r.join(" ")).join("\n"));
  const [error, setError] = useState<string | null>(null);
  const [eli5, setEli5] = useState(false);

  const start = useMemo(() => firstOpen(grid), [grid]);
  const frames = useMemo(() => generate(grid, start), [grid, start, generate]);
  const pattern = PATTERNS[patternSlug];

  const apply = () => {
    const parsed = parseGrid(text);
    if (!parsed) {
      setError("Grid must be rows of 0 (open) and 1 (wall), up to 12×12.");
      return;
    }
    setError(null);
    setGrid(parsed);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-sm text-slate-400">Interactive demo</h2>
        <Eli5Toggle on={eli5} onChange={setEli5} />
      </div>

      {eli5 && pattern && <Eli5Panel pattern={pattern} />}

      <div className="rounded-lg border border-navy-600 bg-navy-800 p-4">
        <label className="text-xs text-slate-400">
          Grid — 0 = open, 1 = wall (traversal starts at the first open cell)
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
            rows={Math.min(8, grid.length + 1)}
            className="mt-1 w-full resize-y rounded-md border border-navy-600 bg-navy-900 p-3 font-mono text-sm text-slate-100 focus:border-cell-current focus:outline-none"
          />
        </label>
        <button
          onClick={apply}
          className="mt-2 rounded-md bg-cell-current px-4 py-2 text-sm font-semibold text-navy-900 hover:bg-amber-400"
        >
          Run
        </button>
        {error && <p className="mt-2 text-xs text-rose-400">{error}</p>}
      </div>

      <Stepper
        frames={frames}
        codeLines={codeLines}
        eli5={eli5}
        renderStage={(f) => <GridStage view={f.view as unknown as GridView} />}
      />
    </div>
  );
}
