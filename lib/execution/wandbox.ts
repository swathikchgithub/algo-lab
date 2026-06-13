import type { Language } from "@/lib/types";
import type { RunRequest, RunResult } from "./types";

// Server-side adapter for the Wandbox public code-execution API
// (https://github.com/melpon/wandbox / https://wandbox.org/api/). Keyless — no
// secret to store. Runs only inside the /api/run route handler, never in the
// browser. (We moved off Piston after its public API became whitelist-only in
// Feb 2026; execution is intentionally behind this swappable adapter.)

const WANDBOX_BASE = "https://wandbox.org/api";
const EXEC_TIMEOUT_MS = 20_000;

// Known-good compilers; used as fallbacks if dynamic resolution fails.
const FALLBACK_COMPILER: Record<Language, string> = {
  python: "cpython-3.14.0",
  java: "openjdk-jdk-22+36",
};

// Wandbox names the source file `prog.<ext>`, so a top-level `public class` can't
// match the filename. Strip the `public` modifier so the common `public class
// Main { ... }` stub compiles. (javac allows at most one public top-level class.)
function prepareSource(language: Language, source: string): string {
  if (language !== "java") return source;
  return source.replace(/\bpublic\s+class\b/, "class");
}

interface WandboxCompiler {
  name: string;
  language: string;
}

let compilersCache: Promise<Record<Language, string>> | null = null;

async function resolveCompilers(): Promise<Record<Language, string>> {
  if (!compilersCache) {
    compilersCache = fetch(`${WANDBOX_BASE}/list.json`, { signal: AbortSignal.timeout(EXEC_TIMEOUT_MS) })
      .then(async (r) => (r.ok ? ((await r.json()) as WandboxCompiler[]) : []))
      .then((list) => ({
        python: pick(list, "Python", "cpython-3", FALLBACK_COMPILER.python),
        java: pick(list, "Java", "openjdk-jdk-", FALLBACK_COMPILER.java),
      }))
      .catch(() => ({ ...FALLBACK_COMPILER }));
  }
  return compilersCache;
}

/** Prefer the fallback if Wandbox still offers it; otherwise the first match. */
function pick(list: WandboxCompiler[], lang: string, prefix: string, fallback: string): string {
  const inLang = list.filter((c) => c.language === lang);
  if (inLang.some((c) => c.name === fallback)) return fallback;
  return inLang.find((c) => c.name.startsWith(prefix))?.name ?? fallback;
}

interface WandboxResponse {
  status?: string | number;
  program_output?: string;
  program_error?: string;
  compiler_error?: string;
  compiler_message?: string;
}

const TRANSIENT = /Resource temporarily unavailable|OCI runtime/i;

/** Execute source via Wandbox, retrying once on a transient sandbox error. */
export async function runCodeOnService(req: RunRequest): Promise<RunResult> {
  const compilers = await resolveCompilers();
  const body = JSON.stringify({
    code: prepareSource(req.language, req.source),
    compiler: compilers[req.language],
    stdin: req.stdin ?? "",
  });

  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await execute(body);
    if ("error" in res) return errorResult(res.error);

    const data = res.data;
    const transient = TRANSIENT.test(data.compiler_message ?? "") || TRANSIENT.test(data.compiler_error ?? "");
    if (transient && attempt === 0) {
      await delay(1200);
      continue;
    }
    return normalize(data);
  }
  return errorResult("The execution service is busy. Please try again.");
}

async function execute(body: string): Promise<{ data: WandboxResponse } | { error: string }> {
  try {
    const res = await fetch(`${WANDBOX_BASE}/compile.json`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      signal: AbortSignal.timeout(EXEC_TIMEOUT_MS),
      body,
    });
    if (!res.ok) return { error: `Execution service error (${res.status}).` };
    return { data: (await res.json()) as WandboxResponse };
  } catch {
    return { error: "Could not reach the execution service. Try again." };
  }
}

function normalize(data: WandboxResponse): RunResult {
  const exitCode = data.status === undefined ? null : Number(data.status);
  const stderr = [data.compiler_error, data.program_error].filter(Boolean).join("\n").trim();
  return {
    stdout: data.program_output ?? "",
    stderr,
    exitCode: Number.isNaN(exitCode) ? null : exitCode,
    ok: exitCode === 0,
  };
}

function errorResult(error: string): RunResult {
  return { stdout: "", stderr: "", exitCode: null, ok: false, error };
}

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
