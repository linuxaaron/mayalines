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

function response(likes: number, liked: boolean, persistent: boolean, visitorId?: string) {
  const result = NextResponse.json({ likes: Math.max(0, likes), liked, persistent }, { headers: { "Cache-Control": "no-store" } });
  if (visitorId) result.headers.set("set-cookie", `mayalines_visitor=${encodeURIComponent(visitorId)}; Path=/; Max-Age=63072000; HttpOnly; Secure; SameSite=Lax`);
  return result;
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isValidQuoteId(id)) return NextResponse.json({ error: "Invalid quote id" }, { status: 400 });

  const redis = getRedis();
  const visitorId = getOrCreateVisitorId(request);
  if (!redis) return response(0, false, false, visitorId);
  const [likes, liked] = await Promise.all([
    redis.get<number>(`quote:likes:${id}`),
    redis.exists(`quote:liked:${id}:${visitorId}`),
  ]);
  return response(Number(likes) || 0, Boolean(liked), true, visitorId);
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const crossSiteResponse = rejectCrossSiteMutation(request);
  if (crossSiteResponse) return crossSiteResponse;
  const rateLimitResponse = await rejectIfRateLimited(request, "like", { max: 30, windowSeconds: 60 });
  if (rateLimitResponse) return rateLimitResponse;

  const { id } = await params;
  if (!isValidQuoteId(id)) return NextResponse.json({ error: "Invalid quote id" }, { status: 400 });

  let body: { action?: string } = {};
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  if (body.action !== "like") return NextResponse.json({ error: "Likes cannot be removed" }, { status: 400 });

  const redis = getRedis();
  if (!redis) return NextResponse.json({ error: "Like storage is not configured" }, { status: 503 });
  const visitorId = getOrCreateVisitorId(request);

  const visitorKey = `quote:liked:${id}:${visitorId}`;
  const countKey = `quote:likes:${id}`;
  const added = await redis.set(visitorKey, "1", { nx: true, ex: 63072000 });
  if (added) await redis.incr(countKey);

  const [likes, liked] = await Promise.all([redis.get<number>(countKey), redis.exists(visitorKey)]);
  return response(Number(likes) || 0, Boolean(liked), true, visitorId);
}
