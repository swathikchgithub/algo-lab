import type { Question } from "@/lib/types";

// Section 1: Arrays — Pattern 1.1 Two Pointers
export const arraysQuestions: Question[] = [
  {
    id: "two-sum-sorted",
    title: "Two Sum (Sorted Array)",
    section: "Arrays",
    pattern: "two-pointers",
    difficulty: "Easy",
    description:
      "Given a 1-indexed sorted array of integers, find two numbers that add up to a target. Return their indices.",
    examples: [
      { input: "numbers = [2,7,11,15], target = 9", output: "[1,2]", explanation: "2 + 7 = 9." },
      { input: "numbers = [2,3,4], target = 6", output: "[1,3]", explanation: "2 + 4 = 6." },
    ],
    constraints: ["2 <= numbers.length <= 3*10^4", "Array is sorted ascending", "Exactly one solution"],
    eli5:
      "Two friends start at opposite ends of a sorted shelf. If their books are too cheap together, the left friend steps right; too expensive, the right friend steps left.",
    hints: [
      "The array is sorted — that's the gift. What can two pointers at the ends tell you?",
      "If the pair sum is too small, which pointer should move to increase it?",
      "Move left up to grow the sum, right down to shrink it.",
    ],
    approach:
      "Place L at the start and R at the end. If arr[L]+arr[R] equals target, done. If it's too small move L right (bigger), if too big move R left (smaller).",
    solutions: {
      python: `def two_sum(numbers, target):
    l, r = 0, len(numbers) - 1
    while l < r:
        s = numbers[l] + numbers[r]
        if s == target:
            return [l + 1, r + 1]  # 1-indexed
        if s < target:
            l += 1  # need a bigger sum
        else:
            r -= 1  # need a smaller sum
    return []`,
      java: `class Solution {
    public int[] twoSum(int[] numbers, int target) {
        int l = 0, r = numbers.length - 1;
        while (l < r) {
            int s = numbers[l] + numbers[r];
            if (s == target) return new int[]{l + 1, r + 1}; // 1-indexed
            if (s < target) l++;   // need a bigger sum
            else r--;              // need a smaller sum
        }
        return new int[]{};
    }
}`,
    },
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    companies: ["Amazon", "Apple", "Google"],
    leetcodeSlug: "two-sum-ii-input-array-is-sorted",
  },
  {
    id: "three-sum",
    title: "Three Sum",
    section: "Arrays",
    pattern: "two-pointers",
    difficulty: "Medium",
    description:
      "Return all unique triplets [a,b,c] in the array such that a+b+c = 0.",
    examples: [
      { input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" },
      { input: "nums = [0,0,0]", output: "[[0,0,0]]" },
    ],
    constraints: ["3 <= nums.length <= 3000", "-10^5 <= nums[i] <= 10^5"],
    eli5:
      "Fix one friend in place, then send two more walking toward each other to find a pair that cancels the fixed one out.",
    hints: [
      "Sort first — it makes duplicate-skipping and two-pointer scanning possible.",
      "Fix index i, then run two pointers on the rest for target = -nums[i].",
      "Skip equal neighbours to avoid duplicate triplets.",
    ],
    approach:
      "Sort. For each i, two-pointer the subarray to the right looking for pairs summing to -nums[i]. Skip duplicates at i, L, and R.",
    solutions: {
      python: `def three_sum(nums):
    nums.sort()
    res = []
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue  # skip duplicate anchor
        l, r = i + 1, len(nums) - 1
        while l < r:
            s = nums[i] + nums[l] + nums[r]
            if s == 0:
                res.append([nums[i], nums[l], nums[r]])
                l += 1; r -= 1
                while l < r and nums[l] == nums[l - 1]: l += 1
                while l < r and nums[r] == nums[r + 1]: r -= 1
            elif s < 0:
                l += 1
            else:
                r -= 1
    return res`,
      java: `import java.util.*;

class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> res = new ArrayList<>();
        for (int i = 0; i < nums.length - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue; // skip duplicate anchor
            int l = i + 1, r = nums.length - 1;
            while (l < r) {
                int s = nums[i] + nums[l] + nums[r];
                if (s == 0) {
                    res.add(Arrays.asList(nums[i], nums[l], nums[r]));
                    l++; r--;
                    while (l < r && nums[l] == nums[l - 1]) l++;
                    while (l < r && nums[r] == nums[r + 1]) r--;
                } else if (s < 0) {
                    l++;
                } else {
                    r--;
                }
            }
        }
        return res;
    }
}`,
    },
    timeComplexity: "O(n^2)",
    spaceComplexity: "O(1) extra (excluding output)",
    companies: ["Meta", "Amazon", "Microsoft"],
    leetcodeSlug: "3sum",
  },
  {
    id: "four-sum",
    title: "Four Sum",
    section: "Arrays",
    pattern: "two-pointers",
    difficulty: "Medium",
    description:
      "Return all unique quadruplets [a,b,c,d] such that a+b+c+d = target.",
    examples: [
      { input: "nums = [1,0,-1,0,-2,2], target = 0", output: "[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]" },
    ],
    constraints: ["1 <= nums.length <= 200", "-10^9 <= nums[i], target <= 10^9"],
    eli5:
      "Same as 3-Sum, but now you fix two friends and send two more walking toward each other.",
    hints: [
      "Generalize Three Sum: two nested fixed loops + two pointers.",
      "Sort and skip duplicates at every level.",
      "Watch for integer overflow in languages that have it — use a wide type.",
    ],
    approach:
      "Sort. Two nested loops fix the first two numbers, then two pointers find the remaining pair summing to target - a - b. Skip duplicates at each level.",
    solutions: {
      python: `def four_sum(nums, target):
    nums.sort()
    n, res = len(nums), []
    for i in range(n - 3):
        if i > 0 and nums[i] == nums[i - 1]: continue
        for j in range(i + 1, n - 2):
            if j > i + 1 and nums[j] == nums[j - 1]: continue
            l, r = j + 1, n - 1
            while l < r:
                s = nums[i] + nums[j] + nums[l] + nums[r]
                if s == target:
                    res.append([nums[i], nums[j], nums[l], nums[r]])
                    l += 1; r -= 1
                    while l < r and nums[l] == nums[l - 1]: l += 1
                    while l < r and nums[r] == nums[r + 1]: r -= 1
                elif s < target: l += 1
                else: r -= 1
    return res`,
      java: `import java.util.*;

class Solution {
    public List<List<Integer>> fourSum(int[] nums, int target) {
        Arrays.sort(nums);
        int n = nums.length;
        List<List<Integer>> res = new ArrayList<>();
        for (int i = 0; i < n - 3; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            for (int j = i + 1; j < n - 2; j++) {
                if (j > i + 1 && nums[j] == nums[j - 1]) continue;
                int l = j + 1, r = n - 1;
                while (l < r) {
                    // use long to avoid integer overflow when summing
                    long s = (long) nums[i] + nums[j] + nums[l] + nums[r];
                    if (s == target) {
                        res.add(Arrays.asList(nums[i], nums[j], nums[l], nums[r]));
                        l++; r--;
                        while (l < r && nums[l] == nums[l - 1]) l++;
                        while (l < r && nums[r] == nums[r + 1]) r--;
                    } else if (s < target) {
                        l++;
                    } else {
                        r--;
                    }
                }
            }
        }
        return res;
    }
}`,
    },
    timeComplexity: "O(n^3)",
    spaceComplexity: "O(1) extra (excluding output)",
    companies: ["Amazon", "Adobe"],
    leetcodeSlug: "4sum",
  },
  {
    id: "container-with-most-water",
    title: "Container With Most Water",
    section: "Arrays",
    pattern: "two-pointers",
    difficulty: "Medium",
    description:
      "Given heights, pick two lines that with the x-axis form a container holding the most water. Return the max area.",
    examples: [
      { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49" },
      { input: "height = [1,1]", output: "1" },
    ],
    constraints: ["2 <= height.length <= 10^5", "0 <= height[i] <= 10^4"],
    eli5:
      "Two walls hold water; the shorter wall limits how much. Move the shorter wall inward hoping to find a taller one.",
    hints: [
      "Area = width × min(left, right). Start with the widest container.",
      "Moving the taller wall can never help — width shrinks and height is still capped by the shorter wall.",
      "Always move the pointer at the shorter line.",
    ],
    approach:
      "Start L=0, R=n-1. Compute area, track max, then move whichever pointer has the smaller height inward — only that can possibly increase the area.",
    solutions: {
      python: `def max_area(height):
    l, r, best = 0, len(height) - 1, 0
    while l < r:
        best = max(best, (r - l) * min(height[l], height[r]))
        if height[l] < height[r]:
            l += 1  # move the shorter wall
        else:
            r -= 1
    return best`,
      java: `class Solution {
    public int maxArea(int[] height) {
        int l = 0, r = height.length - 1, best = 0;
        while (l < r) {
            best = Math.max(best, (r - l) * Math.min(height[l], height[r]));
            if (height[l] < height[r]) l++; // move the shorter wall
            else r--;
        }
        return best;
    }
}`,
    },
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    companies: ["Amazon", "Google", "Bloomberg"],
    leetcodeSlug: "container-with-most-water",
  },
  {
    id: "trapping-rain-water",
    title: "Trapping Rain Water",
    section: "Arrays",
    pattern: "two-pointers",
    difficulty: "Hard",
    description:
      "Given an elevation map, compute how much rain water it can trap.",
    examples: [
      { input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" },
      { input: "height = [4,2,0,3,2,5]", output: "9" },
    ],
    constraints: ["1 <= height.length <= 2*10^4", "0 <= height[i] <= 10^5"],
    eli5:
      "Water above any bar is capped by the shorter of the tallest walls to its left and right. Walk inward from the lower side, since that's the side that decides the water level.",
    hints: [
      "Water over bar i = min(maxLeft, maxRight) - height[i].",
      "Two pointers track running maxLeft and maxRight from each end.",
      "Process the side with the smaller running max — it's the limiting wall.",
    ],
    approach:
      "Two pointers with leftMax/rightMax. Whichever side has the smaller running max is the bound for that bar, so add water there and advance that pointer.",
    solutions: {
      python: `def trap(height):
    l, r = 0, len(height) - 1
    left_max = right_max = water = 0
    while l < r:
        if height[l] < height[r]:
            left_max = max(left_max, height[l])
            water += left_max - height[l]
            l += 1
        else:
            right_max = max(right_max, height[r])
            water += right_max - height[r]
            r -= 1
    return water`,
      java: `class Solution {
    public int trap(int[] height) {
        int l = 0, r = height.length - 1;
        int leftMax = 0, rightMax = 0, water = 0;
        while (l < r) {
            if (height[l] < height[r]) {
                leftMax = Math.max(leftMax, height[l]);
                water += leftMax - height[l];
                l++;
            } else {
                rightMax = Math.max(rightMax, height[r]);
                water += rightMax - height[r];
                r--;
            }
        }
        return water;
    }
}`,
    },
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    companies: ["Amazon", "Google", "Meta", "Apple"],
    leetcodeSlug: "trapping-rain-water",
  },
  {
    id: "remove-duplicates-sorted",
    title: "Remove Duplicates from Sorted Array",
    section: "Arrays",
    pattern: "two-pointers",
    difficulty: "Easy",
    description:
      "Remove duplicates in-place from a sorted array so each element appears once. Return the new length k.",
    examples: [
      { input: "nums = [1,1,2]", output: "2, nums = [1,2,_]" },
      { input: "nums = [0,0,1,1,1,2,2,3,3,4]", output: "5, nums = [0,1,2,3,4,...]" },
    ],
    constraints: ["1 <= nums.length <= 3*10^4", "Sorted non-decreasing"],
    eli5:
      "A slow writer pointer only copies a value when the fast reader finds something new.",
    hints: [
      "Use a slow 'write' pointer and a fast 'read' pointer.",
      "Only write when nums[read] differs from the last written value.",
      "The slow pointer's final position is the new length.",
    ],
    approach:
      "Slow pointer k marks the last unique slot. Scan with i; whenever nums[i] != nums[k-1], write it to nums[k] and advance k.",
    solutions: {
      python: `def remove_duplicates(nums):
    if not nums: return 0
    k = 1
    for i in range(1, len(nums)):
        if nums[i] != nums[k - 1]:
            nums[k] = nums[i]
            k += 1
    return k`,
      java: `class Solution {
    public int removeDuplicates(int[] nums) {
        if (nums.length == 0) return 0;
        int k = 1; // next write index
        for (int i = 1; i < nums.length; i++) {
            if (nums[i] != nums[k - 1]) {
                nums[k] = nums[i];
                k++;
            }
        }
        return k;
    }
}`,
    },
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    companies: ["Microsoft", "Amazon"],
    leetcodeSlug: "remove-duplicates-from-sorted-array",
  },
  {
    id: "move-zeroes",
    title: "Move Zeroes to End",
    section: "Arrays",
    pattern: "two-pointers",
    difficulty: "Easy",
    description:
      "Move all 0s to the end while keeping the relative order of non-zero elements. Do it in-place.",
    examples: [
      { input: "nums = [0,1,0,3,12]", output: "[1,3,12,0,0]" },
      { input: "nums = [0]", output: "[0]" },
    ],
    constraints: ["1 <= nums.length <= 10^4"],
    eli5:
      "A writer pointer packs all the non-zero items to the front; whatever's left gets filled with zeroes.",
    hints: [
      "Keep a write index for the next non-zero slot.",
      "First pass: copy non-zeros forward. Second: zero-fill the tail.",
      "Or swap non-zeros into place as you go.",
    ],
    approach:
      "Write index w starts at 0. For each non-zero, swap it into nums[w] and increment w. Zeros naturally bubble to the end.",
    solutions: {
      python: `def move_zeroes(nums):
    w = 0  # next non-zero slot
    for i in range(len(nums)):
        if nums[i] != 0:
            nums[w], nums[i] = nums[i], nums[w]
            w += 1`,
      java: `class Solution {
    public void moveZeroes(int[] nums) {
        int w = 0; // next non-zero slot
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] != 0) {
                int tmp = nums[w];
                nums[w] = nums[i];
                nums[i] = tmp;
                w++;
            }
        }
    }
}`,
    },
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    companies: ["Meta", "Bloomberg"],
    leetcodeSlug: "move-zeroes",
  },
  {
    id: "sort-colors",
    title: "Sort Colors (Dutch National Flag)",
    section: "Arrays",
    pattern: "two-pointers",
    difficulty: "Medium",
    description:
      "Sort an array of 0s, 1s, and 2s in-place in a single pass.",
    examples: [
      { input: "nums = [2,0,2,1,1,0]", output: "[0,0,1,1,2,2]" },
      { input: "nums = [2,0,1]", output: "[0,1,2]" },
    ],
    constraints: ["1 <= nums.length <= 300", "nums[i] in {0,1,2}"],
    eli5:
      "Three buckets at once: push 0s to the left wall, 2s to the right wall, and 1s settle in the middle.",
    hints: [
      "Three pointers: low, mid, high.",
      "On a 0 swap to low; on a 2 swap to high; on a 1 just advance mid.",
      "When you swap with high, don't advance mid yet — re-inspect the swapped value.",
    ],
    approach:
      "Maintain low/mid/high. Scan with mid: 0 → swap to low (both++), 2 → swap to high (high--), 1 → mid++.",
    solutions: {
      python: `def sort_colors(nums):
    low = mid = 0
    high = len(nums) - 1
    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1; mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1  # re-check swapped value`,
      java: `class Solution {
    public void sortColors(int[] nums) {
        int low = 0, mid = 0, high = nums.length - 1;
        while (mid <= high) {
            if (nums[mid] == 0) {
                int tmp = nums[low];
                nums[low] = nums[mid];
                nums[mid] = tmp;
                low++; mid++;
            } else if (nums[mid] == 1) {
                mid++;
            } else {
                int tmp = nums[mid];
                nums[mid] = nums[high];
                nums[high] = tmp;
                high--; // re-check swapped value
            }
        }
    }
}`,
    },
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    companies: ["Microsoft", "Amazon", "Meta"],
    leetcodeSlug: "sort-colors",
  },
  {
    id: "minimum-size-subarray-sum",
    title: "Minimum Size Subarray Sum",
    section: "Arrays",
    pattern: "sliding-window",
    difficulty: "Medium",
    description:
      "Find the minimal length of a contiguous subarray whose sum is >= target. Return 0 if none.",
    examples: [
      { input: "target = 7, nums = [2,3,1,2,4,3]", output: "2", explanation: "[4,3] has sum 7." },
      { input: "target = 4, nums = [1,4,4]", output: "1" },
    ],
    constraints: ["1 <= nums.length <= 10^5", "1 <= nums[i] <= 10^4"],
    eli5:
      "A stretchy window grows on the right until it's big enough, then shrinks from the left to stay as small as possible.",
    hints: [
      "A shrinking/growing window works because all values are positive.",
      "Expand right adding to the sum; while sum >= target, record length and shrink from left.",
      "Track the minimum window length seen.",
    ],
    approach:
      "Sliding window: extend right, add to sum; whenever sum >= target, update best length and remove nums[left] while shrinking left.",
    solutions: {
      python: `def min_subarray_len(target, nums):
    l = total = 0
    best = float('inf')
    for r in range(len(nums)):
        total += nums[r]
        while total >= target:
            best = min(best, r - l + 1)
            total -= nums[l]
            l += 1
    return 0 if best == float('inf') else best`,
      java: `class Solution {
    public int minSubArrayLen(int target, int[] nums) {
        int l = 0, total = 0;
        int best = Integer.MAX_VALUE;
        for (int r = 0; r < nums.length; r++) {
            total += nums[r];
            while (total >= target) {
                best = Math.min(best, r - l + 1);
                total -= nums[l];
                l++;
            }
        }
        return best == Integer.MAX_VALUE ? 0 : best;
    }
}`,
    },
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    companies: ["Google", "Facebook"],
    leetcodeSlug: "minimum-size-subarray-sum",
  },
  {
    id: "squares-of-sorted-array",
    title: "Squares of a Sorted Array",
    section: "Arrays",
    pattern: "two-pointers",
    difficulty: "Easy",
    description:
      "Given a sorted array, return an array of the squares of each number, also sorted ascending.",
    examples: [
      { input: "nums = [-4,-1,0,3,10]", output: "[0,1,9,16,100]" },
      { input: "nums = [-7,-3,2,3,11]", output: "[4,9,9,49,121]" },
    ],
    constraints: ["1 <= nums.length <= 10^4", "Sorted non-decreasing"],
    eli5:
      "The biggest squares come from the most extreme numbers — the ends. Compare the two ends and fill the answer from the back.",
    hints: [
      "Largest absolute values live at the two ends.",
      "Two pointers from both ends; the bigger square goes to the end of the result.",
      "Fill the output array back-to-front.",
    ],
    approach:
      "Two pointers L and R at the ends. Compare |nums[L]| vs |nums[R]|, place the larger square at the current back slot, and move that pointer inward.",
    solutions: {
      python: `def sorted_squares(nums):
    n = len(nums)
    res = [0] * n
    l, r = 0, n - 1
    for pos in range(n - 1, -1, -1):
        if abs(nums[l]) > abs(nums[r]):
            res[pos] = nums[l] ** 2
            l += 1
        else:
            res[pos] = nums[r] ** 2
            r -= 1
    return res`,
      java: `class Solution {
    public int[] sortedSquares(int[] nums) {
        int n = nums.length;
        int[] res = new int[n];
        int l = 0, r = n - 1;
        for (int pos = n - 1; pos >= 0; pos--) {
            if (Math.abs(nums[l]) > Math.abs(nums[r])) {
                res[pos] = nums[l] * nums[l];
                l++;
            } else {
                res[pos] = nums[r] * nums[r];
                r--;
            }
        }
        return res;
    }
}`,
    },
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    companies: ["Amazon", "Facebook"],
    leetcodeSlug: "squares-of-a-sorted-array",
  },
];
