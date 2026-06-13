import { describe, expect, it } from "vitest";
import type { BucketView } from "@/lib/algorithms/views";
import { hashKey, hashTableFrames } from "./hashTable";

describe("hashKey", () => {
  it("is deterministic — sum of char codes of String(key)", () => {
    // c=99, a=97, t=116
    expect(hashKey("cat")).toBe(312);
    expect(hashKey("cat")).toBe(hashKey("cat"));
  });
});

describe("hashTableFrames", () => {
  const keys = ["cat", "dog", "bird"]; // 312→0, 314→2, 417→1 (numBuckets=4)
  const numBuckets = 4;

  it("lands each key in bucket (hashKey(key) % numBuckets)", () => {
    const { buckets } = hashTableFrames(keys, numBuckets);
    for (const key of keys) {
      const bucket = hashKey(key) % numBuckets;
      expect(buckets[bucket]).toContain(key);
    }
  });

  it("every frame's view has numBuckets buckets", () => {
    const { frames } = hashTableFrames(keys, numBuckets);
    for (const frame of frames) {
      const view = frame.view as unknown as BucketView;
      expect(view.buckets).toHaveLength(numBuckets);
    }
  });

  it("total entries in the final frame equals the number of keys", () => {
    const { buckets } = hashTableFrames(keys, numBuckets);
    const total = buckets.reduce((sum, chain) => sum + chain.length, 0);
    expect(total).toBe(keys.length);
  });

  it("sets activeBucket to the insertion bucket on each insert frame", () => {
    const { frames } = hashTableFrames(keys, numBuckets);
    // frames[0] is the empty-table frame; insert frames follow in key order.
    const dogFrame = frames[2].view as unknown as BucketView;
    expect(dogFrame.activeBucket).toBe(hashKey("dog") % numBuckets);
  });

  it("provides an eli5Caption on every frame", () => {
    const { frames } = hashTableFrames(keys, numBuckets);
    expect(frames.every((f) => f.eli5Caption.length > 0)).toBe(true);
  });

  it("treats numBuckets < 1 as a single bucket", () => {
    const { buckets } = hashTableFrames(keys, 0);
    expect(buckets).toHaveLength(1);
    expect(buckets[0]).toHaveLength(keys.length);
  });
});
