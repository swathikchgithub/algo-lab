import { describe, expect, it } from "vitest";
import type { PlanInputs, Question, QuestionProgress, SelfGrade } from "@/lib/types";
import { generatePlan, orderedPool, questionsPerWeek } from "./generatePlan";
import { DAY_MS, isDueForReview, nextReviewDate, reviewIntervalDays } from "./spacedRepetition";
import { currentWeekNumber, todaysQuestions, WEEK_MS } from "./today";
import { rebalancePlan } from "./rebalance";

// --- fixtures --------------------------------------------------------------

function q(id: string, section: Question["section"], difficulty: Question["difficulty"], stub = false): Question {
  return {
    id,
    title: id,
    section,
    pattern: "two-pointers",
    difficulty,
    description: "",
    examples: [],
    constraints: [],
    eli5: "",
    hints: ["", "", ""],
    approach: "",
    solutions: { python: "", java: "" },
    timeComplexity: "",
    spaceComplexity: "",
    companies: [],
    leetcodeSlug: id,
    stub,
  };
}

const QUESTIONS: Question[] = [
  q("g1", "Graphs", "Easy"),
  q("a-hard", "Arrays", "Hard"),
  q("a-easy", "Arrays", "Easy"),
  q("a-med", "Arrays", "Medium"),
  q("s1", "Strings", "Easy"),
  q("stub1", "Arrays", "Easy", true), // excluded from planning
];

function progress(id: string, grades: SelfGrade[], lastAt: number, status: QuestionProgress["status"] = "Attempted"): QuestionProgress {
  return {
    questionId: id,
    status,
    grades: grades.map((g, i) => ({ grade: g, at: lastAt - (grades.length - 1 - i) * DAY_MS })),
    scratchpad: {},
    bookmarked: false,
    updatedAt: lastAt,
  };
}

const T0 = 1_000_000_000_000; // fixed "now" base

// --- generatePlan ----------------------------------------------------------

describe("orderedPool", () => {
  it("orders by section dependency, then Easy→Medium→Hard within a section", () => {
    const ids = orderedPool(QUESTIONS).map((x) => x.id);
    expect(ids).toEqual(["a-easy", "a-med", "a-hard", "s1", "g1"]);
  });

  it("excludes stub questions", () => {
    expect(orderedPool(QUESTIONS).some((x) => x.id === "stub1")).toBe(false);
  });
});

describe("questionsPerWeek", () => {
  it("scales with hours and level, with a floor of 1", () => {
    const base: PlanInputs = { weeks: 4, hoursPerWeek: 10, level: "Intermediate", targetCompanies: [] };
    expect(questionsPerWeek(base)).toBe(10);
    expect(questionsPerWeek({ ...base, level: "Advanced" })).toBe(15);
    expect(questionsPerWeek({ ...base, hoursPerWeek: 0, level: "Beginner" })).toBe(1);
  });
});

describe("generatePlan", () => {
  const inputs: PlanInputs = { weeks: 3, hoursPerWeek: 2, level: "Intermediate", targetCompanies: [] };

  it("slices the pool into the requested number of weeks", () => {
    const plan = generatePlan(inputs, QUESTIONS, T0);
    expect(plan.weeks).toHaveLength(3);
    expect(plan.weeks[0].questionIds).toEqual(["a-easy", "a-med"]); // 2/week
    expect(plan.weeks[1].questionIds).toEqual(["a-hard", "s1"]);
    expect(plan.weeks[2].questionIds).toEqual(["g1"]);
  });

  it("records the section(s) covered per week", () => {
    const plan = generatePlan(inputs, QUESTIONS, T0);
    expect(plan.weeks[1].sections).toEqual(["Arrays", "Strings"]);
  });
});

// --- spaced repetition -----------------------------------------------------

describe("reviewIntervalDays", () => {
  it("follows the 2 → 5 → 10 day schedule", () => {
    expect(reviewIntervalDays(1)).toBe(2);
    expect(reviewIntervalDays(2)).toBe(5);
    expect(reviewIntervalDays(3)).toBe(10);
    expect(reviewIntervalDays(9)).toBe(10);
  });
});

