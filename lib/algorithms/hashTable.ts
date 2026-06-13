import type { Frame } from "@/lib/types";
import type { BucketView } from "@/lib/algorithms/views";

// Pure frame generator for building a hash table with separate chaining.
// For each key we compute hashKey(key) = sum of char codes, pick its bucket
// (hash % numBuckets), and append the key to that bucket's chain. The
// <Stepper> plays the returned frames; no React here.
//
// `hashTableCode` is 1-indexed by `Frame.highlightLine` (line 1 is the first
// entry). Keep it in sync with the frames this generator emits.

export const hashTableCode = [
  "for key in keys:", // 1
  "    h = 0", // 2
  "    for ch in str(key): h += ord(ch)", // 3
  "    bucket = h % num_buckets", // 4
  "    buckets[bucket].append(key)  # separate chaining", // 5
  "    # collisions chain in the same bucket", // 6
];

export interface HashTableResult {
  frames: Frame[];
  /** Final contents of every bucket, index 0..numBuckets-1. */
  buckets: Array<Array<string | number>>;
}

const ELI5 =
  "Cubbies at school with name labels — you go straight to YOUR cubby.";

/** Sum of char codes of String(key). Pure + deterministic. */
export function hashKey(key: string | number): number {
  const s = String(key);
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash += s.charCodeAt(i);
  }
  return hash;
}

/** Deep-copy buckets so each frame captures an immutable snapshot. */
function snapshot(
  buckets: Array<Array<string | number>>,
): Array<Array<string | number>> {
  return buckets.map((chain) => chain.slice());
}

/**
 * Build a hash table by inserting each key with separate chaining.
 *
 * Time:  O(k · L) — k keys, each hashed over its length L (frames are O(k)).
 * Space: O(k + b) — k stored entries across b buckets, one frame per key.
 */
export function hashTableFrames(
  keys: Array<string | number>,
  numBuckets: number,
): HashTableResult {
  // Guard: a hash table must have at least one bucket.
  const b = numBuckets < 1 ? 1 : Math.floor(numBuckets);
  const buckets: Array<Array<string | number>> = Array.from(
    { length: b },
    () => [],
  );
  const frames: Frame[] = [];

  // Frame 0: empty table before any insertion.
  frames.push({
    highlightLine: 1,
    view: { buckets: snapshot(buckets) } satisfies BucketView,
    variables: { key: "—", hash: "—", bucket: "—" },
    caption: `Start with ${b} empty bucket${b === 1 ? "" : "s"}. Insert each key into hash % ${b}.`,
    eli5Caption: ELI5,
  });

  for (const key of keys) {
    const hash = hashKey(key);
    const bucket = hash % b;
    const collided = buckets[bucket].length > 0;
    const existing = buckets[bucket].map((k) => JSON.stringify(k)).join(", ");

    buckets[bucket].push(key);

    const label = JSON.stringify(key);
    const caption = collided
      ? `hash(${label}) = ${hash}, ${hash} % ${b} = ${bucket} → bucket ${bucket} already has ${existing} → chain it`
      : `hash(${label}) = ${hash}, ${hash} % ${b} = ${bucket} → bucket ${bucket}`;

    frames.push({
      highlightLine: 5,
      view: {
        buckets: snapshot(buckets),
        activeBucket: bucket,
      } satisfies BucketView,
      variables: { key, hash, bucket },
      caption,
      eli5Caption: ELI5,
    });
  }

  return { frames, buckets };
}
