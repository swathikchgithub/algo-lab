import { describe, expect, it } from "vitest";
import { longestPalindromeFrames } from "./longestPalindrome";

describe("longestPalindromeFrames", () => {
  it("uses pairs plus one odd center", () => {
    expect(longestPalindromeFrames("abccccdd").length).toBe(7);
  });

  it("returns 1 for a single character", () => {
    expect(longestPalindromeFrames("a").length).toBe(1);
  });

  it("uses only pairs when all counts are even", () => {
    expect(longestPalindromeFrames("aabb").length).toBe(4);
  });

  it("allows exactly one odd center across multiple odd letters", () => {
    // a:1, b:1, c:1 → 0 pairs, +1 center = 1.
    expect(longestPalindromeFrames("abc").length).toBe(1);
  });

  it("captions every frame", () => {
    for (const f of longestPalindromeFrames("abccccdd").frames) {
      expect(f.eli5Caption.length).toBeGreaterThan(0);
    }
  });
});
