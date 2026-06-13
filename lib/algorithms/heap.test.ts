import { describe, expect, it } from "vitest";
import { heapInsertFrames } from "./heap";
import type { TreeView } from "@/lib/algorithms/views";

describe("heapInsertFrames", () => {
  const input = [5, 3, 8, 1, 9, 2];

  it("produces a final array satisfying the min-heap property", () => {
    const { heap } = heapInsertFrames(input);
    for (let i = 0; i < heap.length; i++) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      if (left < heap.length) expect(heap[i]).toBeLessThanOrEqual(heap[left]);
      if (right < heap.length) expect(heap[i]).toBeLessThanOrEqual(heap[right]);
    }
  });

  it("places the global minimum at the root", () => {
    const { heap } = heapInsertFrames(input);
    expect(heap[0]).toBe(1);
    expect(heap[0]).toBe(Math.min(...input));
  });

  it("keeps every frame's view.states parallel to view.heap", () => {
    const { frames } = heapInsertFrames(input);
    for (const frame of frames) {
      const view = frame.view as unknown as TreeView;
      expect(view.states.length).toBe(view.heap.length);
    }
  });

  it("provides an eli5Caption on every frame", () => {
    const { frames } = heapInsertFrames(input);
    expect(frames.every((f) => f.eli5Caption.length > 0)).toBe(true);
  });

  it("sits the first inserted value at the root after the first insert", () => {
    const { frames } = heapInsertFrames(input);
    // frames[0] is the empty start; frames[1] is the first push.
    const view = frames[1].view as unknown as TreeView;
    expect(view.heap[0]).toBe(5);
  });

  it("emits an initial empty frame", () => {
    const { frames } = heapInsertFrames(input);
    const view = frames[0].view as unknown as TreeView;
    expect(view.heap).toEqual([]);
    expect(view.states).toEqual([]);
  });
});
