import { describe, expect, it } from "vitest";
import { searchRotatedFrames } from "./searchRotated";

describe("searchRotatedFrames", () => {
  const nums = [4, 5, 6, 7, 0, 1, 2];

  it("finds a target in the rotated tail", () => {
    expect(searchRotatedFrames(nums, 0).index).toBe(4);
  });

  it("finds a target in the rotated head", () => {
    expect(searchRotatedFrames(nums, 5).index).toBe(1);
  });

  it("returns -1 for an absent target", () => {
    expect(searchRotatedFrames(nums, 3).index).toBe(-1);
  });

  it("handles a single-element array", () => {
    expect(searchRotatedFrames([1], 0).index).toBe(-1);
    expect(searchRotatedFrames([1], 1).index).toBe(0);
  });

  it("halves the window each step (logarithmic frame count)", () => {
    // 7 elements → at most ceil(log2(7)) ≈ 3 comparisons, plus init frame.
    const { frames } = searchRotatedFrames(nums, 0);
    expect(frames.length).toBeLessThanOrEqual(5);
  });

  it("emits a non-empty eli5 caption on every frame", () => {
    for (const f of searchRotatedFrames(nums, 0).frames) {
      expect(f.eli5Caption.length).toBeGreaterThan(0);
    }
  });
});
