import { describe, expect, it } from "vitest";
import { mergeListsFrames } from "./mergeLists";

describe("mergeListsFrames", () => {
  it("merges two sorted lists", () => {
    expect(mergeListsFrames([1, 2, 4], [1, 3, 4]).result).toEqual([1, 1, 2, 3, 4, 4]);
  });

  it("handles one empty list", () => {
    expect(mergeListsFrames([], [0]).result).toEqual([0]);
    expect(mergeListsFrames([2, 5], []).result).toEqual([2, 5]);
  });

  it("handles both empty", () => {
    expect(mergeListsFrames([], []).result).toEqual([]);
  });

  it("appends a leftover tail from the longer list", () => {
    expect(mergeListsFrames([1, 2, 3], [4, 5, 6, 7]).result).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("captions every frame", () => {
    for (const f of mergeListsFrames([1, 2, 4], [1, 3, 4]).frames) {
      expect(f.eli5Caption.length).toBeGreaterThan(0);
    }
  });
});
