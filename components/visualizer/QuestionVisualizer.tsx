"use client";

import type { Frame } from "@/lib/types";
import {
  trappingRainWaterCode,
  trappingRainWaterFrames,
  type TrapView,
} from "@/lib/algorithms/trappingRainWater";
import { containerWaterCode, containerWaterFrames } from "@/lib/algorithms/containerWater";
import {
  sortedSquaresCode,
  sortedSquaresFrames,
  type SquaresView,
} from "@/lib/algorithms/sortedSquares";
import { moveZeroesCode, moveZeroesFrames, type ArrayMutView } from "@/lib/algorithms/moveZeroes";
import { sortColorsCode, sortColorsFrames } from "@/lib/algorithms/sortColors";
import { removeDuplicatesCode, removeDuplicatesFrames } from "@/lib/algorithms/removeDuplicates";
import { threeSumCode, threeSumFrames } from "@/lib/algorithms/threeSum";
import { searchRotatedCode, searchRotatedFrames } from "@/lib/algorithms/searchRotated";
import { findFirstLastCode, findFirstLastFrames } from "@/lib/algorithms/findFirstLast";
import {
  firstUniqueCharCode,
  firstUniqueCharFrames,
  type CharsView,
} from "@/lib/algorithms/firstUniqueChar";
import { validAnagramCode, validAnagramFrames, type AnagramView } from "@/lib/algorithms/validAnagram";
import { romanToIntCode, romanToIntFrames } from "@/lib/algorithms/romanToInt";
import { myAtoiCode, myAtoiFrames } from "@/lib/algorithms/myAtoi";
import {
  dailyTemperaturesCode,
  dailyTemperaturesFrames,
  type DailyTempView,
} from "@/lib/algorithms/dailyTemperatures";
import {
  asteroidCollisionCode,
  asteroidCollisionFrames,
  type AsteroidView,
} from "@/lib/algorithms/asteroidCollision";
import {
  binarySearchCode,
  searchInsertCode,
  binarySearchFrames,
} from "@/lib/algorithms/binarySearchBasic";
import { twoSumSortedCode, twoSumSortedFrames } from "@/lib/algorithms/twoSumSorted";
import { longestPalindromeCode, longestPalindromeFrames } from "@/lib/algorithms/longestPalindrome";
import {
  inorderCode,
  inorderFrames,
  preorderCode,
  preorderFrames,
  postorderCode,
  postorderFrames,
} from "@/lib/algorithms/treeTraversal";
import {
  maxDepthCode,
  maxDepthFrames,
  minDepthCode,
  minDepthFrames,
  diameterCode,
  diameterFrames,
  balancedCode,
  balancedFrames,
} from "@/lib/algorithms/treeProperties";
import { averageOfLevelsCode, averageOfLevelsFrames } from "@/lib/algorithms/treeLevelOrder";
import {
  reverseListCode,
  reverseListFrames,
  middleNodeCode,
  middleNodeFrames,
  hasCycleCode,
  hasCycleFrames,
} from "@/lib/algorithms/linkedListOps";
import { QuestionWalkthrough } from "./QuestionWalkthrough";
import { StringWalkthrough } from "./StringWalkthrough";
import { TreeWalkthrough } from "./TreeWalkthrough";
import { climbingStairsCode, climbingStairsFrames, type StairsView } from "@/lib/algorithms/climbingStairs";
import {
  nextGreaterElementCode,
  nextGreaterElementFrames,
  type NgeView,
} from "@/lib/algorithms/nextGreaterElement";
import { mergeListsCode, mergeListsFrames, type MergeView } from "@/lib/algorithms/mergeLists";
import { LinkedListWalkthrough } from "./LinkedListWalkthrough";
import { FloodFillVisualizer } from "./FloodFillVisualizer";

/** Parse a comma-separated numeric string into an array (for text-input arrays). */
const parseNums = (s: string): number[] =>
  s.split(",").map((t) => Number(t.trim())).filter((x) => Number.isFinite(x));
import type { LegendItem, StageRow } from "./MultiArrayStage";

// The supported-id set lives in a light standalone module so list pages can
// check it without bundling every frame generator. Re-exported here so existing
// importers (QuestionDetail) keep working. Each id needs a switch case below.
export { hasQuestionVisualizer } from "./supportedQuestions";

