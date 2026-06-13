import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Per-IP rate limiting for /api/run, backed by Upstash Redis (shared state, so
// it works correctly across Vercel's stateless serverless instances — an
// in-memory counter would not).
//
// FAIL-OPEN: if the Upstash env vars are absent (local dev, or before the
// integration is provisioned), limiting is disabled and requests pass through.
// It activates automatically once UPSTASH_REDIS_REST_URL +
// UPSTASH_REDIS_REST_TOKEN are set in the environment.

const MAX_REQUESTS = 10;
const WINDOW = "60 s";

// undefined = not resolved yet; null = disabled (no env); else a configured limiter.
let limiter: Ratelimit | null | undefined;

function getLimiter(): Ratelimit | null {
  if (limiter !== undefined) return limiter;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    limiter = null; // not configured → fail open
    return null;
  }

  limiter = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(MAX_REQUESTS, WINDOW),
    prefix: "algolab:run",
    analytics: false,
  });
  return limiter;
}

/** Best-effort client IP from proxy headers (Vercel sets x-forwarded-for). */
export function clientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "anonymous";
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterSec: number;
  /** False when limiting is disabled (env not configured). */
  enabled: boolean;
}

/** Check (and consume) one token for this client. Fails open if not configured. */
export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  const l = getLimiter();
  if (!l) {
    return { allowed: true, limit: MAX_REQUESTS, remaining: MAX_REQUESTS, retryAfterSec: 0, enabled: false };
  }
  const { success, limit, remaining, reset } = await l.limit(ip);
  const retryAfterSec = Math.max(0, Math.ceil((reset - Date.now()) / 1000));
  return { allowed: success, limit, remaining, retryAfterSec, enabled: true };
}
