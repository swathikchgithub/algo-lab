// Single persistence interface for AlgoLab.
//
// v1 persists to localStorage, but components depend only on the
// `StorageAdapter` abstraction (Dependency Inversion) so a DB/auth-backed
// adapter can be swapped in later without touching the UI. Never call
// localStorage directly from a component — always go through `storage`.

import type { Language, QuestionProgress, QuestionStatus, SelfGrade, StudyPlan } from "./types";

export interface StorageAdapter {
  getProgress(questionId: string): QuestionProgress | null;
  getAllProgress(): QuestionProgress[];
  setStatus(questionId: string, status: QuestionStatus): void;
  /** Persist the coding-pad draft for one language. */
  setScratchpad(questionId: string, language: Language, draft: string): void;
  /** Read the coding-pad draft for one language (empty string if none). */
  getScratchpad(questionId: string, language: Language): string;
  toggleBookmark(questionId: string): void;
  addGrade(questionId: string, grade: SelfGrade): void;

  getPlan(): StudyPlan | null;
  setPlan(plan: StudyPlan): void;
  clearPlan(): void;
}

const PROGRESS_KEY = "algolab:progress";
const PLAN_KEY = "algolab:plan";

function emptyProgress(questionId: string): QuestionProgress {
  return {
    questionId,
    status: "Not started",
    grades: [],
    scratchpad: {},
    bookmarked: false,
    updatedAt: 0,
  };
}

/** Tolerate legacy progress where `scratchpad` was a single string. */
function drafts(p: QuestionProgress): Record<string, string> {
  if (typeof p.scratchpad === "string") return {};
  return p.scratchpad ?? {};
}

/**
 * localStorage-backed adapter. SSR-safe: every access guards on `window`,
 * returning empty data on the server so Next.js can render without a DOM.
 */
class LocalStorageAdapter implements StorageAdapter {
  private readProgressMap(): Record<string, QuestionProgress> {
    if (typeof window === "undefined") return {};
    try {
      const raw = window.localStorage.getItem(PROGRESS_KEY);
      return raw ? (JSON.parse(raw) as Record<string, QuestionProgress>) : {};
    } catch {
      return {};
    }
  }

  private writeProgressMap(map: Record<string, QuestionProgress>): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(map));
    } catch {
      /* quota / private mode — fail silently in v1 */
    }
  }

  private mutate(
    questionId: string,
    fn: (p: QuestionProgress) => void,
  ): void {
    const map = this.readProgressMap();
    const current = map[questionId] ?? emptyProgress(questionId);
    fn(current);
    current.updatedAt = now();
    map[questionId] = current;
    this.writeProgressMap(map);
  }

  getProgress(questionId: string): QuestionProgress | null {
    return this.readProgressMap()[questionId] ?? null;
  }

  getAllProgress(): QuestionProgress[] {
    return Object.values(this.readProgressMap());
  }

  setStatus(questionId: string, status: QuestionStatus): void {
    this.mutate(questionId, (p) => {
      p.status = status;
    });
  }

  setScratchpad(questionId: string, language: Language, draft: string): void {
    this.mutate(questionId, (p) => {
      p.scratchpad = { ...drafts(p), [language]: draft };
    });
  }

  getScratchpad(questionId: string, language: Language): string {
    const p = this.getProgress(questionId);
    return p ? (drafts(p)[language] ?? "") : "";
  }

  toggleBookmark(questionId: string): void {
    this.mutate(questionId, (p) => {
      p.bookmarked = !p.bookmarked;
    });
  }

  addGrade(questionId: string, grade: SelfGrade): void {
    this.mutate(questionId, (p) => {
      p.grades.push({ grade, at: now() });
      // A grade implies the question was at least attempted.
      if (grade === "Got it") p.status = "Solved";
      else p.status = "Needs review";
    });
  }

  getPlan(): StudyPlan | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(PLAN_KEY);
      return raw ? (JSON.parse(raw) as StudyPlan) : null;
    } catch {
      return null;
    }
  }

  setPlan(plan: StudyPlan): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(PLAN_KEY, JSON.stringify(plan));
    } catch {
      /* ignore */
    }
  }

  clearPlan(): void {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(PLAN_KEY);
  }
}

/** Epoch ms. Wrapped so tests can stay deterministic if needed. */
function now(): number {
  return Date.now();
}

/** The single storage instance the app uses. */
export const storage: StorageAdapter = new LocalStorageAdapter();
