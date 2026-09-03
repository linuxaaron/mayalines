import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { getOrCreateVisitorId, isValidQuoteId } from "../../../../../lib/db";
import { rejectIfRateLimited } from "../../../../../lib/rate-limit";
import { rejectCrossSiteMutation } from "../../../../../lib/request-security";

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

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isValidQuoteId(id)) return NextResponse.json({ error: "Invalid quote id" }, { status: 400 });
  const redis = getRedis();
  if (!redis) return NextResponse.json({ average: 0, count: 0, value: null, persistent: false }, { headers: { "Cache-Control": "no-store" } });
  const visitorId = getOrCreateVisitorId(request);
  try {
    const [sum, count, value] = await Promise.all([
      redis.get<number>(`quote:ratings:sum:${id}`),
      redis.get<number>(`quote:ratings:count:${id}`),
      redis.get<number>(`quote:rating:${id}:${visitorId}`),
    ]);
    const safeCount = Math.max(0, Number(count) || 0);
    return response(safeCount ? (Number(sum) || 0) / safeCount : 0, safeCount, value === null ? null : Number(value), visitorId);
  } catch {
    return NextResponse.json({ error: "Rating storage is temporarily unavailable" }, { status: 503 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const crossSiteResponse = rejectCrossSiteMutation(request);
  if (crossSiteResponse) return crossSiteResponse;
  const rateLimitResponse = await rejectIfRateLimited(request, "rating", { max: 20, windowSeconds: 60 });
  if (rateLimitResponse) return rateLimitResponse;
  const { id } = await params;
  if (!isValidQuoteId(id)) return NextResponse.json({ error: "Invalid quote id" }, { status: 400 });
  let value: number;
  try { value = Number((await request.json())?.value); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  if (!Number.isInteger(value) || value < 1 || value > 5) return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
  const redis = getRedis();
  if (!redis) return NextResponse.json({ error: "Rating storage is not configured" }, { status: 503 });
  const visitorId = getOrCreateVisitorId(request);
  const userKey = `quote:rating:${id}:${visitorId}`;
  const sumKey = `quote:ratings:sum:${id}`;
  const countKey = `quote:ratings:count:${id}`;
  try {
    const previous = await redis.get<number>(userKey);
    if (previous === null) {
      await redis.set(userKey, String(value), { ex: 63072000 });
      await Promise.all([redis.incrby(sumKey, value), redis.incr(countKey)]);
    } else if (Number(previous) !== value) {
      await redis.set(userKey, String(value), { ex: 63072000 });
      await redis.incrby(sumKey, value - Number(previous));
    }
    const [sum, count] = await Promise.all([redis.get<number>(sumKey), redis.get<number>(countKey)]);
    const safeCount = Math.max(0, Number(count) || 0);
    return response(safeCount ? (Number(sum) || 0) / safeCount : 0, safeCount, value, visitorId);
  } catch {
    return NextResponse.json({ error: "Rating storage is temporarily unavailable" }, { status: 503 });
  }
}
