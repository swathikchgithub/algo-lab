import { describe, expect, it } from "vitest";
import { binarySearchFrames } from "./binarySearchBasic";

describe("binarySearchFrames", () => {
  const nums = [-1, 0, 3, 5, 9, 12];

  it("finds an existing target", () => {
    expect(binarySearchFrames(nums, 9, "find").result).toBe(4);
  });

  it("returns -1 for an absent target in find mode", () => {
    expect(binarySearchFrames(nums, 2, "find").result).toBe(-1);
  });

  it("returns the insertion point for an absent target in insert mode", () => {
    // 2 belongs between 0 (idx 1) and 3 (idx 2) → index 2.
    expect(binarySearchFrames([1, 3, 5, 6], 2, "insert").result).toBe(1);
  });

  it("returns the matching index in insert mode when present", () => {
    expect(binarySearchFrames([1, 3, 5, 6], 5, "insert").result).toBe(2);
  });

  it("appends past the end when the target is larger than all", () => {
    expect(binarySearchFrames([1, 3, 5, 6], 7, "insert").result).toBe(4);
  });

  it("halves the window (logarithmic frame count) and captions every frame", () => {
    const { frames } = binarySearchFrames(nums, 9, "find");
    expect(frames.length).toBeLessThanOrEqual(5);
    for (const f of frames) expect(f.eli5Caption.length).toBeGreaterThan(0);
  });
});
