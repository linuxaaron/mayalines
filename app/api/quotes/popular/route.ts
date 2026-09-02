import { NextResponse } from "next/server";
import quotesData from "../../../../data/quotes";
import { getDb } from "../../../../lib/db";
import { isPublicQuote } from "../../../../lib/seo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const db = getDb();
  if (!db) return NextResponse.json({ quotes: [], persistent: false }, { headers: { "Cache-Control": "no-store" } });

  try {
    const rows = await db`SELECT quote_id, COUNT(*)::int AS likes FROM quote_likes GROUP BY quote_id ORDER BY likes DESC, quote_id ASC LIMIT 24`;
    const byId = new Map(quotesData.filter(isPublicQuote).map((quote) => [quote.id, quote]));
    const quotes = rows.flatMap((row) => {
      const item = row as { quote_id: string; likes: number };
      const quote = byId.get(item.quote_id);
      return quote ? [{ ...quote, likes: Math.max(0, Number(item.likes) || 0) }] : [];
    }).slice(0, 12);

    return NextResponse.json({ quotes, persistent: true }, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch {
    return NextResponse.json({ quotes: [], persistent: false }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
