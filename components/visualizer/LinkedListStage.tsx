import type { CellState } from "@/lib/types";
import type { LinkedListView } from "@/lib/algorithms/linkedList";

// Renders a linked list as boxed nodes with arrows following `next`. Forward
// adjacent links are straight; backward or skipping links (reverse / cycle) arc
// above the nodes. Pointer badges float over their target slot.

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

const NODE_W = 46;
const NODE_H = 40;
const GAP = 40;
const TOP = 54; // room for badges + arcs above
const PAD = 12;

export function LinkedListStage({ view }: { view: LinkedListView }) {
  const n = view.vals.length;
  if (n === 0) return <p className="text-slate-500">Empty list — enter some values.</p>;

  const step = NODE_W + GAP;
  const left = (i: number) => PAD + i * step;
  const cx = (i: number) => left(i) + NODE_W / 2;
  const midY = TOP + NODE_H / 2;
  const width = PAD * 2 + n * step;
  const height = TOP + NODE_H + 44; // room for null marker + backward arrows

  // Group badges by slot so multiple pointers stack.
  const badgesBySlot = new Map<number, string[]>();
  let nullBadges: string[] = [];
  for (const [name, slot] of Object.entries(view.badges)) {
    if (slot === null || slot < 0) nullBadges.push(name);
    else {
      if (!badgesBySlot.has(slot)) badgesBySlot.set(slot, []);
      badgesBySlot.get(slot)!.push(name);
    }
  }

  return (
    <svg width={width} height={height} className="max-w-full">
      <defs>
        <marker id="ll-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#64748b" />
        </marker>
      </defs>

      {view.next.map((t, i) => {
        if (t === null) {
          // null terminator to the right of node i
          const x = left(i) + NODE_W;
          return (
            <g key={`e${i}`}>
              <line x1={x} y1={midY} x2={x + GAP - 8} y2={midY} stroke="#475569" strokeWidth={1.5} markerEnd="url(#ll-arrow)" />
              <text x={x + GAP - 2} y={midY} dominantBaseline="central" fontSize="13" fill="#64748b">∅</text>
            </g>
          );
        }
        if (t === i + 1) {
          return (
            <line key={`e${i}`} x1={left(i) + NODE_W} y1={midY} x2={left(t)} y2={midY} stroke="#64748b" strokeWidth={1.5} markerEnd="url(#ll-arrow)" />
          );
        }
        // backward or skipping link → arc above the nodes
        const x1 = cx(i);
        const x2 = cx(t);
        const peak = TOP - 28;
        return (
          <path key={`e${i}`} d={`M ${x1},${TOP} Q ${(x1 + x2) / 2},${peak} ${x2},${TOP}`} fill="none" stroke="#f59e0b" strokeWidth={1.5} markerEnd="url(#ll-arrow)" />
        );
      })}

      {view.vals.map((v, i) => {
        const st = view.states[i] ?? "default";
        return (
          <g key={i}>
            <rect x={left(i)} y={TOP} width={NODE_W} height={NODE_H} rx={8} fill={FILL[st]} stroke="#475569" strokeWidth={1.5} />
            <text x={cx(i)} y={midY} textAnchor="middle" dominantBaseline="central" fontSize="13" fontFamily="monospace" fill={TEXT[st]}>
              {v}
            </text>
            {(badgesBySlot.get(i) ?? []).map((name, k) => (
              <text key={name} x={cx(i)} y={TOP - 10 - k * 14} textAnchor="middle" fontSize="11" fontFamily="monospace" fill="#fbbf24">
                {name}
              </text>
            ))}
          </g>
        );
      })}

      {nullBadges.length > 0 && (
        <text x={width - PAD} y={midY + 26} textAnchor="end" fontSize="11" fontFamily="monospace" fill="#fbbf24">
          {nullBadges.join(", ")} → ∅
        </text>
      )}
    </svg>
  );
}
