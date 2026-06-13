import type { Question } from "@/lib/types";

// Section 4: Stacks & Queues — Pattern 4.1 Monotonic Stack
export const stacksQuestions: Question[] = [
  {
    id: "next-greater-element-i",
    title: "Next Greater Element I",
    section: "Stacks & Queues",
    pattern: "monotonic-stack",
    difficulty: "Easy",
    description:
      "For each element of nums1 (a subset of nums2), find the first element to its right in nums2 that is greater. Return -1 where none exists.",
    examples: [
      { input: "nums1 = [4,1,2], nums2 = [1,3,4,2]", output: "[-1,3,-1]", explanation: "For 4 nothing to its right is bigger; for 1 it's 3; for 2 nothing is bigger." },
      { input: "nums1 = [2,4], nums2 = [1,2,3,4]", output: "[3,-1]" },
    ],
    constraints: ["1 <= nums1.length <= nums2.length <= 1000", "0 <= nums[i] <= 10^4", "All integers in nums2 are unique", "nums1 is a subset of nums2"],
    eli5:
      "Walk a line of people right-to-left. Keep a stack of those still 'looking for a taller person'; whoever is shorter than the newcomer gets their answer and leaves.",
    hints: [
      "Precompute the next-greater answer for every value in nums2 once, then just look them up for nums1.",
      "A decreasing stack of values lets you find the next greater element in one pass.",
      "Pop everything smaller than the current number — the current number is their next greater.",
    ],
    approach:
      "Scan nums2 with a monotonic decreasing stack. For each value, pop all smaller values off the stack and record the current value as their next greater in a map. Then map nums1 through it.",
    solutions: {
      python: `def next_greater_element(nums1, nums2):
    nxt = {}            # value -> its next greater element
    stack = []          # decreasing stack of values waiting for an answer
    for x in nums2:
        while stack and stack[-1] < x:
            nxt[stack.pop()] = x  # x is the next greater for the popped value
        stack.append(x)
    return [nxt.get(x, -1) for x in nums1]`,
      java: `import java.util.*;

class Solution {
    public int[] nextGreaterElement(int[] nums1, int[] nums2) {
        Map<Integer, Integer> nxt = new HashMap<>(); // value -> its next greater element
        Deque<Integer> stack = new ArrayDeque<>();   // decreasing stack of values waiting for an answer
        for (int x : nums2) {
            while (!stack.isEmpty() && stack.peek() < x) {
                nxt.put(stack.pop(), x); // x is the next greater for the popped value
            }
            stack.push(x);
        }
        int[] res = new int[nums1.length];
        for (int i = 0; i < nums1.length; i++) {
            res[i] = nxt.getOrDefault(nums1[i], -1);
        }
        return res;
    }
}`,
    },
    timeComplexity: "O(n + m)",
    spaceComplexity: "O(n)",
    companies: ["Amazon", "Bloomberg"],
    leetcodeSlug: "next-greater-element-i",
  },
  {
    id: "next-greater-element-ii",
    title: "Next Greater Element II (Circular)",
    section: "Stacks & Queues",
    pattern: "monotonic-stack",
    difficulty: "Medium",
    description:
      "Given a circular array, return the next greater element for each position. The search wraps around the end back to the start. Use -1 where none exists.",
    examples: [
      { input: "nums = [1,2,1]", output: "[2,-1,2]", explanation: "The last 1 wraps around to find 2 at the front." },
      { input: "nums = [1,2,3,4,3]", output: "[2,3,4,-1,4]" },
    ],
    constraints: ["1 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9"],
    eli5:
      "Same line of people, but it's a circle. Walk around it twice so everyone gets a chance to see who's taller, even past the end.",
    hints: [
      "Circularity is handled by iterating twice over the array (indices 0 .. 2n-1, using i % n).",
      "Store indices on the stack so you know where to write the answer.",
      "Only push real indices during the first pass; the second pass just resolves pending ones.",
    ],
    approach:
      "Run a monotonic decreasing stack of indices over 2n iterations, indexing with i % n. When the current value exceeds the value at the stacked index, pop and fill its answer. Push indices only while i < n.",
    solutions: {
      python: `def next_greater_elements(nums):
    n = len(nums)
    res = [-1] * n
    stack = []  # indices, values decreasing
    for i in range(2 * n):
        cur = nums[i % n]
        while stack and nums[stack[-1]] < cur:
            res[stack.pop()] = cur
        if i < n:
            stack.append(i)  # only the first pass enqueues new indices
    return res`,
      java: `import java.util.*;

class Solution {
    public int[] nextGreaterElements(int[] nums) {
        int n = nums.length;
        int[] res = new int[n];
        Arrays.fill(res, -1);
        Deque<Integer> stack = new ArrayDeque<>(); // indices, values decreasing
        for (int i = 0; i < 2 * n; i++) {
            int cur = nums[i % n];
            while (!stack.isEmpty() && nums[stack.peek()] < cur) {
                res[stack.pop()] = cur;
            }
            if (i < n) stack.push(i); // only the first pass enqueues new indices
        }
        return res;
    }
}`,
    },
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    companies: ["Amazon", "Google"],
    leetcodeSlug: "next-greater-element-ii",
  },
  {
    id: "daily-temperatures",
    title: "Daily Temperatures",
    section: "Stacks & Queues",
    pattern: "monotonic-stack",
    difficulty: "Medium",
    description:
      "Given daily temperatures, return an array where answer[i] is the number of days you must wait until a warmer temperature. If none, put 0.",
    examples: [
      { input: "temperatures = [73,74,75,71,69,72,76,73]", output: "[1,1,4,2,1,1,0,0]" },
      { input: "temperatures = [30,40,50,60]", output: "[1,1,1,0]" },
    ],
    constraints: ["1 <= temperatures.length <= 10^5", "30 <= temperatures[i] <= 100"],
    eli5:
      "Each day stands in line waiting for a warmer day. When a warmer day arrives, it tells every colder day still waiting how long they waited, and they leave.",
    hints: [
      "This is 'next greater element' but the answer is the distance, not the value.",
      "Keep a decreasing stack of indices of days still waiting for a warmer day.",
      "When today is warmer than the day on top, pop it and the wait is i - poppedIndex.",
    ],
    approach:
      "Monotonic decreasing stack of indices. For each day, while it's warmer than the temperature at the top index, pop and set its answer to the index gap. Then push the current index.",
    solutions: {
      python: `def daily_temperatures(temperatures):
    res = [0] * len(temperatures)
    stack = []  # indices of days awaiting a warmer day
    for i, t in enumerate(temperatures):
        while stack and temperatures[stack[-1]] < t:
            j = stack.pop()
            res[j] = i - j  # days waited until warmer
        stack.append(i)
    return res`,
      java: `import java.util.*;

class Solution {
    public int[] dailyTemperatures(int[] temperatures) {
        int[] res = new int[temperatures.length];
        Deque<Integer> stack = new ArrayDeque<>(); // indices of days awaiting a warmer day
        for (int i = 0; i < temperatures.length; i++) {
            while (!stack.isEmpty() && temperatures[stack.peek()] < temperatures[i]) {
                int j = stack.pop();
                res[j] = i - j; // days waited until warmer
            }
            stack.push(i);
        }
        return res;
    }
}`,
    },
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    companies: ["Amazon", "Google", "Microsoft"],
    leetcodeSlug: "daily-temperatures",
  },
  {
    id: "largest-rectangle-in-histogram",
    title: "Largest Rectangle in Histogram",
    section: "Stacks & Queues",
    pattern: "monotonic-stack",
    difficulty: "Hard",
    description:
      "Given the heights of histogram bars of width 1, find the area of the largest rectangle that fits inside the histogram.",
    examples: [
      { input: "heights = [2,1,5,6,2,3]", output: "10", explanation: "Bars 5 and 6 form a 2x5 rectangle of area 10." },
      { input: "heights = [2,4]", output: "4" },
    ],
    constraints: ["1 <= heights.length <= 10^5", "0 <= heights[i] <= 10^4"],
    eli5:
      "Each bar wonders 'how wide a rectangle can I anchor at my height?' A bar can stretch left and right until it hits a shorter bar. We settle each bar's width the moment a shorter bar appears.",
    hints: [
      "For each bar, the widest rectangle of its height extends until the first shorter bar on each side.",
      "Keep an increasing stack of indices; when a shorter bar arrives, the popped bar's rectangle is finalized.",
      "Append a sentinel 0 height at the end so the stack fully drains.",
    ],
    approach:
      "Maintain a stack of indices with increasing heights. When the current bar is shorter than the top, pop it: its height is the popped value, and its width spans from the new top (exclusive) to the current index (exclusive). A trailing sentinel of height 0 flushes all remaining bars.",
    solutions: {
      python: `def largest_rectangle_area(heights):
    stack = []          # indices with increasing heights
    best = 0
    # sentinel 0 forces every bar to be resolved at the end
    for i, h in enumerate(heights + [0]):
        while stack and heights[stack[-1]] >= h:
            height = heights[stack.pop()]
            # width spans from the new top (exclusive) to i (exclusive)
            left = stack[-1] if stack else -1
            width = i - left - 1
            best = max(best, height * width)
        stack.append(i)
    return best`,
      java: `import java.util.*;

class Solution {
    public int largestRectangleArea(int[] heights) {
        int n = heights.length;
        Deque<Integer> stack = new ArrayDeque<>(); // indices with increasing heights
        int best = 0;
        // iterate one past the end; height 0 sentinel forces every bar to resolve
        for (int i = 0; i <= n; i++) {
            int h = (i == n) ? 0 : heights[i];
            while (!stack.isEmpty() && heights[stack.peek()] >= h) {
                int height = heights[stack.pop()];
                // width spans from the new top (exclusive) to i (exclusive)
                int left = stack.isEmpty() ? -1 : stack.peek();
                int width = i - left - 1;
                best = Math.max(best, height * width);
            }
            stack.push(i);
        }
        return best;
    }
}`,
    },
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    companies: ["Amazon", "Google", "Microsoft", "Meta"],
    leetcodeSlug: "largest-rectangle-in-histogram",
  },
  {
    id: "maximal-rectangle-binary-matrix",
    title: "Maximal Rectangle in Binary Matrix",
    section: "Stacks & Queues",
    pattern: "monotonic-stack",
    difficulty: "Hard",
    description:
      "Given a binary matrix of '0's and '1's, find the largest rectangle containing only 1s and return its area.",
    examples: [
      { input: 'matrix = [["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]', output: "6" },
      { input: 'matrix = [["0"]]', output: "0" },
    ],
    constraints: ["rows == matrix.length", "cols == matrix[i].length", "1 <= rows, cols <= 200", "matrix[i][j] is '0' or '1'"],
    eli5:
      "Stack the 1s row by row into bar towers: each cell counts how many 1s sit on top of each other up to this row. Every row becomes a histogram, and we find the biggest rectangle in each.",
    hints: [
      "Build a running histogram per row: heights[c] += 1 if the cell is '1', else reset to 0.",
      "For each row's histogram, reuse the Largest Rectangle in Histogram routine.",
      "The answer is the max histogram rectangle across all rows.",
    ],
    approach:
      "For each row, update a column-height histogram (add 1 for '1', reset to 0 for '0'). Run the monotonic-stack largest-rectangle-in-histogram on that histogram and track the global max.",
    solutions: {
      python: `def maximal_rectangle(matrix):
    if not matrix or not matrix[0]:
        return 0
    cols = len(matrix[0])
    heights = [0] * cols
    best = 0
    for row in matrix:
        for c in range(cols):
            # extend the bar upward, or reset to 0 on a '0'
            heights[c] = heights[c] + 1 if row[c] == '1' else 0
        best = max(best, _largest_in_row(heights))
    return best

def _largest_in_row(heights):
    stack = []          # indices with increasing heights
    best = 0
    for i, h in enumerate(heights + [0]):  # sentinel 0 flushes the stack
        while stack and heights[stack[-1]] >= h:
            height = heights[stack.pop()]
            left = stack[-1] if stack else -1
            best = max(best, height * (i - left - 1))
        stack.append(i)
    return best`,
      java: `import java.util.*;

class Solution {
    public int maximalRectangle(char[][] matrix) {
        if (matrix.length == 0 || matrix[0].length == 0) return 0;
        int cols = matrix[0].length;
        int[] heights = new int[cols];
        int best = 0;
        for (char[] row : matrix) {
            for (int c = 0; c < cols; c++) {
                // extend the bar upward, or reset to 0 on a '0'
                heights[c] = row[c] == '1' ? heights[c] + 1 : 0;
            }
            best = Math.max(best, largestInRow(heights));
        }
        return best;
    }

    private int largestInRow(int[] heights) {
        int n = heights.length;
        Deque<Integer> stack = new ArrayDeque<>(); // indices with increasing heights
        int best = 0;
        for (int i = 0; i <= n; i++) { // sentinel height 0 flushes the stack
            int h = (i == n) ? 0 : heights[i];
            while (!stack.isEmpty() && heights[stack.peek()] >= h) {
                int height = heights[stack.pop()];
                int left = stack.isEmpty() ? -1 : stack.peek();
                best = Math.max(best, height * (i - left - 1));
            }
            stack.push(i);
        }
        return best;
    }
}`,
    },
    timeComplexity: "O(rows * cols)",
    spaceComplexity: "O(cols)",
    companies: ["Amazon", "Google", "Meta"],
    leetcodeSlug: "maximal-rectangle",
  },
  {
    id: "sum-of-subarray-minimums",
    title: "Sum of Subarray Minimums",
    section: "Stacks & Queues",
    pattern: "monotonic-stack",
    difficulty: "Medium",
    description:
      "Given an array, return the sum of the minimum of every contiguous subarray, modulo 10^9 + 7.",
    examples: [
      { input: "arr = [3,1,2,4]", output: "17", explanation: "Subarray minimums sum to 17." },
      { input: "arr = [11,81,94,43,3]", output: "444" },
    ],
    constraints: ["1 <= arr.length <= 3*10^4", "1 <= arr[i] <= 3*10^4"],
    eli5:
      "Instead of looking at every subarray, ask each element: 'in how many subarrays am I the smallest?' Multiply that count by the value and add it all up.",
    hints: [
      "Each element contributes value * (number of subarrays where it is the minimum).",
      "Count how far it extends left and right before meeting a strictly/loosely smaller element — use strict on one side to avoid double counting equal values.",
      "Two monotonic stacks (or one pass) give previous-less and next-less boundaries; remember the mod.",
    ],
    approach:
      "For each index i, find the distance to the previous strictly-smaller element (left) and the next smaller-or-equal element (right). The count of subarrays where arr[i] is the minimum is left * right; sum arr[i] * left * right under mod 1e9+7. The strict/non-strict asymmetry prevents double counting equal minimums.",
    solutions: {
      python: `def sum_subarray_mins(arr):
    MOD = 10**9 + 7
    n = len(arr)
    # left[i]: # of subarrays ending at i where arr[i] is the min
    # using previous strictly-smaller element
    left = [0] * n
    stack = []  # indices, increasing by value (strict on the left)
    for i in range(n):
        while stack and arr[stack[-1]] >= arr[i]:
            stack.pop()
        left[i] = i - stack[-1] if stack else i + 1
        stack.append(i)
    # right[i]: # of subarrays starting at i where arr[i] is the min
    # using next smaller-or-equal element (non-strict to avoid double count)
    right = [0] * n
    stack = []
    for i in range(n - 1, -1, -1):
        while stack and arr[stack[-1]] > arr[i]:
            stack.pop()
        right[i] = stack[-1] - i if stack else n - i
        stack.append(i)
    total = 0
    for i in range(n):
        total = (total + arr[i] * left[i] * right[i]) % MOD
    return total`,
      java: `import java.util.*;

class Solution {
    public int sumSubarrayMins(int[] arr) {
        final long MOD = 1_000_000_007L;
        int n = arr.length;
        // left[i]: # subarrays ending at i where arr[i] is min (prev strictly smaller)
        int[] left = new int[n];
        Deque<Integer> stack = new ArrayDeque<>();
        for (int i = 0; i < n; i++) {
            while (!stack.isEmpty() && arr[stack.peek()] >= arr[i]) stack.pop();
            left[i] = stack.isEmpty() ? i + 1 : i - stack.peek();
            stack.push(i);
        }
        // right[i]: # subarrays starting at i where arr[i] is min (next smaller-or-equal)
        int[] right = new int[n];
        stack.clear();
        for (int i = n - 1; i >= 0; i--) {
            while (!stack.isEmpty() && arr[stack.peek()] > arr[i]) stack.pop();
            right[i] = stack.isEmpty() ? n - i : stack.peek() - i;
            stack.push(i);
        }
        long total = 0;
        for (int i = 0; i < n; i++) {
            // long arithmetic keeps arr[i] * left * right from overflowing before the mod
            total = (total + (long) arr[i] * left[i] * right[i]) % MOD;
        }
        return (int) total;
    }
}`,
    },
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    companies: ["Amazon", "Google", "Bloomberg"],
    leetcodeSlug: "sum-of-subarray-minimums",
  },
  {
    id: "maximum-width-ramp",
    title: "Maximum Width Ramp",
    section: "Stacks & Queues",
    pattern: "monotonic-stack",
    difficulty: "Medium",
    description:
      "A ramp is a pair (i, j) with i < j and nums[i] <= nums[j]. Return the maximum width j - i, or 0 if no ramp exists.",
    examples: [
      { input: "nums = [6,0,8,2,1,5]", output: "4", explanation: "(i, j) = (1, 5) gives nums[1]=0 <= nums[5]=5, width 4." },
      { input: "nums = [9,8,1,0,1,9,4,0,4,1]", output: "7" },
    ],
    constraints: ["2 <= nums.length <= 5*10^4", "0 <= nums[i] <= 5*10^4"],
    eli5:
      "Build a list of candidate left-ends that keep getting smaller (a good left-end is a low value, early). Then walk from the right, and for each right-end pop off any candidate it can pair with, keeping the widest reach.",
    hints: [
      "A useful left index must have a strictly decreasing value compared to earlier kept indices.",
      "Build a decreasing stack of candidate left indices in a forward pass.",
      "Scan from the right; pop candidates while nums[candidate] <= nums[j], updating the best width with each pop.",
    ],
    approach:
      "First pass: push index i onto a stack only when nums[i] is smaller than the value at the current top, forming a decreasing stack of candidate left ends. Second pass from the right: for each j, pop every candidate with nums[top] <= nums[j], updating best = max(best, j - top).",
    solutions: {
      python: `def max_width_ramp(nums):
    stack = []  # candidate left indices, values strictly decreasing
    for i, v in enumerate(nums):
        if not stack or nums[stack[-1]] > v:
            stack.append(i)
    best = 0
    for j in range(len(nums) - 1, -1, -1):
        while stack and nums[stack[-1]] <= nums[j]:
            best = max(best, j - stack.pop())
    return best`,
      java: `import java.util.*;

class Solution {
    public int maxWidthRamp(int[] nums) {
        Deque<Integer> stack = new ArrayDeque<>(); // candidate left indices, values strictly decreasing
        for (int i = 0; i < nums.length; i++) {
            if (stack.isEmpty() || nums[stack.peek()] > nums[i]) stack.push(i);
        }
        int best = 0;
        for (int j = nums.length - 1; j >= 0; j--) {
            while (!stack.isEmpty() && nums[stack.peek()] <= nums[j]) {
                best = Math.max(best, j - stack.pop());
            }
        }
        return best;
    }
}`,
    },
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    companies: ["Amazon", "Google"],
    leetcodeSlug: "maximum-width-ramp",
  },
  {
    id: "online-stock-span",
    title: "Online Stock Span",
    section: "Stacks & Queues",
    pattern: "monotonic-stack",
    difficulty: "Medium",
    description:
      "Design a class that, for a stream of daily stock prices, returns the span: the number of consecutive days (ending today, going back) the price was less than or equal to today's price.",
    examples: [
      { input: "next(100), next(80), next(60), next(70), next(60), next(75), next(85)", output: "1, 1, 1, 2, 1, 4, 6" },
      { input: "next(31), next(41), next(48), next(59), next(79)", output: "1, 2, 3, 4, 5" },
    ],
    constraints: ["1 <= price <= 10^5", "At most 10^4 calls to next"],
    eli5:
      "Each day swallows the spans of all earlier days that were not pricier than it. Instead of recounting them one by one, you absorb their already-counted spans in a single gulp.",
    hints: [
      "Keep a stack of (price, span) pairs with strictly decreasing prices.",
      "When today's price is >= the top price, pop it and add its span into today's span.",
      "Push today's (price, accumulatedSpan) and return the span.",
    ],
    approach:
      "Maintain a monotonic decreasing stack of (price, span) pairs. For each new price, start span = 1, then while the top price <= current price, pop it and add its span. Push (price, span) and return span.",
    solutions: {
      python: `class StockSpanner:
    def __init__(self):
        self.stack = []  # (price, span), prices strictly decreasing

    def next(self, price):
        span = 1
        # absorb the spans of earlier days not pricier than today
        while self.stack and self.stack[-1][0] <= price:
            span += self.stack.pop()[1]
        self.stack.append((price, span))
        return span`,
      java: `import java.util.*;

class StockSpanner {
    private final Deque<int[]> stack; // [price, span], prices strictly decreasing

    public StockSpanner() {
        stack = new ArrayDeque<>();
    }

    public int next(int price) {
        int span = 1;
        // absorb the spans of earlier days not pricier than today
        while (!stack.isEmpty() && stack.peek()[0] <= price) {
            span += stack.pop()[1];
        }
        stack.push(new int[] {price, span});
        return span;
    }
}`,
    },
    timeComplexity: "O(1) amortized per call",
    spaceComplexity: "O(n)",
    companies: ["Amazon", "Bloomberg"],
    leetcodeSlug: "online-stock-span",
  },
  {
    id: "132-pattern",
    title: "132 Pattern",
    section: "Stacks & Queues",
    pattern: "monotonic-stack",
    difficulty: "Medium",
    description:
      "Given an array, determine if there is a 132 pattern: indices i < j < k with nums[i] < nums[k] < nums[j]. Return true if such a triple exists.",
    examples: [
      { input: "nums = [1,2,3,4]", output: "false", explanation: "Strictly increasing — no '2' value dips below a later one." },
      { input: "nums = [3,1,4,2]", output: "true", explanation: "[1,4,2] satisfies nums[i]=1 < nums[k]=2 < nums[j]=4." },
    ],
    constraints: ["n == nums.length", "1 <= n <= 2*10^5", "-10^9 <= nums[i] <= 10^9"],
    eli5:
      "Scan from the right looking for the '2' (a middle value). Keep a stack of big '3' candidates; whenever a number falls below the best '2' you've discarded, you've found the '1'.",
    hints: [
      "Iterate from right to left, treating each element as a candidate for the '3' (nums[j]).",
      "Track the largest value popped so far that is still less than the top — this is the best '2' (nums[k]).",
      "If the current number is less than that best '2', it serves as the '1' and the pattern exists.",
    ],
    approach:
      "Traverse right to left with a decreasing stack of potential '3' values and a variable 'third' holding the best candidate '2' (largest value known to have a bigger element to its right). Pop while nums[i] > top, updating third to the popped value. If nums[i] < third at any point, return true; otherwise push nums[i].",
    solutions: {
      python: `def find132pattern(nums):
    stack = []                  # potential '3' values, decreasing
    third = float('-inf')       # best '2': largest value with a bigger one to its right
    for x in reversed(nums):
        if x < third:           # x is the '1' -> pattern found
            return True
        while stack and stack[-1] < x:
            third = stack.pop()  # this popped value becomes the best '2'
        stack.append(x)
    return False`,
      java: `import java.util.*;

class Solution {
    public boolean find132pattern(int[] nums) {
        Deque<Integer> stack = new ArrayDeque<>(); // potential '3' values, decreasing
        long third = Long.MIN_VALUE;               // best '2': largest value with a bigger one to its right
        for (int i = nums.length - 1; i >= 0; i--) {
            int x = nums[i];
            if (x < third) return true; // x is the '1' -> pattern found
            while (!stack.isEmpty() && stack.peek() < x) {
                third = stack.pop();    // this popped value becomes the best '2'
            }
            stack.push(x);
        }
        return false;
    }
}`,
    },
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    companies: ["Amazon", "Google", "Bloomberg"],
    leetcodeSlug: "132-pattern",
  },
  {
    id: "asteroid-collision",
    title: "Asteroid Collision",
    section: "Stacks & Queues",
    pattern: "monotonic-stack",
    difficulty: "Medium",
    description:
      "Asteroids move along a line; positive values go right, negative go left, all at the same speed. When two collide the smaller explodes (equal size both explode). Return the state after all collisions.",
    examples: [
      { input: "asteroids = [5,10,-5]", output: "[5,10]", explanation: "10 and -5 collide; 10 survives. 5 and 10 never meet." },
      { input: "asteroids = [8,-8]", output: "[]", explanation: "Equal sizes — both explode." },
      { input: "asteroids = [10,2,-5]", output: "[10]", explanation: "2 and -5 collide leaving -5; then 10 and -5 collide leaving 10." },
    ],
    constraints: ["2 <= asteroids.length <= 10^4", "-1000 <= asteroids[i] <= 1000", "asteroids[i] != 0"],
    eli5:
      "Keep a stack of asteroids flying right. A new left-flying asteroid smashes into them one at a time: it survives only if it's bigger, and stops the moment it hits something at least as big.",
    hints: [
      "A collision only happens when a right-moving asteroid (top of stack, positive) meets a left-moving one (negative current).",
      "While the top is positive and smaller than |current|, it explodes (pop).",
      "Handle the equal-size case (both explode) and the survives-current case carefully with a flag.",
    ],
    approach:
      "Push asteroids onto a stack. For each negative asteroid, while the top is positive and smaller than its magnitude, pop it. If the top equals its magnitude, pop and the current also dies. If the top is a larger positive, the current dies. Otherwise the current survives and is pushed.",
    solutions: {
      python: `def asteroid_collision(asteroids):
    stack = []
    for a in asteroids:
        alive = True
        # only a left-mover hitting right-movers on the stack collides
        while alive and a < 0 and stack and stack[-1] > 0:
            if stack[-1] < -a:
                stack.pop()         # top explodes, current keeps going
                continue
            if stack[-1] == -a:
                stack.pop()         # both explode
            alive = False           # current explodes (or both did)
        if alive:
            stack.append(a)
    return stack`,
      java: `import java.util.*;

class Solution {
    public int[] asteroidCollision(int[] asteroids) {
        Deque<Integer> stack = new ArrayDeque<>(); // surviving asteroids, bottom-to-top
        for (int a : asteroids) {
            boolean alive = true;
            // only a left-mover hitting right-movers on the stack collides
            while (alive && a < 0 && !stack.isEmpty() && stack.peek() > 0) {
                int top = stack.peek();
                if (top < -a) {
                    stack.pop();        // top explodes, current keeps going
                    continue;
                }
                if (top == -a) stack.pop(); // both explode
                alive = false;          // current explodes (or both did)
            }
            if (alive) stack.push(a);
        }
        // unwind the stack into bottom-to-top order
        int[] res = new int[stack.size()];
        for (int i = res.length - 1; i >= 0; i--) {
            res[i] = stack.pop();
        }
        return res;
    }
}`,
    },
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    companies: ["Amazon", "Google", "Meta"],
    leetcodeSlug: "asteroid-collision",
  },
];
