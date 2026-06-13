import type { Question } from "@/lib/types";

// Section 6: Trees — Patterns 6.1 Tree Traversal, 6.2 Tree Properties
// All solutions assume a standard binary TreeNode { val, left, right }
// (or an N-ary Node { val, children } where noted).
export const treesQuestions: Question[] = [
  {
    id: "binary-tree-inorder-traversal",
    title: "Binary Tree Inorder Traversal (iterative)",
    section: "Trees",
    pattern: "tree-traversal",
    difficulty: "Easy",
    description:
      "Return the inorder (left, node, right) traversal of a binary tree's node values, using an explicit stack rather than recursion.",
    examples: [
      { input: "root = [1,null,2,3]", output: "[1,3,2]" },
      { input: "root = []", output: "[]" },
      { input: "root = [1]", output: "[1]" },
    ],
    constraints: ["0 <= number of nodes <= 100", "-100 <= Node.val <= 100"],
    eli5:
      "Walk down a staircase always hugging the left wall, dropping a breadcrumb on each step. When you can't go left, read the step, then turn right and repeat.",
    hints: [
      "Inorder visits left subtree, then the node, then the right subtree.",
      "Push nodes while walking left; pop to visit, then move to the popped node's right child.",
      "The loop continues while the stack is non-empty OR the current pointer is non-null.",
    ],
    approach:
      "Keep a stack and a curr pointer. Push curr and go left until curr is null. Then pop a node, record its value, and set curr to its right child. Repeat.",
    solutions: {
      python: `# TreeNode: self.val, self.left, self.right
def inorder_traversal(root):
    res, stack, curr = [], [], root
    while curr or stack:
        while curr:              # dive left, stacking the path
            stack.append(curr)
            curr = curr.left
        curr = stack.pop()       # leftmost unvisited node
        res.append(curr.val)     # visit
        curr = curr.right        # then explore its right subtree
    return res`,
      java: `import java.util.*;
// TreeNode { int val; TreeNode left, right; } provided by LeetCode
class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        Deque<TreeNode> stack = new ArrayDeque<>();
        TreeNode curr = root;
        while (curr != null || !stack.isEmpty()) {
            while (curr != null) {   // dive left, stacking the path
                stack.push(curr);
                curr = curr.left;
            }
            curr = stack.pop();      // leftmost unvisited node
            res.add(curr.val);       // visit
            curr = curr.right;       // then explore its right subtree
        }
        return res;
    }
}`,
    },
    timeComplexity: "O(n)",
    spaceComplexity: "O(h) for the stack, h = tree height",
    companies: ["Microsoft", "Amazon", "Bloomberg"],
    leetcodeSlug: "binary-tree-inorder-traversal",
  },
  {
    id: "binary-tree-preorder-traversal",
    title: "Binary Tree Preorder Traversal (iterative)",
    section: "Trees",
    pattern: "tree-traversal",
    difficulty: "Easy",
    description:
      "Return the preorder (node, left, right) traversal of a binary tree's node values, using an explicit stack.",
    examples: [
      { input: "root = [1,null,2,3]", output: "[1,2,3]" },
      { input: "root = []", output: "[]" },
      { input: "root = [1,2,3,4,5]", output: "[1,2,4,5,3]" },
    ],
    constraints: ["0 <= number of nodes <= 100", "-100 <= Node.val <= 100"],
    eli5:
      "Announce a room the moment you enter it, then explore its left door before its right. Use a to-do pile so you don't lose track of the right doors.",
    hints: [
      "Preorder visits the node first, then left, then right.",
      "Push the root; pop, visit, then push right child before left so left is processed first.",
      "Push right before left because a stack reverses order (LIFO).",
    ],
    approach:
      "Use a stack seeded with the root. Pop a node, record it, then push its right child then its left child so the left is popped next. Skip null children.",
    solutions: {
      python: `# TreeNode: self.val, self.left, self.right
def preorder_traversal(root):
    if not root:
        return []
    res, stack = [], [root]
    while stack:
        node = stack.pop()
        res.append(node.val)      # visit on the way down
        if node.right:            # push right first...
            stack.append(node.right)
        if node.left:             # ...so left is popped next
            stack.append(node.left)
    return res`,
      java: `import java.util.*;
// TreeNode { int val; TreeNode left, right; } provided by LeetCode
class Solution {
    public List<Integer> preorderTraversal(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        if (root == null) return res;
        Deque<TreeNode> stack = new ArrayDeque<>();
        stack.push(root);
        while (!stack.isEmpty()) {
            TreeNode node = stack.pop();
            res.add(node.val);                       // visit on the way down
            if (node.right != null) stack.push(node.right); // push right first...
            if (node.left != null) stack.push(node.left);   // ...so left is popped next
        }
        return res;
    }
}`,
    },
    timeComplexity: "O(n)",
    spaceComplexity: "O(h) for the stack, h = tree height",
    companies: ["Amazon", "Microsoft", "Google"],
    leetcodeSlug: "binary-tree-preorder-traversal",
  },
  {
    id: "binary-tree-postorder-traversal",
    title: "Binary Tree Postorder Traversal (iterative)",
    section: "Trees",
    pattern: "tree-traversal",
    difficulty: "Easy",
    description:
      "Return the postorder (left, right, node) traversal of a binary tree's node values, using an explicit stack.",
    examples: [
      { input: "root = [1,null,2,3]", output: "[3,2,1]" },
      { input: "root = []", output: "[]" },
      { input: "root = [1,2,3,4,5]", output: "[4,5,2,3,1]" },
    ],
    constraints: ["0 <= number of nodes <= 100", "-100 <= Node.val <= 100"],
    eli5:
      "Do a reversed-preorder walk (node, right, left), then flip the whole list around — that gives you left, right, node.",
    hints: [
      "Postorder is left, right, node — the trickiest to do iteratively.",
      "Run a modified preorder that visits node, then right, then left, collecting values.",
      "Reverse that collected list at the end to get true postorder.",
    ],
    approach:
      "Use a stack like preorder but push left before right so right is processed first, prepending (or appending then reversing) values. The reverse of (node, right, left) is (left, right, node).",
    solutions: {
      python: `# TreeNode: self.val, self.left, self.right
def postorder_traversal(root):
    if not root:
        return []
    res, stack = [], [root]
    while stack:
        node = stack.pop()
        res.append(node.val)      # building node, right, left
        if node.left:             # push left first...
            stack.append(node.left)
        if node.right:            # ...so right is popped next
            stack.append(node.right)
    return res[::-1]              # reverse -> left, right, node`,
      java: `import java.util.*;
// TreeNode { int val; TreeNode left, right; } provided by LeetCode
class Solution {
    public List<Integer> postorderTraversal(TreeNode root) {
        LinkedList<Integer> res = new LinkedList<>();
        if (root == null) return res;
        Deque<TreeNode> stack = new ArrayDeque<>();
        stack.push(root);
        while (!stack.isEmpty()) {
            TreeNode node = stack.pop();
            res.addFirst(node.val);                  // prepend -> reverse of (node, right, left)
            if (node.left != null) stack.push(node.left);   // push left first...
            if (node.right != null) stack.push(node.right); // ...so right is popped next
        }
        return res;                                  // already left, right, node
    }
}`,
    },
    timeComplexity: "O(n)",
    spaceComplexity: "O(h) for the stack, h = tree height",
    companies: ["Amazon", "Facebook", "Bloomberg"],
    leetcodeSlug: "binary-tree-postorder-traversal",
  },
  {
    id: "level-order-traversal",
    title: "Level Order Traversal",
    section: "Trees",
    pattern: "tree-traversal",
    difficulty: "Medium",
    description:
      "Return the level-order traversal of a binary tree's values: a list of levels, each level being a list of node values left-to-right.",
    examples: [
      { input: "root = [3,9,20,null,null,15,7]", output: "[[3],[9,20],[15,7]]" },
      { input: "root = [1]", output: "[[1]]" },
      { input: "root = []", output: "[]" },
    ],
    constraints: ["0 <= number of nodes <= 2000", "-1000 <= Node.val <= 1000"],
    eli5:
      "Read the tree like a book, one row at a time. Use a line of people: serve the front of the line and add their kids to the back.",
    hints: [
      "This is breadth-first search — use a queue, not a stack.",
      "Snapshot the queue size at the start of each level to know how many nodes belong to it.",
      "Process exactly that many nodes, enqueuing their children for the next level.",
    ],
    approach:
      "BFS with a queue. For each level, capture the current queue length, dequeue that many nodes into one level's list, and enqueue their non-null children.",
    solutions: {
      python: `from collections import deque
# TreeNode: self.val, self.left, self.right
def level_order(root):
    if not root:
        return []
    res, q = [], deque([root])
    while q:
        level = []
        for _ in range(len(q)):   # exactly this level's nodes
            node = q.popleft()
            level.append(node.val)
            if node.left:
                q.append(node.left)
            if node.right:
                q.append(node.right)
        res.append(level)
    return res`,
      java: `import java.util.*;
// TreeNode { int val; TreeNode left, right; } provided by LeetCode
class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        if (root == null) return res;
        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root);
        while (!q.isEmpty()) {
            int n = q.size();                 // exactly this level's nodes
            List<Integer> level = new ArrayList<>();
            for (int i = 0; i < n; i++) {
                TreeNode node = q.poll();
                level.add(node.val);
                if (node.left != null) q.offer(node.left);
                if (node.right != null) q.offer(node.right);
            }
            res.add(level);
        }
        return res;
    }
}`,
    },
    timeComplexity: "O(n)",
    spaceComplexity: "O(n) for the queue (up to a full level)",
    companies: ["Amazon", "Microsoft", "LinkedIn", "Bloomberg"],
    leetcodeSlug: "binary-tree-level-order-traversal",
  },
  {
    id: "zigzag-level-order-traversal",
    title: "Zigzag Level Order Traversal",
    section: "Trees",
    pattern: "tree-traversal",
    difficulty: "Medium",
    description:
      "Return the zigzag level-order traversal: level 0 left-to-right, level 1 right-to-left, alternating each level.",
    examples: [
      { input: "root = [3,9,20,null,null,15,7]", output: "[[3],[20,9],[15,7]]" },
      { input: "root = [1]", output: "[[1]]" },
      { input: "root = []", output: "[]" },
    ],
    constraints: ["0 <= number of nodes <= 2000", "-100 <= Node.val <= 100"],
    eli5:
      "Read the tree row by row, but mow the lawn in a snake pattern: one row left-to-right, the next right-to-left.",
    hints: [
      "Do a normal level-order BFS first.",
      "Keep a boolean that flips every level deciding the read direction.",
      "Reverse the level list (or insert at the front) on right-to-left levels.",
    ],
    approach:
      "Standard BFS by level, but track a left_to_right flag that toggles each level; when false, reverse that level's values before appending.",
    solutions: {
      python: `from collections import deque
# TreeNode: self.val, self.left, self.right
def zigzag_level_order(root):
    if not root:
        return []
    res, q, left_to_right = [], deque([root]), True
    while q:
        level = []
        for _ in range(len(q)):
            node = q.popleft()
            level.append(node.val)
            if node.left:
                q.append(node.left)
            if node.right:
                q.append(node.right)
        res.append(level if left_to_right else level[::-1])
        left_to_right = not left_to_right   # flip direction
    return res`,
      java: `import java.util.*;
// TreeNode { int val; TreeNode left, right; } provided by LeetCode
class Solution {
    public List<List<Integer>> zigzagLevelOrder(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        if (root == null) return res;
        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root);
        boolean leftToRight = true;
        while (!q.isEmpty()) {
            int n = q.size();
            // Deque lets us append at whichever end matches the read direction
            Deque<Integer> level = new ArrayDeque<>();
            for (int i = 0; i < n; i++) {
                TreeNode node = q.poll();
                if (leftToRight) level.addLast(node.val);
                else level.addFirst(node.val);
                if (node.left != null) q.offer(node.left);
                if (node.right != null) q.offer(node.right);
            }
            res.add(new ArrayList<>(level));
            leftToRight = !leftToRight;        // flip direction
        }
        return res;
    }
}`,
    },
    timeComplexity: "O(n)",
    spaceComplexity: "O(n) for the queue",
    companies: ["Amazon", "Microsoft", "Meta"],
    leetcodeSlug: "binary-tree-zigzag-level-order-traversal",
  },
  {
    id: "binary-tree-right-side-view",
    title: "Binary Tree Right Side View",
    section: "Trees",
    pattern: "tree-traversal",
    difficulty: "Medium",
    description:
      "Imagine standing on the right side of the tree. Return the values of the nodes visible top-to-bottom.",
    examples: [
      { input: "root = [1,2,3,null,5,null,4]", output: "[1,3,4]" },
      { input: "root = [1,null,3]", output: "[1,3]" },
      { input: "root = []", output: "[]" },
    ],
    constraints: ["0 <= number of nodes <= 100", "-100 <= Node.val <= 100"],
    eli5:
      "On each floor of the tree, only the person standing at the far-right window is visible from outside.",
    hints: [
      "The visible node on each level is the last one in left-to-right order.",
      "Run a level-order BFS and grab the final node of each level.",
      "Alternatively DFS visiting right child first, recording the first node seen at each new depth.",
    ],
    approach:
      "BFS by level; the rightmost node of each level is the last node dequeued in that level, so append it to the result.",
    solutions: {
      python: `from collections import deque
# TreeNode: self.val, self.left, self.right
def right_side_view(root):
    if not root:
        return []
    res, q = [], deque([root])
    while q:
        n = len(q)
        for i in range(n):
            node = q.popleft()
            if i == n - 1:        # last node on this level
                res.append(node.val)
            if node.left:
                q.append(node.left)
            if node.right:
                q.append(node.right)
    return res`,
      java: `import java.util.*;
// TreeNode { int val; TreeNode left, right; } provided by LeetCode
class Solution {
    public List<Integer> rightSideView(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        if (root == null) return res;
        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root);
        while (!q.isEmpty()) {
            int n = q.size();
            for (int i = 0; i < n; i++) {
                TreeNode node = q.poll();
                if (i == n - 1) res.add(node.val);   // last node on this level
                if (node.left != null) q.offer(node.left);
                if (node.right != null) q.offer(node.right);
            }
        }
        return res;
    }
}`,
    },
    timeComplexity: "O(n)",
    spaceComplexity: "O(n) for the queue",
    companies: ["Amazon", "Meta", "Microsoft"],
    leetcodeSlug: "binary-tree-right-side-view",
  },
  {
    id: "average-of-levels-in-binary-tree",
    title: "Average of Levels in Binary Tree",
    section: "Trees",
    pattern: "tree-traversal",
    difficulty: "Easy",
    description:
      "Return a list of the average value of the nodes on each level of a binary tree, from top to bottom.",
    examples: [
      { input: "root = [3,9,20,null,null,15,7]", output: "[3.00000,14.50000,11.00000]" },
      { input: "root = [3,9,20,15,7]", output: "[3.00000,14.50000,11.00000]" },
    ],
    constraints: [
      "1 <= number of nodes <= 10^4",
      "-2^31 <= Node.val <= 2^31 - 1",
    ],
    eli5:
      "For each row of the tree, add up everyone's number and divide by how many people are on that row.",
    hints: [
      "It's a level-order BFS where you keep a running sum and count per level.",
      "Snapshot the level size, sum the dequeued values, then divide.",
      "Use floating-point division and beware large sums overflowing fixed-width ints.",
    ],
    approach:
      "BFS by level; for each level sum the node values and divide by the count, pushing the average to the result.",
    solutions: {
      python: `from collections import deque
# TreeNode: self.val, self.left, self.right
def average_of_levels(root):
    res, q = [], deque([root])
    while q:
        n = len(q)
        total = 0
        for _ in range(n):
            node = q.popleft()
            total += node.val
            if node.left:
                q.append(node.left)
            if node.right:
                q.append(node.right)
        res.append(total / n)     # float average
    return res`,
      java: `import java.util.*;
// TreeNode { int val; TreeNode left, right; } provided by LeetCode
class Solution {
    public List<Double> averageOfLevels(TreeNode root) {
        List<Double> res = new ArrayList<>();
        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root);
        while (!q.isEmpty()) {
            int n = q.size();
            long total = 0;                   // long avoids int overflow on large sums
            for (int i = 0; i < n; i++) {
                TreeNode node = q.poll();
                total += node.val;
                if (node.left != null) q.offer(node.left);
                if (node.right != null) q.offer(node.right);
            }
            res.add((double) total / n);      // float average
        }
        return res;
    }
}`,
    },
    timeComplexity: "O(n)",
    spaceComplexity: "O(n) for the queue",
    companies: ["Facebook", "Amazon"],
    leetcodeSlug: "average-of-levels-in-binary-tree",
  },
  {
    id: "n-ary-tree-level-order-traversal",
    title: "N-ary Tree Level Order Traversal",
    section: "Trees",
    pattern: "tree-traversal",
    difficulty: "Medium",
    description:
      "Given the root of an N-ary tree, return the level-order traversal of its node values (each node may have any number of children).",
    examples: [
      { input: "root = [1,null,3,2,4,null,5,6]", output: "[[1],[3,2,4],[5,6]]" },
      {
        input: "root = [1,null,2,3,4,5,null,null,6,7,null,8,null,9,10,null,null,11,null,12,null,13,null,null,14]",
        output: "[[1],[2,3,4,5],[6,7,8,9,10],[11,12,13],[14]]",
      },
    ],
    constraints: [
      "0 <= number of nodes <= 10^4",
      "Tree height <= 1000",
    ],
    eli5:
      "Same row-by-row reading as a normal tree, except each person can have any number of kids — just line them all up at the back.",
    hints: [
      "Identical to binary level-order BFS, but children is a list, not just left/right.",
      "Snapshot the queue size per level, then enqueue every child of each node.",
      "Guard against a null root returning an empty list.",
    ],
    approach:
      "BFS with a queue. For each level, dequeue the current count of nodes into one level list and enqueue all of each node's children.",
    solutions: {
      python: `from collections import deque
# N-ary Node: self.val, self.children (a list)
def level_order(root):
    if not root:
        return []
    res, q = [], deque([root])
    while q:
        level = []
        for _ in range(len(q)):
            node = q.popleft()
            level.append(node.val)
            for child in node.children:   # any number of kids
                q.append(child)
        res.append(level)
    return res`,
      java: `import java.util.*;
// N-ary Node { public int val; public List<Node> children; } provided by LeetCode
class Solution {
    public List<List<Integer>> levelOrder(Node root) {
        List<List<Integer>> res = new ArrayList<>();
        if (root == null) return res;
        Queue<Node> q = new LinkedList<>();
        q.offer(root);
        while (!q.isEmpty()) {
            int n = q.size();
            List<Integer> level = new ArrayList<>();
            for (int i = 0; i < n; i++) {
                Node node = q.poll();
                level.add(node.val);
                for (Node child : node.children) q.offer(child); // any number of kids
            }
            res.add(level);
        }
        return res;
    }
}`,
    },
    timeComplexity: "O(n)",
    spaceComplexity: "O(n) for the queue",
    companies: ["Amazon", "Microsoft"],
    leetcodeSlug: "n-ary-tree-level-order-traversal",
  },
  {
    id: "vertical-order-traversal-binary-tree",
    title: "Vertical Order Traversal of a Binary Tree",
    section: "Trees",
    pattern: "tree-traversal",
    difficulty: "Hard",
    description:
      "Return the vertical order traversal: group nodes by column (root at column 0, left child col-1, right child col+1). Columns go left to right; within a column, top to bottom by row; ties (same row and column) are ordered by ascending value.",
    examples: [
      { input: "root = [3,9,20,null,null,15,7]", output: "[[9],[3,15],[20],[7]]" },
      {
        input: "root = [1,2,3,4,5,6,7]",
        output: "[[4],[2],[1,5,6],[3],[7]]",
        explanation: "Nodes 5 and 6 share column 0 and row 2, so they are sorted by value.",
      },
    ],
    constraints: ["1 <= number of nodes <= 1000", "0 <= Node.val <= 1000"],
    eli5:
      "Drop each node into a labeled column bin based on how far left/right it sits. Inside each bin, stack them top row first, and if two land on the same spot, the smaller number goes first.",
    hints: [
      "Assign each node a (col, row) coordinate: left child is (col-1, row+1), right is (col+1, row+1).",
      "BFS/DFS to collect (col, row, val) triples into a map keyed by column.",
      "Sort columns ascending; within a column sort by (row, value) so same-position ties break by value.",
    ],
    approach:
      "BFS tracking (col, row) for every node, bucketing (row, val) into a dict keyed by column. Then for each column sorted ascending, sort its entries by (row, val) and emit the values.",
    solutions: {
      python: `from collections import deque, defaultdict
# TreeNode: self.val, self.left, self.right
def vertical_traversal(root):
    cols = defaultdict(list)          # col -> list of (row, val)
    q = deque([(root, 0, 0)])         # (node, row, col)
    while q:
        node, row, col = q.popleft()
        cols[col].append((row, node.val))
        if node.left:
            q.append((node.left, row + 1, col - 1))
        if node.right:
            q.append((node.right, row + 1, col + 1))
    res = []
    for col in sorted(cols):          # columns left -> right
        # within a column: by row, then by value
        col_vals = [val for _, val in sorted(cols[col])]
        res.append(col_vals)
    return res`,
      java: `import java.util.*;
// TreeNode { int val; TreeNode left, right; } provided by LeetCode
class Solution {
    public List<List<Integer>> verticalTraversal(TreeNode root) {
        // TreeMap keeps columns sorted ascending (left -> right)
        TreeMap<Integer, List<int[]>> cols = new TreeMap<>(); // col -> list of [row, val]
        Queue<int[]> meta = new LinkedList<>();               // [row, col] paired with node
        Queue<TreeNode> nodes = new LinkedList<>();           // BFS so rows arrive top-down
        nodes.offer(root);
        meta.offer(new int[]{0, 0});
        while (!nodes.isEmpty()) {
            TreeNode node = nodes.poll();
            int[] rc = meta.poll();
            int row = rc[0], col = rc[1];
            cols.computeIfAbsent(col, k -> new ArrayList<>()).add(new int[]{row, node.val});
            if (node.left != null) {
                nodes.offer(node.left);
                meta.offer(new int[]{row + 1, col - 1});
            }
            if (node.right != null) {
                nodes.offer(node.right);
                meta.offer(new int[]{row + 1, col + 1});
            }
        }
        List<List<Integer>> res = new ArrayList<>();
        for (List<int[]> entries : cols.values()) {
            // within a column: by row, then by value
            entries.sort((a, b) -> a[0] != b[0] ? a[0] - b[0] : a[1] - b[1]);
            List<Integer> colVals = new ArrayList<>();
            for (int[] e : entries) colVals.add(e[1]);
            res.add(colVals);
        }
        return res;
    }
}`,
    },
    timeComplexity: "O(n log n) dominated by sorting the buckets",
    spaceComplexity: "O(n) for the column map and queue",
    companies: ["Amazon", "Facebook", "Microsoft"],
    leetcodeSlug: "vertical-order-traversal-of-a-binary-tree",
  },
  {
    id: "boundary-of-binary-tree",
    title: "Boundary of Binary Tree",
    section: "Trees",
    pattern: "tree-traversal",
    difficulty: "Medium",
    description:
      "Return the boundary of a binary tree in anti-clockwise order starting from the root: the root, then the left boundary (excluding leaves), then all leaves left-to-right, then the right boundary in reverse (excluding leaves).",
    examples: [
      { input: "root = [1,null,2,3,4]", output: "[1,3,4,2]" },
      { input: "root = [1,2,3,4,5,6,null,null,null,7,8,9,10]", output: "[1,2,4,7,8,9,10,6,3]" },
    ],
    constraints: ["1 <= number of nodes <= 10^4", "-1000 <= Node.val <= 1000"],
    eli5:
      "Trace your finger around the outside of the tree: down the left edge, across the bottom leaves, then back up the right edge — without counting any corner twice.",
    hints: [
      "Split into three parts: left boundary (top-down, no leaves), all leaves, right boundary (bottom-up, no leaves).",
      "A leaf has no children — collect leaves with a left-to-right DFS.",
      "Handle the root specially and avoid double-counting it as both a boundary and a leaf.",
    ],
    approach:
      "Add the root (if not a leaf). Walk the left boundary top-down skipping leaves; collect all leaves via DFS; walk the right boundary top-down skipping leaves, then append it reversed.",
    solutions: {
      python: `# TreeNode: self.val, self.left, self.right
def boundary_of_binary_tree(root):
    if not root:
        return []

    def is_leaf(n):
        return not n.left and not n.right

    res = [root.val] if not is_leaf(root) else [root.val]

    # left boundary, top-down, excluding leaves
    left = []
    node = root.left
    while node:
        if not is_leaf(node):
            left.append(node.val)
        node = node.left if node.left else node.right

    # leaves, left to right
    leaves = []
    def dfs_leaves(n):
        if not n:
            return
        if is_leaf(n):
            leaves.append(n.val)
            return
        dfs_leaves(n.left)
        dfs_leaves(n.right)
    if not is_leaf(root):
        dfs_leaves(root)

    # right boundary, top-down then reversed, excluding leaves
    right = []
    node = root.right
    while node:
        if not is_leaf(node):
            right.append(node.val)
        node = node.right if node.right else node.left

    return res + left + leaves + right[::-1]`,
      java: `import java.util.*;
// TreeNode { int val; TreeNode left, right; } provided by LeetCode
class Solution {
    private boolean isLeaf(TreeNode n) {
        return n.left == null && n.right == null;
    }

    private void dfsLeaves(TreeNode n, List<Integer> leaves) {
        if (n == null) return;
        if (isLeaf(n)) { leaves.add(n.val); return; }
        dfsLeaves(n.left, leaves);
        dfsLeaves(n.right, leaves);
    }

    public List<Integer> boundaryOfBinaryTree(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        if (root == null) return res;
        res.add(root.val);

        // left boundary, top-down, excluding leaves
        List<Integer> left = new ArrayList<>();
        TreeNode node = root.left;
        while (node != null) {
            if (!isLeaf(node)) left.add(node.val);
            node = node.left != null ? node.left : node.right;
        }

        // leaves, left to right
        List<Integer> leaves = new ArrayList<>();
        if (!isLeaf(root)) dfsLeaves(root, leaves);

        // right boundary, top-down, excluding leaves
        List<Integer> right = new ArrayList<>();
        node = root.right;
        while (node != null) {
            if (!isLeaf(node)) right.add(node.val);
            node = node.right != null ? node.right : node.left;
        }

        res.addAll(left);
        res.addAll(leaves);
        Collections.reverse(right);              // right boundary appended bottom-up
        res.addAll(right);
        return res;
    }
}`,
    },
    timeComplexity: "O(n)",
    spaceComplexity: "O(h) recursion for leaf collection + O(n) output",
    companies: ["Amazon", "Microsoft", "Google"],
    leetcodeSlug: "boundary-of-binary-tree",
  },
  {
    id: "maximum-depth-of-binary-tree",
    title: "Maximum Depth of Binary Tree",
    section: "Trees",
    pattern: "tree-properties",
    difficulty: "Easy",
    description:
      "Return the maximum depth of a binary tree: the number of nodes along the longest path from the root down to the farthest leaf.",
    examples: [
      { input: "root = [3,9,20,null,null,15,7]", output: "3" },
      { input: "root = [1,null,2]", output: "2" },
      { input: "root = []", output: "0" },
    ],
    constraints: ["0 <= number of nodes <= 10^4", "-100 <= Node.val <= 100"],
    eli5:
      "Ask each child 'how tall are you?', take the taller answer, and add one for yourself.",
    hints: [
      "An empty tree has depth 0 — that's the base case.",
      "A node's depth is 1 plus the deeper of its two subtrees.",
      "Simple post-order recursion solves it cleanly.",
    ],
    approach:
      "Recurse: depth of null is 0; otherwise 1 + max(depth(left), depth(right)).",
    solutions: {
      python: `# TreeNode: self.val, self.left, self.right
def max_depth(root):
    if not root:
        return 0                       # empty subtree
    return 1 + max(max_depth(root.left), max_depth(root.right))`,
      java: `// TreeNode { int val; TreeNode left, right; } provided by LeetCode
class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null) return 0;          // empty subtree
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }
}`,
    },
    timeComplexity: "O(n)",
    spaceComplexity: "O(h) recursion stack, h = tree height",
    companies: ["Amazon", "LinkedIn", "Apple"],
    leetcodeSlug: "maximum-depth-of-binary-tree",
  },
  {
    id: "minimum-depth-of-binary-tree",
    title: "Minimum Depth of Binary Tree",
    section: "Trees",
    pattern: "tree-properties",
    difficulty: "Easy",
    description:
      "Return the minimum depth of a binary tree: the number of nodes along the shortest path from the root down to the nearest leaf.",
    examples: [
      { input: "root = [3,9,20,null,null,15,7]", output: "2" },
      { input: "root = [2,null,3,null,4,null,5,null,6]", output: "5" },
    ],
    constraints: ["0 <= number of nodes <= 10^5", "-1000 <= Node.val <= 1000"],
    eli5:
      "Find the closest exit (a leaf). But watch out: a node with one missing child isn't an exit, so you must follow the side that actually exists.",
    hints: [
      "A leaf is a node with no children — the minimum path must end at a leaf.",
      "Careful: min(left, right) is wrong when one child is null, because the null side isn't a real path.",
      "If one child is missing, recurse only into the present child; otherwise take the min of both.",
    ],
    approach:
      "Recurse: null is 0. If one child is missing, return 1 + depth of the existing child (a null side is not a leaf path). Otherwise return 1 + min of both children.",
    solutions: {
      python: `# TreeNode: self.val, self.left, self.right
def min_depth(root):
    if not root:
        return 0
    if not root.left:                  # only right subtree exists
        return 1 + min_depth(root.right)
    if not root.right:                 # only left subtree exists
        return 1 + min_depth(root.left)
    return 1 + min(min_depth(root.left), min_depth(root.right))`,
      java: `// TreeNode { int val; TreeNode left, right; } provided by LeetCode
class Solution {
    public int minDepth(TreeNode root) {
        if (root == null) return 0;
        if (root.left == null)  return 1 + minDepth(root.right); // only right exists
        if (root.right == null) return 1 + minDepth(root.left);  // only left exists
        return 1 + Math.min(minDepth(root.left), minDepth(root.right));
    }
}`,
    },
    timeComplexity: "O(n)",
    spaceComplexity: "O(h) recursion stack, h = tree height",
    companies: ["Amazon", "Facebook"],
    leetcodeSlug: "minimum-depth-of-binary-tree",
  },
  {
    id: "diameter-of-binary-tree",
    title: "Diameter of Binary Tree",
    section: "Trees",
    pattern: "tree-properties",
    difficulty: "Easy",
    description:
      "Return the length of the diameter of a binary tree: the number of edges on the longest path between any two nodes (the path may or may not pass through the root).",
    examples: [
      { input: "root = [1,2,3,4,5]", output: "3", explanation: "Longest path 4-2-1-3 or 5-2-1-3 has 3 edges." },
      { input: "root = [1,2]", output: "1" },
    ],
    constraints: ["1 <= number of nodes <= 10^4", "-100 <= Node.val <= 100"],
    eli5:
      "At every node, the longest path bending through it is its left height plus its right height. Walk the whole tree remembering the biggest such bend.",
    hints: [
      "The diameter through a node = height(left) + height(right) (in edges).",
      "Compute heights bottom-up and update a running best at each node.",
      "Return the height from the recursion but track the diameter in an outer variable.",
    ],
    approach:
      "Post-order DFS returning each subtree's height (in edges). At each node, candidate diameter = leftHeight + rightHeight; keep the global max. Height returned is 1 + max(left, right).",
    solutions: {
      python: `# TreeNode: self.val, self.left, self.right
def diameter_of_binary_tree(root):
    best = 0
    def height(node):                  # returns height in edges
        nonlocal best
        if not node:
            return 0
        left = height(node.left)
        right = height(node.right)
        best = max(best, left + right)  # path bending through node
        return 1 + max(left, right)
    height(root)
    return best`,
      java: `// TreeNode { int val; TreeNode left, right; } provided by LeetCode
class Solution {
    private int best = 0;

    public int diameterOfBinaryTree(TreeNode root) {
        height(root);
        return best;
    }

    private int height(TreeNode node) {          // returns height in edges
        if (node == null) return 0;
        int left = height(node.left);
        int right = height(node.right);
        best = Math.max(best, left + right);     // path bending through node
        return 1 + Math.max(left, right);
    }
}`,
    },
    timeComplexity: "O(n)",
    spaceComplexity: "O(h) recursion stack, h = tree height",
    companies: ["Amazon", "Facebook", "Google"],
    leetcodeSlug: "diameter-of-binary-tree",
  },
  {
    id: "balanced-binary-tree",
    title: "Balanced Binary Tree",
    section: "Trees",
    pattern: "tree-properties",
    difficulty: "Easy",
    description:
      "Determine whether a binary tree is height-balanced: for every node, the heights of its two subtrees differ by at most 1.",
    examples: [
      { input: "root = [3,9,20,null,null,15,7]", output: "true" },
      { input: "root = [1,2,2,3,3,null,null,4,4]", output: "false" },
      { input: "root = []", output: "true" },
    ],
    constraints: ["0 <= number of nodes <= 5000", "-10^4 <= Node.val <= 10^4"],
    eli5:
      "Check every node to make sure its two sides aren't lopsided — one branch can't be more than one step taller than the other.",
    hints: [
      "Naively checking balance at each node and recomputing height is O(n^2).",
      "Do a single bottom-up pass returning height while detecting imbalance.",
      "Use a sentinel (like -1) to mean 'already unbalanced' and short-circuit upward.",
    ],
    approach:
      "Post-order DFS returning subtree height, or -1 if any subtree is unbalanced. If either child returns -1 or their heights differ by more than 1, propagate -1; otherwise return 1 + max(left, right).",
    solutions: {
      python: `# TreeNode: self.val, self.left, self.right
def is_balanced(root):
    def height(node):                  # -1 signals "unbalanced"
        if not node:
            return 0
        left = height(node.left)
        if left == -1:
            return -1
        right = height(node.right)
        if right == -1:
            return -1
        if abs(left - right) > 1:
            return -1
        return 1 + max(left, right)
    return height(root) != -1`,
      java: `// TreeNode { int val; TreeNode left, right; } provided by LeetCode
class Solution {
    public boolean isBalanced(TreeNode root) {
        return height(root) != -1;
    }

    private int height(TreeNode node) {          // -1 signals "unbalanced"
        if (node == null) return 0;
        int left = height(node.left);
        if (left == -1) return -1;
        int right = height(node.right);
        if (right == -1) return -1;
        if (Math.abs(left - right) > 1) return -1;
        return 1 + Math.max(left, right);
    }
}`,
    },
    timeComplexity: "O(n)",
    spaceComplexity: "O(h) recursion stack, h = tree height",
    companies: ["Amazon", "Microsoft", "Bloomberg"],
    leetcodeSlug: "balanced-binary-tree",
  },
];
