import { motion } from "framer-motion";
import type { CellState } from "@/lib/types";
import type { GridView } from "@/lib/algorithms/views";
import { StackPanel } from "./StackPanel";

const CELL: Record<CellState, string> = {
  default: "bg-navy-700 border-navy-600 text-slate-300",
  active: "bg-cell-active border-blue-400 text-white",
  current: "bg-cell-current border-amber-300 text-navy-900",
  visited: "bg-navy-800 border-navy-700 text-slate-500",
};

/** Grid substrate for DFS/BFS, with an optional call-stack/queue panel. */
export function GridStage({ view }: { view: GridView }) {
  return (
    <div className="flex flex-wrap items-start gap-4">
      <div className="inline-flex flex-col gap-1">
        {view.grid.map((row, r) => (
          <div key={r} className="flex gap-1">
            {row.map((state, c) => (
              <motion.div
                key={c}
                layout
                className={`flex h-10 w-10 items-center justify-center rounded-md border font-mono text-xs ${CELL[state]}`}
              >
                {view.labels?.[r]?.[c] ?? ""}
              </motion.div>
            ))}
          </div>
        ))}
      </div>
      {view.aux && (
        <StackPanel items={view.aux.items} title={view.aux.title} orientation={view.aux.orientation} />
      )}
    </div>
  );
}
