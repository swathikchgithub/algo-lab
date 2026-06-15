import { describe, expect, it } from "vitest";
import { dailyTemperaturesFrames, type DailyTempView } from "./dailyTemperatures";

describe("dailyTemperaturesFrames", () => {
  it("computes days-until-warmer for the classic example", () => {
    expect(dailyTemperaturesFrames([73, 74, 75, 71, 69, 72, 76, 73]).res).toEqual([
      1, 1, 4, 2, 1, 1, 0, 0,
    ]);
  });

  it("handles a strictly increasing run", () => {
    expect(dailyTemperaturesFrames([30, 40, 50, 60]).res).toEqual([1, 1, 1, 0]);
  });

  it("returns all zeros for a non-increasing run", () => {
    expect(dailyTemperaturesFrames([60, 50, 40]).res).toEqual([0, 0, 0]);
  });

  it("handles a single day", () => {
    expect(dailyTemperaturesFrames([42]).res).toEqual([0]);
  });

  it("ends with the stack reflected in the final view (waiters left over)", () => {
    const { frames } = dailyTemperaturesFrames([60, 50, 40]);
    const last = frames[frames.length - 1].view as unknown as DailyTempView;
    // 3 days that never warm up remain conceptually waiting → all res 0.
    expect(last.res).toEqual([0, 0, 0]);
  });

  it("emits a non-empty eli5 caption and all three rows on every frame", () => {
    const temps = [73, 74, 75, 71, 69, 72, 76, 73];
    for (const f of dailyTemperaturesFrames(temps).frames) {
      const v = f.view as unknown as DailyTempView;
      expect(v.temps).toHaveLength(temps.length);
      expect(v.res).toHaveLength(temps.length);
      expect(f.eli5Caption.length).toBeGreaterThan(0);
    }
  });
});
