import { motion } from "framer-motion";

interface StackPanelProps {
  /** Values bottom → top. */
  items: Array<number | string>;
  title?: string;
  /** "vertical" stacks bottom-up (stack); "horizontal" is a row (queue). */
  orientation?: "vertical" | "horizontal";
}

/** A push/pop panel for stacks (and queues) shown beside the array. */
export function StackPanel({ items, title = "Stack", orientation = "vertical" }: StackPanelProps) {
  const vertical = orientation === "vertical";
  return (
    <div className="min-w-28 rounded-lg border border-navy-600 bg-navy-900 p-3">
      <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">
        {title} {vertical && <span className="text-slate-600">(top ↑)</span>}
      </p>
      <div className={`flex gap-1.5 ${vertical ? "flex-col-reverse items-stretch" : "flex-row flex-wrap"}`}>
        {items.length === 0 && <span className="text-xs text-slate-600">empty</span>}
        {items.map((v, i) => (
          <motion.div
            key={i}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex h-9 min-w-9 items-center justify-center rounded-md border border-cell-active bg-cell-active/20 px-2 font-mono text-sm text-white"
          >
            {v}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
