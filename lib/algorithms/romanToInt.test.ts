import { describe, expect, it } from "vitest";
import { romanToIntFrames } from "./romanToInt";

describe("romanToIntFrames", () => {
  it("decodes a simple additive numeral", () => {
    expect(romanToIntFrames("III").total).toBe(3);
  });

  it("decodes a numeral with a larger leading symbol", () => {
    expect(romanToIntFrames("LVIII").total).toBe(58);
  });

  it("decodes subtractive pairs throughout", () => {
    expect(romanToIntFrames("MCMXCIV").total).toBe(1994);
  });

  it("decodes a single symbol", () => {
    expect(romanToIntFrames("X").total).toBe(10);
  });

  it("carries the character row in the first frame's view", () => {
    const first = romanToIntFrames("IV").frames[0];
    expect((first.view as { chars: string[] }).chars).toEqual(["I", "V"]);
  });

  it("emits a non-empty eli5 caption on every frame", () => {
    for (const f of romanToIntFrames("MCMXCIV").frames) {
      expect(f.eli5Caption.length).toBeGreaterThan(0);
    }
  });
});
