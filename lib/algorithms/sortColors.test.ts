import { describe, expect, it } from "vitest";
import { sortColorsFrames } from "./sortColors";
import type { ArrayMutView } from "./moveZeroes";

describe("sortColorsFrames", () => {
  it("sorts a mixed array of 0s, 1s, and 2s", () => {
    expect(sortColorsFrames([2, 0, 2, 1, 1, 0]).result).toEqual([0, 0, 1, 1, 2, 2]);
  });

  it("sorts a short array", () => {
    expect(sortColorsFrames([2, 0, 1]).result).toEqual([0, 1, 2]);
  });

  it("leaves an already-sorted array sorted", () => {
    expect(sortColorsFrames([0, 1, 2]).result).toEqual([0, 1, 2]);
  });

  it("handles a single element", () => {
    expect(sortColorsFrames([1]).result).toEqual([1]);
  });

  it("carries the live (mutating) array in each frame's view, ending sorted", () => {
    const { frames } = sortColorsFrames([2, 0, 2, 1, 1, 0]);
    const last = frames[frames.length - 1].view as unknown as ArrayMutView;
    expect(last.arr).toEqual([0, 0, 1, 1, 2, 2]);
  });

  it("emits parallel-length cellStates and a non-empty eli5 caption on every frame", () => {
    const nums = [2, 0, 2, 1, 1, 0];
    for (const f of sortColorsFrames(nums).frames) {
      expect(f.cellStates).toHaveLength(nums.length);
      expect((f.view as unknown as ArrayMutView).arr).toHaveLength(nums.length);
      expect(f.eli5Caption.length).toBeGreaterThan(0);
    }
  });
});
