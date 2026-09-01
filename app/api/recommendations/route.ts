import { NextResponse } from "next/server";
import quotesData from "../../../data/quotes";
import { getDb, getOrCreateVisitorId } from "../../../lib/db";
export const runtime = "nodejs";
export async function GET(request: Request) {
  const visitorId = getOrCreateVisitorId(request); const db = getDb();
  if (!db) return NextResponse.json({ quotes: [], persistent: false }, { headers: { "Cache-Control": "no-store" } });
  try {
    const [savedRows, follows] = await Promise.all([db`SELECT i.quote_id FROM quote_collection_items i JOIN quote_collections c ON c.id = i.collection_id WHERE c.visitor_id = ${visitorId}::uuid`, db`SELECT target_type, target FROM quote_follows WHERE visitor_id = ${visitorId}::uuid`]);
    const saved = new Set(savedRows.map((row) => String((row as { quote_id: string }).quote_id))); const byId = new Map(quotesData.map((quote) => [quote.id, quote]));
    const savedQuotes = [...saved].map((id) => byId.get(id)).filter(Boolean); const followedAuthors = new Set(follows.filter((row) => (row as { target_type: string }).target_type === "author").map((row) => String((row as { target: string }).target))); const followedTopics = new Set(follows.filter((row) => (row as { target_type: string }).target_type === "topic").map((row) => String((row as { target: string }).target)));
    const savedCategories = new Set(savedQuotes.map((quote) => quote?.category));
    const quotes = quotesData.filter((quote) => quote.indexable && !saved.has(quote.id)).map((quote) => ({ quote, score: (followedAuthors.has(quote.author) ? 4 : 0) + (followedTopics.has(quote.category) ? 3 : 0) + (savedCategories.has(quote.category) ? 1 : 0) })).filter(({ score }) => score > 0).sort((a, b) => b.score - a.score || a.quote.id.localeCompare(b.quote.id)).slice(0, 24).map(({ quote }) => quote);
    const response = NextResponse.json({ quotes, persistent: true, basis: "followed authors, followed topics and saved-quote categories" }, { headers: { "Cache-Control": "no-store" } }); response.headers.set("set-cookie", `mayalines_visitor=${encodeURIComponent(visitorId)}; Path=/; Max-Age=63072000; HttpOnly; Secure; SameSite=Lax`); return response;
  } catch { return NextResponse.json({ quotes: [], persistent: false }, { headers: { "Cache-Control": "no-store" } }); }
}
