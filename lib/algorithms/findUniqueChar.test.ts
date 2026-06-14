import { describe, expect, it } from "vitest";
import { firstUniqueCharFrames, type CharsView } from "./firstUniqueChar";

describe("firstUniqueCharFrames", () => {
  it("returns the index of the first unique character", () => {
    expect(firstUniqueCharFrames("leetcode").index).toBe(0);
  });

  it("finds a unique character that is not first", () => {
    expect(firstUniqueCharFrames("loveleetcode").index).toBe(2);
  });

  it("returns -1 when every character repeats", () => {
    expect(firstUniqueCharFrames("aabb").index).toBe(-1);
  });

  it("handles a single character", () => {
    expect(firstUniqueCharFrames("z").index).toBe(0);
  });

  it("carries the character row in each frame's view", () => {
    const first = firstUniqueCharFrames("abc").frames[0];
    expect((first.view as unknown as CharsView).chars).toEqual(["a", "b", "c"]);
  });

  it("emits a non-empty eli5 caption on every frame", () => {
    for (const f of firstUniqueCharFrames("leetcode").frames) {
      expect(f.eli5Caption.length).toBeGreaterThan(0);
    }
  });
});
