import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { randomUUID } from "node:crypto";

export const runtime = "nodejs";

const VOTER_COOKIE = "mayalines_voter";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 * 2;

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

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isValidId(id)) return NextResponse.json({ error: "Invalid quote id" }, { status: 400 });

  const redis = getRedis();
  if (!redis) return NextResponse.json({ likes: 0, liked: false, persistent: false });

  const voterId = getOrCreateVoter(request);
  const key = `quote:likes:${id}`;
  const voterKey = `quote:voters:${id}`;
  const [likes, liked] = await Promise.all([
    redis.scard(voterKey),
    redis.sismember(voterKey, voterId),
  ]);

  const response = NextResponse.json({
    likes: Math.max(0, Number(likes) || 0),
    liked: Boolean(liked),
    persistent: true,
  }, { headers: { "Cache-Control": "no-store" } });

  // Keep the legacy counter in sync for compatibility with existing data.
  await redis.set(key, Math.max(0, Number(likes) || 0));
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
  const voterKey = `quote:voters:${id}`;

  if (body.action === "like") {
    await redis.sadd(voterKey, voterId);
  } else {
    await redis.srem(voterKey, voterId);
  }

  const likes = Math.max(0, Number(await redis.scard(voterKey)) || 0);
  await redis.set(`quote:likes:${id}`, likes);
  const liked = Boolean(await redis.sismember(voterKey, voterId));

  const response = NextResponse.json({ likes, liked, persistent: true }, {
    headers: { "Cache-Control": "no-store" },
  });
  setVoterCookie(response, voterId);
  return response;
}
