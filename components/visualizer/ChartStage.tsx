import type { ChartView } from "@/lib/algorithms/views";

const W = 380;
const H = 210;
const PAD = 36;

/** Operations-vs-input-size chart for the Big-O explainer. Points are 0..1. */
export function ChartStage({ view }: { view: ChartView }) {
  const px = (x: number) => PAD + x * (W - PAD - 10);
  const py = (y: number) => H - PAD - y * (H - PAD - 10);
  const poly = view.points.map((p) => `${px(p.x)},${py(p.y)}`).join(" ");
  const last = view.points[view.points.length - 1];

  return (
    <div className="rounded-lg border border-navy-600 bg-navy-900 p-2">
      <svg width={W} height={H} className="max-w-full">
        {/* axes */}
        <line x1={PAD} y1={H - PAD} x2={W - 10} y2={H - PAD} stroke="#475569" />
        <line x1={PAD} y1={H - PAD} x2={PAD} y2={10} stroke="#475569" />
        <text x={W / 2} y={H - 6} textAnchor="middle" fontSize="10" fill="#64748b">
          x: input size (n)
        </text>
        <text x={12} y={H / 2} textAnchor="middle" fontSize="10" fill="#64748b" transform={`rotate(-90 12 ${H / 2})`}>
          y: operations
        </text>
        {view.points.length > 1 && <polyline points={poly} fill="none" stroke="#f59e0b" strokeWidth={2} />}
        {last && <circle cx={px(last.x)} cy={py(last.y)} r={4} fill="#f59e0b" />}
      </svg>
      <p className="mt-1 px-2 font-mono text-sm text-amber-200">
        {view.curve}: n = {view.n} → {view.ops} operations
      </p>
    </div>
  );
}
