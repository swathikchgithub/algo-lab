import { describe, expect, it } from "vitest";
import { containerWaterFrames } from "./containerWater";

describe("containerWaterFrames", () => {
  it("finds the maximum area for the classic example", () => {
    expect(containerWaterFrames([1, 8, 6, 2, 5, 4, 8, 3, 7]).best).toBe(49);
  });

  it("handles the minimal two-wall case", () => {
    expect(containerWaterFrames([1, 1]).best).toBe(1);
  });

  it("starts at the widest container with pointers at both ends", () => {
    const first = containerWaterFrames([1, 8, 6, 2, 5, 4, 8, 3, 7]).frames[0];
    expect(first.pointers).toEqual({ L: 0, R: 8 });
  });

  it("advances the shorter wall inward", () => {
    // [1,8,...]: left wall 1 < right wall 7, so L moves from 0 to 1.
    const { frames } = containerWaterFrames([1, 8, 6, 2, 5, 4, 8, 3, 7]);
    expect(frames[1].variables.l).toBe(0);
    expect(frames[2].variables.l).toBe(1); // left advanced after the first step
  });

  it("emits parallel-length cellStates with a non-empty eli5 caption on every frame", () => {
    const height = [1, 8, 6, 2, 5, 4, 8, 3, 7];
    for (const f of containerWaterFrames(height).frames) {
      expect(f.cellStates).toHaveLength(height.length);
      expect(f.eli5Caption.length).toBeGreaterThan(0);
    }
  });

  it("ends on the return line with the best area in the readout", () => {
    const { frames, best } = containerWaterFrames([1, 8, 6, 2, 5, 4, 8, 3, 7]);
    const last = frames[frames.length - 1];
    expect(last.highlightLine).toBe(9);
    expect(last.variables.best).toBe(best);
  });
});
