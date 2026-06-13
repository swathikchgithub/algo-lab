import type { PatternMeta } from "@/lib/types";

// Canonical pattern metadata + ELI5 analogies. The analogies are the project's
// single source of truth — reuse them everywhere (pattern pages + visualizers);
// never invent a new analogy for an existing pattern.

export const PATTERNS: Record<string, PatternMeta> = {
  "two-pointers": {
    slug: "two-pointers",
    name: "Two Pointers",
    section: "Arrays",
    blurb:
      "Use two indices moving toward/away from each other to reduce O(n²) to O(n).",
    eli5:
      "Two friends walking toward each other from opposite ends of a hallway, checking doors as they meet in the middle.",
    emoji: "🚶‍♂️🚶‍♀️",
    whenToUse:
      "Sorted arrays, pair/triplet sums, partitioning in place, or shrinking a window from both ends.",
    template: `let left = 0, right = arr.length - 1;
while (left < right) {
  const sum = arr[left] + arr[right];
  if (sum === target) return [left, right];
  if (sum < target) left++;   // need bigger → move left up
  else right--;               // need smaller → move right down
}`,
    visualizerSlug: "two-pointers",
  },

  "string-hashing": {
    slug: "string-hashing",
    name: "String Manipulation & Hashing",
    section: "Strings",
    blurb: "HashMap / frequency count to compare or group strings in O(n).",
    eli5:
      "Cubbies at school with name labels — you go straight to YOUR cubby, you never search every cubby.",
    emoji: "🗄️",
    whenToUse:
      "Anagrams, character/word frequency, grouping, or any 'have I seen this before?' check.",
    template: `const count = new Map();
for (const ch of s) count.set(ch, (count.get(ch) ?? 0) + 1);
// compare / inspect counts`,
    visualizerSlug: "hash-table",
  },

  "sliding-window": {
    slug: "sliding-window",
    name: "Sliding Window",
    section: "Strings",
    blurb:
      "Variable- or fixed-size window — track contents as it slides instead of re-scanning.",
    eli5:
      "Looking through a train window — as the train moves, one new house appears and one old house disappears. You never re-count all the houses.",
    emoji: "🚂",
    whenToUse:
      "Longest/shortest substring or subarray meeting a constraint; running aggregates over contiguous ranges.",
    template: `let left = 0;
for (let right = 0; right < n; right++) {
  add(arr[right]);
  while (invalid()) { remove(arr[left]); left++; }
  best = Math.max(best, right - left + 1);
}`,
    visualizerSlug: "sliding-window",
  },

  "monotonic-stack": {
    slug: "monotonic-stack",
    name: "Monotonic Stack",
    section: "Stacks & Queues",
    blurb:
      "Maintain a stack in increasing/decreasing order for next-greater/smaller queries.",
    eli5:
      "A stack of pancakes — you can only take from the top, and you keep it tidy by tossing smaller pancakes before adding a bigger one.",
    emoji: "🥞",
    whenToUse:
      "Next greater/smaller element, spans, histogram areas — anything asking 'nearest bigger/smaller'.",
    template: `const stack = []; // indices, decreasing values
for (let i = 0; i < n; i++) {
  while (stack.length && arr[stack.at(-1)] < arr[i]) {
    const j = stack.pop();
    result[j] = arr[i]; // arr[i] is next greater for j
  }
  stack.push(i);
}`,
    visualizerSlug: "monotonic-stack",
  },

  "tree-traversal": {
    slug: "tree-traversal",
    name: "Tree Traversals",
    section: "Trees",
    blurb:
      "DFS pre/in/post-order & BFS level-order — the foundation of nearly all tree problems.",
    eli5:
      "Exploring a maze: keep going deeper down one path until a dead end, then backtrack to the last fork.",
    emoji: "🌳",
    whenToUse:
      "Any time you must visit every node in a specific order, or process a tree level by level.",
    template: `function inorder(node, out) {
  if (!node) return;
  inorder(node.left, out);
  out.push(node.val);
  inorder(node.right, out);
}`,
    visualizerSlug: "dfs",
  },

  "tree-properties": {
    slug: "tree-properties",
    name: "Binary Tree Properties",
    section: "Trees",
    blurb:
      "Tree recursion — solve sub-problems on left/right subtrees and combine the results.",
    eli5:
      "Ask each child 'how tall are you?', then you are one taller than your tallest child.",
    emoji: "📏",
    whenToUse:
      "Height, depth, diameter, balance — properties defined recursively over subtrees.",
    template: `function depth(node) {
  if (!node) return 0;
  return 1 + Math.max(depth(node.left), depth(node.right));
}`,
  },

  "top-k": {
    slug: "top-k",
    name: "Top-K (Heap)",
    section: "Heaps & Priority Queues",
    blurb: "Min-heap of size K — maintain the K largest elements efficiently.",
    eli5:
      "A tournament bracket where the champion (smallest/biggest) is always instantly at the top.",
    emoji: "🏆",
    whenToUse:
      "K largest/smallest/most-frequent items from a stream or large list without full sorting.",
    template: `const heap = new MinHeap();
for (const x of items) {
  heap.push(x);
  if (heap.size() > k) heap.pop(); // drop smallest
}
// heap now holds the k largest`,
    visualizerSlug: "heap",
  },

  "two-heap": {
    slug: "two-heap",
    name: "Two-Heap",
    section: "Heaps & Priority Queues",
    blurb: "One max-heap + one min-heap to find the median dynamically.",
    eli5:
      "Two tournament brackets back to back — the small half and the big half — so the middle is always at the seam.",
    emoji: "⚖️",
    whenToUse:
      "Running median, or any 'middle element' query over a stream of numbers.",
    template: `const lo = new MaxHeap(); // smaller half
const hi = new MinHeap(); // larger half
// keep sizes balanced; median is the top(s)`,
  },

  bfs: {
    slug: "bfs",
    name: "BFS (Shortest Path / Level-order)",
    section: "Graphs",
    blurb:
      "Explore nodes level by level; guarantees shortest path in unweighted graphs.",
    eli5: "Ripples in a pond — explore everything 1 step away, then 2 steps, then 3.",
    emoji: "🌊",
    whenToUse:
      "Shortest path in unweighted graphs/grids, level-order processing, multi-source spread.",
    template: `const queue = [start]; visited.add(start);
let steps = 0;
while (queue.length) {
  for (let i = queue.length; i > 0; i--) {
    const node = queue.shift();
    for (const next of neighbors(node))
      if (!visited.has(next)) { visited.add(next); queue.push(next); }
  }
  steps++;
}`,
    visualizerSlug: "bfs",
  },

  "dfs-backtracking": {
    slug: "dfs-backtracking",
    name: "DFS / Backtracking on Graphs",
    section: "Graphs",
    blurb:
      "DFS with a visited set — explore all paths; detect cycles and connected components.",
    eli5:
      "Exploring a maze: keep going deeper down one path until a dead end, then backtrack to the last fork.",
    emoji: "🧭",
    whenToUse:
      "Connected components, cycle detection, topological order, exhaustive path search.",
    template: `function dfs(node) {
  visited.add(node);
  for (const next of neighbors(node))
    if (!visited.has(next)) dfs(next);
}`,
    visualizerSlug: "dfs",
  },

  // --- Sections seeded with a representative subset (Pass 1) ---

  "linked-list": {
    slug: "linked-list",
    name: "Linked List Manipulation",
    section: "Linked Lists",
    blurb: "Pointer rewiring with dummy heads and fast/slow runners.",
    eli5:
      "A treasure hunt where each clue points to the next — to reverse it, you flip each arrow to point backward.",
    emoji: "🔗",
    whenToUse:
      "Reversal, cycle detection, finding the middle, merging sorted lists.",
    template: `let prev = null, curr = head;
while (curr) {
  const next = curr.next;
  curr.next = prev; // flip the arrow
  prev = curr; curr = next;
}
return prev;`,
  },

  "binary-search": {
    slug: "binary-search",
    name: "Binary Search",
    section: "Binary Search",
    blurb: "Repeatedly halve a sorted search space — O(log n).",
    eli5:
      "Guessing a number 1–100. Every guess of the middle throws away half the numbers. That's why it's so fast.",
    emoji: "🎯",
    whenToUse:
      "Searching sorted data, or finding a boundary where a monotonic condition flips.",
    template: `let lo = 0, hi = n - 1;
while (lo <= hi) {
  const mid = lo + ((hi - lo) >> 1);
  if (arr[mid] === target) return mid;
  if (arr[mid] < target) lo = mid + 1; // answer is right
  else hi = mid - 1;                    // answer is left
}
return -1;`,
    visualizerSlug: "binary-search",
  },

  "dynamic-programming": {
    slug: "dynamic-programming",
    name: "Dynamic Programming",
    section: "Dynamic Programming",
    blurb:
      "Break a problem into overlapping subproblems and cache their answers.",
    eli5:
      "Climbing stairs: the number of ways to reach a step is just the ways to reach the two steps below it — so write each answer down and reuse it.",
    emoji: "🪜",
    whenToUse:
      "Optimal substructure + overlapping subproblems: counting, min/max paths, knapsack-style choices.",
    template: `const dp = new Array(n + 1).fill(0);
dp[0] = base;
for (let i = 1; i <= n; i++)
  dp[i] = combine(dp[i - 1], dp[i - 2]); // recurrence
return dp[n];`,
    visualizerSlug: "kadane",
  },

  backtracking: {
    slug: "backtracking",
    name: "Backtracking",
    section: "Backtracking",
    blurb: "Build candidates incrementally, abandoning a path as soon as it fails.",
    eli5:
      "Trying outfits: put on a piece, check the mirror, and if it clashes take it back off before trying the next.",
    emoji: "🧩",
    whenToUse:
      "Permutations, combinations, subsets, constraint puzzles (N-Queens, Sudoku).",
    template: `function backtrack(path, choices) {
  if (isComplete(path)) { results.push([...path]); return; }
  for (const c of choices) {
    path.push(c);          // choose
    backtrack(path, next); // explore
    path.pop();            // un-choose
  }
}`,
  },

  // --- Visualizer-only patterns (no dedicated question pattern in v1) ---

  "big-o": {
    slug: "big-o",
    name: "Big-O Notation",
    section: "Arrays",
    blurb:
      "How an algorithm's work grows as the input grows — the language of efficiency.",
    eli5:
      "O(1) = grabbing a book when you know the shelf. O(n) = checking every shelf. O(log n) = the library is sorted so each question kills half the shelves.",
    emoji: "📚",
    whenToUse: "Always — state time & space complexity for every algorithm you write.",
    template: `O(1)      constant — one step, regardless of n
O(log n)  halve the problem each step (binary search)
O(n)      one pass over the input
O(n log n) sort, then a linear pass
O(n²)     nested loops over the same data`,
    visualizerSlug: "big-o",
  },

  kadane: {
    slug: "kadane",
    name: "Kadane's / Max Subarray",
    section: "Dynamic Programming",
    blurb:
      "Track the best subarray ending here; reset when the running sum goes negative.",
    eli5:
      "Carrying a money bag down the street; if the bag ever goes negative, drop it and start a fresh one.",
    emoji: "💰",
    whenToUse: "Maximum/contiguous subarray sum and its many variants.",
    template: `let best = arr[0], cur = arr[0];
for (let i = 1; i < n; i++) {
  cur = Math.max(arr[i], cur + arr[i]); // extend or restart
  best = Math.max(best, cur);
}
return best;`,
    visualizerSlug: "kadane",
  },
};

export function getPattern(slug: string): PatternMeta | undefined {
  return PATTERNS[slug];
}