const TRAP_LEGEND: LegendItem[] = [
  { label: "pointer (l, r)", swatch: "bg-cell-current" },
  { label: "in play / water", swatch: "bg-cell-active" },
  { label: "processed", swatch: "bg-navy-800" },
];

const POINTER_LEGEND: LegendItem[] = [
  { label: "pointer (l, r)", swatch: "bg-cell-current" },
  { label: "in play", swatch: "bg-cell-active" },
  { label: "processed", swatch: "bg-navy-800" },
];

const RESULT_LEGEND: LegendItem[] = [
  { label: "pointer (l, r)", swatch: "bg-cell-current" },
  { label: "in play / filled", swatch: "bg-cell-active" },
  { label: "processed / empty", swatch: "bg-navy-800" },
];

const MOVE_LEGEND: LegendItem[] = [
  { label: "scan (i)", swatch: "bg-cell-current" },
  { label: "packed non-zeros", swatch: "bg-cell-active" },
  { label: "not yet scanned", swatch: "bg-navy-700" },
];

const SORT_LEGEND: LegendItem[] = [
  { label: "cursor (mid)", swatch: "bg-cell-current" },
  { label: "settled (0s, 2s)", swatch: "bg-cell-active" },
  { label: "unknown", swatch: "bg-navy-700" },
];

const DEDUPE_LEGEND: LegendItem[] = [
  { label: "read (i)", swatch: "bg-cell-current" },
  { label: "unique kept", swatch: "bg-cell-active" },
  { label: "not yet read", swatch: "bg-navy-700" },
];

const TRIPLET_LEGEND: LegendItem[] = [
  { label: "anchor (i)", swatch: "bg-cell-current" },
  { label: "window [l, r]", swatch: "bg-cell-active" },
  { label: "out of window", swatch: "bg-navy-800" },
];

const SEARCH_LEGEND: LegendItem[] = [
  { label: "mid", swatch: "bg-cell-current" },
  { label: "window [lo, hi]", swatch: "bg-cell-active" },
  { label: "discarded", swatch: "bg-navy-800" },
];

const SCAN_LEGEND: LegendItem[] = [
  { label: "cursor (i)", swatch: "bg-cell-current" },
  { label: "scanned", swatch: "bg-cell-active" },
  { label: "not yet read", swatch: "bg-navy-700" },
];

const ANAGRAM_LEGEND: LegendItem[] = [
  { label: "current char", swatch: "bg-cell-current" },
  { label: "processed", swatch: "bg-cell-active" },
  { label: "pending", swatch: "bg-navy-700" },
];

const STACK_LEGEND: LegendItem[] = [
  { label: "today (i) / stack top", swatch: "bg-cell-current" },
  { label: "waiting / resolved", swatch: "bg-cell-active" },
  { label: "untouched / empty", swatch: "bg-navy-700" },
];

const TREE_LEGEND: LegendItem[] = [
  { label: "current node", swatch: "bg-cell-current" },
  { label: "on stack / output", swatch: "bg-cell-active" },
  { label: "visited", swatch: "bg-navy-800" },
];

/** Single-row stage backed by the live (mutating) array in `frame.view.arr`. */
function mutatingRow(frame: Frame, label: string): StageRow {
  const view = frame.view as unknown as ArrayMutView;
  return {
    label,
    values: view.arr,
    cellStates: frame.cellStates ?? [],
    pointers: frame.pointers ?? {},
  };
}

/**
 * Maps a question id to its bespoke walkthrough. Returns null for ids without
 * one (the detail page then falls back to the generic pattern link). Adding a
 * question = a frame generator + a case here, no engine changes.
 */
