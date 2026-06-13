// Visualizer catalog — metadata for the gallery and per-slug pages.
// Frame generators live in their own modules; this file only describes them so
// the gallery and routes stay data-driven. Adding a visualizer = author a
// generator + flip `implemented` to true here and wire it on the slug page.

export interface VisualizerMeta {
  slug: string;
  title: string;
  /** One-line tagline under the title. */
  tagline: string;
  /** Complexity shown in the pill badge, e.g. "O(log n)". */
  complexity: string;
  /** Pattern slug this visualizer illustrates (keys into PATTERNS). */
  patternSlug: string;
  implemented: boolean;
}

export const VISUALIZERS: VisualizerMeta[] = [
  {
    slug: "binary-search",
    title: "Binary Search",
    tagline: "Find an element by repeatedly halving the search space.",
    complexity: "O(log n)",
    patternSlug: "binary-search",
    implemented: true,
  },
  {
    slug: "two-pointers",
    title: "Two Pointers",
    tagline: "Two indices converge from the ends to find a pair in one pass.",
    complexity: "O(n)",
    patternSlug: "two-pointers",
    implemented: true,
  },
  {
    slug: "sliding-window",
    title: "Sliding Window",
    tagline: "A fixed-size window slides across the array, updating as it goes.",
    complexity: "O(n)",
    patternSlug: "sliding-window",
    implemented: true,
  },
  {
    slug: "hash-table",
    title: "Hash Table Build",
    tagline: "Keys land in buckets for instant O(1) lookup.",
    complexity: "O(1) avg",
    patternSlug: "string-hashing",
    implemented: true,
  },
  {
    slug: "dfs",
    title: "DFS on a Grid",
    tagline: "Dive deep down one path, backtracking at dead ends.",
    complexity: "O(V + E)",
    patternSlug: "dfs-backtracking",
    implemented: true,
  },
  {
    slug: "bfs",
    title: "BFS on a Grid",
    tagline: "Explore level by level — ripples spreading outward.",
    complexity: "O(V + E)",
    patternSlug: "bfs",
    implemented: true,
  },
  {
    slug: "big-o",
    title: "Big-O Explainer",
    tagline: "Watch operations grow as the input size grows.",
    complexity: "O(1) · O(log n) · O(n) · O(n²)",
    patternSlug: "big-o",
    implemented: true,
  },
  {
    slug: "monotonic-stack",
    title: "Monotonic Stack",
    tagline: "A tidy stack answers next-greater-element queries in one pass.",
    complexity: "O(n)",
    patternSlug: "monotonic-stack",
    implemented: true,
  },
  {
    slug: "heap",
    title: "Heap (Top-K)",
    tagline: "A min-heap bubbles values into place on every insert.",
    complexity: "O(log n) insert",
    patternSlug: "top-k",
    implemented: true,
  },
  {
    slug: "kadane",
    title: "Kadane's Max Subarray",
    tagline: "Drop the running sum whenever it turns negative.",
    complexity: "O(n)",
    patternSlug: "kadane",
    implemented: true,
  },
];

const BY_SLUG = new Map(VISUALIZERS.map((v) => [v.slug, v]));

export function getVisualizer(slug: string): VisualizerMeta | undefined {
  return BY_SLUG.get(slug);
}
