import type { Request, Response, NextFunction } from "express";
import { fail } from "../utils/response";

/**
 * In-memory token-bucket rate limiter.
 *
 * Sufficient for a single-instance monolith. Replace with Redis
 * if the API is later horizontally scaled.
 */
interface Bucket {
  tokens: number;
  updatedAt: number;
}

export interface RateLimitOptions {
  windowMs: number;     // window length in ms
  max: number;          // max requests per window per key
  keyFn?: (req: Request) => string;
}

const buckets = new Map<string, Bucket>();

export const rateLimit = (opts: RateLimitOptions) => {
  const { windowMs, max } = opts;
  const keyFn = opts.keyFn ?? ((req: Request) => req.ip ?? "anon");

  return (req: Request, res: Response, next: NextFunction): void => {
    const now = Date.now();
    const key = `${req.path}:${keyFn(req)}`;
    let b = buckets.get(key);

    if (!b) {
      b = { tokens: max - 1, updatedAt: now };
      buckets.set(key, b);
    } else {
      const elapsed = now - b.updatedAt;
      const refill = Math.floor((elapsed / windowMs) * max);
      if (refill > 0) {
        b.tokens = Math.min(max, b.tokens + refill);
        b.updatedAt = now;
      }
      if (b.tokens <= 0) {
        const reset = b.updatedAt + windowMs;
        res.setHeader("X-RateLimit-Limit", String(max));
        res.setHeader("X-RateLimit-Remaining", "0");
        res.setHeader("X-RateLimit-Reset", String(Math.floor(reset / 1000)));
        res.setHeader("Retry-After", String(Math.ceil((reset - now) / 1000)));
        fail(res, 429, "Terlalu banyak request, coba lagi nanti");
        return;
      }
      b.tokens -= 1;
    }

    res.setHeader("X-RateLimit-Limit", String(max));
    res.setHeader("X-RateLimit-Remaining", String(b.tokens));
    next();
  };
};
