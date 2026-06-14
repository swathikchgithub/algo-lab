import { describe, expect, it } from "vitest";
import { validAnagramFrames, type AnagramView } from "./validAnagram";

describe("validAnagramFrames", () => {
  it("accepts a true anagram", () => {
    expect(validAnagramFrames("anagram", "nagaram").isAnagram).toBe(true);
  });

  it("rejects strings with different letters", () => {
    expect(validAnagramFrames("rat", "car").isAnagram).toBe(false);
  });

  it("rejects strings of different lengths immediately", () => {
    const { frames, isAnagram } = validAnagramFrames("ab", "abc");
    expect(isAnagram).toBe(false);
    expect(frames[0].highlightLine).toBe(1); // never gets past the length gate
  });

  it("accepts two empty-equivalent single chars", () => {
    expect(validAnagramFrames("a", "a").isAnagram).toBe(true);
    expect(validAnagramFrames("a", "b").isAnagram).toBe(false);
  });

  it("carries both rows in each frame's view", () => {
    const last = validAnagramFrames("anagram", "nagaram").frames.at(-1)!.view as unknown as AnagramView;
    expect(last.s.join("")).toBe("anagram");
    expect(last.t.join("")).toBe("nagaram");
  });

  it("emits a non-empty eli5 caption on every frame", () => {
    for (const f of validAnagramFrames("anagram", "nagaram").frames) {
      expect(f.eli5Caption.length).toBeGreaterThan(0);
    }
  });
});
