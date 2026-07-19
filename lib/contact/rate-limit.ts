/* ---------------------------------------------------------------------------
   Fixed-window rate limiter.

   IMPORTANT — read before relying on this in production.

   State lives in the module scope of a single serverless instance. On Vercel
   that means it holds for as long as an instance stays warm and is enforced
   per instance, not globally: a determined attacker hitting a scaled-out
   deployment can exceed the limit by landing on cold instances.

   It is therefore a courtesy throttle against casual abuse and accidental
   double-submits — which, combined with the honeypot and Zod validation, is
   proportionate for a portfolio contact form. For a hard global guarantee,
   swap `hit()` for a Redis-backed counter (Upstash and Vercel KV both expose
   an atomic INCR with TTL); the call site does not need to change.
   --------------------------------------------------------------------------- */

export type RateLimitResult = {
  ok: boolean;
  /** Submissions left in the current window. */
  remaining: number;
  /** Seconds until the window resets — surfaced as Retry-After. */
  retryAfter: number;
};

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_PER_WINDOW = 5;
/** Guards against unbounded growth if the instance stays warm a long time. */
const MAX_TRACKED_KEYS = 5_000;

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

function sweep(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
  // If a flood still leaves the map oversized, drop the oldest entries.
  if (buckets.size > MAX_TRACKED_KEYS) {
    const excess = buckets.size - MAX_TRACKED_KEYS;
    let i = 0;
    for (const key of buckets.keys()) {
      if (i++ >= excess) break;
      buckets.delete(key);
    }
  }
}

export function hit(key: string): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, remaining: MAX_PER_WINDOW - 1, retryAfter: 0 };
  }

  existing.count += 1;
  const retryAfter = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));

  if (existing.count > MAX_PER_WINDOW) {
    return { ok: false, remaining: 0, retryAfter };
  }
  return {
    ok: true,
    remaining: Math.max(0, MAX_PER_WINDOW - existing.count),
    retryAfter,
  };
}

/**
 * Best-effort client identity. Vercel populates `x-forwarded-for`; the first
 * entry is the original client. Falls back to a shared bucket so a missing
 * header degrades to throttling rather than to no limit at all.
 */
export function clientKey(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return headers.get("x-real-ip") ?? "unknown";
}

/** Exposed for tests and for documenting the policy at the call site. */
export const RATE_LIMIT_POLICY = {
  windowMs: WINDOW_MS,
  max: MAX_PER_WINDOW,
} as const;
