"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Language, Question, SelfGrade } from "@/lib/types";
import { storage } from "@/lib/storage";
import { PATTERNS } from "@/data/patterns";
import { getVisualizer } from "@/lib/algorithms/registry";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import { CodePad } from "./CodePad";

const SOLUTION_LANGS: { key: Language; label: string }[] = [
  { key: "python", label: "Python" },
  { key: "java", label: "Java" },
];

const SECTION = "rounded-xl border border-navy-600 bg-navy-800 p-5";

export function QuestionDetail({ question }: { question: Question }) {
  const [revealedHints, setRevealedHints] = useState(0);
  const [showEli5, setShowEli5] = useState(false);
  const [showApproach, setShowApproach] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [lang, setLang] = useState<Language>("python");
  const [bookmarked, setBookmarked] = useState(false);
  const [lastGrade, setLastGrade] = useState<SelfGrade | null>(null);

  // Hydrate persisted state on the client.
  useEffect(() => {
    const p = storage.getProgress(question.id);
    if (p) {
      setBookmarked(p.bookmarked);
      setLastGrade(p.grades.at(-1)?.grade ?? null);
    }
    storage.setStatus(question.id, p?.status && p.status !== "Not started" ? p.status : "Attempted");
  }, [question.id]);

  const grade = (g: SelfGrade) => {
    storage.addGrade(question.id, g);
    setLastGrade(g);
  };

  const toggleBookmark = () => {
    storage.toggleBookmark(question.id);
    setBookmarked((b) => !b);
  };

  // Link to the pattern's visualizer when one exists and is implemented.
  const visualizerSlug = PATTERNS[question.pattern]?.visualizerSlug;
  const hasVisualizer = visualizerSlug ? getVisualizer(visualizerSlug)?.implemented : false;

  if (question.stub) {
    return (
      <StubNotice question={question} bookmarked={bookmarked} onBookmark={toggleBookmark} />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-wrap items-center gap-3">
        <h1 className="font-mono text-2xl font-bold text-white">{question.title}</h1>
        <DifficultyBadge difficulty={question.difficulty} />
        <button
          onClick={toggleBookmark}
          className="ml-auto rounded-md border border-navy-600 bg-navy-700 px-3 py-1.5 text-sm hover:bg-navy-600"
          aria-pressed={bookmarked}
        >
          {bookmarked ? "★ Bookmarked" : "☆ Bookmark"}
        </button>
      </header>

      <div className="flex flex-wrap gap-2 text-xs text-slate-400">
        <span className="rounded bg-navy-700 px-2 py-1">{question.section}</span>
        <span className="rounded bg-navy-700 px-2 py-1">Time: {question.timeComplexity}</span>
        <span className="rounded bg-navy-700 px-2 py-1">Space: {question.spaceComplexity}</span>
        {question.companies.map((c) => (
          <span key={c} className="rounded bg-navy-700 px-2 py-1">
            {c}
          </span>
        ))}
        <a
          href={`https://leetcode.com/problems/${question.leetcodeSlug}/`}
          target="_blank"
          rel="noreferrer"
          className="rounded bg-navy-700 px-2 py-1 text-cell-current hover:underline"
        >
          LeetCode ↗
        </a>
        {hasVisualizer && (
          <Link
            href={`/visualize/${visualizerSlug}`}
            className="rounded border border-cell-current/40 bg-cell-current/10 px-2 py-1 text-amber-200 hover:bg-cell-current/20"
          >
            ▶ Visualize this pattern
          </Link>
        )}
      </div>

      <section className={SECTION}>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Problem
        </h2>
        <p className="whitespace-pre-line text-slate-200">{question.description}</p>
      </section>

      {question.examples.length > 0 && (
        <section className={SECTION}>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
            Examples
          </h2>
          <div className="flex flex-col gap-3">
            {question.examples.map((ex, i) => (
              <div key={i} className="rounded-md bg-navy-900 p-3 font-mono text-sm">
                <p className="text-slate-300">
                  <span className="text-slate-500">Input:</span> {ex.input}
                </p>
                <p className="text-slate-300">
                  <span className="text-slate-500">Output:</span> {ex.output}
                </p>
                {ex.explanation && (
                  <p className="mt-1 text-slate-400">
                    <span className="text-slate-500">Explanation:</span> {ex.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {question.constraints.length > 0 && (
        <section className={SECTION}>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
            Constraints
          </h2>
          <ul className="list-inside list-disc space-y-1 font-mono text-sm text-slate-300">
            {question.constraints.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Coding pad — write, run, and iterate before revealing the answer. */}
      <section className={SECTION}>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Coding pad
        </h2>
        <CodePad questionId={question.id} />
      </section>

      {/* Progressive hints. */}
      <section className={SECTION}>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Hints
        </h2>
        <div className="flex flex-col gap-2">
          {question.hints.slice(0, revealedHints).map((h, i) => (
            <p key={i} className="rounded-md bg-navy-900 p-3 text-sm text-slate-200">
              <span className="text-slate-500">Hint {i + 1}:</span> {h}
            </p>
          ))}
          {revealedHints < question.hints.length ? (
            <button
              onClick={() => setRevealedHints((n) => n + 1)}
              className="self-start rounded-md border border-navy-600 bg-navy-700 px-3 py-1.5 text-sm hover:bg-navy-600"
            >
              Reveal hint {revealedHints + 1} of {question.hints.length}
            </button>
          ) : (
            <p className="text-xs text-slate-500">All hints revealed.</p>
          )}
        </div>
      </section>

      {/* ELI5. */}
      <section className={SECTION}>
        <button
          onClick={() => setShowEli5((v) => !v)}
          className="rounded-md border border-cell-current/40 bg-cell-current/10 px-3 py-1.5 text-sm text-amber-200 hover:bg-cell-current/20"
        >
          🧸 {showEli5 ? "Hide" : "ELI5 this"}
        </button>
        {showEli5 && <p className="mt-3 text-slate-100">{question.eli5}</p>}
      </section>

      {/* Approach (collapsible). */}
      <section className={SECTION}>
        <button
          onClick={() => setShowApproach((v) => !v)}
          className="text-sm font-semibold text-slate-200 hover:text-white"
        >
          {showApproach ? "▾" : "▸"} Approach
        </button>
        {showApproach && (
          <p className="mt-3 whitespace-pre-line text-slate-200">{question.approach}</p>
        )}
      </section>

      {/* Solution (revealed on demand, with language tabs). */}
      <section className={SECTION}>
        {!showSolution ? (
          <button
            onClick={() => setShowSolution(true)}
            className="rounded-md bg-cell-current px-4 py-2 text-sm font-semibold text-navy-900 hover:bg-amber-400"
          >
            Reveal solution
          </button>
        ) : (
          <>
            <div className="mb-3 flex gap-2">
              {SOLUTION_LANGS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setLang(key)}
                  className={`rounded-md px-3 py-1.5 text-sm ${
                    lang === key
                      ? "bg-cell-active text-white"
                      : "bg-navy-700 text-slate-300 hover:bg-navy-600"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <pre className="thin-scroll overflow-x-auto rounded-md border border-navy-600 bg-navy-900 p-4 font-mono text-sm leading-relaxed text-slate-100">
              <code>{question.solutions[lang]}</code>
            </pre>

            {/* Self-grade. */}
            <div className="mt-4">
              <p className="mb-2 text-sm text-slate-400">How did it go?</p>
              <div className="flex flex-wrap gap-2">
                {(["Got it", "Struggled", "Failed"] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => grade(g)}
                    className={`rounded-md border px-3 py-1.5 text-sm transition ${
                      lastGrade === g
                        ? "border-cell-current bg-cell-current/15 text-amber-200"
                        : "border-navy-600 bg-navy-700 text-slate-200 hover:bg-navy-600"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
              {lastGrade && (
                <p className="mt-2 text-xs text-slate-500">
                  Recorded “{lastGrade}”.{" "}
                  {lastGrade !== "Got it" && "We'll resurface this for review soon."}
                </p>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function StubNotice({
  question,
  bookmarked,
  onBookmark,
}: {
  question: Question;
  bookmarked: boolean;
  onBookmark: () => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-wrap items-center gap-3">
        <h1 className="font-mono text-2xl font-bold text-white">{question.title}</h1>
        <DifficultyBadge difficulty={question.difficulty} />
        <button
          onClick={onBookmark}
          className="ml-auto rounded-md border border-navy-600 bg-navy-700 px-3 py-1.5 text-sm hover:bg-navy-600"
        >
          {bookmarked ? "★ Bookmarked" : "☆ Bookmark"}
        </button>
      </header>
      <div className="rounded-xl border border-dashed border-navy-600 bg-navy-800 p-8 text-center">
        <p className="text-lg font-semibold text-slate-200">
          Full write-up coming soon.
        </p>
        <p className="mt-2 text-sm text-slate-400">
          This question is in the bank ({question.section}) but its detailed solution,
          hints, and ELI5 are still being authored.
        </p>
        <a
          href={`https://leetcode.com/problems/${question.leetcodeSlug}/`}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-block text-cell-current hover:underline"
        >
          Practice it on LeetCode ↗
        </a>
      </div>
    </div>
  );
}
