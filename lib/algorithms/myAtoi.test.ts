import { describe, expect, it } from "vitest";
import { myAtoiFrames } from "./myAtoi";

describe("myAtoiFrames", () => {
  it("parses a plain number", () => {
    expect(myAtoiFrames("42").value).toBe(42);
  });

  it("skips leading spaces and applies a negative sign", () => {
    expect(myAtoiFrames("   -42").value).toBe(-42);
  });

  it("stops at the first non-digit", () => {
    expect(myAtoiFrames("4193 with words").value).toBe(4193);
  });

  it("returns 0 when there are no leading digits", () => {
    expect(myAtoiFrames("words and 987").value).toBe(0);
  });

  it("clamps above the 32-bit signed maximum", () => {
    expect(myAtoiFrames("91283472332").value).toBe(2 ** 31 - 1);
  });

  it("clamps below the 32-bit signed minimum", () => {
    expect(myAtoiFrames("-91283472332").value).toBe(-(2 ** 31));
  });

  it("emits a non-empty eli5 caption on every frame", () => {
    for (const f of myAtoiFrames("   -42").frames) {
      expect(f.eli5Caption.length).toBeGreaterThan(0);
    }
  });
});
