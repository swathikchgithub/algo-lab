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
};
