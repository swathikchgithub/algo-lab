import { describe, expect, it } from "vitest";
import { binarySearchFrames } from "./binarySearch";

describe("binarySearchFrames", () => {
  const arr = [1, 3, 5, 7, 9, 11, 13]; // indices 0..6

  it("finds a target present in the array", () => {
    const { found, index } = binarySearchFrames(arr, 9);
    expect(found).toBe(true);
    expect(index).toBe(4);
  });

  it("reports not found for an absent target", () => {
    const { found, index } = binarySearchFrames(arr, 8);
    expect(found).toBe(false);
    expect(index).toBe(-1);
  });

  it("first frame considers the entire array as the active window", () => {
    const { frames } = binarySearchFrames(arr, 13);
    const first = frames[0];
    expect(first.pointers).toEqual({ L: 0, R: 6 });
    expect(first.cellStates).toHaveLength(arr.length);
    expect(first.cellStates!.every((s) => s === "active")).toBe(true);
  });

  it("picks the correct first mid and highlights it amber", () => {
    const { frames } = binarySearchFrames(arr, 13);
    // Second frame is the first mid selection. mid = 0 + ((6-0)>>1) = 3.
    const midFrame = frames[1];
    expect(midFrame.pointers!.M).toBe(3);
    expect(midFrame.cellStates![3]).toBe("current");
    expect(midFrame.variables["arr[mid]"]).toBe(7);
  });

  it("discards the left half when arr[mid] < target", () => {
    const { frames } = binarySearchFrames(arr, 13);
    // arr[3]=7 < 13 → discard left. The discard frame is frames[2].
    const discard = frames[2];
    expect(discard.highlightLine).toBe(5);
    expect(discard.caption).toContain("discard left half");
    // Indices left of the new lo (mid+1=4) become visited on the next mid frame.
    const nextMid = frames[3];
    expect(nextMid.cellStates![0]).toBe("visited");
    expect(nextMid.cellStates![3]).toBe("visited");
  });

  it("each iteration shrinks the window (log-many frames)", () => {
    const { frames } = binarySearchFrames(arr, 13);
    // 7 elements → at most ceil(log2(7))+1 ≈ 3 iterations; bounded well under n.
    expect(frames.length).toBeLessThan(arr.length * 3);
    expect(frames.length).toBeGreaterThan(1);
  });

  it("provides an eli5Caption on every frame", () => {
    const { frames } = binarySearchFrames(arr, 9);
    expect(frames.every((f) => f.eli5Caption.length > 0)).toBe(true);
  });

  it("handles a single-element array", () => {
    expect(binarySearchFrames([5], 5)).toMatchObject({ found: true, index: 0 });
    expect(binarySearchFrames([5], 4)).toMatchObject({ found: false, index: -1 });
  });
});
