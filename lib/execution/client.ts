"use client";

import type { RunRequest, RunResult } from "./types";

// Browser-side caller for the execution backend. Components depend on this, not
// on Piston directly — the API route is the single seam to the execution service.
export async function runCode(req: RunRequest): Promise<RunResult> {
  let res: Response;
  try {
    res = await fetch("/api/run", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(req),
    });
  } catch {
    return { stdout: "", stderr: "", exitCode: null, ok: false, error: "Network error — could not run." };
  }

  const data = (await res.json().catch(() => ({}))) as Partial<RunResult> & { error?: string };
  if (!res.ok) {
    return { stdout: "", stderr: "", exitCode: null, ok: false, error: data.error ?? "Run failed." };
  }
  return {
    stdout: data.stdout ?? "",
    stderr: data.stderr ?? "",
    exitCode: data.exitCode ?? null,
    ok: Boolean(data.ok),
    error: data.error,
  };
}
