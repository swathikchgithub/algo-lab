import Link from "next/link";
import { notFound } from "next/navigation";
import { PATTERNS } from "@/data/patterns";
import { QUESTIONS } from "@/data/questions";
import { Eli5Panel } from "@/components/visualizer/Eli5Panel";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";

export function generateStaticParams() {
  return Object.keys(PATTERNS).map((slug) => ({ slug }));
}

const CARD = "rounded-xl border border-navy-600 bg-navy-800 p-5";

export default function PatternPage({ params }: { params: { slug: string } }) {
  const pattern = PATTERNS[params.slug];
  if (!pattern) notFound();

  const linked = QUESTIONS.filter((q) => q.pattern === params.slug);
  const others = Object.values(PATTERNS).filter((p) => p.slug !== params.slug);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-sm text-slate-500">{pattern.section}</p>
        <h1 className="font-mono text-3xl font-bold text-white">{pattern.name}</h1>
        <p className="mt-2 text-slate-400">{pattern.blurb}</p>
      </div>

      <Eli5Panel pattern={pattern} />

      <section className={CARD}>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
          When to use it
        </h2>
        <p className="text-slate-200">{pattern.whenToUse}</p>
      </section>

      <section className={CARD}>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Template
        </h2>
        <pre className="thin-scroll overflow-x-auto rounded-md border border-navy-600 bg-navy-900 p-4 font-mono text-sm leading-relaxed text-slate-100">
          <code>{pattern.template}</code>
        </pre>
        {pattern.visualizerSlug && (
          <Link
            href={`/visualize/${pattern.visualizerSlug}`}
            className="mt-3 inline-block text-sm text-cell-current hover:underline"
          >
            See it animated →
          </Link>
        )}
      </section>

      <section className={CARD}>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Linked questions ({linked.length})
        </h2>
        <ul className="divide-y divide-navy-700">
          {linked.map((q) => (
            <li key={q.id}>
              <Link
                href={`/questions/${q.id}`}
                className="flex items-center gap-3 py-2 hover:text-white"
              >
                <span className="flex-1 text-slate-200">{q.title}</span>
                <DifficultyBadge difficulty={q.difficulty} />
              </Link>
            </li>
          ))}
          {linked.length === 0 && <li className="py-2 text-slate-500">No questions yet.</li>}
        </ul>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Other patterns
        </h2>
        <div className="flex flex-wrap gap-2">
          {others.map((p) => (
            <Link
              key={p.slug}
              href={`/patterns/${p.slug}`}
              className="rounded-full border border-navy-600 bg-navy-700 px-3 py-1.5 text-sm text-slate-300 hover:bg-navy-600 hover:text-white"
            >
              {p.emoji} {p.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
