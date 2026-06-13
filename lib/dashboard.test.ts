import { describe, expect, it } from "vitest";
import type { QuestionProgress } from "@/lib/types";
import { currentStreak, difficultyBreakdown } from "./dashboard";
import { DAY_MS } from "./planner/spacedRepetition";

const T0 = 1_000_000_000_000;

function prog(id: string, updatedAt: number): QuestionProgress {
  return {
    questionId: id,
    status: "Attempted",
    grades: [],
    scratchpad: {},
    bookmarked: false,
    updatedAt,
  };
}

describe("difficultyBreakdown", () => {
  it("counts solved questions per difficulty", () => {
    const solved = new Set(["a", "c"]);
    const result = difficultyBreakdown(solved, [
      { id: "a", difficulty: "Easy" },
      { id: "b", difficulty: "Easy" }, // not solved
      { id: "c", difficulty: "Hard" },
    ]);
    expect(result).toEqual({ Easy: 1, Medium: 0, Hard: 1 });
  });
});

describe("currentStreak", () => {
  it("is 0 with no activity", () => {
    expect(currentStreak([], T0)).toBe(0);
  });

  it("counts consecutive active days ending today", () => {
    const p = [prog("a", T0), prog("b", T0 - DAY_MS), prog("c", T0 - 2 * DAY_MS)];
    expect(currentStreak(p, T0)).toBe(3);
  });

  it("allows the streak to start yesterday", () => {
    expect(currentStreak([prog("a", T0 - DAY_MS)], T0)).toBe(1);
  });

  it("breaks when a day is skipped", () => {
    const p = [prog("a", T0), prog("b", T0 - 2 * DAY_MS)]; // missing yesterday
    expect(currentStreak(p, T0)).toBe(1);
  });

  it("resets to 0 when the last activity is too old", () => {
    expect(currentStreak([prog("a", T0 - 5 * DAY_MS)], T0)).toBe(0);
  });
});
