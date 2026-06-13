import { motion } from "framer-motion";
import type { CellState } from "@/lib/types";
import { PointerBadge } from "./PointerBadge";

const CELL_STYLES: Record<CellState, string> = {
  default: "bg-navy-700 border-navy-600 text-slate-200",
  active: "bg-cell-active border-blue-400 text-white",
  current: "bg-cell-current border-amber-300 text-navy-900",
  visited: "bg-navy-800 border-navy-700 text-slate-500 opacity-50",
};

interface CellRowProps {
  values: Array<number | string>;
  cellStates: CellState[];
  /** pointer name → cell index */
  pointers: Record<string, number>;
}

/** Renders the array as 44px rounded cells with pointer badges floating above. */
export function CellRow({ values, cellStates, pointers }: CellRowProps) {
  // Invert pointers to index → names so multiple pointers can share a cell.
  const badgesByIndex = new Map<number, string[]>();
  for (const [name, idx] of Object.entries(pointers)) {
    if (!badgesByIndex.has(idx)) badgesByIndex.set(idx, []);
    badgesByIndex.get(idx)!.push(name);
  }

  return (
    <div className="flex flex-wrap gap-2 py-2">
      {values.map((v, i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <div className="flex h-6 items-end gap-1">
            {(badgesByIndex.get(i) ?? []).map((name) => (
              <PointerBadge key={name} name={name} />
            ))}
          </div>
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 500, damping: 32 }}
            className={`flex h-11 w-11 items-center justify-center rounded-lg border font-mono text-sm font-semibold ${
              CELL_STYLES[cellStates[i] ?? "default"]
            }`}
          >
            {v}
          </motion.div>
          <span className="font-mono text-[10px] text-slate-500">{i}</span>
        </div>
      ))}
    </div>
  );
}
