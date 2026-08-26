import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import quotesData from "../../../../data/quotes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return NextResponse.json({ quotes: [], persistent: false }, { headers: { "Cache-Control": "no-store" } });
  const redis = new Redis({ url, token });
  const ids = await redis.zrange<string[]>("quotes:trending", 0, 11, { rev: true });
  const byId = new Map(quotesData.map((quote) => [quote.id, quote]));
  const quotes = ids.map((id) => byId.get(id)).filter((quote): quote is (typeof quotesData)[number] => Boolean(quote && quote.indexable !== false));
  return NextResponse.json({ quotes, persistent: true }, { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120" } });
}
