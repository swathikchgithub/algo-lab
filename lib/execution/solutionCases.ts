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
};
