import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { randomUUID } from "node:crypto";

export const runtime = "nodejs";

const VOTER_COOKIE = "mayalines_voter";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 * 2;
const RANKING_KEY = "quotes:ranking";

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

function isValidId(id: string) {
  return /^[a-zA-Z0-9_-]{1,128}$/.test(id);
}

function getOrCreateVoter(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${VOTER_COOKIE}=([^;]+)`));
  return match?.[1] || randomUUID();
}

function setVoterCookie(response: NextResponse, voterId: string) {
  response.cookies.set(VOTER_COOKIE, voterId, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

async function getLikeState(redis: Redis, id: string, voterId: string) {
  const counterKey = `quote:likes:${id}`;
  const voterKey = `quote:voters:${id}`;
  const [counter, voterCount, liked] = await Promise.all([
    redis.get<number>(counterKey),
    redis.scard(voterKey),
    redis.sismember(voterKey, voterId),
  ]);

  const likes = Math.max(0, Number(counter) || 0, Number(voterCount) || 0);
  return { likes, liked: Boolean(liked), voterKey, counterKey };
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isValidId(id)) return NextResponse.json({ error: "Invalid quote id" }, { status: 400 });

  const redis = getRedis();
  if (!redis) return NextResponse.json({ likes: 0, liked: false, persistent: false }, { headers: { "Cache-Control": "no-store" } });

  const voterId = getOrCreateVoter(request);
  const { likes, liked } = await getLikeState(redis, id, voterId);
  const response = NextResponse.json({ likes, liked, persistent: true }, { headers: { "Cache-Control": "no-store" } });
  setVoterCookie(response, voterId);
  return response;
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isValidId(id)) return NextResponse.json({ error: "Invalid quote id" }, { status: 400 });

  const redis = getRedis();
  if (!redis) return NextResponse.json({ error: "Like storage is not configured" }, { status: 503 });

  let body: { action?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.action !== "like" && body.action !== "unlike") {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const voterId = getOrCreateVoter(request);
  const state = await getLikeState(redis, id, voterId);

  if (body.action === "like") {
    const added = await redis.sadd(state.voterKey, voterId);
    if (added === 1) {
      const likes = await redis.incr(state.counterKey);
      await redis.zadd(RANKING_KEY, { score: Number(likes), member: id });
    }
  } else {
    const removed = await redis.srem(state.voterKey, voterId);
    if (removed === 1) {
      const current = Math.max(0, Number((await redis.get<number>(state.counterKey)) ?? 0));
      const likes = Math.max(0, current - 1);
      if (likes === 0) {
        await Promise.all([redis.set(state.counterKey, 0), redis.zrem(RANKING_KEY, id)]);
      } else {
        await Promise.all([redis.set(state.counterKey, likes), redis.zadd(RANKING_KEY, { score: likes, member: id })]);
      }
    }
  }

  const updated = await getLikeState(redis, id, voterId);
  const response = NextResponse.json(
    { likes: updated.likes, liked: updated.liked, persistent: true },
    { headers: { "Cache-Control": "no-store" } },
  );
  setVoterCookie(response, voterId);
  return response;
}
