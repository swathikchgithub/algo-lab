"use client";

import { BinarySearchVisualizer } from "./BinarySearchVisualizer";
import { ArrayVisualizer } from "./ArrayVisualizer";
import { GridVisualizer } from "./GridVisualizer";
import { HeapVisualizer } from "./HeapVisualizer";
import { HashTableVisualizer } from "./HashTableVisualizer";
import { BigOVisualizer } from "./BigOVisualizer";
import { StackPanel } from "./StackPanel";
import { twoPointersCode, twoPointersFrames } from "@/lib/algorithms/twoPointers";
import { slidingWindowCode, slidingWindowFrames } from "@/lib/algorithms/slidingWindow";
import { monotonicStackCode, monotonicStackFrames } from "@/lib/algorithms/monotonicStack";
import { kadaneCode, kadaneFrames } from "@/lib/algorithms/kadane";
import { dfsCode, dfsGridFrames } from "@/lib/algorithms/dfsGrid";
import { bfsCode, bfsGridFrames } from "@/lib/algorithms/bfsGrid";

const DEFAULT_GRID = [
  [0, 0, 0, 1, 0],
  [0, 1, 0, 1, 0],
  [0, 1, 0, 0, 0],
  [0, 0, 0, 1, 0],
];

/**
 * Maps a visualizer slug to its client component. Array-substrate visualizers
 * are thin <ArrayVisualizer> configs; others have dedicated components.
 * Returns null for slugs not yet implemented (the page shows "coming soon").
 */
export function VisualizerSwitch({ slug }: { slug: string }) {
  switch (slug) {
    case "binary-search":
      return <BinarySearchVisualizer />;

    case "two-pointers":
      return (
        <ArrayVisualizer
          patternSlug="two-pointers"
          codeLines={twoPointersCode}
          defaultArray={[1, 3, 5, 7, 9, 11, 13]}
          param={{ label: "Target", value: 14 }}
          sort
          generate={(a, p) => twoPointersFrames(a, p ?? 0).frames}
        />
      );

    case "sliding-window":
      return (
        <ArrayVisualizer
          patternSlug="sliding-window"
          codeLines={slidingWindowCode}
          defaultArray={[2, 1, 5, 1, 3, 2]}
          param={{ label: "Window k", value: 3 }}
          generate={(a, p) => slidingWindowFrames(a, p ?? 1).frames}
        />
      );

    case "monotonic-stack":
      return (
        <ArrayVisualizer
          patternSlug="monotonic-stack"
          codeLines={monotonicStackCode}
          defaultArray={[2, 1, 2, 4, 3]}
          generate={(a) => monotonicStackFrames(a).frames}
          renderExtra={(f) => (
            <StackPanel items={(f.view?.stack as number[]) ?? []} title="Stack" />
          )}
        />
      );

    case "kadane":
      return (
        <ArrayVisualizer
          patternSlug="kadane"
          codeLines={kadaneCode}
          defaultArray={[-2, 1, -3, 4, -1, 2, 1, -5, 4]}
          generate={(a) => kadaneFrames(a).frames}
        />
      );

    case "dfs":
      return (
        <GridVisualizer
          patternSlug="dfs-backtracking"
          codeLines={dfsCode}
          defaultGrid={DEFAULT_GRID}
          generate={(g, s) => dfsGridFrames(g, s).frames}
        />
      );

    case "bfs":
      return (
        <GridVisualizer
          patternSlug="bfs"
          codeLines={bfsCode}
          defaultGrid={DEFAULT_GRID}
          generate={(g, s) => bfsGridFrames(g, s).frames}
        />
      );

    case "heap":
      return <HeapVisualizer />;

    case "hash-table":
      return <HashTableVisualizer />;

    case "big-o":
      return <BigOVisualizer />;

    default:
      return null;
  }
}
