import type { QuestionProgress, StudyPlan } from "@/lib/types";
import { dueReviewIds, DAY_MS } from "./spacedRepetition";

export const WEEK_MS = 7 * DAY_MS;

const SOLVED_STATUSES = new Set(["Solved"]);

/** 1-based current week index based on elapsed time, clamped to the plan length. */
export function currentWeekNumber(plan: StudyPlan, now: number): number {
  const elapsedWeeks = Math.floor((now - plan.createdAt) / WEEK_MS);
  return Math.min(Math.max(1, elapsedWeeks + 1), plan.weeks.length || 1);
}

/**
 * Today's question list (3–5 items): spaced-repetition reviews first, then the
 * next not-yet-solved questions from the current week. Deduped, capped at `max`.
 *
 * Time:  O(n) over progress + current-week ids. Space: O(n).
 */
export function todaysQuestions(
  plan: StudyPlan,
  allProgress: QuestionProgress[],
  now: number,
  max = 5,
): string[] {
  const solved = new Set(
    allProgress.filter((p) => SOLVED_STATUSES.has(p.status)).map((p) => p.questionId),
  );

  const result: string[] = [];
  const seen = new Set<string>();
  const push = (id: string) => {
    if (!seen.has(id)) {
      seen.add(id);
      result.push(id);
    }
  };

  // 1) Reviews that are due take priority.
  for (const id of dueReviewIds(allProgress, now)) {
    if (result.length >= max) break;
    push(id);
  }

  // 2) Fill with this week's unsolved questions.
  const week = plan.weeks[currentWeekNumber(plan, now) - 1];
  if (week) {
    for (const id of week.questionIds) {
      if (result.length >= max) break;
      if (!solved.has(id)) push(id);
    }
  }

  return result;
}
