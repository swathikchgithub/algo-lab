import { describe, expect, it } from "vitest";
import { averageOfLevelsFrames } from "./treeLevelOrder";

describe("averageOfLevelsFrames", () => {
  it("averages each level", () => {
    expect(averageOfLevelsFrames("3,9,20,null,null,15,7").result).toEqual([3, 14.5, 11]);
  });

  it("handles a single node", () => {
    expect(averageOfLevelsFrames("5").result).toEqual([5]);
  });

  it("handles an empty tree", () => {
    expect(averageOfLevelsFrames("").result).toEqual([]);
  });

  it("captions every frame", () => {
    for (const f of averageOfLevelsFrames("3,9,20,null,null,15,7").frames) {
      expect(f.eli5Caption.length).toBeGreaterThan(0);
    }
  });
});
