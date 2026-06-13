import type { Question } from "@/lib/types";

// Section 10: Backtracking — Pattern: backtracking
export const backtrackingQuestions: Question[] = [
  {
    id: "subsets",
    title: "Subsets",
    section: "Backtracking",
    pattern: "backtracking",
    difficulty: "Medium",
    description:
      "Given an array of unique integers, return all possible subsets (the power set). The solution set must not contain duplicate subsets.",
    examples: [
      { input: "nums = [1,2,3]", output: "[[],[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]]" },
      { input: "nums = [0]", output: "[[],[0]]" },
    ],
    constraints: ["1 <= nums.length <= 10", "All numbers unique", "-10 <= nums[i] <= 10"],
    eli5:
      "Walk down the list of items and for each one make two branches: one where you take it and one where you skip it. Every leaf of that tree is a subset.",
    hints: [
      "Think of a decision tree: at each index choose to include nums[i] or not.",
      "Record the current path at every node, not just the leaves.",
      "Backtrack by popping the last choice after recursing.",
    ],
    approach:
      "DFS from a start index. Record the current path as a subset, then for each index from start onward, include nums[i], recurse with i+1, and pop to undo the choice.",
    solutions: {
      python: `def subsets(nums):
    res = []
    def backtrack(start, path):
        res.append(path[:])          # record current subset
        for i in range(start, len(nums)):
            path.append(nums[i])     # choose
            backtrack(i + 1, path)   # explore
            path.pop()               # un-choose
    backtrack(0, [])
    return res`,
      java: `import java.util.*;

class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        backtrack(nums, 0, new ArrayList<>(), res);
        return res;
    }

    private void backtrack(int[] nums, int start, List<Integer> path, List<List<Integer>> res) {
        res.add(new ArrayList<>(path));      // record current subset
        for (int i = start; i < nums.length; i++) {
            path.add(nums[i]);               // choose
            backtrack(nums, i + 1, path, res); // explore
            path.remove(path.size() - 1);    // un-choose
        }
    }
}`,
    },
    timeComplexity: "O(n * 2^n)",
    spaceComplexity: "O(n) recursion depth (excluding output)",
    companies: ["Amazon", "Meta", "Google"],
    leetcodeSlug: "subsets",
  },
  {
    id: "permutations",
    title: "Permutations",
    section: "Backtracking",
    pattern: "backtracking",
    difficulty: "Medium",
    description:
      "Given an array of distinct integers, return all possible permutations in any order.",
    examples: [
      { input: "nums = [1,2,3]", output: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]" },
      { input: "nums = [0,1]", output: "[[0,1],[1,0]]" },
    ],
    constraints: ["1 <= nums.length <= 6", "All integers unique"],
    eli5:
      "Arrange people in a line: pick anyone for the first spot, then anyone still standing for the next, and so on, undoing each pick to try the others.",
    hints: [
      "At each step pick an unused number and mark it used.",
      "When the path length equals n, you have a full permutation.",
      "Unmark (backtrack) after the recursive call so the number is free again.",
    ],
    approach:
      "DFS building a path. Use a 'used' boolean array. When path length equals n, record it. Otherwise try each unused number, mark it, recurse, then unmark.",
    solutions: {
      python: `def permute(nums):
    res = []
    used = [False] * len(nums)
    def backtrack(path):
        if len(path) == len(nums):
            res.append(path[:])      # full permutation
            return
        for i in range(len(nums)):
            if used[i]:
                continue
            used[i] = True           # choose
            path.append(nums[i])
            backtrack(path)          # explore
            path.pop()               # un-choose
            used[i] = False
    backtrack([])
    return res`,
      java: `import java.util.*;

class Solution {
    public List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        boolean[] used = new boolean[nums.length];
        backtrack(nums, used, new ArrayList<>(), res);
        return res;
    }

    private void backtrack(int[] nums, boolean[] used, List<Integer> path, List<List<Integer>> res) {
        if (path.size() == nums.length) {
            res.add(new ArrayList<>(path));  // full permutation
            return;
        }
        for (int i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            used[i] = true;                  // choose
            path.add(nums[i]);
            backtrack(nums, used, path, res); // explore
            path.remove(path.size() - 1);    // un-choose
            used[i] = false;
        }
    }
}`,
    },
    timeComplexity: "O(n * n!)",
    spaceComplexity: "O(n) recursion depth (excluding output)",
    companies: ["Amazon", "Microsoft", "LinkedIn"],
    leetcodeSlug: "permutations",
  },
  {
    id: "combination-sum",
    title: "Combination Sum",
    section: "Backtracking",
    pattern: "backtracking",
    difficulty: "Medium",
    description:
      "Given an array of distinct candidates and a target, return all unique combinations where the chosen numbers sum to target. The same number may be chosen unlimited times.",
    examples: [
      { input: "candidates = [2,3,6,7], target = 7", output: "[[2,2,3],[7]]" },
      { input: "candidates = [2,3,5], target = 8", output: "[[2,2,2,2],[2,3,3],[3,5]]" },
      { input: "candidates = [2], target = 1", output: "[]" },
    ],
    constraints: ["1 <= candidates.length <= 30", "2 <= candidates[i] <= 40", "All candidates distinct", "1 <= target <= 40"],
    eli5:
      "Pick coins to hit an exact total; you may reuse a coin, but to avoid counting the same handful twice you never reach back to a smaller coin once you've moved on.",
    hints: [
      "Pass a start index so you only reuse the current or later candidates — this avoids duplicate combinations.",
      "Subtract the chosen candidate from the remaining target as you recurse.",
      "Stop when remaining hits 0 (record it) or goes negative (dead end).",
    ],
    approach:
      "DFS with a start index and remaining target. At each candidate from start onward, choose it (recurse with the same index since reuse is allowed and a reduced target), then un-choose. Record when remaining reaches 0.",
    solutions: {
      python: `def combination_sum(candidates, target):
    res = []
    def backtrack(start, remaining, path):
        if remaining == 0:
            res.append(path[:])          # exact total reached
            return
        for i in range(start, len(candidates)):
            c = candidates[i]
            if c > remaining:
                continue                 # would overshoot
            path.append(c)               # choose
            backtrack(i, remaining - c, path)  # reuse allowed: same i
            path.pop()                   # un-choose
    backtrack(0, target, [])
    return res`,
      java: `import java.util.*;

class Solution {
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        List<List<Integer>> res = new ArrayList<>();
        backtrack(candidates, 0, target, new ArrayList<>(), res);
        return res;
    }

    private void backtrack(int[] candidates, int start, int remaining, List<Integer> path, List<List<Integer>> res) {
        if (remaining == 0) {
            res.add(new ArrayList<>(path));          // exact total reached
            return;
        }
        for (int i = start; i < candidates.length; i++) {
            int c = candidates[i];
            if (c > remaining) continue;             // would overshoot
            path.add(c);                             // choose
            backtrack(candidates, i, remaining - c, path, res); // reuse allowed: same i
            path.remove(path.size() - 1);            // un-choose
        }
    }
}`,
    },
    timeComplexity: "O(n^(target/min)) — exponential in the number of candidates",
    spaceComplexity: "O(target/min) recursion depth (excluding output)",
    companies: ["Amazon", "Meta", "Airbnb"],
    leetcodeSlug: "combination-sum",
  },
  {
    id: "generate-parentheses",
    title: "Generate Parentheses",
    section: "Backtracking",
    pattern: "backtracking",
    difficulty: "Medium",
    description:
      "Given n pairs of parentheses, generate all combinations of well-formed parentheses.",
    examples: [
      { input: "n = 3", output: '["((()))","(()())","(())()","()(())","()()()"]' },
      { input: "n = 1", output: '["()"]' },
    ],
    constraints: ["1 <= n <= 8"],
    eli5:
      "Build the string one bracket at a time. You may add an opening bracket while you still have some left, and a closing bracket only if there's an unmatched opening waiting for it.",
    hints: [
      "Track how many '(' and ')' you've placed so far.",
      "You can add '(' while open < n, and ')' only while close < open.",
      "Record the string when its length is 2*n.",
    ],
    approach:
      "DFS tracking counts of open and close brackets. Add '(' if open < n; add ')' if close < open. When the string reaches length 2n it is a valid combination.",
    solutions: {
      python: `def generate_parenthesis(n):
    res = []
    def backtrack(s, open_count, close_count):
        if len(s) == 2 * n:
            res.append(s)                # complete valid string
            return
        if open_count < n:
            backtrack(s + '(', open_count + 1, close_count)
        if close_count < open_count:     # only close an open one
            backtrack(s + ')', open_count, close_count + 1)
    backtrack('', 0, 0)
    return res`,
      java: `import java.util.*;

class Solution {
    public List<String> generateParenthesis(int n) {
        List<String> res = new ArrayList<>();
        backtrack(new StringBuilder(), 0, 0, n, res);
        return res;
    }

    private void backtrack(StringBuilder s, int open, int close, int n, List<String> res) {
        if (s.length() == 2 * n) {
            res.add(s.toString());           // complete valid string
            return;
        }
        if (open < n) {
            s.append('(');
            backtrack(s, open + 1, close, n, res);
            s.deleteCharAt(s.length() - 1);  // un-choose
        }
        if (close < open) {                  // only close an open one
            s.append(')');
            backtrack(s, open, close + 1, n, res);
            s.deleteCharAt(s.length() - 1);  // un-choose
        }
    }
}`,
    },
    timeComplexity: "O(4^n / sqrt(n)) — the nth Catalan number",
    spaceComplexity: "O(n) recursion depth (excluding output)",
    companies: ["Amazon", "Google", "Uber"],
    leetcodeSlug: "generate-parentheses",
  },
  {
    id: "word-search",
    title: "Word Search",
    section: "Backtracking",
    pattern: "backtracking",
    difficulty: "Medium",
    stub: true,
    description: "Content coming soon.",
    examples: [],
    constraints: [],
    eli5: "",
    hints: ["", "", ""],
    approach: "",
    solutions: { python: "", java: "" },
    timeComplexity: "",
    spaceComplexity: "",
    companies: ["Amazon", "Microsoft", "Bloomberg"],
    leetcodeSlug: "word-search",
  },
  {
    id: "palindrome-partitioning",
    title: "Palindrome Partitioning",
    section: "Backtracking",
    pattern: "backtracking",
    difficulty: "Medium",
    stub: true,
    description: "Content coming soon.",
    examples: [],
    constraints: [],
    eli5: "",
    hints: ["", "", ""],
    approach: "",
    solutions: { python: "", java: "" },
    timeComplexity: "",
    spaceComplexity: "",
    companies: ["Amazon", "Google"],
    leetcodeSlug: "palindrome-partitioning",
  },
  {
    id: "n-queens",
    title: "N-Queens",
    section: "Backtracking",
    pattern: "backtracking",
    difficulty: "Hard",
    stub: true,
    description: "Content coming soon.",
    examples: [],
    constraints: [],
    eli5: "",
    hints: ["", "", ""],
    approach: "",
    solutions: { python: "", java: "" },
    timeComplexity: "",
    spaceComplexity: "",
    companies: ["Amazon", "Google", "Microsoft"],
    leetcodeSlug: "n-queens",
  },
  {
    id: "sudoku-solver",
    title: "Sudoku Solver",
    section: "Backtracking",
    pattern: "backtracking",
    difficulty: "Hard",
    stub: true,
    description: "Content coming soon.",
    examples: [],
    constraints: [],
    eli5: "",
    hints: ["", "", ""],
    approach: "",
    solutions: { python: "", java: "" },
    timeComplexity: "",
    spaceComplexity: "",
    companies: ["Amazon", "Google", "Uber"],
    leetcodeSlug: "sudoku-solver",
  },
];
