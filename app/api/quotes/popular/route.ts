import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import quotesData from "../../../../data/quotes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? new Redis({ url, token }) : null;
}

export async function GET() {
  const redis = getRedis();
  if (!redis) return NextResponse.json({ quotes: [], persistent: false }, { headers: { "Cache-Control": "no-store" } });

  const quotes = quotesData.filter((quote) => quote.indexable !== false);
  const keys = quotes.map((quote) => `quote:likes:${quote.id}`);
  const counts = await redis.mget<number[]>(...keys);
  const popular = quotes
    .map((quote, index) => ({ ...quote, likes: Math.max(0, Number(counts[index]) || 0) }))
    .filter((quote) => quote.likes > 0)
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 12);

  return NextResponse.json({ quotes: popular, persistent: true }, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
  });
}
