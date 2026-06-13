"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { QUESTIONS, getQuestion, orderedSections, questionsBySection } from "@/data/questions";
import { storage } from "@/lib/storage";
import type { QuestionProgress, StudyPlan } from "@/lib/types";
import { currentStreak, difficultyBreakdown } from "@/lib/dashboard";
import { todaysQuestions } from "@/lib/planner/today";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";

const REAL_QUESTIONS = QUESTIONS.filter((q) => !q.stub);

export default function Dashboard() {
  const [progress, setProgress] = useState<QuestionProgress[]>([]);
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProgress(storage.getAllProgress());
    setPlan(storage.getPlan());
    setReady(true);
  }, []);

  const solvedIds = new Set(progress.filter((p) => p.status === "Solved").map((p) => p.questionId));
  const total = REAL_QUESTIONS.length;
  const solved = REAL_QUESTIONS.filter((q) => solvedIds.has(q.id)).length;
  const pct = total === 0 ? 0 : solved / total;
  const now = Date.now();
  const streak = ready ? currentStreak(progress, now) : 0;
  const diff = difficultyBreakdown(solvedIds, REAL_QUESTIONS);

  const today = ready && plan ? todaysQuestions(plan, progress, now, 5) : [];
  const lastTouched = ready
    ? [...progress].filter((p) => p.updatedAt > 0).sort((a, b) => b.updatedAt - a.updatedAt)[0]
    : undefined;

  return (
    <div>
      <h1 className="font-mono text-3xl font-bold text-white">
        Algo<span className="text-cell-current">Lab</span>
      </h1>
      <p className="mt-2 text-slate-400">
        Your DSA interview-prep cockpit — track progress, follow a plan, and watch
        algorithms run step by step.
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {/* Overall completion */}
        <div className="flex items-center gap-5 rounded-xl border border-navy-600 bg-navy-800 p-5">
          <ProgressRing value={pct} label={`${Math.round(pct * 100)}%`} sublabel="complete" />
          <div>
            <p className="text-2xl font-bold text-white">
              {solved}
              <span className="text-base font-normal text-slate-500"> / {total}</span>
            </p>
            <p className="text-sm text-slate-400">questions solved</p>
            <div className="mt-3 flex gap-3 text-xs">
              <DiffStat label="Easy" n={diff.Easy} color="text-diff-easy" />
              <DiffStat label="Medium" n={diff.Medium} color="text-diff-medium" />
              <DiffStat label="Hard" n={diff.Hard} color="text-diff-hard" />
            </div>
          </div>
        </div>

        {/* Streak */}
        <div className="rounded-xl border border-navy-600 bg-navy-800 p-5">
          <p className="text-sm text-slate-400">Current streak</p>
          <p className="mt-1 font-mono text-4xl font-bold text-white">
            {streak}
            <span className="text-lg text-slate-500"> day{streak === 1 ? "" : "s"}</span>
          </p>
          <p className="mt-2 text-sm text-slate-500">
            {streak > 0 ? "🔥 Keep it going!" : "Solve one question to start a streak."}
          </p>
        </div>

        {/* Continue where you left off */}
        <div className="rounded-xl border border-navy-600 bg-navy-800 p-5">
          <p className="text-sm text-slate-400">Continue where you left off</p>
          {lastTouched && getQuestion(lastTouched.questionId) ? (
            <Link
              href={`/questions/${lastTouched.questionId}`}
              className="mt-2 block font-medium text-slate-100 hover:text-cell-current"
            >
              {getQuestion(lastTouched.questionId)!.title} →
            </Link>
          ) : (
            <Link href="/questions" className="mt-2 block text-cell-current hover:underline">
              Browse the question bank →
            </Link>
          )}
        </div>
      </div>

      {/* Today's plan */}
      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Today&apos;s plan
          </h2>
          <Link href="/plan" className="text-sm text-cell-current hover:underline">
            {plan ? "View full plan →" : "Create a plan →"}
          </Link>
        </div>
        {plan && today.length > 0 ? (
          <ul className="divide-y divide-navy-700 overflow-hidden rounded-xl border border-navy-600">
            {today.map((id) => {
              const q = getQuestion(id);
              if (!q) return null;
              return (
                <li key={id}>
                  <Link
                    href={`/questions/${id}`}
                    className="flex items-center gap-3 bg-navy-800 px-4 py-3 hover:bg-navy-700"
                  >
                    <span className="flex-1 text-slate-200">{q.title}</span>
                    <DifficultyBadge difficulty={q.difficulty} />
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="rounded-xl border border-dashed border-navy-600 bg-navy-800 p-6 text-center text-sm text-slate-400">
            {plan ? "Nothing scheduled today." : "No study plan yet — create one to get a daily list."}
          </div>
        )}
      </section>

      {/* Per-section progress */}
      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
          By section
        </h2>
        <div className="grid gap-2">
          {orderedSections().map((s) => {
            const inSection = questionsBySection(s).filter((q) => !q.stub);
            const done = inSection.filter((q) => solvedIds.has(q.id)).length;
            const ratio = inSection.length === 0 ? 0 : done / inSection.length;
            return (
              <div key={s} className="rounded-lg border border-navy-600 bg-navy-800 px-4 py-3">
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-slate-200">{s}</span>
                  <span className="font-mono text-xs text-slate-500">
                    {done}/{inSection.length}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-navy-700">
                  <div className="h-full bg-cell-active" style={{ width: `${ratio * 100}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick links to visualizers */}
      <section className="mt-6 rounded-xl border border-navy-600 bg-navy-800 p-5">
        <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Visualize an algorithm
        </h2>
        <p className="text-sm text-slate-400">
          Step through Binary Search frame by frame, with an ELI5 mode.{" "}
          <Link href="/visualize" className="text-cell-current hover:underline">
            Open the gallery →
          </Link>
        </p>
      </section>
    </div>
  );
}

function DiffStat({ label, n, color }: { label: string; n: number; color: string }) {
  return (
    <span className={color}>
      {label}: <span className="font-semibold">{n}</span>
    </span>
  );
}
