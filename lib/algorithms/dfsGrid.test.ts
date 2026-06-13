import { describe, expect, it } from "vitest";
import { dfsGridFrames } from "./dfsGrid";
import type { GridView } from "@/lib/algorithms/views";

describe("dfsGridFrames", () => {
  // 3x3 grid with a single wall at (1,1). 8 open cells, all reachable from (0,0).
  const grid = [
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
  ];
  const start: [number, number] = [0, 0];

  it("visits every reachable open cell exactly once", () => {
    const { order } = dfsGridFrames(grid, start);
    expect(order).toHaveLength(8); // 9 cells - 1 wall
  });

  it("visits the start cell first", () => {
    const { order } = dfsGridFrames(grid, start);
    expect(order[0]).toEqual([0, 0]);
  });

  it("never visits a wall cell", () => {
    const { order } = dfsGridFrames(grid, start);
    expect(order).not.toContainEqual([1, 1]);
  });

  it("keeps every frame's view.grid the same dimensions as the input", () => {
    const { frames } = dfsGridFrames(grid, start);
    for (const frame of frames) {
      const view = frame.view as unknown as GridView;
      expect(view.grid).toHaveLength(grid.length);
      view.grid.forEach((row, r) => expect(row).toHaveLength(grid[r].length));
    }
  });

  it("provides an eli5Caption on every frame", () => {
    const { frames } = dfsGridFrames(grid, start);
    expect(frames.every((f) => f.eli5Caption.length > 0)).toBe(true);
  });

  it("marks walls as visited with a # label in the view", () => {
    const { frames } = dfsGridFrames(grid, start);
    const view = frames[0].view as unknown as GridView;
    expect(view.grid[1][1]).toBe("visited");
    expect(view.labels![1][1]).toBe("#");
  });

  it("exposes the call stack as a vertical aux list", () => {
    const { frames } = dfsGridFrames(grid, start);
    const view = frames[0].view as unknown as GridView;
    expect(view.aux!.title).toBe("Call stack");
    expect(view.aux!.orientation).toBe("vertical");
    expect(view.aux!.items).toEqual(["0,0"]);
  });
});
