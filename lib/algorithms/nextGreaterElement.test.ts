import { describe, expect, it } from "vitest";
import { nextGreaterElementFrames } from "./nextGreaterElement";

describe("nextGreaterElementFrames", () => {
  it("maps each nums1 value to its next greater in nums2", () => {
    expect(nextGreaterElementFrames([4, 1, 2], [1, 3, 4, 2]).result).toEqual([-1, 3, -1]);
  });

  it("handles values with greater elements to the right", () => {
    expect(nextGreaterElementFrames([2, 4], [1, 2, 3, 4]).result).toEqual([3, -1]);
  });

  it("returns -1 for a strictly decreasing nums2 (no next greater)", () => {
    expect(nextGreaterElementFrames([3, 1], [4, 3, 2, 1]).result).toEqual([-1, -1]);
  });

  it("captions every frame", () => {
    for (const f of nextGreaterElementFrames([4, 1, 2], [1, 3, 4, 2]).frames) {
      expect(f.eli5Caption.length).toBeGreaterThan(0);
    }
  });
});
