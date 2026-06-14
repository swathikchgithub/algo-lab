import { describe, expect, it } from "vitest";
import { removeDuplicatesFrames } from "./removeDuplicates";
import type { ArrayMutView } from "./moveZeroes";

describe("removeDuplicatesFrames", () => {
  it("returns the count of unique elements", () => {
    expect(removeDuplicatesFrames([1, 1, 2]).k).toBe(2);
  });

  it("dedupes a longer run array", () => {
    expect(removeDuplicatesFrames([0, 0, 1, 1, 1, 2, 2, 3, 3, 4]).k).toBe(5);
  });

  it("leaves an all-unique array unchanged", () => {
    expect(removeDuplicatesFrames([1, 2, 3]).k).toBe(3);
  });

  it("collapses an all-same array to length 1", () => {
    expect(removeDuplicatesFrames([7, 7, 7, 7]).k).toBe(1);
  });

  it("returns 0 for an empty array", () => {
    expect(removeDuplicatesFrames([]).k).toBe(0);
  });

  it("writes the unique prefix into the live view array", () => {
    const { frames, k } = removeDuplicatesFrames([0, 0, 1, 1, 1, 2, 2, 3, 3, 4]);
    const last = frames[frames.length - 1].view as unknown as ArrayMutView;
    expect(last.arr.slice(0, k)).toEqual([0, 1, 2, 3, 4]);
  });

  it("emits parallel-length cellStates and a non-empty eli5 caption on every frame", () => {
    const nums = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4];
    for (const f of removeDuplicatesFrames(nums).frames) {
      expect(f.cellStates).toHaveLength(nums.length);
      expect(f.eli5Caption.length).toBeGreaterThan(0);
    }
  });
});
