import { describe, expect, it } from "vitest";
import { climbingStairsFrames } from "./climbingStairs";

describe("climbingStairsFrames", () => {
  it("counts the ways (Fibonacci)", () => {
    expect(climbingStairsFrames(2).result).toBe(2);
    expect(climbingStairsFrames(3).result).toBe(3);
    expect(climbingStairsFrames(5).result).toBe(8);
  });

  it("handles n = 1", () => {
    expect(climbingStairsFrames(1).result).toBe(1);
  });

  it("captions every frame", () => {
    for (const f of climbingStairsFrames(5).frames) {
      expect(f.eli5Caption.length).toBeGreaterThan(0);
    }
  });
});
