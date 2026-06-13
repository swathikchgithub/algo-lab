import type { Difficulty, Level, PlanInputs, PlanWeek, Question, Section, StudyPlan } from "@/lib/types";
import { SECTIONS } from "@/lib/types";

// Pure study-plan generation. Orders questions by section dependency, front-loads
// Easy within each section, and slices the pool into weekly buckets sized by the
// learner's available hours and self-rated level.

const DIFFICULTY_RANK: Record<Difficulty, number> = { Easy: 0, Medium: 1, Hard: 2 };

/** Questions a learner can realistically work through per study hour, by level. */
const QUESTIONS_PER_HOUR: Record<Level, number> = {
  Beginner: 0.75,
  Intermediate: 1,
  Advanced: 1.5,
};

/** How many questions to schedule per week for these inputs (min 1). */
export function questionsPerWeek(inputs: PlanInputs): number {
  return Math.max(1, Math.round(inputs.hoursPerWeek * QUESTIONS_PER_HOUR[inputs.level]));
}

/**
 * The schedulable pool in study order: section-dependency order, and within each
 * section Easy → Medium → Hard (front-loading Easy). Stub questions (no authored
 * content) are excluded — you can't practice what isn't written yet.
 */
export function orderedPool(questions: Question[]): Question[] {
  const sectionIndex = new Map<Section, number>(SECTIONS.map((s, i) => [s, i]));
  return questions
    .filter((q) => !q.stub)
    .slice()
    .sort((a, b) => {
      const s = (sectionIndex.get(a.section) ?? 0) - (sectionIndex.get(b.section) ?? 0);
      if (s !== 0) return s;
      return DIFFICULTY_RANK[a.difficulty] - DIFFICULTY_RANK[b.difficulty];
    });
}

/** Slice an ordered id list into weekly buckets of the given size. */
export function chunkIntoWeeks(pool: Question[], perWeek: number, weeks: number): PlanWeek[] {
  const result: PlanWeek[] = [];
  let cursor = 0;
  for (let week = 1; week <= weeks; week++) {
    const slice = pool.slice(cursor, cursor + perWeek);
    cursor += slice.length;
    const sections = [...new Set(slice.map((q) => q.section))];
    result.push({ week, questionIds: slice.map((q) => q.id), sections });
    if (cursor >= pool.length) {
      // Pad remaining weeks as empty so the calendar still spans the full range.
      for (let w = week + 1; w <= weeks; w++) {
        result.push({ week: w, questionIds: [], sections: [] });
      }
      break;
    }
  }
  return result;
}

/**
 * Generate a fresh study plan.
 *
 * Time:  O(n log n) — dominated by sorting the question pool.
 * Space: O(n).
 */
export function generatePlan(inputs: PlanInputs, questions: Question[], now: number): StudyPlan {
  const pool = orderedPool(questions);
  const perWeek = questionsPerWeek(inputs);
  const weeks = chunkIntoWeeks(pool, perWeek, inputs.weeks);
  return { inputs, weeks, createdAt: now };
}
