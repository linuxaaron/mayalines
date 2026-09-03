import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { getOrCreateVisitorId } from "../../../lib/db";
import { rejectIfRateLimited } from "../../../lib/rate-limit";
import { rejectCrossSiteMutation } from "../../../lib/request-security";

export const runtime = "nodejs";

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? new Redis({ url, token }) : null;
}

function response(average: number, count: number, value: number | null, visitorId: string) {
  const result = NextResponse.json({ average, count, value, persistent: true }, { headers: { "Cache-Control": "no-store" } });
  result.headers.set("set-cookie", `mayalines_visitor=${encodeURIComponent(visitorId)}; Path=/; Max-Age=63072000; HttpOnly; Secure; SameSite=Lax`);
  return result;
}

export async function GET(request: Request) {
  const redis = getRedis();
  if (!redis) return NextResponse.json({ average: 0, count: 0, value: null, persistent: false }, { headers: { "Cache-Control": "no-store" } });
  const visitorId = getOrCreateVisitorId(request);
  try {
    const [sum, count, value] = await Promise.all([
      redis.get<number>("mayalines:site-rating:sum"),
      redis.get<number>("mayalines:site-rating:count"),
      redis.get<number>(`mayalines:site-rating:user:${visitorId}`),
    ]);
    const safeCount = Math.max(0, Number(count) || 0);
    return response(safeCount ? (Number(sum) || 0) / safeCount : 0, safeCount, value === null ? null : Number(value), visitorId);
  } catch {
    return NextResponse.json({ error: "Site rating is temporarily unavailable" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const crossSiteResponse = rejectCrossSiteMutation(request);
  if (crossSiteResponse) return crossSiteResponse;
  const rateLimitResponse = await rejectIfRateLimited(request, "site-rating", { max: 10, windowSeconds: 60 });
  if (rateLimitResponse) return rateLimitResponse;
  let value: number;
  try { value = Number((await request.json())?.value); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  if (!Number.isInteger(value) || value < 1 || value > 5) return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
  const redis = getRedis();
  if (!redis) return NextResponse.json({ error: "Site rating storage is not configured" }, { status: 503 });
  const visitorId = getOrCreateVisitorId(request);
  const userKey = `mayalines:site-rating:user:${visitorId}`;
  try {
    const previous = await redis.get<number>(userKey);
    if (previous === null) {
      await redis.set(userKey, String(value), { ex: 63072000 });
      await Promise.all([redis.incrby("mayalines:site-rating:sum", value), redis.incr("mayalines:site-rating:count")]);
    } else if (Number(previous) !== value) {
      await redis.set(userKey, String(value), { ex: 63072000 });
      await redis.incrby("mayalines:site-rating:sum", value - Number(previous));
    }
    const [sum, count] = await Promise.all([redis.get<number>("mayalines:site-rating:sum"), redis.get<number>("mayalines:site-rating:count")]);
    const safeCount = Math.max(0, Number(count) || 0);
    return response(safeCount ? (Number(sum) || 0) / safeCount : 0, safeCount, value, visitorId);
  } catch {
    return NextResponse.json({ error: "Site rating is temporarily unavailable" }, { status: 503 });
  }
}
