import { describe, expect, it } from "vitest";
import { checkRateLimit, clientIp } from "./rateLimit";

describe("clientIp", () => {
  it("takes the first IP from x-forwarded-for", () => {
    const req = new Request("https://x/api/run", {
      headers: { "x-forwarded-for": "203.0.113.7, 70.41.3.18, 150.172.238.178" },
    });
    expect(clientIp(req)).toBe("203.0.113.7");
  });

  it("falls back to x-real-ip", () => {
    const req = new Request("https://x/api/run", { headers: { "x-real-ip": "198.51.100.2" } });
    expect(clientIp(req)).toBe("198.51.100.2");
  });

  it("falls back to 'anonymous' when no proxy headers are present", () => {
    expect(clientIp(new Request("https://x/api/run"))).toBe("anonymous");
  });
});

describe("checkRateLimit (fail-open when unconfigured)", () => {
  it("allows requests and reports disabled when Upstash env vars are absent", async () => {
    // No UPSTASH_REDIS_REST_URL/TOKEN in the test env → limiting is disabled.
    const result = await checkRateLimit("203.0.113.7");
    expect(result.allowed).toBe(true);
    expect(result.enabled).toBe(false);
  });
});

describe("checkRateLimit (with a configured limiter)", () => {
  it("allows and reports enabled when the limiter succeeds", async () => {
    const fake = {
      limit: async () => ({ success: true, limit: 10, remaining: 9, reset: Date.now() + 60_000 }),
    };
    const r = await checkRateLimit("1.2.3.4", fake);
    expect(r).toMatchObject({ allowed: true, enabled: true, limit: 10, remaining: 9 });
    expect(r.retryAfterSec).toBeGreaterThanOrEqual(0);
  });

  it("blocks with a Retry-After when the limiter denies", async () => {
    const fake = {
      limit: async () => ({ success: false, limit: 10, remaining: 0, reset: Date.now() + 30_000 }),
    };
    const r = await checkRateLimit("1.2.3.4", fake);
    expect(r.allowed).toBe(false);
    expect(r.retryAfterSec).toBeGreaterThan(0);
  });

  it("fails OPEN when the limiter throws (store outage)", async () => {
    const fake = {
      limit: async () => {
        throw new Error("redis unreachable");
      },
    };
    const r = await checkRateLimit("1.2.3.4", fake);
    expect(r.allowed).toBe(true);
    expect(r.enabled).toBe(false);
  });
});
