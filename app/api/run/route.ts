import { NextResponse } from "next/server";
import { LANGUAGES, type Language } from "@/lib/types";
import { MAX_SOURCE_BYTES, MAX_STDIN_BYTES, type RunRequest } from "@/lib/execution/types";
import { runCodeOnService } from "@/lib/execution/wandbox";
import { checkRateLimit, clientIp } from "@/lib/execution/rateLimit";

export const runtime = "nodejs";

// POST /api/run — execute user code via the Wandbox proxy.
// Validates strictly at the boundary (fail fast), then rate-limits per IP,
// before touching the execution service.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return bad("Request body must be valid JSON.");
  }

  const parsed = validate(body);
  if ("error" in parsed) return bad(parsed.error);

  // Throttle per client IP (no-op until Upstash env vars are configured).
  const rl = await checkRateLimit(clientIp(request));
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Rate limit reached (${rl.limit} runs/min). Try again in ${rl.retryAfterSec}s.` },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  const result = await runCodeOnService(parsed.value);
  // Always 200 — execution outcomes (compile errors, non-zero exit) live in the body.
  return NextResponse.json(result);
}

type Validated = { value: RunRequest } | { error: string };

function validate(body: unknown): Validated {
  if (typeof body !== "object" || body === null) return { error: "Expected a JSON object." };
  const { language, source, stdin } = body as Record<string, unknown>;

  if (typeof language !== "string" || !LANGUAGES.includes(language as Language)) {
    return { error: `Language must be one of: ${LANGUAGES.join(", ")}.` };
  }
  if (typeof source !== "string" || source.trim().length === 0) {
    return { error: "Source code is required." };
  }
  if (byteLength(source) > MAX_SOURCE_BYTES) {
    return { error: "Source code is too large." };
  }
  if (stdin !== undefined && (typeof stdin !== "string" || byteLength(stdin) > MAX_STDIN_BYTES)) {
    return { error: "Invalid or oversized stdin." };
  }

  return { value: { language: language as Language, source, stdin: stdin as string | undefined } };
}

function byteLength(s: string): number {
  return new TextEncoder().encode(s).length;
}

function bad(error: string) {
  return NextResponse.json({ error }, { status: 400 });
}
