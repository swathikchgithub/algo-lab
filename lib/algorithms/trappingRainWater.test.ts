import { describe, expect, it } from "vitest";
import { trappingRainWaterFrames, type TrapView } from "./trappingRainWater";

describe("trappingRainWaterFrames", () => {
  it("computes the trapped water for the classic example", () => {
    const { water } = trappingRainWaterFrames([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]);
    expect(water).toBe(6);
  });

  it("computes the trapped water for a basin between two tall walls", () => {
    const { water } = trappingRainWaterFrames([4, 2, 0, 3, 2, 5]);
    expect(water).toBe(9);
  });

  it("traps no water on a strictly increasing elevation map", () => {
    const { water } = trappingRainWaterFrames([1, 2, 3, 4]);
    expect(water).toBe(0);
  });

  it("traps no water for a single bar", () => {
    const { water } = trappingRainWaterFrames([5]);
    expect(water).toBe(0);
  });

  it("starts with pointers at both ends and an empty water row", () => {
    const height = [4, 2, 0, 3, 2, 5];
    const first = trappingRainWaterFrames(height).frames[0];
    expect(first.pointers).toEqual({ L: 0, R: height.length - 1 });
    const view = first.view as unknown as TrapView;
    expect(view.trapped).toEqual([0, 0, 0, 0, 0, 0]);
    expect(view.trapped).toHaveLength(height.length);
  });

  it("the per-bar water row on the final frame sums to the total", () => {
    const { frames, water } = trappingRainWaterFrames([4, 2, 0, 3, 2, 5]);
    const finalView = frames[frames.length - 1].view as unknown as TrapView;
    const sum = finalView.trapped.reduce((a, b) => a + b, 0);
    expect(sum).toBe(water);
  });

  it("emits parallel-length cellStates and water row on every frame", () => {
    const height = [4, 2, 0, 3, 2, 5];
    const { frames } = trappingRainWaterFrames(height);
    for (const f of frames) {
      expect(f.cellStates).toHaveLength(height.length);
      expect((f.view as unknown as TrapView).trapped).toHaveLength(height.length);
      expect(f.eli5Caption.length).toBeGreaterThan(0);
    }
  });

  it("ends on the return line with the final water total in the readout", () => {
    const { frames, water } = trappingRainWaterFrames([4, 2, 0, 3, 2, 5]);
    const last = frames[frames.length - 1];
    expect(last.highlightLine).toBe(12);
    expect(last.variables.water).toBe(water);
  });
});
