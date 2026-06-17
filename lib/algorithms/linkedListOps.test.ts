import { describe, expect, it } from "vitest";
import { reverseListFrames, middleNodeFrames, hasCycleFrames } from "./linkedListOps";

describe("reverseListFrames", () => {
  it("reverses the list", () => {
    expect(reverseListFrames([1, 2, 3, 4, 5]).result).toEqual([5, 4, 3, 2, 1]);
  });
  it("handles a single node and empty", () => {
    expect(reverseListFrames([1]).result).toEqual([1]);
    expect(reverseListFrames([]).result).toEqual([]);
  });
});

describe("middleNodeFrames", () => {
  it("returns the middle for odd length", () => {
    expect(middleNodeFrames([1, 2, 3, 4, 5]).result).toEqual([3, 4, 5]);
  });
  it("returns the second middle for even length", () => {
    expect(middleNodeFrames([1, 2, 3, 4, 5, 6]).result).toEqual([4, 5, 6]);
  });
});

describe("hasCycleFrames", () => {
  it("detects a cycle", () => {
    expect(hasCycleFrames([3, 2, 0, -4], 1).result).toBe(true);
  });
  it("reports no cycle", () => {
    expect(hasCycleFrames([1, 2], -1).result).toBe(false);
    expect(hasCycleFrames([1], -1).result).toBe(false);
  });
  it("terminates and captions every frame", () => {
    for (const f of hasCycleFrames([3, 2, 0, -4], 1).frames) {
      expect(f.eli5Caption.length).toBeGreaterThan(0);
    }
  });
});
