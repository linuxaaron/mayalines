import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

export const runtime = "nodejs";

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

function isValidId(id: string) {
  return /^[a-zA-Z0-9_-]{1,128}$/.test(id);
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isValidId(id)) return NextResponse.json({ error: "Invalid quote id" }, { status: 400 });
  const redis = getRedis();
  if (!redis) return NextResponse.json({ likes: 0, persistent: false });
  const likes = Number((await redis.get<number>(`quote:likes:${id}`)) ?? 0);
  return NextResponse.json({ likes: Number.isFinite(likes) ? Math.max(0, likes) : 0, persistent: true }, {
    headers: { "Cache-Control": "no-store" },
  });
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

  const key = `quote:likes:${id}`;
  let likes: number;
  if (body.action === "like") {
    likes = await redis.incr(key);
  } else {
    const current = Number((await redis.get<number>(key)) ?? 0);
    likes = Math.max(0, current - 1);
    await redis.set(key, likes);
  }

  return NextResponse.json({ likes, persistent: true }, {
    headers: { "Cache-Control": "no-store" },
  });
}
