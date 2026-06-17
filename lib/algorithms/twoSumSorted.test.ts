import { describe, expect, it } from "vitest";
import { twoSumSortedFrames } from "./twoSumSorted";

describe("twoSumSortedFrames", () => {
  it("returns 1-indexed positions of the pair", () => {
    expect(twoSumSortedFrames([2, 7, 11, 15], 9).result).toEqual([1, 2]);
  });

  it("finds a pair spanning the array", () => {
    expect(twoSumSortedFrames([1, 3, 5, 7, 9, 11, 13], 14).result).toEqual([1, 7]);
  });

  it("returns [] when no pair matches", () => {
    expect(twoSumSortedFrames([1, 3, 5, 7], 100).result).toEqual([]);
  });

  it("moves the right pointer in when the sum is too big", () => {
    // 1+13=14 > 12 → r--; 1+11=12 → [1,6].
    expect(twoSumSortedFrames([1, 3, 5, 7, 9, 11, 13], 12).result).toEqual([1, 6]);
  });

  it("captions every frame", () => {
    for (const f of twoSumSortedFrames([2, 7, 11, 15], 9).frames) {
      expect(f.eli5Caption.length).toBeGreaterThan(0);
    }
  });
});
