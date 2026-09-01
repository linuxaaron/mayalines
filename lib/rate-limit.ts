import { createHash } from "node:crypto";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

type Limit = { max: number; windowSeconds: number };
type LocalEntry = { count: number; resetAt: number };

const localEntries = new Map<string, LocalEntry>();

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? new Redis({ url, token }) : null;
}

function clientKey(request: Request) {
  // Vercel provides this header after removing client-supplied forwarding data.
  const address = request.headers.get("x-vercel-forwarded-for")
    ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? "unknown";

  return createHash("sha256").update(address).digest("base64url").slice(0, 32);
}

function incrementLocally(key: string, limit: Limit) {
  const now = Date.now();
  const current = localEntries.get(key);
  if (!current || current.resetAt <= now) {
    const next = { count: 1, resetAt: now + limit.windowSeconds * 1000 };
    localEntries.set(key, next);
    return next;
  }

  current.count += 1;
  return current;
}

async function increment(key: string, limit: Limit) {
  const redis = getRedis();
  if (!redis) return incrementLocally(key, limit);

  try {
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, limit.windowSeconds);
    return { count, resetAt: Date.now() + limit.windowSeconds * 1000 };
  } catch {
    return incrementLocally(key, limit);
  }
}

/**
 * Limits a public API action per visitor. Upstash Redis makes the limit shared
 * across serverless instances; the in-memory fallback still protects local dev.
 */
export async function rejectIfRateLimited(request: Request, action: string, limit: Limit) {
  const key = `mayalines:rate:${action}:${clientKey(request)}:${Math.floor(Date.now() / (limit.windowSeconds * 1000))}`;

  try {
    const { count, resetAt } = await increment(key, limit);
    if (count <= limit.max) return null;

    const retryAfter = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Cache-Control": "no-store", "Retry-After": String(retryAfter) } },
    );
  } catch {
    // A malformed request must never become a server error.
    return null;
  }
}
