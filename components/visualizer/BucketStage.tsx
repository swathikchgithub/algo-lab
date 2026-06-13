import { motion } from "framer-motion";
import type { BucketView } from "@/lib/algorithms/views";

/** Hash-table buckets (separate chaining); the active bucket is highlighted. */
export function BucketStage({ view }: { view: BucketView }) {
  return (
    <div className="flex flex-col gap-1.5">
      {view.buckets.map((entries, i) => (
        <div
          key={i}
          className={`flex items-center gap-2 rounded-md border px-2 py-1.5 ${
            i === view.activeBucket ? "border-cell-current bg-cell-current/10" : "border-navy-600 bg-navy-900"
          }`}
        >
          <span className="w-8 text-right font-mono text-xs text-slate-500">{i}</span>
          <span className="text-slate-600">→</span>
          <div className="flex flex-wrap gap-1.5">
            {entries.length === 0 && <span className="text-xs text-slate-600">·</span>}
            {entries.map((e, j) => (
              <motion.span
                key={j}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded border border-cell-active bg-cell-active/20 px-2 py-0.5 font-mono text-xs text-white"
              >
                {e}
              </motion.span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
