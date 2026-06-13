import { describe, expect, it } from "vitest";
import { bfsGridFrames } from "./bfsGrid";
import type { GridView } from "@/lib/algorithms/views";

describe("bfsGridFrames", () => {
  // 3x3 grid, 0 = open, 1 = wall. Start at top-left (0,0).
  // Wall at (1,1) splits the middle; 8 open cells reachable from (0,0).
  //   0 0 0
  //   0 1 0
  //   0 0 0
  const grid = [
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
  ];
  const start: [number, number] = [0, 0];

  it("visits every reachable open cell exactly once", () => {
    const { order } = bfsGridFrames(grid, start);
    expect(order).toHaveLength(8); // 9 cells - 1 wall
  });

  it("visits the start cell first at level 0", () => {
    const { order, frames } = bfsGridFrames(grid, start);
    expect(order[0]).toEqual([0, 0]);
    expect(frames[0].variables.level).toBe(0);
  });

  it("produces non-decreasing BFS distances in visit order", () => {
    const { order } = bfsGridFrames(grid, start);
    const manhattan = order.map(([r, c]) => r + c); // start is (0,0)
    // BFS over an open-ish grid discovers cells in non-decreasing distance.
    for (let i = 1; i < manhattan.length; i++) {
      expect(manhattan[i]).toBeGreaterThanOrEqual(manhattan[i - 1]);
    }
  });

  it("never visits a wall cell", () => {
    const { order } = bfsGridFrames(grid, start);
    const visitedWall = order.some(([r, c]) => grid[r][c] === 1);
    expect(visitedWall).toBe(false);
  });

  it("view.grid dimensions match the input grid", () => {
    const { frames } = bfsGridFrames(grid, start);
    const view = frames[0].view as unknown as GridView;
    expect(view.grid).toHaveLength(grid.length);
    expect(view.grid[0]).toHaveLength(grid[0].length);
  });

  it("labels walls with '#' and queue is horizontal", () => {
    const { frames } = bfsGridFrames(grid, start);
    const view = frames[0].view as unknown as GridView;
    expect(view.labels![1][1]).toBe("#");
    expect(view.aux!.title).toBe("Queue");
    expect(view.aux!.orientation).toBe("horizontal");
  });

  it("provides an eli5Caption on every frame", () => {
    const { frames } = bfsGridFrames(grid, start);
    expect(frames.every((f) => f.eli5Caption.length > 0)).toBe(true);
  });
});
