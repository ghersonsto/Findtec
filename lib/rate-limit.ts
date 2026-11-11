/**
 * Rate limit en memoria (mejor esfuerzo en Vercel).
 * En serverless el estado no es global entre instancias; sirve como freno básico.
 */

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

const MAX_KEYS = 5_000;

function pruneIfNeeded() {
  if (buckets.size < MAX_KEYS) return;
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
  if (buckets.size < MAX_KEYS) return;
  // Evacuar entradas antiguas si sigue saturado
  const overflow = buckets.size - Math.floor(MAX_KEYS * 0.7);
  let removed = 0;
  for (const key of buckets.keys()) {
    buckets.delete(key);
    removed += 1;
    if (removed >= overflow) break;
  }
}

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfterSec: number;
};

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  pruneIfNeeded();
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: Math.max(0, limit - 1), retryAfterSec: 0 };
  }

  if (current.count >= limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfterSec: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  return {
    ok: true,
    remaining: Math.max(0, limit - current.count),
    retryAfterSec: 0,
  };
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first.slice(0, 128);
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp.slice(0, 128);
  return "unknown";
}

export function rateLimitResponse(retryAfterSec: number) {
  return Response.json(
    {
      ok: false,
      success: false,
      message: "Demasiadas solicitudes. Intenta de nuevo en unos momentos.",
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfterSec),
        "Cache-Control": "no-store",
      },
    },
  );
}
