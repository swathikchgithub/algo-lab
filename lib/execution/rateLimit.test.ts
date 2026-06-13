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
