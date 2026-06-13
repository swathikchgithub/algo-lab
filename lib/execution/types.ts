import type { Language } from "@/lib/types";

// Contract between the coding-pad UI and the code-execution backend.

export interface RunRequest {
  language: Language;
  source: string;
  stdin?: string;
}

export interface RunResult {
  stdout: string;
  stderr: string;
  /** Process exit code, or null if it never ran (e.g. compile error). */
  exitCode: number | null;
  /** True when the program compiled and ran (exit code 0). */
  ok: boolean;
  /** Set when the request itself failed (network, validation, timeout). */
  error?: string;
}

/** Hard limits enforced at the boundary (defense against abuse / runaway input). */
export const MAX_SOURCE_BYTES = 50_000;
export const MAX_STDIN_BYTES = 10_000;
