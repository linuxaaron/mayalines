import { randomInt } from "node:crypto";
import { NextResponse } from "next/server";
import quotesData from "../../../../data/quotes";
import { isPublicQuote } from "../../../../lib/seo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const publicQuotes = quotesData.filter(isPublicQuote).map(({ id, quote, author }) => ({ id, quote, author }));

export async function GET() {
  if (!publicQuotes.length) {
    return NextResponse.json({ error: "No verified quotes available" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }

  return NextResponse.json(
    { quote: publicQuotes[randomInt(publicQuotes.length)] },
    { headers: { "Cache-Control": "no-store" } },
  );
}
