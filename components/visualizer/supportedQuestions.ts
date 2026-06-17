// Question ids that have a bespoke, per-question visualizer. Kept in a tiny
// standalone module (no React, no frame-generator imports) so list/index pages
// can check it via hasQuestionVisualizer() WITHOUT pulling the whole visualizer
// bundle. QuestionVisualizer.tsx must have a matching switch case for each id.

export const SUPPORTED_VISUALIZER_IDS: ReadonlySet<string> = new Set([
  // Arrays
  "trapping-rain-water",
  "container-with-most-water",
  "squares-of-sorted-array",
  "move-zeroes",
  "sort-colors",
  "remove-duplicates-sorted",
  "three-sum",
  "two-sum-sorted",
  // Binary Search
  "search-in-rotated-sorted-array",
  "find-first-and-last-position",
  "binary-search",
  "search-insert-position",
  // Strings
  "first-unique-character",
  "valid-anagram",
  "roman-to-integer",
  "string-to-integer-atoi",
  "longest-palindrome-rearrangement",
  // Stacks & Queues
  "daily-temperatures",
  "asteroid-collision",
  // Trees
  "binary-tree-inorder-traversal",
  "binary-tree-preorder-traversal",
  "binary-tree-postorder-traversal",
  "average-of-levels-in-binary-tree",
  "maximum-depth-of-binary-tree",
  "minimum-depth-of-binary-tree",
  "diameter-of-binary-tree",
  "balanced-binary-tree",
]);

export function hasQuestionVisualizer(id: string): boolean {
  return SUPPORTED_VISUALIZER_IDS.has(id);
}
