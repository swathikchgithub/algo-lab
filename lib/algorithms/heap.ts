import type { CellState, Frame } from "@/lib/types";
import type { TreeView } from "@/lib/algorithms/views";

// Pure frame generator for inserting values into a binary MIN-heap stored as a
// level-order array. For each value we push to the end, then sift-up: while the
// node is smaller than its parent (index (i-1)>>1) we swap, stopping when it is
// >= its parent or reaches the root. Returns the frames the <Stepper> plays plus
// the final heap. No React.
//
// The `heapCode` lines below are 1-indexed by `Frame.highlightLine` (line 1 is
// the first entry). Keep them in sync with the frames this function emits.

export const heapCode = [
  "def insert(heap, value):", // 1
  "    heap.append(value)", // 2
  "    i = len(heap) - 1", // 3
  "    while i > 0:", // 4
  "        parent = (i - 1) // 2", // 5
  "        if heap[i] >= heap[parent]: break", // 6
  "        heap[i], heap[parent] = heap[parent], heap[i]", // 7
  "        i = parent", // 8
  "        # bubble up toward the root", // 9
  "    # the smallest value ends up on top", // 10
];

export interface HeapResult {
  frames: Frame[];
  /** Final level-order min-heap array. */
  heap: number[];
}

const ELI5 =
  "a tournament bracket where the champion (smallest) bubbles up to the top.";

/**
 * Build the states array parallel to `heap`.
 *   - `current`  → the node currently bubbling up
 *   - `active`   → its parent being compared (or a just-placed node)
 *   - `default`  → everything else
 */
function buildStates(
  size: number,
  current: number,
  active: number,
): CellState[] {
  const states: CellState[] = new Array(size).fill("default");
  if (active >= 0 && active < size) states[active] = "active";
  if (current >= 0 && current < size) states[current] = "current";
  return states;
}

/**
 * Generate frames for inserting `values` into a binary min-heap one at a time.
 *
 * Time:  O(k log k) — each of the k inserts sifts up at most O(log size) levels.
 * Space: O(k) — the heap plus one frame per push/compare step.
 */
export function heapInsertFrames(values: number[]): HeapResult {
  const heap: number[] = [];
  const frames: Frame[] = [];

  // Initial empty frame.
  frames.push({
    highlightLine: 1,
    view: { heap: [], states: [] } satisfies TreeView,
    variables: { inserting: "—", size: 0 },
    caption: "Start with an empty min-heap.",
    eli5Caption: ELI5,
  });

  for (const value of values) {
    // Push to the end of the level-order array.
    heap.push(value);
    let i = heap.length - 1;
    frames.push({
      highlightLine: 2,
      view: { heap: [...heap], states: buildStates(heap.length, i, -1) },
      variables: { inserting: value, size: heap.length },
      caption: `Push ${value} to the end (index ${i}).`,
      eli5Caption: ELI5,
    });

    // Sift-up: bubble the new node toward the root.
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (heap[i] >= heap[parent]) {
        frames.push({
          highlightLine: 6,
          view: { heap: [...heap], states: buildStates(heap.length, i, parent) },
          variables: {
            inserting: value,
            size: heap.length,
            comparing: `${heap[i]} >= ${heap[parent]}`,
          },
          caption: `${heap[i]} >= parent ${heap[parent]} ✗ → stop.`,
          eli5Caption: ELI5,
        });
        break;
      }
      // child < parent → swap up.
      const child = heap[i];
      frames.push({
        highlightLine: 7,
        view: { heap: [...heap], states: buildStates(heap.length, i, parent) },
        variables: {
          inserting: value,
          size: heap.length,
          comparing: `${heap[i]} < ${heap[parent]}`,
        },
        caption: `${child} < parent ${heap[parent]} ✓ → swap up.`,
        eli5Caption: ELI5,
      });
      [heap[i], heap[parent]] = [heap[parent], heap[i]];
      i = parent;
    }

    // Completed insert: briefly mark the just-placed node as active.
    frames.push({
      highlightLine: 10,
      view: { heap: [...heap], states: buildStates(heap.length, -1, i) },
      variables: { inserting: value, size: heap.length },
      caption:
        i === 0
          ? `${value} settled at the root.`
          : `${value} settled at index ${i}.`,
      eli5Caption: ELI5,
    });
  }

  return { frames, heap };
}
