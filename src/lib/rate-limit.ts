type RateLimitState = {
  count: number;
  resetAt: number;
};

type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
};

const buckets = new Map<string, RateLimitState>();
const MAX_BUCKETS = 5000;

function cleanupBuckets(now: number) {
  if (buckets.size <= MAX_BUCKETS) {
    return;
  }
  for (const [key, state] of buckets.entries()) {
    if (state.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

export function checkRateLimit(params: {
  key: string;
  limit: number;
  windowMs: number;
}): RateLimitResult {
  const now = Date.now();
  cleanupBuckets(now);

  const existing = buckets.get(params.key);
  if (!existing || existing.resetAt <= now) {
    const resetAt = now + params.windowMs;
    buckets.set(params.key, { count: 1, resetAt });
    return {
      allowed: true,
      limit: params.limit,
      remaining: params.limit - 1,
      resetAt,
      retryAfterSeconds: Math.ceil(params.windowMs / 1000),
    };
  }

  if (existing.count >= params.limit) {
    return {
      allowed: false,
      limit: params.limit,
      remaining: 0,
      resetAt: existing.resetAt,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((existing.resetAt - now) / 1000)
      ),
    };
  }

  existing.count += 1;
  return {
    allowed: true,
    limit: params.limit,
    remaining: Math.max(0, params.limit - existing.count),
    resetAt: existing.resetAt,
    retryAfterSeconds: Math.max(
      1,
      Math.ceil((existing.resetAt - now) / 1000)
    ),
  };
}

export function rateLimitHeaders(result: RateLimitResult) {
  return {
    "Retry-After": result.retryAfterSeconds.toString(),
    "X-RateLimit-Limit": result.limit.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": result.resetAt.toString(),
  };
}
