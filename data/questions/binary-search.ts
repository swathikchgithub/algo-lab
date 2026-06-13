import type { Question } from "@/lib/types";

// Section 5: Binary Search — Pattern: binary-search
export const binarySearchQuestions: Question[] = [
  {
    id: "binary-search",
    title: "Binary Search",
    section: "Binary Search",
    pattern: "binary-search",
    difficulty: "Easy",
    description:
      "Given a sorted array of integers and a target, return the index of target if it exists, otherwise -1.",
    examples: [
      { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4", explanation: "9 is at index 4." },
      { input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1", explanation: "2 is not present." },
    ],
    constraints: ["1 <= nums.length <= 10^4", "All values unique and sorted ascending", "-10^4 <= nums[i], target <= 10^4"],
    eli5:
      "Guessing a number between 1 and 100: each guess in the middle lets you throw away half the remaining options.",
    hints: [
      "Keep a low and high bound and look at the middle each time.",
      "If the middle is too small, search the right half; too big, search the left half.",
      "Use low + (high - low) // 2 to compute mid and avoid overflow.",
    ],
    approach:
      "Maintain low and high. Compute mid; if nums[mid] equals target return mid. If nums[mid] < target move low up, else move high down. Stop when low > high.",
    solutions: {
      python: `def search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2   # avoid overflow
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            lo = mid + 1            # search right half
        else:
            hi = mid - 1            # search left half
    return -1`,
      java: `class Solution {
    public int search(int[] nums, int target) {
        int lo = 0, hi = nums.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;   // avoid overflow
            if (nums[mid] == target) return mid;
            if (nums[mid] < target) lo = mid + 1;   // search right half
            else hi = mid - 1;                      // search left half
        }
        return -1;
    }
}`,
    },
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    companies: ["Amazon", "Microsoft", "Google"],
    leetcodeSlug: "binary-search",
  },
  {
    id: "search-insert-position",
    title: "Search Insert Position",
    section: "Binary Search",
    pattern: "binary-search",
    difficulty: "Easy",
    description:
      "Given a sorted array of distinct integers and a target, return the index if found. If not, return the index where it would be inserted to keep the array sorted.",
    examples: [
      { input: "nums = [1,3,5,6], target = 5", output: "2" },
      { input: "nums = [1,3,5,6], target = 2", output: "1" },
      { input: "nums = [1,3,5,6], target = 7", output: "4" },
    ],
    constraints: ["1 <= nums.length <= 10^4", "Sorted ascending, distinct values"],
    eli5:
      "Same halving game, but if you never find the number you point to the slot where it should slide in.",
    hints: [
      "This is binary search for the leftmost position >= target.",
      "When the loop ends without a match, low is exactly the insert index.",
      "Don't return -1 on miss — return low.",
    ],
    approach:
      "Standard binary search. On a match return mid. Otherwise narrow with low/high; when the loop exits, low is the first index where target fits, which is the insert position.",
    solutions: {
      python: `def search_insert(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return lo                       # insert position`,
      java: `class Solution {
    public int searchInsert(int[] nums, int target) {
        int lo = 0, hi = nums.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;   // avoid overflow
            if (nums[mid] == target) return mid;
            if (nums[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return lo;                          // insert position
    }
}`,
    },
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    companies: ["Amazon", "Microsoft"],
    leetcodeSlug: "search-insert-position",
  },
  {
    id: "find-first-and-last-position",
    title: "Find First and Last Position of Element in Sorted Array",
    section: "Binary Search",
    pattern: "binary-search",
    difficulty: "Medium",
    description:
      "Given a sorted array, find the starting and ending index of a given target value. Return [-1, -1] if the target is not present. Must run in O(log n).",
    examples: [
      { input: "nums = [5,7,7,8,8,10], target = 8", output: "[3,4]" },
      { input: "nums = [5,7,7,8,8,10], target = 6", output: "[-1,-1]" },
      { input: "nums = [], target = 0", output: "[-1,-1]" },
    ],
    constraints: ["0 <= nums.length <= 10^5", "-10^9 <= nums[i], target <= 10^9", "Sorted non-decreasing"],
    eli5:
      "Play the halving game twice: once leaning left to find where the target first appears, once leaning right to find where it last appears.",
    hints: [
      "Run two binary searches: one for the leftmost occurrence, one for the rightmost.",
      "For the left bound, keep moving high left even after a match.",
      "For the right bound, keep moving low right even after a match.",
    ],
    approach:
      "Write a helper that finds the boundary. For the first position, on equality continue searching left; for the last, continue searching right. Combine the two results.",
    solutions: {
      python: `def search_range(nums, target):
    def bound(find_left):
        lo, hi, ans = 0, len(nums) - 1, -1
        while lo <= hi:
            mid = lo + (hi - lo) // 2
            if nums[mid] == target:
                ans = mid               # record, then keep searching
                if find_left:
                    hi = mid - 1        # lean left
                else:
                    lo = mid + 1        # lean right
            elif nums[mid] < target:
                lo = mid + 1
            else:
                hi = mid - 1
        return ans
    return [bound(True), bound(False)]`,
      java: `class Solution {
    public int[] searchRange(int[] nums, int target) {
        return new int[] { bound(nums, target, true), bound(nums, target, false) };
    }

    // findLeft = true finds the first occurrence, false finds the last
    private int bound(int[] nums, int target, boolean findLeft) {
        int lo = 0, hi = nums.length - 1, ans = -1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;   // avoid overflow
            if (nums[mid] == target) {
                ans = mid;                  // record, then keep searching
                if (findLeft) hi = mid - 1; // lean left
                else lo = mid + 1;          // lean right
            } else if (nums[mid] < target) {
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        return ans;
    }
}`,
    },
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    companies: ["Amazon", "Meta", "LinkedIn"],
    leetcodeSlug: "find-first-and-last-position-of-element-in-sorted-array",
  },
  {
    id: "search-in-rotated-sorted-array",
    title: "Search in Rotated Sorted Array",
    section: "Binary Search",
    pattern: "binary-search",
    difficulty: "Medium",
    description:
      "An ascending sorted array of distinct integers is rotated at an unknown pivot. Given a target, return its index, or -1 if absent. Must run in O(log n).",
    examples: [
      { input: "nums = [4,5,6,7,0,1,2], target = 0", output: "4" },
      { input: "nums = [4,5,6,7,0,1,2], target = 3", output: "-1" },
      { input: "nums = [1], target = 0", output: "-1" },
    ],
    constraints: ["1 <= nums.length <= 5000", "All values unique", "Array is a rotation of an ascending array"],
    eli5:
      "The list was cut and the back half moved to the front. At every middle, one of the two halves is still perfectly sorted — use that half to decide where to look.",
    hints: [
      "At any mid, at least one side (low..mid or mid..high) is sorted.",
      "Check which side is sorted, then test whether the target lies within that sorted range.",
      "If the target is in the sorted side, search there; otherwise search the other side.",
    ],
    approach:
      "Binary search with a twist. Identify the sorted half by comparing nums[lo] with nums[mid]. If target lies in that sorted half's range, recurse into it; otherwise go to the other half.",
    solutions: {
      python: `def search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] == target:
            return mid
        if nums[lo] <= nums[mid]:           # left half sorted
            if nums[lo] <= target < nums[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        else:                               # right half sorted
            if nums[mid] < target <= nums[hi]:
                lo = mid + 1
            else:
                hi = mid - 1
    return -1`,
      java: `class Solution {
    public int search(int[] nums, int target) {
        int lo = 0, hi = nums.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;   // avoid overflow
            if (nums[mid] == target) return mid;
            if (nums[lo] <= nums[mid]) {                // left half sorted
                if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
                else lo = mid + 1;
            } else {                                    // right half sorted
                if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
                else hi = mid - 1;
            }
        }
        return -1;
    }
}`,
    },
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    companies: ["Amazon", "Microsoft", "Meta", "Google"],
    leetcodeSlug: "search-in-rotated-sorted-array",
  },
  {
    id: "find-minimum-in-rotated-sorted-array",
    title: "Find Minimum in Rotated Sorted Array",
    section: "Binary Search",
    pattern: "binary-search",
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
    companies: ["Amazon", "Microsoft"],
    leetcodeSlug: "find-minimum-in-rotated-sorted-array",
  },
  {
    id: "koko-eating-bananas",
    title: "Koko Eating Bananas",
    section: "Binary Search",
    pattern: "binary-search",
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
    leetcodeSlug: "koko-eating-bananas",
  },
  {
    id: "find-peak-element",
    title: "Find Peak Element",
    section: "Binary Search",
    pattern: "binary-search",
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
    leetcodeSlug: "find-peak-element",
  },
  {
    id: "median-of-two-sorted-arrays",
    title: "Median of Two Sorted Arrays",
    section: "Binary Search",
    pattern: "binary-search",
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
    companies: ["Amazon", "Google", "Adobe"],
    leetcodeSlug: "median-of-two-sorted-arrays",
  },
];
