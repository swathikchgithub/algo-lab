import { describe, expect, it } from "vitest";
import { findFirstLastFrames } from "./findFirstLast";

describe("findFirstLastFrames", () => {
  const nums = [5, 7, 7, 8, 8, 10];

  it("finds the first and last index of a repeated target", () => {
    expect(findFirstLastFrames(nums, 8).range).toEqual([3, 4]);
  });

  it("returns [-1, -1] when the target is absent", () => {
    expect(findFirstLastFrames(nums, 6).range).toEqual([-1, -1]);
  });

  it("returns the same index twice for a unique target", () => {
    expect(findFirstLastFrames(nums, 10).range).toEqual([5, 5]);
  });

  it("handles an empty array", () => {
    expect(findFirstLastFrames([], 0).range).toEqual([-1, -1]);
  });

  it("runs two passes with distinct labels", () => {
    const labels = new Set(
      findFirstLastFrames(nums, 8).frames.map((f) => f.variables.pass).filter(Boolean),
    );
    expect(labels).toContain("find first →");
    expect(labels).toContain("find last ←");
  });

  it("emits a non-empty eli5 caption on every frame", () => {
    for (const f of findFirstLastFrames(nums, 8).frames) {
      expect(f.eli5Caption.length).toBeGreaterThan(0);
    }
  });
});
