import { describe, expect, it } from "vitest";
import { slidingWindowFrames } from "./slidingWindow";

describe("slidingWindowFrames", () => {
  const arr = [2, 1, 5, 1, 3, 2]; // best window [5,1,3] = 9
  const k = 3;

  it("computes the max sum of any window of size k", () => {
    const { maxSum } = slidingWindowFrames(arr, k);
    expect(maxSum).toBe(9);
  });

  it("first frame establishes the initial full window sum", () => {
    const { frames } = slidingWindowFrames(arr, k);
    const first = frames[0];
    expect(first.pointers).toEqual({ L: 0, R: 2 });
    expect(first.variables.windowSum).toBe(8); // 2+1+5
  });

  it("emits one frame per slide plus the initial frame", () => {
    const { frames } = slidingWindowFrames(arr, k);
    // n - k = 3 slides + 1 initial frame.
    expect(frames).toHaveLength(arr.length - k + 1);
  });

  it("every frame's cellStates is parallel to the array", () => {
    const { frames } = slidingWindowFrames(arr, k);
    expect(frames.every((f) => f.cellStates!.length === arr.length)).toBe(true);
  });

  it("provides an eli5Caption on every frame", () => {
    const { frames } = slidingWindowFrames(arr, k);
    expect(frames.every((f) => f.eli5Caption.length > 0)).toBe(true);
  });

  it("returns a single explanatory frame when k > array length", () => {
    const { frames, maxSum } = slidingWindowFrames(arr, arr.length + 1);
    expect(frames).toHaveLength(1);
    expect(maxSum).toBe(0);
    expect(frames[0].caption).toContain("k must be between 1 and the array length");
  });
});
