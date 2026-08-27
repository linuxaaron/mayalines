import { NextResponse } from "next/server";
import { getDb } from "../../../lib/db";

export const runtime = "nodejs";

const MAX_QUOTE = 2000;
const MAX_AUTHOR = 160;
const MAX_SOURCE = 300;
const MAX_SUBMITTER = 120;
const MAX_CATEGORY = 80;

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const input = body as Record<string, unknown>;
  const quote = clean(input.quote, MAX_QUOTE);
  const author = clean(input.author, MAX_AUTHOR);
  const source = clean(input.source, MAX_SOURCE);
  const category = clean(input.category, MAX_CATEGORY);
  const submitter = clean(input.submitter, MAX_SUBMITTER);

  if (quote.length < 3 || author.length < 1 || category.length < 1) return NextResponse.json({ error: "Quote, author and category are required" }, { status: 400 });

  const db = getDb();
  if (!db) return NextResponse.json({ error: "Submission storage is not configured" }, { status: 503 });

  await db`INSERT INTO quote_submissions (quote, author, source, category, submitter_name) VALUES (${quote}, ${author}, ${source || null}, ${category}, ${submitter || null})`;
  return NextResponse.json({ received: true, persisted: true });
}
