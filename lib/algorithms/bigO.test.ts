import { describe, expect, it } from "vitest";
import { bigOFrames } from "./bigO";
import type { ChartView } from "@/lib/algorithms/views";

describe("bigOFrames", () => {
  const maxN = 8;

  it("emits exactly maxN frames", () => {
    const { frames } = bigOFrames("O(n)", maxN);
    expect(frames).toHaveLength(maxN);
  });

  it("ends O(n) at maxN operations", () => {
    const { frames } = bigOFrames("O(n)", maxN);
    expect(frames[frames.length - 1].variables.operations).toBe(maxN);
  });

  it("ends O(n^2) at maxN squared operations", () => {
    const { frames } = bigOFrames("O(n^2)", maxN);
    expect(frames[frames.length - 1].variables.operations).toBe(maxN * maxN);
  });

  it("keeps O(1) at one operation on every frame", () => {
    const { frames } = bigOFrames("O(1)", maxN);
    expect(frames.every((f) => f.variables.operations === 1)).toBe(true);
  });

  it("normalizes all chart points into [0,1]", () => {
    const { frames } = bigOFrames("O(n^2)", maxN);
    const last = frames[frames.length - 1].view as unknown as ChartView;
    expect(
      last.points.every((p) => p.x >= 0 && p.x <= 1 && p.y >= 0 && p.y <= 1)
    ).toBe(true);
  });

  it("renders an input row of length maxN on every frame", () => {
    const { frames } = bigOFrames("O(log n)", maxN);
    expect(frames.every((f) => f.cellStates!.length === maxN)).toBe(true);
  });

  it("provides an eli5Caption on every frame", () => {
    const { frames } = bigOFrames("O(log n)", maxN);
    expect(frames.every((f) => f.eli5Caption.length > 0)).toBe(true);
  });
});
