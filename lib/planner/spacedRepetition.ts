import type { QuestionProgress, SelfGrade } from "@/lib/types";

// Spaced repetition: a question graded "Struggled" or "Failed" resurfaces after
// 2, then 5, then 10 days. A subsequent "Got it" clears it from review.
// All functions are pure — callers pass `now` (epoch ms) for determinism.

export const DAY_MS = 24 * 60 * 60 * 1000;

/** Days until the next review given how many times it has been graded poorly. */
export function reviewIntervalDays(poorGradeCount: number): number {
  if (poorGradeCount <= 1) return 2;
  if (poorGradeCount === 2) return 5;
  return 10;
}

const POOR: ReadonlySet<SelfGrade> = new Set(["Struggled", "Failed"]);

/**
 * When this question is next due for review (epoch ms), or null if it never is.
 * Null means: never graded, or the most recent grade was "Got it" (mastered).
 */
export function nextReviewDate(progress: QuestionProgress): number | null {
  const { grades } = progress;
  if (grades.length === 0) return null;

  const last = grades[grades.length - 1];
  if (last.grade === "Got it") return null; // mastered — drop from rotation

  const poorCount = grades.reduce((n, g) => (POOR.has(g.grade) ? n + 1 : n), 0);
  return last.at + reviewIntervalDays(poorCount) * DAY_MS;
}

/** Whether the question should appear in today's review list. */
export function isDueForReview(progress: QuestionProgress, now: number): boolean {
  const due = nextReviewDate(progress);
  return due !== null && now >= due;
}

/** Question ids currently due for review, soonest-overdue first. */
export function dueReviewIds(allProgress: QuestionProgress[], now: number): string[] {
  return allProgress
    .map((p) => ({ id: p.questionId, due: nextReviewDate(p) }))
    .filter((x): x is { id: string; due: number } => x.due !== null && now >= x.due)
    .sort((a, b) => a.due - b.due)
    .map((x) => x.id);
}
