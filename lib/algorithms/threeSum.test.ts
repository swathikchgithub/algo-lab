import { describe, expect, it } from "vitest";
import { threeSumFrames } from "./threeSum";
import type { ArrayMutView } from "./moveZeroes";

describe("threeSumFrames", () => {
  it("finds the unique triplets that sum to zero", () => {
    const { res } = threeSumFrames([-1, 0, 1, 2, -1, -4]);
    expect(res).toEqual([
      [-1, -1, 2],
      [-1, 0, 1],
    ]);
  });

  it("returns a single triplet for all zeros", () => {
    expect(threeSumFrames([0, 0, 0]).res).toEqual([[0, 0, 0]]);
  });

  it("returns no triplets when none sum to zero", () => {
    expect(threeSumFrames([1, 2, 3, 4]).res).toEqual([]);
  });

  it("does not emit duplicate triplets", () => {
    const { res } = threeSumFrames([-2, 0, 0, 2, 2]);
    expect(res).toEqual([[-2, 0, 2]]);
  });

  it("displays the sorted array in the first frame's view", () => {
    const first = threeSumFrames([-1, 0, 1, 2, -1, -4]).frames[0];
    expect((first.view as unknown as ArrayMutView).arr).toEqual([-4, -1, -1, 0, 1, 2]);
  });

  it("emits a non-empty eli5 caption and a view array on every frame", () => {
    const { frames } = threeSumFrames([-1, 0, 1, 2, -1, -4]);
    for (const f of frames) {
      expect(f.eli5Caption.length).toBeGreaterThan(0);
      expect((f.view as unknown as ArrayMutView).arr.length).toBe(6);
    }
  });

  it("ends on the return line", () => {
    const { frames } = threeSumFrames([-1, 0, 1, 2, -1, -4]);
    expect(frames[frames.length - 1].highlightLine).toBe(13);
  });
});
