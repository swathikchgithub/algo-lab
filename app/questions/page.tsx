"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { QUESTIONS, allCompanies, orderedSections } from "@/data/questions";
import { PATTERNS } from "@/data/patterns";
import { storage } from "@/lib/storage";
import type { QuestionStatus, Section } from "@/lib/types";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";

const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
const STATUSES: QuestionStatus[] = ["Not started", "Attempted", "Solved", "Needs review"];

const selectClass =
  "rounded-md border border-navy-600 bg-navy-800 px-3 py-2 text-sm text-slate-200 focus:border-cell-current focus:outline-none";

export default function QuestionsPage() {
  const [search, setSearch] = useState("");
  const [section, setSection] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [statusById, setStatusById] = useState<Record<string, QuestionStatus>>({});

  // Read persisted statuses on the client only (storage is SSR-safe but empty on server).
  useEffect(() => {
    const map: Record<string, QuestionStatus> = {};
    for (const p of storage.getAllProgress()) map[p.questionId] = p.status;
    setStatusById(map);
  }, []);

  const sections = useMemo(() => orderedSections(), []);
  const companies = useMemo(() => allCompanies(), []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return QUESTIONS.filter((question) => {
      if (section && question.section !== section) return false;
      if (difficulty && question.difficulty !== difficulty) return false;
      if (company && !question.companies.includes(company)) return false;
      if (status) {
        const s = statusById[question.id] ?? "Not started";
        if (s !== status) return false;
      }
      if (q && !question.title.toLowerCase().includes(q) && !question.pattern.includes(q))
        return false;
      return true;
    });
  }, [search, section, difficulty, company, status, statusById]);

  return (
    <div>
      <h1 className="font-mono text-3xl font-bold text-white">Question Bank</h1>
      <p className="mt-2 text-slate-400">
        {QUESTIONS.length} questions across {sections.length} sections. Filter, search,
        and track your progress.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search title or pattern…"
          className={`${selectClass} min-w-48 flex-1`}
        />
        <select className={selectClass} value={section} onChange={(e) => setSection(e.target.value)}>
          <option value="">All sections</option>
          {sections.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select className={selectClass} value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="">Any difficulty</option>
          {DIFFICULTIES.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <select className={selectClass} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Any status</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select className={selectClass} value={company} onChange={(e) => setCompany(e.target.value)}>
          <option value="">Any company</option>
          {companies.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <p className="mt-4 text-xs text-slate-500">{filtered.length} matching</p>

      <ul className="mt-2 divide-y divide-navy-700 overflow-hidden rounded-xl border border-navy-600">
        {filtered.map((question) => {
          const s = statusById[question.id] ?? "Not started";
          return (
            <li key={question.id}>
              <Link
                href={`/questions/${question.id}`}
                className="flex flex-wrap items-center gap-x-3 gap-y-1 bg-navy-800 px-4 py-3 transition hover:bg-navy-700"
              >
                <span className="flex-1 font-medium text-slate-100">
                  {question.title}
                  {question.stub && (
                    <span className="ml-2 align-middle text-xs text-slate-500">(soon)</span>
                  )}
                </span>
                <span className="text-xs text-slate-500">
                  {PATTERNS[question.pattern]?.name ?? question.pattern}
                </span>
                <span className="hidden text-xs text-slate-600 sm:inline">{question.section}</span>
                <DifficultyBadge difficulty={question.difficulty} />
                <StatusDot status={s} />
              </Link>
            </li>
          );
        })}
        {filtered.length === 0 && (
          <li className="bg-navy-800 px-4 py-8 text-center text-slate-500">
            No questions match these filters.
          </li>
        )}
      </ul>
    </div>
  );
}

function StatusDot({ status }: { status: QuestionStatus }) {
  const color =
    status === "Solved"
      ? "text-diff-easy"
      : status === "Needs review"
        ? "text-diff-hard"
        : status === "Attempted"
          ? "text-diff-medium"
          : "text-slate-600";
  return (
    <span className={`w-24 text-right text-xs ${color}`} title={status}>
      ● {status}
    </span>
  );
}
