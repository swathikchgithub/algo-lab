import type { CellState } from "@/lib/types";
import type { TreeView } from "@/lib/algorithms/views";

const FILL: Record<CellState, string> = {
  default: "#1a2236",
  active: "#3b82f6",
  current: "#f59e0b",
  visited: "#243049",
};
const TEXT: Record<CellState, string> = {
  default: "#e2e8f0",
  active: "#ffffff",
  current: "#0a0e1a",
  visited: "#64748b",
};

/** Binary heap drawn as a tree from a level-order array. */
export function TreeStage({ view }: { view: TreeView }) {
  const n = view.heap.length;
  if (n === 0) return <p className="text-slate-500">Heap is empty — insert a value.</p>;

  const maxDepth = Math.floor(Math.log2(n));
  const rows = maxDepth + 1;
  const width = Math.max(280, Math.pow(2, maxDepth) * 64);
  const rowH = 72;
  const radius = 18;

  const pos = (i: number) => {
    const d = Math.floor(Math.log2(i + 1));
    const idxInLevel = i - (2 ** d - 1);
    const count = 2 ** d;
    return { x: ((idxInLevel + 0.5) / count) * width, y: (d + 0.5) * rowH };
  };

  return (
    <svg width={width} height={rows * rowH} className="max-w-full">
      {view.heap.map((_, i) => {
        if (i === 0) return null;
        const p = pos((i - 1) >> 1);
        const c = pos(i);
        return <line key={`e${i}`} x1={p.x} y1={p.y} x2={c.x} y2={c.y} stroke="#334155" strokeWidth={1.5} />;
      })}
      {view.heap.map((v, i) => {
        const { x, y } = pos(i);
        const st = view.states[i] ?? "default";
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={radius} fill={FILL[st]} stroke="#475569" strokeWidth={1.5} />
            <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize="13" fontFamily="monospace" fill={TEXT[st]}>
              {v}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
