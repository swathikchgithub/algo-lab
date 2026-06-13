import type { Question } from "@/lib/types";

// Section 7: Heaps & Priority Queues — Patterns 7.1 Top-K, 7.2 Two-Heap
export const heapsQuestions: Question[] = [
  {
    id: "kth-largest-in-stream",
    title: "Kth Largest Element in a Stream",
    section: "Heaps & Priority Queues",
    pattern: "top-k",
    difficulty: "Easy",
    description:
      "Design a class that, given k and an initial stream, returns the kth largest element after each new value is added.",
    examples: [
      {
        input: "k = 3, nums = [4,5,8,2], add(3), add(5), add(10), add(9), add(4)",
        output: "[4,5,5,8,8]",
        explanation: "After each add, the 3rd largest seen so far.",
      },
    ],
    constraints: ["1 <= k <= 10^4", "0 <= nums.length <= 10^4", "-10^4 <= nums[i] <= 10^4"],
    eli5:
      "Keep only your k tallest friends in a small room. Whenever a taller person arrives, the shortest one in the room leaves. The shortest in the room is always the kth tallest overall.",
    hints: [
      "You only ever need the k largest values — anything smaller can't be the kth largest.",
      "A min-heap of size k keeps the smallest of those k at the top.",
      "On each add, push then pop until size is k; the heap top is the answer.",
    ],
    approach:
      "Maintain a min-heap capped at size k. Push each new value; if the heap grows past k, pop the smallest. The root is always the kth largest element seen so far.",
    solutions: {
      python: `import heapq

class KthLargest:
    def __init__(self, k, nums):
        self.k = k
        self.heap = nums[:]
        heapq.heapify(self.heap)
        while len(self.heap) > k:
            heapq.heappop(self.heap)  # keep only k largest

    def add(self, val):
        heapq.heappush(self.heap, val)
        if len(self.heap) > self.k:
            heapq.heappop(self.heap)  # drop the smallest
        return self.heap[0]  # kth largest`,
      java: `import java.util.*;

class KthLargest {
    private final int k;
    private final PriorityQueue<Integer> heap; // min-heap of the k largest

    public KthLargest(int k, int[] nums) {
        this.k = k;
        this.heap = new PriorityQueue<>(); // natural order = min-heap
        for (int n : nums) add(n);
    }

    public int add(int val) {
        heap.offer(val);
        if (heap.size() > k) heap.poll(); // drop the smallest
        return heap.peek();               // kth largest
    }
}`,
    },
    timeComplexity: "O(log k) per add",
    spaceComplexity: "O(k)",
    companies: ["Amazon", "Facebook", "Microsoft"],
    leetcodeSlug: "kth-largest-element-in-a-stream",
  },
  {
    id: "top-k-frequent-elements",
    title: "Top K Frequent Elements",
    section: "Heaps & Priority Queues",
    pattern: "top-k",
    difficulty: "Medium",
    description:
      "Given an integer array and k, return the k most frequent elements (any order).",
    examples: [
      { input: "nums = [1,1,1,2,2,3], k = 2", output: "[1,2]" },
      { input: "nums = [1], k = 1", output: "[1]" },
    ],
    constraints: ["1 <= nums.length <= 10^5", "k is in [1, number of distinct elements]"],
    eli5:
      "Count how often each number shows up, then keep only the k loudest in a small room — quieter numbers get pushed out.",
    hints: [
      "First build a count map of value → frequency.",
      "A min-heap of size k keyed on frequency keeps the k most frequent.",
      "Bucket sort by frequency gives an O(n) alternative.",
    ],
    approach:
      "Count frequencies, then push (freq, value) into a min-heap capped at k so the least-frequent of the kept set sits at the root and gets evicted first. Bucket sort by frequency is the linear-time variant.",
    solutions: {
      python: `import heapq
from collections import Counter

def top_k_frequent(nums, k):
    count = Counter(nums)
    heap = []  # min-heap of (freq, value)
    for val, freq in count.items():
        heapq.heappush(heap, (freq, val))
        if len(heap) > k:
            heapq.heappop(heap)  # evict least frequent kept
    return [val for _, val in heap]`,
      java: `import java.util.*;

class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> count = new HashMap<>();
        for (int n : nums) count.merge(n, 1, Integer::sum);
        // Bucket sort: index = frequency.
        List<Integer>[] buckets = new List[nums.length + 1];
        for (Map.Entry<Integer, Integer> e : count.entrySet()) {
            int freq = e.getValue();
            if (buckets[freq] == null) buckets[freq] = new ArrayList<>();
            buckets[freq].add(e.getKey());
        }
        int[] res = new int[k];
        int idx = 0;
        for (int f = buckets.length - 1; f >= 0 && idx < k; f--) {
            if (buckets[f] == null) continue;
            for (int val : buckets[f]) {
                res[idx++] = val;
                if (idx == k) break;
            }
        }
        return res;
    }
}`,
    },
    timeComplexity: "O(n log k) with a heap, O(n) with bucket sort",
    spaceComplexity: "O(n)",
    companies: ["Amazon", "Facebook", "Google", "Uber"],
    leetcodeSlug: "top-k-frequent-elements",
  },
  {
    id: "top-k-frequent-words",
    title: "Top K Frequent Words",
    section: "Heaps & Priority Queues",
    pattern: "top-k",
    difficulty: "Medium",
    description:
      "Return the k most frequent words, sorted by descending frequency; ties broken by lexicographical (alphabetical) order.",
    examples: [
      {
        input: 'words = ["i","love","leetcode","i","love","coding"], k = 2',
        output: '["i","love"]',
        explanation: '"i" and "love" both appear twice; "coding" once.',
      },
      {
        input: 'words = ["the","day","is","sunny","the","the","the","sunny","is","is"], k = 4',
        output: '["the","is","sunny","day"]',
      },
    ],
    constraints: ["1 <= words.length <= 500", "1 <= words[i].length <= 10", "Words are lowercase"],
    eli5:
      "Tally each word, then line them up loudest-first. When two words are equally loud, the one earlier in the dictionary goes first.",
    hints: [
      "Count word frequencies first.",
      "The tie-break is tricky: higher frequency wins, but equal frequency means alphabetical order.",
      "A heap of size k must order by (lower freq, then reverse-alphabetical) so the worst candidate is evicted.",
    ],
    approach:
      "Count frequencies. Use a min-heap of size k where the comparison is inverted: the element to evict is the one with the lowest frequency, or — on ties — the lexicographically larger word. Pop everything at the end and reverse.",
    solutions: {
      python: `import heapq
from collections import Counter

def top_k_frequent(words, k):
    count = Counter(words)
    # Sort by descending freq, then ascending word; take first k.
    return heapq.nsmallest(k, count.keys(), key=lambda w: (-count[w], w))`,
      java: `import java.util.*;

class Solution {
    public List<String> topKFrequent(String[] words, int k) {
        Map<String, Integer> count = new HashMap<>();
        for (String w : words) count.merge(w, 1, Integer::sum);
        // Min-heap of size k: the "worst" candidate (lowest freq, or on a
        // tie the lexicographically larger word) sits on top to be evicted.
        PriorityQueue<String> heap = new PriorityQueue<>((a, b) -> {
            int fa = count.get(a), fb = count.get(b);
            if (fa != fb) return fa - fb;     // lower freq on top
            return b.compareTo(a);            // larger word on top (evict it)
        });
        for (String w : count.keySet()) {
            heap.offer(w);
            if (heap.size() > k) heap.poll();
        }
        // Pop ascending-by-rank, then reverse to get best first.
        LinkedList<String> res = new LinkedList<>();
        while (!heap.isEmpty()) res.addFirst(heap.poll());
        return res;
    }
}`,
    },
    timeComplexity: "O(n log k) with a heap, O(n log n) with a full sort",
    spaceComplexity: "O(n)",
    companies: ["Amazon", "Facebook", "Bloomberg"],
    leetcodeSlug: "top-k-frequent-words",
  },
  {
    id: "k-closest-points-to-origin",
    title: "K Closest Points to Origin",
    section: "Heaps & Priority Queues",
    pattern: "top-k",
    difficulty: "Medium",
    description:
      "Given points on a plane and k, return the k points closest to the origin (0,0) by Euclidean distance.",
    examples: [
      { input: "points = [[1,3],[-2,2]], k = 1", output: "[[-2,2]]" },
      { input: "points = [[3,3],[5,-1],[-2,4]], k = 2", output: "[[3,3],[-2,4]]" },
    ],
    constraints: ["1 <= k <= points.length <= 10^4", "-10^4 <= xi, yi <= 10^4"],
    eli5:
      "Keep the k nearest stars in a small box. If a closer star appears, the farthest one in the box gets kicked out.",
    hints: [
      "Compare squared distances — no need for the costly square root.",
      "A max-heap of size k keeps the farthest of the kept points at the top for easy eviction.",
      "Or use Quickselect for average O(n).",
    ],
    approach:
      "Use a max-heap of size k keyed on squared distance (negate distance with a min-heap in Python). Push each point; if size exceeds k, pop the farthest. Squared distance avoids floating-point sqrt.",
    solutions: {
      python: `import heapq

def k_closest(points, k):
    heap = []  # max-heap via negated distance, size k
    for x, y in points:
        d = x * x + y * y  # squared distance
        heapq.heappush(heap, (-d, x, y))
        if len(heap) > k:
            heapq.heappop(heap)  # drop the farthest kept
    return [[x, y] for _, x, y in heap]`,
      java: `import java.util.*;

class Solution {
    public int[][] kClosest(int[][] points, int k) {
        // Max-heap on squared distance: the farthest kept point is on top.
        PriorityQueue<int[]> heap = new PriorityQueue<>(
            (a, b) -> (b[0] * b[0] + b[1] * b[1]) - (a[0] * a[0] + a[1] * a[1])
        );
        for (int[] p : points) {
            heap.offer(p);
            if (heap.size() > k) heap.poll(); // drop the farthest
        }
        int[][] res = new int[k][2];
        for (int i = 0; i < k; i++) res[i] = heap.poll();
        return res;
    }
}`,
    },
    timeComplexity: "O(n log k)",
    spaceComplexity: "O(k)",
    companies: ["Amazon", "Facebook", "Google", "Uber"],
    leetcodeSlug: "k-closest-points-to-origin",
  },
  {
    id: "find-k-pairs-smallest-sums",
    title: "Find K Pairs with Smallest Sums",
    section: "Heaps & Priority Queues",
    pattern: "top-k",
    difficulty: "Medium",
    description:
      "Given two ascending arrays nums1 and nums2 and an integer k, return the k pairs (u, v) with the smallest sums u + v.",
    examples: [
      {
        input: "nums1 = [1,7,11], nums2 = [2,4,6], k = 3",
        output: "[[1,2],[1,4],[1,6]]",
      },
      {
        input: "nums1 = [1,1,2], nums2 = [1,2,3], k = 2",
        output: "[[1,1],[1,1]]",
      },
    ],
    constraints: ["1 <= nums1.length, nums2.length <= 10^5", "Both arrays sorted ascending", "1 <= k <= 10^4"],
    eli5:
      "Imagine many sorted queues, one per element of the first array. The next-smallest pair always sits at the front of one of those queues — a heap picks the best front each time.",
    hints: [
      "Don't generate all pairs — that's too many.",
      "Seed the heap with pairs (nums1[i], nums2[0]) for the first few i.",
      "When you pop (i, j), push its neighbor (i, j+1) — the next candidate from that row.",
    ],
    approach:
      "Min-heap of (sum, i, j). Seed with the first column: (nums1[i] + nums2[0], i, 0) for up to k rows. Each pop yields the next smallest pair; push (i, j+1) to advance along nums2. Repeat k times.",
    solutions: {
      python: `import heapq

def k_smallest_pairs(nums1, nums2, k):
    if not nums1 or not nums2:
        return []
    heap = []
    # Seed first column; only need min(k, len) rows.
    for i in range(min(k, len(nums1))):
        heapq.heappush(heap, (nums1[i] + nums2[0], i, 0))
    res = []
    while heap and len(res) < k:
        _, i, j = heapq.heappop(heap)
        res.append([nums1[i], nums2[j]])
        if j + 1 < len(nums2):
            heapq.heappush(heap, (nums1[i] + nums2[j + 1], i, j + 1))
    return res`,
      java: `import java.util.*;

class Solution {
    public List<List<Integer>> kSmallestPairs(int[] nums1, int[] nums2, int k) {
        List<List<Integer>> res = new ArrayList<>();
        if (nums1.length == 0 || nums2.length == 0) return res;
        // Min-heap of [sum, i, j].
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        // Seed first column; only need min(k, len) rows.
        for (int i = 0; i < Math.min(k, nums1.length); i++) {
            heap.offer(new int[] {nums1[i] + nums2[0], i, 0});
        }
        while (!heap.isEmpty() && res.size() < k) {
            int[] top = heap.poll();
            int i = top[1], j = top[2];
            res.add(Arrays.asList(nums1[i], nums2[j]));
            if (j + 1 < nums2.length) {
                heap.offer(new int[] {nums1[i] + nums2[j + 1], i, j + 1});
            }
        }
        return res;
    }
}`,
    },
    timeComplexity: "O(k log k)",
    spaceComplexity: "O(k)",
    companies: ["Amazon", "Google", "LinkedIn"],
    leetcodeSlug: "find-k-pairs-with-smallest-sums",
  },
  {
    id: "kth-smallest-in-sorted-matrix",
    title: "Kth Smallest Element in a Sorted Matrix",
    section: "Heaps & Priority Queues",
    pattern: "top-k",
    difficulty: "Medium",
    description:
      "Given an n x n matrix where each row and column is sorted ascending, return the kth smallest element (in sorted order, not the kth distinct).",
    examples: [
      {
        input: "matrix = [[1,5,9],[10,11,13],[12,13,15]], k = 8",
        output: "13",
      },
      { input: "matrix = [[-5]], k = 1", output: "-5" },
    ],
    constraints: ["n == matrix.length == matrix[i].length", "1 <= n <= 300", "1 <= k <= n^2"],
    eli5:
      "Every row is its own sorted line. The next-smallest value is always at the head of some line — a heap keeps merging the heads until you've pulled out k values.",
    hints: [
      "It's a k-way merge of sorted rows.",
      "Seed the heap with the first element of each row.",
      "Pop the smallest, then push the next element from that same row.",
    ],
    approach:
      "Min-heap merge: push (matrix[r][0], r, 0) for each row. Pop k-1 times, each time advancing within the popped row by pushing (matrix[r][c+1], r, c+1). The kth pop is the answer.",
    solutions: {
      python: `import heapq

def kth_smallest(matrix, k):
    n = len(matrix)
    heap = [(matrix[r][0], r, 0) for r in range(n)]  # row heads
    heapq.heapify(heap)
    val = 0
    for _ in range(k):
        val, r, c = heapq.heappop(heap)
        if c + 1 < n:
            heapq.heappush(heap, (matrix[r][c + 1], r, c + 1))
    return val`,
      java: `import java.util.*;

class Solution {
    public int kthSmallest(int[][] matrix, int k) {
        int n = matrix.length;
        // Min-heap of [value, row, col]; seed with each row's head.
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        for (int r = 0; r < n; r++) heap.offer(new int[] {matrix[r][0], r, 0});
        int val = 0;
        for (int i = 0; i < k; i++) {
            int[] top = heap.poll();
            val = top[0];
            int r = top[1], c = top[2];
            if (c + 1 < n) heap.offer(new int[] {matrix[r][c + 1], r, c + 1});
        }
        return val; // the kth pop
    }
}`,
    },
    timeComplexity: "O(k log n)",
    spaceComplexity: "O(n)",
    companies: ["Amazon", "Google", "Uber"],
    leetcodeSlug: "kth-smallest-element-in-a-sorted-matrix",
  },
  {
    id: "sort-characters-by-frequency",
    title: "Sort Characters By Frequency",
    section: "Heaps & Priority Queues",
    pattern: "top-k",
    difficulty: "Medium",
    description:
      "Given a string, rearrange its characters so that characters appearing more often come first. Return any valid arrangement.",
    examples: [
      { input: 's = "tree"', output: '"eert"', explanation: '"e" appears twice; "r" and "t" once.' },
      { input: 's = "cccaaa"', output: '"aaaccc"', explanation: 'Both appear 3 times; any grouping is valid.' },
    ],
    constraints: ["1 <= s.length <= 5*10^5", "s consists of uppercase/lowercase letters and digits"],
    eli5:
      "Count how many of each letter you have, then pour out the biggest piles first.",
    hints: [
      "Count each character's frequency.",
      "Sort the distinct characters by descending count.",
      "Repeat each character by its count to build the result.",
    ],
    approach:
      "Build a frequency map, sort distinct characters by descending frequency (a max-heap or a plain sort both work), then emit each character repeated by its count.",
    solutions: {
      python: `from collections import Counter

def frequency_sort(s):
    count = Counter(s)
    # most_common returns (char, freq) sorted by descending freq.
    return ''.join(ch * freq for ch, freq in count.most_common())`,
      java: `import java.util.*;

class Solution {
    public String frequencySort(String s) {
        Map<Character, Integer> count = new HashMap<>();
        for (char ch : s.toCharArray()) count.merge(ch, 1, Integer::sum);
        // Max-heap by frequency: pour out the biggest piles first.
        PriorityQueue<Character> heap =
            new PriorityQueue<>((a, b) -> count.get(b) - count.get(a));
        heap.addAll(count.keySet());
        StringBuilder sb = new StringBuilder();
        while (!heap.isEmpty()) {
            char ch = heap.poll();
            int freq = count.get(ch);
            for (int i = 0; i < freq; i++) sb.append(ch);
        }
        return sb.toString();
    }
}`,
    },
    timeComplexity: "O(n + u log u) where u is the number of distinct characters",
    spaceComplexity: "O(n)",
    companies: ["Amazon", "Google", "Bloomberg"],
    leetcodeSlug: "sort-characters-by-frequency",
  },
  {
    id: "reorganize-string",
    title: "Reorganize String",
    section: "Heaps & Priority Queues",
    pattern: "top-k",
    difficulty: "Medium",
    description:
      "Rearrange a string so that no two adjacent characters are the same. Return any valid arrangement, or \"\" if impossible.",
    examples: [
      { input: 's = "aab"', output: '"aba"' },
      { input: 's = "aaab"', output: '""', explanation: '"a" appears 3 of 4 times — no valid arrangement exists.' },
    ],
    constraints: ["1 <= s.length <= 500", "s consists of lowercase letters"],
    eli5:
      "Always place the letter you have the most of next, but never the one you just placed — like dealing cards so the same suit never repeats back-to-back.",
    hints: [
      "If any character's count exceeds (n+1)/2, it's impossible.",
      "Greedily place the most frequent remaining character that differs from the last placed one.",
      "A max-heap by remaining count, holding back the just-used character for one turn, does this cleanly.",
    ],
    approach:
      "Feasibility: if the max count > (n+1)//2, return \"\". Otherwise use a max-heap by count. Pop the most frequent char that isn't the previous one, append it, decrement, and push it back only after placing the next char (one-turn cooldown).",
    solutions: {
      python: `import heapq
from collections import Counter

def reorganize_string(s):
    n = len(s)
    count = Counter(s)
    if max(count.values()) > (n + 1) // 2:
        return ""  # one char dominates — impossible
    heap = [(-freq, ch) for ch, freq in count.items()]
    heapq.heapify(heap)
    res = []
    prev = None  # char held back for one turn
    while heap:
        freq, ch = heapq.heappop(heap)
        res.append(ch)
        if prev and prev[0] < 0:
            heapq.heappush(heap, prev)  # release after cooldown
        prev = (freq + 1, ch)  # one fewer remaining (freq is negative)
    return ''.join(res)`,
      java: `import java.util.*;

class Solution {
    public String reorganizeString(String s) {
        int n = s.length();
        Map<Character, Integer> count = new HashMap<>();
        for (char ch : s.toCharArray()) count.merge(ch, 1, Integer::sum);
        // Feasibility: if any char dominates, no valid arrangement exists.
        for (int freq : count.values()) {
            if (freq > (n + 1) / 2) return "";
        }
        // Max-heap of [freq, char] by remaining count.
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> b[0] - a[0]);
        for (Map.Entry<Character, Integer> e : count.entrySet()) {
            heap.offer(new int[] {e.getValue(), e.getKey()});
        }
        StringBuilder sb = new StringBuilder();
        int[] prev = null; // [freq, char] held back for one turn
        while (!heap.isEmpty()) {
            int[] cur = heap.poll();
            sb.append((char) cur[1]);
            if (prev != null && prev[0] > 0) heap.offer(prev); // cooldown done
            prev = new int[] {cur[0] - 1, cur[1]}; // one fewer remaining
        }
        return sb.toString();
    }
}`,
    },
    timeComplexity: "O(n log u) where u is the number of distinct characters",
    spaceComplexity: "O(u)",
    companies: ["Amazon", "Google", "Facebook"],
    leetcodeSlug: "reorganize-string",
  },
  {
    id: "task-scheduler",
    title: "Task Scheduler",
    section: "Heaps & Priority Queues",
    pattern: "top-k",
    difficulty: "Medium",
    description:
      "Given tasks (letters) and a cooldown n, each task takes one unit and identical tasks must be at least n units apart. Return the minimum number of units (including idle) to finish all tasks.",
    examples: [
      {
        input: 'tasks = ["A","A","A","B","B","B"], n = 2',
        output: "8",
        explanation: "A B idle A B idle A B → 8 units.",
      },
      { input: 'tasks = ["A","C","A","B","D","B"], n = 1', output: "6" },
    ],
    constraints: ["1 <= tasks.length <= 10^4", "tasks[i] is an uppercase letter", "0 <= n <= 100"],
    eli5:
      "The busiest task sets the rhythm: it lays down evenly spaced slots, and every other task fills the gaps. If there aren't enough other tasks, the gaps stay empty (idle).",
    hints: [
      "Only the most frequent task and how many share that max frequency matter.",
      "Build a skeleton from the most frequent task: (maxFreq - 1) full frames of size (n + 1).",
      "Answer is max(len(tasks), (maxFreq - 1) * (n + 1) + countOfMaxFreq).",
    ],
    approach:
      "Let f = max frequency and c = number of tasks sharing that frequency. The most frequent task creates (f - 1) gaps of length (n + 1), plus the final c tasks: slots = (f - 1) * (n + 1) + c. If there are more tasks than slots, no idling is needed, so the answer is max(len(tasks), slots).",
    solutions: {
      python: `from collections import Counter

def least_interval(tasks, n):
    count = Counter(tasks)
    f = max(count.values())            # highest frequency
    c = sum(1 for v in count.values() if v == f)  # how many share it
    slots = (f - 1) * (n + 1) + c      # skeleton size
    return max(len(tasks), slots)`,
      java: `import java.util.*;

class Solution {
    public int leastInterval(char[] tasks, int n) {
        Map<Character, Integer> count = new HashMap<>();
        for (char t : tasks) count.merge(t, 1, Integer::sum);
        int f = 0; // highest frequency
        for (int v : count.values()) f = Math.max(f, v);
        int c = 0; // how many tasks share the max frequency
        for (int v : count.values()) if (v == f) c++;
        int slots = (f - 1) * (n + 1) + c; // skeleton size
        return Math.max(tasks.length, slots);
    }
}`,
    },
    timeComplexity: "O(n) over the tasks (counting dominates)",
    spaceComplexity: "O(1) (at most 26 distinct tasks)",
    companies: ["Facebook", "Amazon", "Google"],
    leetcodeSlug: "task-scheduler",
  },
  {
    id: "maximum-frequency-stack",
    title: "Maximum Frequency Stack",
    section: "Heaps & Priority Queues",
    pattern: "top-k",
    difficulty: "Hard",
    description:
      "Design a stack-like structure. push(x) adds x; pop() removes and returns the most frequent element, breaking ties by whichever was pushed most recently.",
    examples: [
      {
        input: "push(5),push(7),push(5),push(7),push(4),push(5), then pop x4",
        output: "[5,7,5,4]",
        explanation: "5 has count 3 → pop 5; then 7 and 5 tie at 2 → pop the more recent 7; then 5 (count 2); then 4.",
      },
    ],
    constraints: ["0 <= x <= 10^9", "At most 2*10^4 calls to push and pop", "pop is called on a non-empty stack"],
    eli5:
      "Stack your items by how popular they are: each value gets its own pile per popularity level. To pop, take from the tallest popularity pile — and within it, the most recent.",
    hints: [
      "Track each value's current frequency in a map.",
      "Group values onto stacks keyed by frequency (a stack-of-stacks).",
      "pop removes from the highest-frequency group's top — that's the most recent at the max frequency.",
    ],
    approach:
      "Keep freq[x] = current count of x, and group[f] = a stack of values currently at frequency f. On push, increment freq[x] to f and append x to group[f], tracking maxFreq. On pop, take the top of group[maxFreq], decrement its freq, and drop maxFreq if that group empties.",
    solutions: {
      python: `from collections import defaultdict

class FreqStack:
    def __init__(self):
        self.freq = defaultdict(int)        # value -> current count
        self.group = defaultdict(list)      # count -> stack of values
        self.max_freq = 0

    def push(self, x):
        self.freq[x] += 1
        f = self.freq[x]
        self.max_freq = max(self.max_freq, f)
        self.group[f].append(x)             # most-recent on top

    def pop(self):
        x = self.group[self.max_freq].pop()
        self.freq[x] -= 1
        if not self.group[self.max_freq]:
            self.max_freq -= 1               # group emptied
        return x`,
      java: `import java.util.*;

class FreqStack {
    private final Map<Integer, Integer> freq = new HashMap<>();      // value -> count
    private final Map<Integer, Deque<Integer>> group = new HashMap<>(); // count -> stack
    private int maxFreq = 0;

    public void push(int x) {
        int f = freq.merge(x, 1, Integer::sum);
        maxFreq = Math.max(maxFreq, f);
        group.computeIfAbsent(f, key -> new ArrayDeque<>()).push(x); // most-recent on top
    }

    public int pop() {
        Deque<Integer> stack = group.get(maxFreq);
        int x = stack.pop();
        freq.merge(x, -1, Integer::sum);
        if (stack.isEmpty()) maxFreq--; // group emptied
        return x;
    }
}`,
    },
    timeComplexity: "O(1) per push and pop",
    spaceComplexity: "O(n)",
    companies: ["Amazon", "Google", "Bloomberg"],
    leetcodeSlug: "maximum-frequency-stack",
  },
  {
    id: "find-median-from-data-stream",
    title: "Find Median from Data Stream",
    section: "Heaps & Priority Queues",
    pattern: "two-heap",
    difficulty: "Hard",
    description:
      "Design a structure that supports adding numbers from a stream and querying the median of all numbers added so far.",
    examples: [
      {
        input: "addNum(1), addNum(2), findMedian(), addNum(3), findMedian()",
        output: "[1.5, 2.0]",
        explanation: "Median of {1,2} is 1.5; median of {1,2,3} is 2.",
      },
    ],
    constraints: ["-10^5 <= num <= 10^5", "At most 5*10^4 calls", "findMedian is called after at least one addNum"],
    eli5:
      "Split the numbers into a 'smaller half' and a 'bigger half' that stay balanced. The median is the boundary between them — either the top of the smaller half or the average of both tops.",
    hints: [
      "Keep two heaps: a max-heap for the lower half, a min-heap for the upper half.",
      "Keep their sizes within one of each other.",
      "The median is the top of the bigger heap, or the average of both tops when sizes are equal.",
    ],
    approach:
      "Maintain a max-heap (low) and min-heap (high). Always push to low first, then move low's top to high to keep order; if high grows larger, move its top back. Median is low's top when low is bigger, else the average of both tops.",
    solutions: {
      python: `import heapq

class MedianFinder:
    def __init__(self):
        self.low = []   # max-heap (store negatives): smaller half
        self.high = []  # min-heap: larger half

    def add_num(self, num):
        heapq.heappush(self.low, -num)
        # Ensure every low element <= every high element.
        heapq.heappush(self.high, -heapq.heappop(self.low))
        # Rebalance so low is never smaller than high.
        if len(self.high) > len(self.low):
            heapq.heappush(self.low, -heapq.heappop(self.high))

    def find_median(self):
        if len(self.low) > len(self.high):
            return -self.low[0]
        return (-self.low[0] + self.high[0]) / 2`,
      java: `import java.util.*;

class MedianFinder {
    private final PriorityQueue<Integer> low;  // max-heap: smaller half
    private final PriorityQueue<Integer> high; // min-heap: larger half

    public MedianFinder() {
        low = new PriorityQueue<>(Collections.reverseOrder());
        high = new PriorityQueue<>();
    }

    public void addNum(int num) {
        low.offer(num);
        high.offer(low.poll());          // keep order across heaps
        if (high.size() > low.size()) {
            low.offer(high.poll());      // rebalance: low never smaller
        }
    }

    public double findMedian() {
        if (low.size() > high.size()) return low.peek();
        return (low.peek() + (double) high.peek()) / 2;
    }
}`,
    },
    timeComplexity: "O(log n) per addNum, O(1) per findMedian",
    spaceComplexity: "O(n)",
    companies: ["Amazon", "Google", "Facebook", "Microsoft"],
    leetcodeSlug: "find-median-from-data-stream",
  },
  {
    id: "sliding-window-median",
    title: "Sliding Window Median",
    section: "Heaps & Priority Queues",
    pattern: "two-heap",
    difficulty: "Hard",
    description:
      "Given an array and a window size k, return the median of each contiguous window as it slides from left to right.",
    examples: [
      {
        input: "nums = [1,3,-1,-3,5,3,6,7], k = 3",
        output: "[1.0,-1.0,-1.0,3.0,5.0,6.0]",
      },
      { input: "nums = [1,2,3,4], k = 1", output: "[1.0,2.0,3.0,4.0]" },
    ],
    constraints: ["1 <= k <= nums.length <= 10^5", "-2^31 <= nums[i] <= 2^31 - 1"],
    eli5:
      "Same two-heaps idea as the streaming median, but the window also forgets its oldest number each step. We mark numbers leaving the window as 'to be removed' and clean them off the heap tops lazily.",
    hints: [
      "Reuse the two-heap median structure (max-heap low, min-heap high).",
      "When the window slides, one number enters and one leaves — handle removal with lazy deletion.",
      "Keep a balance counter and a delayed-removal map; clean the heap top only when it surfaces.",
    ],
    approach:
      "Two heaps with lazy deletion. A hash map records elements scheduled for removal. After adding the new element and marking the outgoing one, rebalance using a net-balance counter, then prune any heap top that is scheduled for deletion. Record the median once the window is full.",
    solutions: {
      python: `import heapq
from collections import defaultdict

def median_sliding_window(nums, k):
    low, high = [], []          # max-heap (negated), min-heap
    delayed = defaultdict(int)  # value -> times scheduled for removal
    res = []

    def prune(heap):
        # Remove heap-top elements that are scheduled for deletion.
        while heap:
            num = -heap[0] if heap is low else heap[0]
            if delayed[num] > 0:
                delayed[num] -= 1
                heapq.heappop(heap)
            else:
                break

    def median():
        if k % 2:
            return float(-low[0])
        return (-low[0] + high[0]) / 2

    balance = 0  # effective size(low) - size(high)
    for i, num in enumerate(nums):
        # Add new number.
        if not low or num <= -low[0]:
            heapq.heappush(low, -num); balance += 1
        else:
            heapq.heappush(high, num); balance -= 1
        # Remove the element leaving the window.
        if i >= k:
            out = nums[i - k]
            delayed[out] += 1
            balance += -1 if out <= -low[0] else 1
        # Rebalance so |size(low) - size(high)| <= ... with low >= high.
        if balance > 1:
            heapq.heappush(high, -heapq.heappop(low)); balance -= 2
        elif balance < 0:
            heapq.heappush(low, -heapq.heappop(high)); balance += 2
        prune(low); prune(high)
        if i >= k - 1:
            res.append(median())
    return res`,
      java: `import java.util.*;

class Solution {
    public double[] medianSlidingWindow(int[] nums, int k) {
        // Two heaps with lazy deletion. Use Long to avoid int overflow on
        // the -2^31..2^31-1 range when comparing/negating values.
        PriorityQueue<Integer> low =
            new PriorityQueue<>(Collections.reverseOrder()); // smaller half
        PriorityQueue<Integer> high = new PriorityQueue<>();  // larger half
        Map<Integer, Integer> delayed = new HashMap<>();      // value -> pending removals
        double[] res = new double[nums.length - k + 1];
        int balance = 0; // effective size(low) - size(high)

        for (int i = 0; i < nums.length; i++) {
            int num = nums[i];
            // Add new number.
            if (low.isEmpty() || num <= low.peek()) { low.offer(num); balance++; }
            else { high.offer(num); balance--; }
            // Mark the element leaving the window for lazy removal.
            if (i >= k) {
                int out = nums[i - k];
                delayed.merge(out, 1, Integer::sum);
                balance += (out <= low.peek()) ? -1 : 1;
            }
            // Rebalance toward low >= high, sizes within one.
            if (balance > 1) { high.offer(low.poll()); balance -= 2; }
            else if (balance < 0) { low.offer(high.poll()); balance += 2; }
            // Prune any scheduled-for-deletion element that surfaced on top.
            prune(low, delayed);
            prune(high, delayed);
            if (i >= k - 1) {
                res[i - k + 1] = (k % 2 == 1)
                    ? (double) low.peek()
                    : ((long) low.peek() + (long) high.peek()) / 2.0;
            }
        }
        return res;
    }

    private void prune(PriorityQueue<Integer> heap, Map<Integer, Integer> delayed) {
        while (!heap.isEmpty()) {
            int v = heap.peek();
            int pending = delayed.getOrDefault(v, 0);
            if (pending > 0) {
                delayed.put(v, pending - 1);
                heap.poll();
            } else break;
        }
    }
}`,
    },
    timeComplexity: "O(n log k)",
    spaceComplexity: "O(k)",
    companies: ["Amazon", "Google", "Facebook"],
    leetcodeSlug: "sliding-window-median",
  },
];
