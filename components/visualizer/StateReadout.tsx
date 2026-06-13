import type { Frame } from "@/lib/types";

interface StateReadoutProps {
  frame: Frame;
  eli5: boolean;
}

/** Live variable values plus the caption / condition under test (with ✓/✗). */
export function StateReadout({ frame, eli5 }: StateReadoutProps) {
  const entries = Object.entries(frame.variables);
  return (
    <div className="rounded-lg border border-navy-600 bg-navy-800 p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {entries.map(([k, v]) => (
          <span
            key={k}
            className="rounded-md bg-navy-700 px-2 py-1 font-mono text-xs text-slate-200"
          >
            <span className="text-slate-400">{k}</span>
            <span className="text-slate-500"> = </span>
            <span className="font-semibold text-cell-current">{String(v)}</span>
          </span>
        ))}
      </div>
      <p className="font-mono text-sm text-slate-100">
        {eli5 ? frame.eli5Caption : frame.caption}
      </p>
    </div>
  );
}
