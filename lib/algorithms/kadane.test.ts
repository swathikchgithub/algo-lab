import { describe, expect, it } from "vitest";
import { kadaneFrames } from "./kadane";

describe("kadaneFrames", () => {
  const arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4]; // classic example

  it("computes the maximum subarray sum", () => {
    const { maxSum } = kadaneFrames(arr);
    expect(maxSum).toBe(6); // subarray [4, -1, 2, 1]
  });

  it("reports the best subarray range", () => {
    const { bestRange } = kadaneFrames(arr);
    expect(bestRange).toEqual([3, 6]);
  });

  it("handles an all-negative array (best is the largest element)", () => {
    const { maxSum, bestRange } = kadaneFrames([-3, -1, -2]);
    expect(maxSum).toBe(-1);
    expect(bestRange).toEqual([1, 1]);
  });

  it("keeps cellStates parallel to the input on every frame", () => {
    const { frames } = kadaneFrames(arr);
    expect(frames.every((f) => f.cellStates!.length === arr.length)).toBe(true);
  });

  it("provides the money-bag eli5Caption on every frame", () => {
    const { frames } = kadaneFrames(arr);
    expect(frames.every((f) => f.eli5Caption.length > 0)).toBe(true);
    expect(frames[0].eli5Caption).toContain("money bag");
  });

  it("emits an initial frame plus one frame per subsequent element", () => {
    const { frames } = kadaneFrames(arr);
    // Frame 0 (init) + a decision frame per i in 1..n-1 (+ optional best frames)
    // + a final frame. Lower bound: init + (n-1) decisions + final.
    expect(frames.length).toBeGreaterThanOrEqual(arr.length + 1);
    expect(frames[0].pointers).toEqual({ i: 0 });
  });

  it("highlights the winning subarray as active on the final frame", () => {
    const { frames, bestRange } = kadaneFrames(arr);
    const last = frames[frames.length - 1];
    const [l, r] = bestRange;
    for (let k = 0; k < arr.length; k++) {
      expect(last.cellStates![k]).toBe(k >= l && k <= r ? "active" : "visited");
    }
  });
});
