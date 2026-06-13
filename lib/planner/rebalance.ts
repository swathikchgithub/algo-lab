import type { PlanWeek, Question, QuestionProgress, StudyPlan } from "@/lib/types";
import { chunkIntoWeeks, orderedPool, questionsPerWeek } from "./generatePlan";
import { currentWeekNumber } from "./today";

/**
 * Rebalance a plan from current progress: past weeks are preserved verbatim, and
 * every week from the current one onward is regenerated from the still-unsolved
 * questions (in dependency order). Inputs and createdAt are kept, so user history
 * (progress/grades, which live in storage) is never lost.
 *
 * Time:  O(n log n). Space: O(n).
 */
export function rebalancePlan(
  plan: StudyPlan,
  allProgress: QuestionProgress[],
  questions: Question[],
  now: number,
): StudyPlan {
  const solved = new Set(
    allProgress.filter((p) => p.status === "Solved").map((p) => p.questionId),
  );

  const current = currentWeekNumber(plan, now);
  const pastWeeks = plan.weeks.filter((w) => w.week < current);

  // Questions already completed in past (kept) weeks shouldn't be rescheduled.
  const lockedFromPast = new Set(pastWeeks.flatMap((w) => w.questionIds));

  const remainingPool = orderedPool(questions).filter(
    (q) => !solved.has(q.id) && !lockedFromPast.has(q.id),
  );

  const remainingWeekCount = Math.max(0, plan.weeks.length - pastWeeks.length);
  const perWeek = questionsPerWeek(plan.inputs);

  const regenerated: PlanWeek[] = chunkIntoWeeks(
    remainingPool,
    perWeek,
    remainingWeekCount,
  ).map((w, i) => ({ ...w, week: current + i })); // renumber to follow past weeks

  return { ...plan, weeks: [...pastWeeks, ...regenerated] };
}
