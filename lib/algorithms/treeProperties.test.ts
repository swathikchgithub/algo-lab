import { describe, expect, it } from "vitest";
import { maxDepthFrames, minDepthFrames, diameterFrames, balancedFrames } from "./treeProperties";

describe("tree properties", () => {
  it("maximum depth", () => {
    expect(maxDepthFrames("3,9,20,null,null,15,7").result).toBe(3);
    expect(maxDepthFrames("").result).toBe(0);
    expect(maxDepthFrames("1").result).toBe(1);
  });

  it("minimum depth (single-child node does not count as a leaf path)", () => {
    expect(minDepthFrames("3,9,20,null,null,15,7").result).toBe(2);
    // [2,null,3,null,4]: a right-leaning chain → nearest leaf is depth 3.
    expect(minDepthFrames("2,null,3,null,4").result).toBe(3);
    expect(minDepthFrames("").result).toBe(0);
  });

  it("diameter (in edges)", () => {
    // [1,2,3,4,5]: longest path 4-2-5 plus to 3 → 4-2-1-3 = 3 edges.
    expect(diameterFrames("1,2,3,4,5").result).toBe(3);
    expect(diameterFrames("1").result).toBe(0);
  });

  it("balanced", () => {
    expect(balancedFrames("3,9,20,null,null,15,7").result).toBe(true);
    // [1,2,2,3,3,null,null,4,4]: deep on the left only → unbalanced.
    expect(balancedFrames("1,2,2,3,3,null,null,4,4").result).toBe(false);
    expect(balancedFrames("").result).toBe(true);
  });

  it("captions every frame", () => {
    for (const f of diameterFrames("1,2,3,4,5").frames) {
      expect(f.eli5Caption.length).toBeGreaterThan(0);
    }
  });
});
