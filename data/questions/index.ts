import type { Question, Section } from "@/lib/types";
import { SECTIONS } from "@/lib/types";
import { arraysQuestions } from "./arrays";
import { stringsQuestions } from "./strings";
import { linkedListsQuestions } from "./linked-lists";
import { stacksQuestions } from "./stacks";
import { binarySearchQuestions } from "./binary-search";
import { treesQuestions } from "./trees";
import { heapsQuestions } from "./heaps";
import { graphsQuestions } from "./graphs";
import { dynamicProgrammingQuestions } from "./dynamic-programming";
import { backtrackingQuestions } from "./backtracking";

// Single flat list of every question, assembled in section-dependency order.
export const QUESTIONS: Question[] = [
  ...arraysQuestions,
  ...stringsQuestions,
  ...linkedListsQuestions,
  ...stacksQuestions,
  ...binarySearchQuestions,
  ...treesQuestions,
  ...heapsQuestions,
  ...graphsQuestions,
  ...dynamicProgrammingQuestions,
  ...backtrackingQuestions,
];

// O(1) id lookup.
const BY_ID = new Map<string, Question>(QUESTIONS.map((q) => [q.id, q]));

export function getQuestion(id: string): Question | undefined {
  return BY_ID.get(id);
}

export function questionsBySection(section: Section): Question[] {
  return QUESTIONS.filter((q) => q.section === section);
}

/** Sections that actually contain questions, in dependency order. */
export function orderedSections(): Section[] {
  return SECTIONS.filter((s) => QUESTIONS.some((q) => q.section === s));
}

/** Distinct company tags across the bank, sorted for stable filter UIs. */
export function allCompanies(): string[] {
  const set = new Set<string>();
  for (const q of QUESTIONS) for (const c of q.companies) set.add(c);
  return [...set].sort();
}
