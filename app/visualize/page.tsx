import Link from "next/link";
import { VISUALIZERS } from "@/lib/algorithms/registry";

export const metadata = { title: "Visualizers — AlgoLab" };

export default function VisualizeGallery() {
  return (
    <div>
      <h1 className="font-mono text-3xl font-bold text-white">Visualizers</h1>
      <p className="mt-2 text-slate-400">
        Step through algorithms frame by frame. Play, pause, scrub, and flip on ELI5
        to see the plain-language story.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {VISUALIZERS.map((v) => {
          const card = (
            <div
              className={`flex h-full flex-col rounded-xl border border-navy-600 bg-navy-800 p-5 transition ${
                v.implemented ? "hover:border-cell-current/60 hover:bg-navy-700" : "opacity-70"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-mono text-lg font-semibold text-white">{v.title}</h2>
                <span className="shrink-0 rounded-full border border-cell-current/40 bg-cell-current/10 px-2 py-0.5 font-mono text-xs text-amber-200">
                  {v.complexity}
                </span>
              </div>
              <p className="mt-2 flex-1 text-sm text-slate-400">{v.tagline}</p>
              <span className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {v.implemented ? "Open →" : "Coming soon"}
              </span>
            </div>
          );

          return v.implemented ? (
            <Link key={v.slug} href={`/visualize/${v.slug}`}>
              {card}
            </Link>
          ) : (
            <div key={v.slug} aria-disabled>
              {card}
            </div>
          );
        })}
      </div>
    </div>
  );
}
