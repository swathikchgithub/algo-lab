// Domain types for AlgoLab. Pure data — no React, no side effects.

// ---------------------------------------------------------------------------
// Sections & patterns
// ---------------------------------------------------------------------------

/**
 * Sections in dependency order. The planner relies on this ordering to
 * sequence study weeks, so the array order is the source of truth.
 */
export const SECTIONS = [
  "Arrays",
  "Strings",
  "Linked Lists",
  "Stacks & Queues",
  "Binary Search",
  "Trees",
  "Heaps & Priority Queues",
  "Graphs",
  "Dynamic Programming",
  "Backtracking",
] as const;

export type Section = (typeof SECTIONS)[number];

export type Difficulty = "Easy" | "Medium" | "Hard";

// ---------------------------------------------------------------------------
// Questions
// ---------------------------------------------------------------------------

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface Solutions {
  python: string;
  java: string;
}

/** Languages a question's solutions / coding pad support. */
export const LANGUAGES = ["python", "java"] as const;
export type Language = (typeof LANGUAGES)[number];

export interface Question {
  id: string;
  title: string;
  section: Section;
  /** Pattern slug, e.g. "two-pointers" (keys into PATTERNS). */
  pattern: string;
  difficulty: Difficulty;
  description: string;
  examples: Example[];
  constraints: string[];
  /** Explain-like-I'm-5 analogy for this specific problem. */
  eli5: string;
  /** Exactly 3 progressive hints. */
  hints: [string, string, string];
  /** Plain-English strategy. */
  approach: string;
  solutions: Solutions;
  timeComplexity: string;
  spaceComplexity: string;
  companies: string[];
  leetcodeSlug: string;
  /** Content not yet authored — detail page shows a "coming soon" notice. */
  stub?: boolean;
}

export interface PatternMeta {
  slug: string;
  name: string;
  section: Section;
  /** One-line "what this pattern is" blurb. */
  blurb: string;
  /** ELI5 analogy (canonical, shared with the matching visualizer). */
  eli5: string;
  /** Emoji used in ELI5 panels. */
  emoji: string;
  /** When to reach for this pattern. */
  whenToUse: string;
  /** Template / skeleton code (language-agnostic pseudocode or JS). */
  template: string;
  /** Visualizer slug this pattern links to, if any. */
  visualizerSlug?: string;
}

// ---------------------------------------------------------------------------
// User progress (persisted)
// ---------------------------------------------------------------------------

export type QuestionStatus =
  | "Not started"
  | "Attempted"
  | "Solved"
  | "Needs review";

export type SelfGrade = "Got it" | "Struggled" | "Failed";

export interface GradeEvent {
  grade: SelfGrade;
  /** Epoch ms. */
  at: number;
}

export interface QuestionProgress {
  questionId: string;
  status: QuestionStatus;
  grades: GradeEvent[];
  /** Coding-pad drafts, keyed by language (e.g. "python", "java"). */
  scratchpad: Record<string, string>;
  bookmarked: boolean;
  /** Epoch ms of last interaction. */
  updatedAt: number;
}

// ---------------------------------------------------------------------------
// Visualizer frames
// ---------------------------------------------------------------------------

export type CellState =
  | "default"
  | "active" // in window / being considered — blue
  | "current" // mid / focus — amber
  | "visited"; // discarded / already seen — dimmed

/**
 * A single step of an algorithm animation. Produced by pure generators in
 * lib/algorithms and played by the generic <Stepper>.
 *
 * The <Stepper> itself only reads the common fields (highlightLine, variables,
 * caption, eli5Caption); the visual substrate is drawn by a per-visualizer
 * `renderStage` prop. Array-based visualizers use `pointers`/`cellStates`;
 * grid/tree/bucket/chart visualizers carry their substrate data in `view`.
 */
export interface Frame {
  /** 1-based line in the code panel to highlight. */
  highlightLine: number;
  /** Live variable readout. */
  variables: Record<string, string | number>;
  /** Condition under test, with explicit ✓/✗ — e.g. "9 < 13 ✗ → move left". */
  caption: string;
  /** Simpler caption shown while ELI5 mode is on. */
  eli5Caption: string;
  /** Named pointers (L, M, R, i, …) → cell index. Array substrate. */
  pointers?: Record<string, number>;
  /** Per-cell visual state, parallel to the input array. Array substrate. */
  cellStates?: CellState[];
  /**
   * Substrate-specific view data for non-array visualizers (grid cells, heap
   * tree, hash buckets, chart points, auxiliary stacks/queues). Each visualizer
   * module defines and casts its own typed shape.
   */
  view?: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Study planner (persisted)
// ---------------------------------------------------------------------------

export type Level = "Beginner" | "Intermediate" | "Advanced";

export interface PlanInputs {
  /** Number of weeks until the interview. */
  weeks: number;
  hoursPerWeek: number;
  level: Level;
  targetCompanies: string[];
}

export interface PlanWeek {
  /** 1-based week number. */
  week: number;
  /** Question ids scheduled for this week. */
  questionIds: string[];
  /** Sections primarily covered this week (for display). */
  sections: Section[];
}

export interface StudyPlan {
  inputs: PlanInputs;
  weeks: PlanWeek[];
  /** Epoch ms the plan was generated. */
  createdAt: number;
}
