"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { QUESTIONS, getQuestion, allCompanies } from "@/data/questions";
import { storage } from "@/lib/storage";
import type { Level, PlanInputs, StudyPlan } from "@/lib/types";
import { generatePlan } from "@/lib/planner/generatePlan";
import { rebalancePlan } from "@/lib/planner/rebalance";
import { currentWeekNumber, todaysQuestions } from "@/lib/planner/today";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";

const LEVELS: Level[] = ["Beginner", "Intermediate", "Advanced"];

export default function PlanPage() {
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setPlan(storage.getPlan());
    setReady(true);
  }, []);

  if (!ready) return <p className="text-slate-400">Loading…</p>;

  return (
    <div>
      <h1 className="font-mono text-3xl font-bold text-white">Study Planner</h1>
      <p className="mt-2 text-slate-400">
        A week-by-week plan in section-dependency order, with spaced-repetition reviews.
      </p>
      <div className="mt-6">
        {plan ? (
          <PlanView plan={plan} setPlan={setPlan} />
        ) : (
          <Wizard onCreate={setPlan} />
        )}
      </div>
    </div>
  );
}

function Wizard({ onCreate }: { onCreate: (p: StudyPlan) => void }) {
  const [weeks, setWeeks] = useState(8);
  const [hoursPerWeek, setHoursPerWeek] = useState(6);
  const [level, setLevel] = useState<Level>("Intermediate");
  const [companies, setCompanies] = useState<string[]>([]);
  const companyOptions = useMemo(() => allCompanies(), []);

  const submit = () => {
    const inputs: PlanInputs = { weeks, hoursPerWeek, level, targetCompanies: companies };
    const plan = generatePlan(inputs, QUESTIONS, Date.now());
    storage.setPlan(plan);
    onCreate(plan);
  };

  return (
    <div className="max-w-lg rounded-xl border border-navy-600 bg-navy-800 p-6">
      <h2 className="mb-4 text-lg font-semibold text-white">Build your plan</h2>

      <Field label={`Weeks until interview: ${weeks}`}>
        <input type="range" min={1} max={24} value={weeks} onChange={(e) => setWeeks(+e.target.value)} className="w-full" />
      </Field>

      <Field label={`Hours per week: ${hoursPerWeek}`}>
        <input type="range" min={1} max={30} value={hoursPerWeek} onChange={(e) => setHoursPerWeek(+e.target.value)} className="w-full" />
      </Field>

      <Field label="Level">
        <div className="flex gap-2">
          {LEVELS.map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`rounded-md px-3 py-1.5 text-sm ${
                level === l ? "bg-cell-active text-white" : "bg-navy-700 text-slate-300 hover:bg-navy-600"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Target companies (optional)">
        <div className="flex flex-wrap gap-2">
          {companyOptions.map((c) => {
            const on = companies.includes(c);
            return (
              <button
                key={c}
                onClick={() =>
                  setCompanies((prev) => (on ? prev.filter((x) => x !== c) : [...prev, c]))
                }
                className={`rounded-full px-2.5 py-1 text-xs ${
                  on ? "bg-cell-current text-navy-900" : "bg-navy-700 text-slate-300 hover:bg-navy-600"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </Field>

      <button
        onClick={submit}
        className="mt-2 w-full rounded-md bg-cell-current px-4 py-2.5 font-semibold text-navy-900 hover:bg-amber-400"
      >
        Generate plan
      </button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm text-slate-300">{label}</label>
      {children}
    </div>
  );
}

function PlanView({ plan, setPlan }: { plan: StudyPlan; setPlan: (p: StudyPlan | null) => void }) {
  const now = Date.now();
  const allProgress = storage.getAllProgress();
  const today = todaysQuestions(plan, allProgress, now, 5);
  const week = currentWeekNumber(plan, now);

  const rebalance = () => {
    const next = rebalancePlan(plan, storage.getAllProgress(), QUESTIONS, Date.now());
    storage.setPlan(next);
    setPlan(next);
  };

  const startOver = () => {
    storage.clearPlan();
    setPlan(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
        <span className="rounded bg-navy-700 px-2 py-1">{plan.inputs.weeks} weeks</span>
        <span className="rounded bg-navy-700 px-2 py-1">{plan.inputs.hoursPerWeek} hrs/week</span>
        <span className="rounded bg-navy-700 px-2 py-1">{plan.inputs.level}</span>
        <span className="rounded bg-navy-700 px-2 py-1">Currently week {week}</span>
        <button onClick={rebalance} className="ml-auto rounded-md border border-navy-600 bg-navy-700 px-3 py-1.5 hover:bg-navy-600">
          Rebalance my plan
        </button>
        <button onClick={startOver} className="rounded-md border border-navy-600 bg-navy-700 px-3 py-1.5 hover:bg-navy-600">
          Start over
        </button>
      </div>

      <section className="rounded-xl border border-cell-current/40 bg-cell-current/5 p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-amber-200">
          Today&apos;s questions
        </h2>
        <QuestionLinks ids={today} emptyText="Nothing due today — pick anything from this week below." />
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Weekly plan
        </h2>
        <div className="grid gap-3">
          {plan.weeks.map((w) => (
            <div
              key={w.week}
              className={`rounded-xl border p-4 ${
                w.week === week ? "border-cell-current/60 bg-navy-800" : "border-navy-600 bg-navy-800"
              }`}
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="font-mono text-sm font-semibold text-white">Week {w.week}</span>
                {w.week === week && (
                  <span className="rounded-full bg-cell-current/20 px-2 py-0.5 text-xs text-amber-200">
                    current
                  </span>
                )}
                <span className="text-xs text-slate-500">{w.sections.join(" · ") || "—"}</span>
              </div>
              <QuestionLinks ids={w.questionIds} emptyText="Rest / catch up week." />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function QuestionLinks({ ids, emptyText }: { ids: string[]; emptyText: string }) {
  if (ids.length === 0) return <p className="text-sm text-slate-500">{emptyText}</p>;
  return (
    <ul className="divide-y divide-navy-700">
      {ids.map((id) => {
        const q = getQuestion(id);
        if (!q) return null;
        return (
          <li key={id}>
            <Link href={`/questions/${id}`} className="flex items-center gap-3 py-2 hover:text-white">
              <span className="flex-1 text-slate-200">{q.title}</span>
              <span className="hidden text-xs text-slate-500 sm:inline">{q.section}</span>
              <DifficultyBadge difficulty={q.difficulty} />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
