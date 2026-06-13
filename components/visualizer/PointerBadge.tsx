import { motion } from "framer-motion";

const COLORS: Record<string, string> = {
  L: "bg-emerald-500 text-white",
  R: "bg-rose-500 text-white",
  M: "bg-cell-current text-navy-900",
};

/** A small labeled pointer badge with a downward arrow, rendered above a cell. */
export function PointerBadge({ name }: { name: string }) {
  const color = COLORS[name] ?? "bg-cell-active text-white";
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center"
    >
      <span className={`rounded px-1.5 py-0.5 font-mono text-xs font-bold ${color}`}>
        {name}
      </span>
      <span className="text-[10px] leading-none text-slate-400">▾</span>
    </motion.div>
  );
}
