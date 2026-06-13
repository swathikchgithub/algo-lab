import type { PatternMeta } from "@/lib/types";

/** Friendly analogy panel shown above the code/animation while ELI5 is on. */
export function Eli5Panel({ pattern }: { pattern: PatternMeta }) {
  return (
    <div className="rounded-lg border border-cell-current/40 bg-cell-current/10 p-4">
      <div className="flex items-start gap-3">
        <span className="text-3xl" aria-hidden>
          {pattern.emoji}
        </span>
        <div>
          <p className="text-sm font-semibold text-amber-200">Explain like I&apos;m 5</p>
          <p className="mt-1 text-sm text-slate-100">{pattern.eli5}</p>
        </div>
      </div>
    </div>
  );
}