describe("nextReviewDate", () => {
  it("is null when never graded", () => {
    expect(nextReviewDate(progress("x", [], T0))).toBeNull();
  });

  it("is null once mastered (last grade Got it)", () => {
    expect(nextReviewDate(progress("x", ["Failed", "Got it"], T0))).toBeNull();
  });

  it("schedules 2 days out after a first poor grade", () => {
    const p = progress("x", ["Struggled"], T0);
    expect(nextReviewDate(p)).toBe(T0 + 2 * DAY_MS);
  });

  it("schedules 5 days out after a second poor grade", () => {
    const p = progress("x", ["Failed", "Struggled"], T0);
    expect(nextReviewDate(p)).toBe(T0 + 5 * DAY_MS);
  });
});

describe("isDueForReview", () => {
  it("is due once the interval has elapsed", () => {
    const p = progress("x", ["Struggled"], T0);
    expect(isDueForReview(p, T0 + 2 * DAY_MS)).toBe(true);
    expect(isDueForReview(p, T0 + DAY_MS)).toBe(false);
  });
});

// --- today -----------------------------------------------------------------

describe("currentWeekNumber", () => {
  const plan = generatePlan({ weeks: 4, hoursPerWeek: 2, level: "Intermediate", targetCompanies: [] }, QUESTIONS, T0);

  it("is week 1 at creation", () => {
    expect(currentWeekNumber(plan, T0)).toBe(1);
  });

  it("advances one week per elapsed week, clamped to plan length", () => {
    expect(currentWeekNumber(plan, T0 + 2 * WEEK_MS)).toBe(3);
    expect(currentWeekNumber(plan, T0 + 99 * WEEK_MS)).toBe(4);
  });
});

describe("todaysQuestions", () => {
  const plan = generatePlan({ weeks: 3, hoursPerWeek: 2, level: "Intermediate", targetCompanies: [] }, QUESTIONS, T0);

  it("prioritizes due reviews, then current-week unsolved, deduped and capped", () => {
    const allProgress = [progress("g1", ["Failed"], T0 - 2 * DAY_MS)]; // due now
    const today = todaysQuestions(plan, allProgress, T0, 5);
    expect(today[0]).toBe("g1"); // review first
    expect(today).toContain("a-easy"); // then week-1 items
    expect(new Set(today).size).toBe(today.length); // deduped
  });

  it("skips solved questions from the week list", () => {
    const allProgress = [progress("a-easy", ["Got it"], T0, "Solved")];
    const today = todaysQuestions(plan, allProgress, T0, 5);
    expect(today).not.toContain("a-easy");
    expect(today).toContain("a-med");
  });
});

// --- rebalance -------------------------------------------------------------

describe("rebalancePlan", () => {
  const inputs: PlanInputs = { weeks: 3, hoursPerWeek: 2, level: "Intermediate", targetCompanies: [] };

  it("keeps past weeks and regenerates the rest from unsolved questions", () => {
    const plan = generatePlan(inputs, QUESTIONS, T0);
    const now = T0 + 1 * WEEK_MS; // currently in week 2
    const allProgress = [progress("a-med", ["Got it"], now, "Solved")]; // solved one future item

    const rebalanced = rebalancePlan(plan, allProgress, QUESTIONS, now);

    // Week 1 is preserved verbatim.
    expect(rebalanced.weeks[0]).toEqual(plan.weeks[0]);
    // Week 1's items (a-easy, a-med) are locked/solved and not rescheduled.
    const futureIds = rebalanced.weeks.slice(1).flatMap((w) => w.questionIds);
    expect(futureIds).not.toContain("a-easy");
    expect(futureIds).not.toContain("a-med");
    expect(futureIds).toEqual(["a-hard", "s1", "g1"].slice(0, futureIds.length));
  });

  it("preserves inputs and createdAt (history not lost)", () => {
    const plan = generatePlan(inputs, QUESTIONS, T0);
    const rebalanced = rebalancePlan(plan, [], QUESTIONS, T0 + WEEK_MS);
    expect(rebalanced.inputs).toEqual(plan.inputs);
    expect(rebalanced.createdAt).toBe(plan.createdAt);
  });
});
