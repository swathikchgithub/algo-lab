import type { Question } from "@/lib/types";

// Section 9: Dynamic Programming — Pattern: dynamic-programming
export const dynamicProgrammingQuestions: Question[] = [
  {
    id: "climbing-stairs",
    title: "Climbing Stairs",
    section: "Dynamic Programming",
    pattern: "dynamic-programming",
    difficulty: "Easy",
    description:
      "You are climbing a staircase with n steps. Each time you can climb 1 or 2 steps. In how many distinct ways can you reach the top?",
    examples: [
      { input: "n = 2", output: "2", explanation: "1+1 or 2." },
      { input: "n = 3", output: "3", explanation: "1+1+1, 1+2, or 2+1." },
    ],
    constraints: ["1 <= n <= 45"],
    eli5:
      "To stand on a step you arrived either from one step below or two steps below, so the ways to reach it are just those two counts added up — Fibonacci in disguise.",
    hints: [
      "The number of ways to reach step n equals ways(n-1) + ways(n-2).",
      "That's the Fibonacci recurrence with base cases ways(0)=1, ways(1)=1.",
      "You only need the last two values, so track them in two variables.",
    ],
    approach:
      "Let dp[i] be the ways to reach step i. dp[i] = dp[i-1] + dp[i-2]. Roll it forward keeping only the previous two values for O(1) space.",
    solutions: {
      python: `def climb_stairs(n):
    a, b = 1, 1               # ways to reach step 0 and step 1
    for _ in range(2, n + 1):
        a, b = b, a + b       # slide the window forward
    return b`,
      java: `class Solution {
    public int climbStairs(int n) {
        int a = 1, b = 1;             // ways to reach step 0 and step 1
        for (int i = 2; i <= n; i++) {
            int next = a + b;         // slide the window forward
            a = b;
            b = next;
        }
        return b;
    }
}`,
    },
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    companies: ["Amazon", "Apple", "Adobe"],
    leetcodeSlug: "climbing-stairs",
  },
  {
    id: "house-robber",
    title: "House Robber",
    section: "Dynamic Programming",
    pattern: "dynamic-programming",
    difficulty: "Medium",
    description:
      "Given an array where each value is the money in a house along a street, return the maximum you can rob without robbing two adjacent houses.",
    examples: [
      { input: "nums = [1,2,3,1]", output: "4", explanation: "Rob house 1 and 3: 1 + 3 = 4." },
      { input: "nums = [2,7,9,3,1]", output: "12", explanation: "Rob houses 1, 3, 5: 2 + 9 + 1 = 12." },
    ],
    constraints: ["1 <= nums.length <= 100", "0 <= nums[i] <= 400"],
    eli5:
      "At each house you choose: skip it and keep your best-so-far, or rob it and add it to your best from two houses back. Take the bigger.",
    hints: [
      "For each house, either skip it (keep prev best) or rob it (best from two back + current).",
      "dp[i] = max(dp[i-1], dp[i-2] + nums[i]).",
      "Only the last two dp values matter, so use two rolling variables.",
    ],
    approach:
      "Track prev2 (best up to i-2) and prev1 (best up to i-1). At each house, cur = max(prev1, prev2 + nums[i]); shift the window. Answer is prev1 at the end.",
    solutions: {
      python: `def rob(nums):
    prev2, prev1 = 0, 0       # best up to i-2 and i-1
    for n in nums:
        # skip this house vs rob it (best two back + this)
        prev2, prev1 = prev1, max(prev1, prev2 + n)
    return prev1`,
      java: `class Solution {
    public int rob(int[] nums) {
        int prev2 = 0, prev1 = 0;          // best up to i-2 and i-1
        for (int n : nums) {
            // skip this house vs rob it (best two back + this)
            int cur = Math.max(prev1, prev2 + n);
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }
}`,
    },
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    companies: ["Amazon", "Microsoft", "Google"],
    leetcodeSlug: "house-robber",
  },
  {
    id: "coin-change",
    title: "Coin Change",
    section: "Dynamic Programming",
    pattern: "dynamic-programming",
    difficulty: "Medium",
    description:
      "Given coins of different denominations and an amount, return the fewest number of coins needed to make that amount. Return -1 if it cannot be made.",
    examples: [
      { input: "coins = [1,2,5], amount = 11", output: "3", explanation: "11 = 5 + 5 + 1." },
      { input: "coins = [2], amount = 3", output: "-1" },
      { input: "coins = [1], amount = 0", output: "0" },
    ],
    constraints: ["1 <= coins.length <= 12", "1 <= coins[i] <= 2^31 - 1", "0 <= amount <= 10^4"],
    eli5:
      "To make a total, try each coin as the last one you place; the best plan is one more coin than the best plan for the leftover amount.",
    hints: [
      "Build up the answer for every amount from 0 to the target.",
      "dp[a] = 1 + min over coins c of dp[a - c] where a - c >= 0.",
      "Initialize dp with infinity (unreachable) and dp[0] = 0.",
    ],
    approach:
      "Bottom-up DP over amounts. For each amount a, try every coin; dp[a] is the minimum coins. Unreachable amounts stay at infinity. Return dp[amount] or -1.",
    solutions: {
      python: `def coin_change(coins, amount):
    INF = amount + 1
    dp = [0] + [INF] * amount    # dp[0] = 0, rest unreachable
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a:
                dp[a] = min(dp[a], dp[a - c] + 1)
    return dp[amount] if dp[amount] != INF else -1`,
      java: `class Solution {
    public int coinChange(int[] coins, int amount) {
        int INF = amount + 1;
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, INF);            // mark every amount unreachable
        dp[0] = 0;                       // base case: 0 coins for amount 0
        for (int a = 1; a <= amount; a++) {
            for (int c : coins) {
                if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);
            }
        }
        return dp[amount] == INF ? -1 : dp[amount];
    }
}`,
    },
    timeComplexity: "O(amount * coins)",
    spaceComplexity: "O(amount)",
    companies: ["Amazon", "Google", "Uber"],
    leetcodeSlug: "coin-change",
  },
  {
    id: "longest-increasing-subsequence",
    title: "Longest Increasing Subsequence",
    section: "Dynamic Programming",
    pattern: "dynamic-programming",
    difficulty: "Medium",
    description:
      "Given an integer array, return the length of the longest strictly increasing subsequence.",
    examples: [
      { input: "nums = [10,9,2,5,3,7,101,18]", output: "4", explanation: "[2,3,7,101] has length 4." },
      { input: "nums = [0,1,0,3,2,3]", output: "4" },
      { input: "nums = [7,7,7,7,7]", output: "1" },
    ],
    constraints: ["1 <= nums.length <= 2500", "-10^4 <= nums[i] <= 10^4"],
    eli5:
      "Keep a pile of the smallest possible tail for each subsequence length. Each new number either extends the longest pile or replaces the smallest tail it can beat.",
    hints: [
      "Maintain 'tails', where tails[k] is the smallest possible tail of an increasing subsequence of length k+1.",
      "For each number, binary search for the first tail >= it and replace it (or append if it's bigger than all).",
      "The length of tails is the answer.",
    ],
    approach:
      "Patience sorting. Keep a tails array; for each number, use binary search to find its insertion point. Append if it extends, otherwise overwrite. The final tails length is the LIS length.",
    solutions: {
      python: `import bisect

def length_of_lis(nums):
    tails = []                       # smallest tail per length
    for n in nums:
        i = bisect.bisect_left(tails, n)  # first tail >= n
        if i == len(tails):
            tails.append(n)          # extends the longest run
        else:
            tails[i] = n             # tighten a smaller tail
    return len(tails)`,
      java: `class Solution {
    public int lengthOfLIS(int[] nums) {
        int[] tails = new int[nums.length];  // smallest tail per length
        int size = 0;                        // current LIS length
        for (int n : nums) {
            int lo = 0, hi = size;
            while (lo < hi) {                // binary search: first tail >= n
                int mid = lo + (hi - lo) / 2;
                if (tails[mid] < n) lo = mid + 1;
                else hi = mid;
            }
            tails[lo] = n;                   // append (lo == size) or tighten
            if (lo == size) size++;
        }
        return size;
    }
}`,
    },
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    companies: ["Amazon", "Microsoft", "Google"],
    leetcodeSlug: "longest-increasing-subsequence",
  },
  {
    id: "maximum-subarray",
    title: "Maximum Subarray",
    section: "Dynamic Programming",
    pattern: "kadane",
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
    companies: ["Amazon", "Microsoft", "LinkedIn"],
    leetcodeSlug: "maximum-subarray",
  },
  {
    id: "unique-paths",
    title: "Unique Paths",
    section: "Dynamic Programming",
    pattern: "dynamic-programming",
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
    companies: ["Amazon", "Google", "Bloomberg"],
    leetcodeSlug: "unique-paths",
  },
  {
    id: "word-break",
    title: "Word Break",
    section: "Dynamic Programming",
    pattern: "dynamic-programming",
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
    companies: ["Amazon", "Google", "Meta"],
    leetcodeSlug: "word-break",
  },
  {
    id: "edit-distance",
    title: "Edit Distance",
    section: "Dynamic Programming",
    pattern: "dynamic-programming",
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
    companies: ["Amazon", "Google", "Microsoft"],
    leetcodeSlug: "edit-distance",
  },
  {
    id: "longest-common-subsequence",
    title: "Longest Common Subsequence",
    section: "Dynamic Programming",
    pattern: "dynamic-programming",
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
    companies: ["Amazon", "Google", "Microsoft"],
    leetcodeSlug: "longest-common-subsequence",
  },
];
