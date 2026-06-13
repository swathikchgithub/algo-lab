import { describe, expect, it } from "vitest";
import { twoPointersFrames } from "./twoPointers";

describe("twoPointersFrames", () => {
  const arr = [1, 3, 5, 7, 9, 11, 13]; // indices 0..6

  it("finds a pair that sums to the target", () => {
    // 1 + 13 = 14 → indices 0 and 6.
    const { found, indices } = twoPointersFrames(arr, 14);
    expect(found).toBe(true);
    expect(indices).toEqual([0, 6]);
  });

  it("reports not found when no pair sums to the target", () => {
    const { found, indices } = twoPointersFrames(arr, 100);
    expect(found).toBe(false);
    expect(indices).toBeNull();
  });

  it("first frame considers the entire array active with pointers at the ends", () => {
    const { frames } = twoPointersFrames(arr, 14);
    const first = frames[0];
    expect(first.pointers).toEqual({ L: 0, R: 6 });
    expect(first.cellStates).toHaveLength(arr.length);
    expect(first.cellStates!.every((s) => s === "active")).toBe(true);
  });

  it("moves the right pointer in when the sum is too big", () => {
    // target 12: 1+13=14 > 12 → R-- ; then 1+11=12 → found at 0 and 5.
    const { frames, indices } = twoPointersFrames(arr, 12);
    expect(indices).toEqual([0, 5]);
    const moveRight = frames[1];
    expect(moveRight.highlightLine).toBe(6);
    expect(moveRight.caption).toContain("move right in");
    // After the move, the discarded right end is dimmed on the found frame.
    const found = frames[2];
    expect(found.cellStates![6]).toBe("visited");
    expect(found.cellStates![0]).toBe("current");
    expect(found.cellStates![5]).toBe("current");
  });

  it("provides an eli5Caption on every frame", () => {
    const { frames } = twoPointersFrames(arr, 12);
    expect(frames.every((f) => f.eli5Caption.length > 0)).toBe(true);
  });

  it("emits cellStates parallel to the array on every frame", () => {
    const { frames } = twoPointersFrames(arr, 100);
    expect(frames.every((f) => f.cellStates!.length === arr.length)).toBe(true);
  });
});
