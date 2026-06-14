import { describe, expect, it } from "vitest";
import { moveZeroesFrames, type ArrayMutView } from "./moveZeroes";

describe("moveZeroesFrames", () => {
  it("moves zeros to the end while keeping non-zero order", () => {
    expect(moveZeroesFrames([0, 1, 0, 3, 12]).result).toEqual([1, 3, 12, 0, 0]);
  });

  it("leaves a single zero untouched", () => {
    expect(moveZeroesFrames([0]).result).toEqual([0]);
  });

  it("leaves an already-packed array unchanged", () => {
    expect(moveZeroesFrames([1, 2, 3]).result).toEqual([1, 2, 3]);
  });

  it("carries the live (mutating) array in each frame's view", () => {
    const { frames } = moveZeroesFrames([0, 1, 0, 3, 12]);
    const last = frames[frames.length - 1].view as unknown as ArrayMutView;
    expect(last.arr).toEqual([1, 3, 12, 0, 0]);
  });

  it("emits parallel-length cellStates and a non-empty eli5 caption on every frame", () => {
    const nums = [0, 1, 0, 3, 12];
    for (const f of moveZeroesFrames(nums).frames) {
      expect(f.cellStates).toHaveLength(nums.length);
      expect((f.view as unknown as ArrayMutView).arr).toHaveLength(nums.length);
      expect(f.eli5Caption.length).toBeGreaterThan(0);
    }
  });
});
