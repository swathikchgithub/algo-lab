import type { CellState } from "@/lib/types";
import { CellRow } from "./CellRow";

export interface StageRow {
  /** Label shown to the left of the row (e.g. "height", "water"). */
  label: string;
  values: Array<number | string>;
  cellStates: CellState[];
  /** Optional pointer badges (l, r, i, …) → cell index. */
  pointers?: Record<string, number>;
}

export interface LegendItem {
  label: string;
  /** Tailwind background class for the swatch, e.g. "bg-cell-current". */
  swatch: string;
}

interface MultiArrayStageProps {
  rows: StageRow[];
  legend?: LegendItem[];
}

/**
 * Renders one or more labeled array rows stacked vertically (e.g. height + the
 * water trapped above each bar), with an optional color legend on top. The
 * substrate for any per-question walkthrough that reasons over parallel arrays.
 * Presentational only — reuses <CellRow> for each row.
 */
export function MultiArrayStage({ rows, legend }: MultiArrayStageProps) {
  return (
    <div className="flex flex-col gap-3">
      {legend && legend.length > 0 && (
        <div className="flex flex-wrap gap-3 text-xs text-slate-400">
          {legend.map((item) => (
            <span key={item.label} className="flex items-center gap-1.5">
              <span className={`inline-block h-3 w-3 rounded border border-navy-600 ${item.swatch}`} />
              {item.label}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center gap-3">
            <span className="w-16 shrink-0 text-right font-mono text-xs text-slate-400">
              {row.label}
            </span>
            <CellRow
              values={row.values}
              cellStates={row.cellStates}
              pointers={row.pointers ?? {}}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
