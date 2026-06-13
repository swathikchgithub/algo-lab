import type { Question } from "@/lib/types";

// Section 3: Linked Lists — Pattern: linked-list
export const linkedListsQuestions: Question[] = [
  {
    id: "reverse-linked-list",
    title: "Reverse Linked List",
    section: "Linked Lists",
    pattern: "linked-list",
    difficulty: "Easy",
    description:
      "Given the head of a singly linked list, reverse the list and return the new head.",
    examples: [
      { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" },
      { input: "head = [1,2]", output: "[2,1]" },
      { input: "head = []", output: "[]" },
    ],
    constraints: ["0 <= number of nodes <= 5000", "-5000 <= Node.val <= 5000"],
    eli5:
      "Walk down a line of people each pointing to the next. As you pass each one, turn them around to point back at the person you just left.",
    hints: [
      "Keep a 'prev' pointer that trails behind the node you're currently at.",
      "Before rewiring, save the next node so you don't lose the rest of the list.",
      "When you fall off the end, 'prev' is the new head.",
    ],
    approach:
      "Iterate with prev=None and curr=head. At each step, remember next, point curr.next back to prev, then advance prev and curr. Return prev.",
    solutions: {
      python: `def reverse_list(head):
    prev = None
    curr = head
    while curr:
        nxt = curr.next      # save the rest of the list
        curr.next = prev     # flip the pointer backward
        prev = curr          # advance prev
        curr = nxt           # advance curr
    return prev              # prev is the new head`,
      java: `class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode curr = head;
        while (curr != null) {
            ListNode next = curr.next; // save the rest of the list
            curr.next = prev;          // flip the pointer backward
            prev = curr;               // advance prev
            curr = next;               // advance curr
        }
        return prev;                   // prev is the new head
    }
}`,
    },
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    companies: ["Amazon", "Microsoft", "Apple"],
    leetcodeSlug: "reverse-linked-list",
  },
  {
    id: "merge-two-sorted-lists",
    title: "Merge Two Sorted Lists",
    section: "Linked Lists",
    pattern: "linked-list",
    difficulty: "Easy",
    description:
      "Merge two sorted linked lists into one sorted list by splicing together their nodes. Return the head of the merged list.",
    examples: [
      { input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]" },
      { input: "list1 = [], list2 = []", output: "[]" },
      { input: "list1 = [], list2 = [0]", output: "[0]" },
    ],
    constraints: ["0 <= nodes in each list <= 50", "-100 <= Node.val <= 100", "Both lists sorted ascending"],
    eli5:
      "Two sorted stacks of cards face up. Repeatedly take the smaller top card and add it to your new pile.",
    hints: [
      "Use a dummy head node so you don't special-case the first append.",
      "Compare the two front nodes and splice the smaller one onto the tail.",
      "When one list runs out, attach whatever remains of the other.",
    ],
    approach:
      "Create a dummy node and a tail pointer. While both lists have nodes, attach the smaller head to tail and advance. Finally attach the non-empty remainder.",
    solutions: {
      python: `def merge_two_lists(list1, list2):
    dummy = ListNode()       # sentinel to simplify edge cases
    tail = dummy
    while list1 and list2:
        if list1.val <= list2.val:
            tail.next = list1
            list1 = list1.next
        else:
            tail.next = list2
            list2 = list2.next
        tail = tail.next
    tail.next = list1 or list2  # attach the leftover tail
    return dummy.next`,
      java: `class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        ListNode dummy = new ListNode(); // sentinel to simplify edge cases
        ListNode tail = dummy;
        while (list1 != null && list2 != null) {
            if (list1.val <= list2.val) {
                tail.next = list1;
                list1 = list1.next;
            } else {
                tail.next = list2;
                list2 = list2.next;
            }
            tail = tail.next;
        }
        tail.next = (list1 != null) ? list1 : list2; // attach the leftover tail
        return dummy.next;
    }
}`,
    },
    timeComplexity: "O(n + m)",
    spaceComplexity: "O(1)",
    companies: ["Amazon", "Microsoft", "Apple"],
    leetcodeSlug: "merge-two-sorted-lists",
  },
  {
    id: "linked-list-cycle",
    title: "Linked List Cycle",
    section: "Linked Lists",
    pattern: "linked-list",
    difficulty: "Easy",
    description:
      "Given the head of a linked list, determine if it contains a cycle (some node is revisited by following next pointers).",
    examples: [
      { input: "head = [3,2,0,-4], pos = 1", output: "true", explanation: "Tail connects back to index 1." },
      { input: "head = [1,2], pos = 0", output: "true" },
      { input: "head = [1], pos = -1", output: "false" },
    ],
    constraints: ["0 <= number of nodes <= 10^4", "-10^5 <= Node.val <= 10^5"],
    eli5:
      "Two runners on a track, one twice as fast. If the track loops, the fast one eventually laps and meets the slow one; on a straight track it just runs off the end.",
    hints: [
      "Use two pointers moving at different speeds (Floyd's tortoise and hare).",
      "Advance slow by 1 and fast by 2 each step.",
      "If fast ever equals slow there's a cycle; if fast hits null there isn't.",
    ],
    approach:
      "Floyd's cycle detection: a slow pointer moves one step, a fast pointer two. If they meet, there's a cycle; if fast reaches the end, there isn't.",
    solutions: {
      python: `def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next         # one step
        fast = fast.next.next    # two steps
        if slow is fast:         # they met -> cycle
            return True
    return False`,
      java: `class Solution {
    public boolean hasCycle(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;        // one step
            fast = fast.next.next;   // two steps
            if (slow == fast) {      // they met -> cycle
                return true;
            }
        }
        return false;
    }
}`,
    },
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    companies: ["Amazon", "Microsoft", "Bloomberg"],
    leetcodeSlug: "linked-list-cycle",
  },
  {
    id: "middle-of-the-linked-list",
    title: "Middle of the Linked List",
    section: "Linked Lists",
    pattern: "linked-list",
    difficulty: "Easy",
    description:
      "Given the head of a singly linked list, return the middle node. If there are two middle nodes, return the second one.",
    examples: [
      { input: "head = [1,2,3,4,5]", output: "[3,4,5]", explanation: "Middle node is 3." },
      { input: "head = [1,2,3,4,5,6]", output: "[4,5,6]", explanation: "Two middles; return the second." },
    ],
    constraints: ["1 <= number of nodes <= 100", "1 <= Node.val <= 100"],
    eli5:
      "Two walkers start together; one takes double steps. When the fast one reaches the end, the slow one is exactly halfway.",
    hints: [
      "Two pointers again: slow moves 1, fast moves 2.",
      "When fast falls off the end, slow sits at the middle.",
      "The loop condition determines which middle you land on for even lengths.",
    ],
    approach:
      "Slow/fast pointers from the head. Advance slow by one and fast by two until fast (or fast.next) is null. Slow is the middle.",
    solutions: {
      python: `def middle_node(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next         # one step
        fast = fast.next.next    # two steps
    return slow                  # slow is the (second) middle`,
      java: `class Solution {
    public ListNode middleNode(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;        // one step
            fast = fast.next.next;   // two steps
        }
        return slow;                 // slow is the (second) middle
    }
}`,
    },
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    companies: ["Amazon", "Google"],
    leetcodeSlug: "middle-of-the-linked-list",
  },
  {
    id: "remove-nth-node-from-end-of-list",
    title: "Remove Nth Node From End of List",
    section: "Linked Lists",
    pattern: "linked-list",
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
    leetcodeSlug: "remove-nth-node-from-end-of-list",
  },
  {
    id: "reorder-list",
    title: "Reorder List",
    section: "Linked Lists",
    pattern: "linked-list",
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
    companies: ["Amazon", "Meta"],
    leetcodeSlug: "reorder-list",
  },
  {
    id: "add-two-numbers",
    title: "Add Two Numbers",
    section: "Linked Lists",
    pattern: "linked-list",
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
    leetcodeSlug: "add-two-numbers",
  },
  {
    id: "copy-list-with-random-pointer",
    title: "Copy List with Random Pointer",
    section: "Linked Lists",
    pattern: "linked-list",
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
    companies: ["Amazon", "Meta", "Microsoft"],
    leetcodeSlug: "copy-list-with-random-pointer",
  },
];
