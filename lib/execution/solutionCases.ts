// Machine-runnable test cases for the *displayed* solution code in the question
// bank. The question `examples` are human-readable prose ("height = [..]" → "6"),
// so they can't be executed directly. These sidecar cases give a function name,
// call arguments, and the expected return value — enough to actually run each
// solution and assert it's correct. Consumed by tests/solutions/*.test.ts.
//
// Add an entry here when a question gets a visualizer (its code panel must be
// right) or whenever you want its shipped solution verified.

export interface SolutionCase {
  /** Positional arguments passed to the solution function. */
  args: unknown[];
  /** Expected return value (compared by value, language-side). */
  expected: unknown;
}

export interface SolutionSpec {
  /** The function defined by the question's `solutions.python`, e.g. "trap". */
  fn: string;
  /** True when the function mutates its first argument in place and returns
   *  nothing (e.g. move_zeroes, sort_colors) — compare the argument, not the return. */
  inPlace?: boolean;
  /** "tree": first arg is a LeetCode level-order array; build a TreeNode from it
   *  (via an injected TreeNode + build_tree preamble) before calling. */
  adapter?: "tree";
  cases: SolutionCase[];
}

/** Keyed by question id. */
export const PYTHON_SOLUTION_CASES: Record<string, SolutionSpec> = {
  "trapping-rain-water": {
    fn: "trap",
    cases: [
      { args: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expected: 6 },
      { args: [[4, 2, 0, 3, 2, 5]], expected: 9 },
      { args: [[1, 2, 3, 4]], expected: 0 },
    ],
  },
  "container-with-most-water": {
    fn: "max_area",
    cases: [
      { args: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49 },
      { args: [[1, 1]], expected: 1 },
    ],
  },
  "squares-of-sorted-array": {
    fn: "sorted_squares",
    cases: [
      { args: [[-4, -1, 0, 3, 10]], expected: [0, 1, 9, 16, 100] },
      { args: [[-7, -3, 2, 3, 11]], expected: [4, 9, 9, 49, 121] },
    ],
  },
  "move-zeroes": {
    fn: "move_zeroes",
    inPlace: true,
    cases: [
      { args: [[0, 1, 0, 3, 12]], expected: [1, 3, 12, 0, 0] },
      { args: [[0]], expected: [0] },
    ],
  },
  "sort-colors": {
    fn: "sort_colors",
    inPlace: true,
    cases: [
      { args: [[2, 0, 2, 1, 1, 0]], expected: [0, 0, 1, 1, 2, 2] },
      { args: [[2, 0, 1]], expected: [0, 1, 2] },
    ],
  },
  "remove-duplicates-sorted": {
    // Returns the new length k; the in-place rewrite of the prefix is exercised
    // by the unit test on the frame generator.
    fn: "remove_duplicates",
    cases: [
      { args: [[1, 1, 2]], expected: 2 },
      { args: [[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]], expected: 5 },
    ],
  },
  "three-sum": {
    fn: "three_sum",
    cases: [
      {
        args: [[-1, 0, 1, 2, -1, -4]],
        expected: [
          [-1, -1, 2],
          [-1, 0, 1],
        ],
      },
      { args: [[0, 0, 0]], expected: [[0, 0, 0]] },
    ],
  },
  "search-in-rotated-sorted-array": {
    fn: "search",
    cases: [
      { args: [[4, 5, 6, 7, 0, 1, 2], 0], expected: 4 },
      { args: [[4, 5, 6, 7, 0, 1, 2], 3], expected: -1 },
      { args: [[1], 0], expected: -1 },
    ],
  },
  "find-first-and-last-position": {
    fn: "search_range",
    cases: [
      { args: [[5, 7, 7, 8, 8, 10], 8], expected: [3, 4] },
      { args: [[5, 7, 7, 8, 8, 10], 6], expected: [-1, -1] },
      { args: [[], 0], expected: [-1, -1] },
    ],
  },
  "first-unique-character": {
    fn: "first_uniq_char",
    cases: [
      { args: ["leetcode"], expected: 0 },
      { args: ["loveleetcode"], expected: 2 },
      { args: ["aabb"], expected: -1 },
    ],
  },
  "valid-anagram": {
    fn: "is_anagram",
    cases: [
      { args: ["anagram", "nagaram"], expected: true },
      { args: ["rat", "car"], expected: false },
      { args: ["ab", "abc"], expected: false },
    ],
  },
  "roman-to-integer": {
    fn: "roman_to_int",
    cases: [
      { args: ["III"], expected: 3 },
      { args: ["LVIII"], expected: 58 },
      { args: ["MCMXCIV"], expected: 1994 },
    ],
  },
  "string-to-integer-atoi": {
    fn: "my_atoi",
    cases: [
      { args: ["42"], expected: 42 },
      { args: ["   -42"], expected: -42 },
      { args: ["4193 with words"], expected: 4193 },
      { args: ["words and 987"], expected: 0 },
      { args: ["91283472332"], expected: 2147483647 },
    ],
  },
  "daily-temperatures": {
    fn: "daily_temperatures",
    cases: [
      { args: [[73, 74, 75, 71, 69, 72, 76, 73]], expected: [1, 1, 4, 2, 1, 1, 0, 0] },
      { args: [[30, 40, 50, 60]], expected: [1, 1, 1, 0] },
    ],
  },
  "asteroid-collision": {
    fn: "asteroid_collision",
    cases: [
      { args: [[5, 10, -5]], expected: [5, 10] },
      { args: [[8, -8]], expected: [] },
      { args: [[10, 2, -5]], expected: [10] },
    ],
  },
  "two-sum-sorted": {
    fn: "two_sum",
    cases: [
      { args: [[2, 7, 11, 15], 9], expected: [1, 2] },
      { args: [[2, 3, 4], 6], expected: [1, 3] },
      { args: [[1, 3, 5, 7], 100], expected: [] },
    ],
  },
  "binary-search": {
    fn: "search",
    cases: [
      { args: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 },
      { args: [[-1, 0, 3, 5, 9, 12], 2], expected: -1 },
    ],
  },
  "search-insert-position": {
    fn: "search_insert",
    cases: [
      { args: [[1, 3, 5, 6], 5], expected: 2 },
      { args: [[1, 3, 5, 6], 2], expected: 1 },
      { args: [[1, 3, 5, 6], 7], expected: 4 },
    ],
  },
  "longest-palindrome-rearrangement": {
    fn: "longest_palindrome",
    cases: [
      { args: ["abccccdd"], expected: 7 },
      { args: ["a"], expected: 1 },
      { args: ["aabb"], expected: 4 },
    ],
  },
  "binary-tree-inorder-traversal": {
    fn: "inorder_traversal",
    adapter: "tree",
    cases: [
      { args: [[1, null, 2, 3]], expected: [1, 3, 2] },
      { args: [[]], expected: [] },
      { args: [[1, 2, 3, 4, 5]], expected: [4, 2, 5, 1, 3] },
    ],
  },
  "binary-tree-preorder-traversal": {
    fn: "preorder_traversal",
    adapter: "tree",
    cases: [
      { args: [[1, null, 2, 3]], expected: [1, 2, 3] },
      { args: [[1, 2, 3, 4, 5]], expected: [1, 2, 4, 5, 3] },
    ],
  },
  "binary-tree-postorder-traversal": {
    fn: "postorder_traversal",
    adapter: "tree",
    cases: [
      { args: [[1, null, 2, 3]], expected: [3, 2, 1] },
      { args: [[1, 2, 3, 4, 5]], expected: [4, 5, 2, 3, 1] },
    ],
  },
  "maximum-depth-of-binary-tree": {
    fn: "max_depth",
    adapter: "tree",
    cases: [
      { args: [[3, 9, 20, null, null, 15, 7]], expected: 3 },
      { args: [[1]], expected: 1 },
      { args: [[]], expected: 0 },
    ],
  },
  "minimum-depth-of-binary-tree": {
    fn: "min_depth",
    adapter: "tree",
    cases: [
      { args: [[3, 9, 20, null, null, 15, 7]], expected: 2 },
      { args: [[2, null, 3, null, 4]], expected: 3 },
    ],
  },
  "diameter-of-binary-tree": {
    fn: "diameter_of_binary_tree",
    adapter: "tree",
    cases: [
      { args: [[1, 2, 3, 4, 5]], expected: 3 },
      { args: [[1, 2]], expected: 1 },
    ],
  },
  "balanced-binary-tree": {
    fn: "is_balanced",
    adapter: "tree",
    cases: [
      { args: [[3, 9, 20, null, null, 15, 7]], expected: true },
      { args: [[1, 2, 2, 3, 3, null, null, 4, 4]], expected: false },
    ],
  },
  "average-of-levels-in-binary-tree": {
    fn: "average_of_levels",
    adapter: "tree",
    cases: [
      { args: [[3, 9, 20, null, null, 15, 7]], expected: [3, 14.5, 11] },
      { args: [[1, 2, 3]], expected: [1, 2.5] },
    ],
  },
};
