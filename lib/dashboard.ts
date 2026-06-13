import type { Difficulty, QuestionProgress, Section } from "@/lib/types";
import { DAY_MS } from "@/lib/planner/spacedRepetition";

// Pure helpers that turn raw progress + the question bank into dashboard stats.

export interface SectionStat {
  section: Section;
  total: number;
  solved: number;
}

/** Count of solved questions per difficulty. */
export function difficultyBreakdown(
  solvedIds: Set<string>,
  questions: { id: string; difficulty: Difficulty }[],
): Record<Difficulty, number> {
  const out: Record<Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  for (const q of questions) if (solvedIds.has(q.id)) out[q.difficulty]++;
  return out;
}

/**
 * Current daily streak: consecutive days (ending today or yesterday) on which
 * the learner touched at least one question. Pass `now` for determinism.
 */
export function currentStreak(allProgress: QuestionProgress[], now: number): number {
  const days = new Set<number>();
  for (const p of allProgress) {
    if (p.updatedAt > 0) days.add(Math.floor(p.updatedAt / DAY_MS));
    for (const g of p.grades) days.add(Math.floor(g.at / DAY_MS));
  }
  if (days.size === 0) return 0;

  const today = Math.floor(now / DAY_MS);
  // Allow the streak to "start" today or yesterday.
  let cursor = days.has(today) ? today : days.has(today - 1) ? today - 1 : -1;
  if (cursor === -1) return 0;

  let streak = 0;
  while (days.has(cursor)) {
    streak++;
    cursor--;
  }
  return streak;
}
