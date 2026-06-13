import Link from "next/link";
import { notFound } from "next/navigation";
import { getVisualizer, VISUALIZERS } from "@/lib/algorithms/registry";
import { PATTERNS } from "@/data/patterns";
import { VisualizerSwitch } from "@/components/visualizer/VisualizerSwitch";

export function generateStaticParams() {
  return VISUALIZERS.map((v) => ({ slug: v.slug }));
}

export default function VisualizerPage({ params }: { params: { slug: string } }) {
  const meta = getVisualizer(params.slug);
  if (!meta) notFound();

  const pattern = PATTERNS[meta.patternSlug];

  return (
    <div>
      <Link href="/visualize" className="text-sm text-slate-400 hover:text-white">
        ← All visualizers
      </Link>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="font-mono text-3xl font-bold text-white">{meta.title}</h1>
        <span className="rounded-full border border-cell-current/40 bg-cell-current/10 px-3 py-1 font-mono text-sm text-amber-200">
          Complexity: {meta.complexity}
        </span>
      </div>
      <p className="mt-2 text-slate-400">{meta.tagline}</p>

      <div className="mt-6">
        {meta.implemented ? (
          <VisualizerSwitch slug={meta.slug} />
        ) : (
          <ComingSoon patternName={pattern?.name ?? meta.title} />
        )}
      </div>
    </div>
  );
}

function ComingSoon({ patternName }: { patternName: string }) {
  return (
    <div className="rounded-xl border border-dashed border-navy-600 bg-navy-800 p-8 text-center">
      <p className="text-lg font-semibold text-slate-200">This visualizer is on the way.</p>
      <p className="mt-2 text-sm text-slate-400">
        The {patternName} visualizer plugs a new frame generator into the same{" "}
        <code className="font-mono text-amber-200">&lt;Stepper&gt;</code> engine powering
        Binary Search. Try the{" "}
        <Link href="/visualize/binary-search" className="text-cell-current hover:underline">
          Binary Search visualizer
        </Link>{" "}
        in the meantime.
      </p>
    </div>
  );
}
