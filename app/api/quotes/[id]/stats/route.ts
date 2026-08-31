import { NextResponse } from "next/server";
import { getDb, isValidQuoteId } from "../../../../../lib/db";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isValidQuoteId(id)) return NextResponse.json({ error: "Invalid quote id" }, { status: 400 });

  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { likes: 0, copies: 0, shares: 0, persistent: false },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const rows = await db`
      SELECT
        (SELECT COUNT(*)::int FROM quote_likes WHERE quote_id = ${id}) AS likes,
        (SELECT COUNT(*)::int FROM quote_copies WHERE quote_id = ${id}) AS copies,
        (SELECT COUNT(*)::int FROM quote_shares WHERE quote_id = ${id}) AS shares
    `;
    const result = rows[0] as { likes: number; copies: number; shares: number } | undefined;

    return NextResponse.json(
      {
        likes: Number(result?.likes) || 0,
        copies: Number(result?.copies) || 0,
        shares: Number(result?.shares) || 0,
        persistent: true,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { likes: 0, copies: 0, shares: 0, persistent: false },
      { headers: { "Cache-Control": "no-store" } },
    );
  }
}