export function QuestionVisualizer({ questionId }: { questionId: string }) {
  switch (questionId) {
    case "trapping-rain-water":
      return (
        <QuestionWalkthrough
          codeLines={trappingRainWaterCode}
          defaultInput={[4, 2, 0, 3, 2, 5]}
          patternSlug="two-pointers"
          generate={(input) => trappingRainWaterFrames(input).frames}
          legend={TRAP_LEGEND}
          rows={(frame: Frame, input) => {
            const view = frame.view as unknown as TrapView;
            return [
              {
                label: "height",
                values: input,
                cellStates: frame.cellStates ?? [],
                pointers: frame.pointers ?? {},
              },
              {
                label: "water",
                values: view.trapped,
                cellStates: view.trappedStates,
              },
            ];
          }}
        />
      );

    case "container-with-most-water":
      return (
        <QuestionWalkthrough
          codeLines={containerWaterCode}
          defaultInput={[1, 8, 6, 2, 5, 4, 8, 3, 7]}
          patternSlug="two-pointers"
          generate={(input) => containerWaterFrames(input).frames}
          legend={POINTER_LEGEND}
          rows={(frame: Frame, input) => [
            {
              label: "height",
              values: input,
              cellStates: frame.cellStates ?? [],
              pointers: frame.pointers ?? {},
            },
          ]}
        />
      );

    case "squares-of-sorted-array":
      return (
        <QuestionWalkthrough
          codeLines={sortedSquaresCode}
          defaultInput={[-4, -1, 0, 3, 10]}
          patternSlug="two-pointers"
          generate={(input) => sortedSquaresFrames(input).frames}
          legend={RESULT_LEGEND}
          rows={(frame: Frame, input): StageRow[] => {
            const view = frame.view as unknown as SquaresView;
            const p = frame.pointers ?? {};
            const numsPointers: Record<string, number> = {};
            if (p.L !== undefined) numsPointers.L = p.L;
            if (p.R !== undefined) numsPointers.R = p.R;
            return [
              {
                label: "nums",
                values: input,
                cellStates: frame.cellStates ?? [],
                pointers: numsPointers,
              },
              {
                // Unfilled slots (default state) render as an empty placeholder.
                label: "res",
                values: view.res.map((v, i) => (view.resStates[i] === "default" ? "·" : v)),
                cellStates: view.resStates,
                pointers: p.pos !== undefined ? { pos: p.pos } : {},
              },
            ];
          }}
        />
      );

    case "move-zeroes":
      return (
        <QuestionWalkthrough
          codeLines={moveZeroesCode}
          defaultInput={[0, 1, 0, 3, 12]}
          patternSlug="two-pointers"
          generate={(input) => moveZeroesFrames(input).frames}
          legend={MOVE_LEGEND}
          rows={(frame: Frame) => [mutatingRow(frame, "nums")]}
        />
      );

    case "sort-colors":
      return (
        <QuestionWalkthrough
          codeLines={sortColorsCode}
          defaultInput={[2, 0, 2, 1, 1, 0]}
          patternSlug="two-pointers"
          generate={(input) => sortColorsFrames(input).frames}
          legend={SORT_LEGEND}
          rows={(frame: Frame) => [mutatingRow(frame, "nums")]}
        />
      );

    case "remove-duplicates-sorted":
      return (
        <QuestionWalkthrough
          codeLines={removeDuplicatesCode}
          defaultInput={[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]}
          patternSlug="two-pointers"
          generate={(input) => removeDuplicatesFrames(input).frames}
          legend={DEDUPE_LEGEND}
          rows={(frame: Frame) => [mutatingRow(frame, "nums")]}
        />
      );

    case "three-sum":
      return (
        <QuestionWalkthrough
          codeLines={threeSumCode}
          defaultInput={[-1, 0, 1, 2, -1, -4]}
          patternSlug="two-pointers"
          generate={(input) => threeSumFrames(input).frames}
          legend={TRIPLET_LEGEND}
          rows={(frame: Frame) => [mutatingRow(frame, "nums")]}
        />
      );

    case "search-in-rotated-sorted-array":
      return (
        <QuestionWalkthrough
          codeLines={searchRotatedCode}
          defaultInput={[4, 5, 6, 7, 0, 1, 2]}
          param={{ label: "target", value: 0 }}
          patternSlug="binary-search"
          generate={(input, target) => searchRotatedFrames(input, target ?? 0).frames}
          legend={SEARCH_LEGEND}
          rows={(frame: Frame) => [mutatingRow(frame, "nums")]}
        />
      );

    case "find-first-and-last-position":
      return (
        <QuestionWalkthrough
          codeLines={findFirstLastCode}
          defaultInput={[5, 7, 7, 8, 8, 10]}
          param={{ label: "target", value: 8 }}
          patternSlug="binary-search"
          generate={(input, target) => findFirstLastFrames(input, target ?? 0).frames}
          legend={SEARCH_LEGEND}
          rows={(frame: Frame) => [mutatingRow(frame, "nums")]}
        />
      );

    case "first-unique-character":
      return (
        <StringWalkthrough
          codeLines={firstUniqueCharCode}
          defaultInput="leetcode"
          inputLabel="String"
          patternSlug="string-hashing"
          generate={(input) => firstUniqueCharFrames(input).frames}
          legend={SCAN_LEGEND}
          rows={(frame: Frame) => [
            {
              label: "s",
              values: (frame.view as unknown as CharsView).chars,
              cellStates: frame.cellStates ?? [],
              pointers: frame.pointers ?? {},
            },
          ]}
        />
      );

    case "daily-temperatures":
      return (
        <QuestionWalkthrough
          codeLines={dailyTemperaturesCode}
          defaultInput={[73, 74, 75, 71, 69, 72, 76, 73]}
          patternSlug="monotonic-stack"
          generate={(input) => dailyTemperaturesFrames(input).frames}
          legend={STACK_LEGEND}
          rows={(frame: Frame): StageRow[] => {
            const v = frame.view as unknown as DailyTempView;
            return [
              {
                label: "temps",
                values: v.temps,
                cellStates: v.tempStates,
                pointers: frame.pointers?.i !== undefined ? { i: frame.pointers.i } : {},
              },
              {
                label: "stack(idx)",
                values: v.stack,
                cellStates: v.stackStates,
                pointers: v.stack.length ? { top: v.stack.length - 1 } : {},
              },
              {
                label: "answer",
                values: v.res.map((n, k) => (v.resStates[k] === "default" ? "·" : n)),
                cellStates: v.resStates,
              },
            ];
          }}
        />
      );

    case "asteroid-collision":
      return (
        <QuestionWalkthrough
          codeLines={asteroidCollisionCode}
          defaultInput={[5, 10, -5]}
          patternSlug="monotonic-stack"
          generate={(input) => asteroidCollisionFrames(input).frames}
          legend={STACK_LEGEND}
          rows={(frame: Frame): StageRow[] => {
            const v = frame.view as unknown as AsteroidView;
            return [
              {
                label: "asteroids",
                values: v.asteroids,
                cellStates: v.astStates,
                pointers: frame.pointers?.i !== undefined ? { i: frame.pointers.i } : {},
              },
              {
                label: "stack",
                values: v.stack,
                cellStates: v.stackStates,
                pointers: v.stack.length ? { top: v.stack.length - 1 } : {},
              },
            ];
          }}
        />
      );

    case "two-sum-sorted":
      return (
        <QuestionWalkthrough
          codeLines={twoSumSortedCode}
          defaultInput={[2, 7, 11, 15]}
          param={{ label: "target", value: 9 }}
          patternSlug="two-pointers"
          generate={(input, target) => twoSumSortedFrames(input, target ?? 0).frames}
          legend={POINTER_LEGEND}
          rows={(frame: Frame) => [mutatingRow(frame, "numbers")]}
        />
      );

    case "binary-search":
      return (
        <QuestionWalkthrough
          codeLines={binarySearchCode}
          defaultInput={[-1, 0, 3, 5, 9, 12]}
          param={{ label: "target", value: 9 }}
          patternSlug="binary-search"
          generate={(input, target) => binarySearchFrames(input, target ?? 0, "find").frames}
          legend={SEARCH_LEGEND}
          rows={(frame: Frame) => [mutatingRow(frame, "nums")]}
        />
      );

    case "search-insert-position":
      return (
        <QuestionWalkthrough
          codeLines={searchInsertCode}
          defaultInput={[1, 3, 5, 6]}
          param={{ label: "target", value: 2 }}
          patternSlug="binary-search"
          generate={(input, target) => binarySearchFrames(input, target ?? 0, "insert").frames}
          legend={SEARCH_LEGEND}
          rows={(frame: Frame) => [mutatingRow(frame, "nums")]}
        />
      );

    case "longest-palindrome-rearrangement":
      return (
        <StringWalkthrough
          codeLines={longestPalindromeCode}
          defaultInput="abccccdd"
          inputLabel="String"
          patternSlug="string-hashing"
          generate={(input) => longestPalindromeFrames(input).frames}
          legend={ANAGRAM_LEGEND}
          rows={(frame: Frame) => [
            {
              label: "s",
              values: (frame.view as unknown as CharsView).chars,
              cellStates: frame.cellStates ?? [],
              pointers: frame.pointers ?? {},
            },
          ]}
        />
      );

    case "binary-tree-inorder-traversal":
      return (
        <TreeWalkthrough
          codeLines={inorderCode}
          defaultInput="1,null,2,3"
          patternSlug="tree-traversal"
          generate={(input) => inorderFrames(input).frames}
          legend={TREE_LEGEND}
        />
      );

    case "binary-tree-preorder-traversal":
      return (
        <TreeWalkthrough
          codeLines={preorderCode}
          defaultInput="1,null,2,3"
          patternSlug="tree-traversal"
          generate={(input) => preorderFrames(input).frames}
          legend={TREE_LEGEND}
        />
      );

    case "binary-tree-postorder-traversal":
      return (
        <TreeWalkthrough
          codeLines={postorderCode}
          defaultInput="1,null,2,3"
          patternSlug="tree-traversal"
          generate={(input) => postorderFrames(input).frames}
          legend={TREE_LEGEND}
        />
      );

    case "maximum-depth-of-binary-tree":
      return (
        <TreeWalkthrough
          codeLines={maxDepthCode}
          defaultInput="3,9,20,null,null,15,7"
          auxLabel="call stack"
          outputLabel="returns"
          patternSlug="tree-properties"
          generate={(input) => maxDepthFrames(input).frames}
          legend={TREE_LEGEND}
        />
      );

    case "minimum-depth-of-binary-tree":
      return (
        <TreeWalkthrough
          codeLines={minDepthCode}
          defaultInput="3,9,20,null,null,15,7"
          auxLabel="call stack"
          outputLabel="returns"
          patternSlug="tree-properties"
          generate={(input) => minDepthFrames(input).frames}
          legend={TREE_LEGEND}
        />
      );

    case "diameter-of-binary-tree":
      return (
        <TreeWalkthrough
          codeLines={diameterCode}
          defaultInput="1,2,3,4,5"
          auxLabel="call stack"
          outputLabel="heights"
          patternSlug="tree-properties"
          generate={(input) => diameterFrames(input).frames}
          legend={TREE_LEGEND}
        />
      );

    case "balanced-binary-tree":
      return (
        <TreeWalkthrough
          codeLines={balancedCode}
          defaultInput="3,9,20,null,null,15,7"
          auxLabel="call stack"
          outputLabel="returns"
          patternSlug="tree-properties"
          generate={(input) => balancedFrames(input).frames}
          legend={TREE_LEGEND}
        />
      );

    case "average-of-levels-in-binary-tree":
      return (
        <TreeWalkthrough
          codeLines={averageOfLevelsCode}
          defaultInput="3,9,20,null,null,15,7"
          auxLabel="queue"
          outputLabel="averages"
          patternSlug="tree-traversal"
          generate={(input) => averageOfLevelsFrames(input).frames}
          legend={TREE_LEGEND}
        />
      );

    case "flood-fill":
      return <FloodFillVisualizer />;

    case "merge-two-sorted-lists":
      return (
        <StringWalkthrough
          codeLines={mergeListsCode}
          defaultInput="1,2,4"
          inputLabel="list1"
          param={{ label: "list2", value: "1,3,4" }}
          patternSlug="linked-list"
          generate={(s, t) => mergeListsFrames(parseNums(s), parseNums(t ?? "")).frames}
          legend={POINTER_LEGEND}
          rows={(frame: Frame): StageRow[] => {
            const v = frame.view as unknown as MergeView;
            return [
              { label: "list1", values: v.list1, cellStates: v.list1States },
              { label: "list2", values: v.list2, cellStates: v.list2States },
              { label: "merged", values: v.merged, cellStates: v.mergedStates },
            ];
          }}
        />
      );

    case "climbing-stairs":
      return (
        <StringWalkthrough
          codeLines={climbingStairsCode}
          defaultInput="5"
          inputLabel="n (number of stairs)"
          patternSlug="dynamic-programming"
          generate={(input) => climbingStairsFrames(Number(input) || 1).frames}
          legend={SCAN_LEGEND}
          rows={(frame: Frame) => {
            const v = frame.view as unknown as StairsView;
            return [
              {
                label: "ways",
                values: v.dp.map((n, k) => (v.dpStates[k] === "default" ? "·" : n)),
                cellStates: v.dpStates,
              },
            ];
          }}
        />
      );

    case "next-greater-element-i":
      return (
        <StringWalkthrough
          codeLines={nextGreaterElementCode}
          defaultInput="4,1,2"
          inputLabel="nums1"
          param={{ label: "nums2", value: "1,3,4,2" }}
          patternSlug="monotonic-stack"
          generate={(s, t) => nextGreaterElementFrames(parseNums(s), parseNums(t ?? "")).frames}
          legend={STACK_LEGEND}
          rows={(frame: Frame): StageRow[] => {
            const v = frame.view as unknown as NgeView;
            return [
              { label: "nums2", values: v.nums2, cellStates: v.nums2States },
              { label: "stack", values: v.stack, cellStates: v.stackStates },
              { label: "nums1", values: v.nums1, cellStates: v.nums1States },
              { label: "ans", values: v.ans, cellStates: v.ansStates },
            ];
          }}
        />
      );

    case "reverse-linked-list":
      return (
        <LinkedListWalkthrough
          codeLines={reverseListCode}
          defaultInput={[1, 2, 3, 4, 5]}
          patternSlug="linked-list"
          generate={(input) => reverseListFrames(input).frames}
        />
      );

    case "middle-of-the-linked-list":
      return (
        <LinkedListWalkthrough
          codeLines={middleNodeCode}
          defaultInput={[1, 2, 3, 4, 5]}
          patternSlug="linked-list"
          generate={(input) => middleNodeFrames(input).frames}
        />
      );

    case "linked-list-cycle":
      return (
        <LinkedListWalkthrough
          codeLines={hasCycleCode}
          defaultInput={[3, 2, 0, -4]}
          param={{ label: "pos (cycle idx, -1 = none)", value: 1 }}
          patternSlug="linked-list"
          generate={(input, pos) => hasCycleFrames(input, pos ?? -1).frames}
        />
      );

    case "string-to-integer-atoi":
      return (
        <StringWalkthrough
          codeLines={myAtoiCode}
          defaultInput="   -42"
          inputLabel="String"
          trim={false}
          patternSlug="string-hashing"
          generate={(input) => myAtoiFrames(input).frames}
          legend={SCAN_LEGEND}
          rows={(frame: Frame) => [
            {
              label: "s",
              values: (frame.view as unknown as CharsView).chars.map((c) => (c === " " ? "␣" : c)),
              cellStates: frame.cellStates ?? [],
              pointers: frame.pointers ?? {},
            },
          ]}
        />
      );

    case "roman-to-integer":
      return (
        <StringWalkthrough
          codeLines={romanToIntCode}
          defaultInput="MCMXCIV"
          inputLabel="Roman numeral"
          patternSlug="string-hashing"
          generate={(input) => romanToIntFrames(input).frames}
          legend={SCAN_LEGEND}
          rows={(frame: Frame) => [
            {
              label: "s",
              values: (frame.view as unknown as CharsView).chars,
              cellStates: frame.cellStates ?? [],
              pointers: frame.pointers ?? {},
            },
          ]}
        />
      );

    case "valid-anagram":
      return (
        <StringWalkthrough
          codeLines={validAnagramCode}
          defaultInput="anagram"
          inputLabel="s"
          param={{ label: "t", value: "nagaram" }}
          patternSlug="string-hashing"
          generate={(s, t) => validAnagramFrames(s, t ?? "").frames}
          legend={ANAGRAM_LEGEND}
          rows={(frame: Frame): StageRow[] => {
            const v = frame.view as unknown as AnagramView;
            return [
              {
                label: "s",
                values: v.s,
                cellStates: v.sStates,
                pointers: v.sPtr !== null ? { i: v.sPtr } : {},
              },
              {
                label: "t",
                values: v.t,
                cellStates: v.tStates,
                pointers: v.tPtr !== null ? { i: v.tPtr } : {},
              },
            ];
          }}
        />
      );

    default:
      return null;
  }
}
