import { describe, expect, it } from "vitest";
import { sortedSquaresFrames, type SquaresView } from "./sortedSquares";

describe("sortedSquaresFrames", () => {
  it("returns the sorted squares for a mixed-sign array", () => {
    expect(sortedSquaresFrames([-4, -1, 0, 3, 10]).res).toEqual([0, 1, 9, 16, 100]);
  });

  it("returns the sorted squares when both ends are large", () => {
    expect(sortedSquaresFrames([-7, -3, 2, 3, 11]).res).toEqual([4, 9, 9, 49, 121]);
  });

  it("handles a single element", () => {
    expect(sortedSquaresFrames([5]).res).toEqual([25]);
  });

  it("starts with an all-zero (unfilled) result row and pointers at the ends", () => {
    const first = sortedSquaresFrames([-4, -1, 0, 3, 10]).frames[0];
    expect(first.pointers).toEqual({ L: 0, R: 4 });
    expect((first.view as unknown as SquaresView).res).toEqual([0, 0, 0, 0, 0]);
  });

  it("writes the result back-to-front (largest square first)", () => {
    const { frames } = sortedSquaresFrames([-4, -1, 0, 3, 10]);
    // First write fills the LAST slot with the largest square (10² = 100).
    const firstWrite = frames[1];
    expect(firstWrite.variables.pos).toBe(4);
    expect((firstWrite.view as unknown as SquaresView).res[4]).toBe(100);
  });

  it("emits parallel-length rows with a non-empty eli5 caption on every frame", () => {
    const nums = [-4, -1, 0, 3, 10];
    for (const f of sortedSquaresFrames(nums).frames) {
      expect(f.cellStates).toHaveLength(nums.length);
      expect((f.view as unknown as SquaresView).res).toHaveLength(nums.length);
      expect(f.eli5Caption.length).toBeGreaterThan(0);
    }
  });

  it("ends on the return line", () => {
    const { frames } = sortedSquaresFrames([-4, -1, 0, 3, 10]);
    expect(frames[frames.length - 1].highlightLine).toBe(11);
  });
});
