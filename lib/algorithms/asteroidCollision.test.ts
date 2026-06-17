import { describe, expect, it } from "vitest";
import { asteroidCollisionFrames, type AsteroidView } from "./asteroidCollision";

describe("asteroidCollisionFrames", () => {
  it("keeps the larger of two colliding asteroids", () => {
    expect(asteroidCollisionFrames([5, 10, -5]).result).toEqual([5, 10]);
  });

  it("destroys both on equal sizes", () => {
    expect(asteroidCollisionFrames([8, -8]).result).toEqual([]);
  });

  it("chains collisions until one survives", () => {
    expect(asteroidCollisionFrames([10, 2, -5]).result).toEqual([10]);
  });

  it("never collides when all move the same direction", () => {
    expect(asteroidCollisionFrames([-2, -1, 1, 2]).result).toEqual([-2, -1, 1, 2]);
  });

  it("carries the surviving stack in the final frame's view", () => {
    const { frames, result } = asteroidCollisionFrames([10, 2, -5]);
    const last = frames[frames.length - 1].view as unknown as AsteroidView;
    expect(last.stack).toEqual(result);
  });

  it("emits a non-empty eli5 caption on every frame", () => {
    for (const f of asteroidCollisionFrames([5, 10, -5]).frames) {
      expect(f.eli5Caption.length).toBeGreaterThan(0);
    }
  });
});
