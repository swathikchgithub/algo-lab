import type { CellState } from "@/lib/types";

// Renders a general binary tree (with gaps) from a complete-tree-indexed slots
// array. Unlike TreeStage (heap, dense), this skips null slots and only draws
// edges between present nodes. Each node is colored by its per-slot state.

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

interface BinaryTreeStageProps {
  slots: (number | null)[];
  states: CellState[];
}

export function BinaryTreeStage({ slots, states }: BinaryTreeStageProps) {
  const n = slots.length;
  if (n === 0) return <p className="text-slate-500">Empty tree — enter a level-order array.</p>;

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
      {slots.map((v, i) => {
        if (i === 0 || v === null) return null;
        const parent = (i - 1) >> 1;
        if (slots[parent] === null) return null; // no edge to a missing parent
        const p = pos(parent);
        const c = pos(i);
        return <line key={`e${i}`} x1={p.x} y1={p.y} x2={c.x} y2={c.y} stroke="#334155" strokeWidth={1.5} />;
      })}
      {slots.map((v, i) => {
        if (v === null) return null;
        const { x, y } = pos(i);
        const st = states[i] ?? "default";
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={radius} fill={FILL[st]} stroke="#475569" strokeWidth={1.5} />
            <text
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="13"
              fontFamily="monospace"
              fill={TEXT[st]}
            >
              {v}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
