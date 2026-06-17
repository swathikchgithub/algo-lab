import { describe, expect, it } from "vitest";
import { floodFillFrames } from "./floodFill";

describe("floodFillFrames", () => {
  it("fills the connected region of the start color", () => {
    const out = floodFillFrames(
      [
        [1, 1, 1],
        [1, 1, 0],
        [1, 0, 1],
      ],
      1,
      1,
      2,
    ).result;
    expect(out).toEqual([
      [2, 2, 2],
      [2, 2, 0],
      [2, 0, 1],
    ]);
  });

  it("returns the image unchanged when start already equals color", () => {
    const out = floodFillFrames([[0, 0], [0, 0]], 0, 0, 0).result;
    expect(out).toEqual([[0, 0], [0, 0]]);
  });

  it("fills a single isolated cell", () => {
    const out = floodFillFrames([[0, 1], [1, 1]], 0, 0, 5).result;
    expect(out).toEqual([[5, 1], [1, 1]]);
  });

  it("captions every frame", () => {
    for (const f of floodFillFrames([[1, 1], [1, 1]], 0, 0, 2).frames) {
      expect(f.eli5Caption.length).toBeGreaterThan(0);
    }
  });
});
