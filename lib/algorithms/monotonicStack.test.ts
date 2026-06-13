import { describe, expect, it } from "vitest";
import { monotonicStackFrames, type MonotonicStackView } from "./monotonicStack";

describe("monotonicStackFrames", () => {
  const arr = [2, 1, 2, 4, 3]; // indices 0..4

  it("computes the correct next-greater element for each index", () => {
    const { nextGreater } = monotonicStackFrames(arr);
    expect(nextGreater).toEqual([4, 2, 4, -1, -1]);
  });

  it("leaves -1 for elements with no greater element to the right", () => {
    const { nextGreater } = monotonicStackFrames([5, 4, 3, 2, 1]);
    expect(nextGreater).toEqual([-1, -1, -1, -1, -1]);
  });

  it("emits an initial frame with an empty stack", () => {
    const { frames } = monotonicStackFrames(arr);
    const first = frames[0];
    expect((first.view as MonotonicStackView).stack).toEqual([]);
    expect(first.pointers).toEqual({});
  });

  it("populates view.stack with the current stack values somewhere", () => {
    const { frames } = monotonicStackFrames(arr);
    const withStack = frames.find(
      (f) => (f.view as MonotonicStackView).stack.length > 0,
    );
    expect(withStack).toBeDefined();
    expect((withStack!.view as MonotonicStackView).stack).toContain(2);
  });

  it("keeps cellStates parallel to the input on every frame", () => {
    const { frames } = monotonicStackFrames(arr);
    expect(frames.every((f) => f.cellStates!.length === arr.length)).toBe(true);
  });

  it("marks the current index amber and resolved indices dimmed", () => {
    const { frames } = monotonicStackFrames(arr);
    // A pop frame describes resolving an index; find the first one.
    const popFrame = frames.find((f) => f.caption.includes("pop, nextGreater"));
    expect(popFrame).toBeDefined();
    expect(popFrame!.cellStates![popFrame!.pointers!.i]).toBe("current");
  });

  it("provides a pancake eli5Caption on every frame", () => {
    const { frames } = monotonicStackFrames(arr);
    expect(
      frames.every((f) => f.eli5Caption.toLowerCase().includes("pancake")),
    ).toBe(true);
  });
});
