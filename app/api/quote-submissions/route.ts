import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_QUOTE = 2000;
const MAX_AUTHOR = 160;
const MAX_SOURCE = 300;
const MAX_SUBMITTER = 120;

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
  const category = clean(input.category, 80);
  const submitter = clean(input.submitter, MAX_SUBMITTER);

  if (quote.length < 3 || author.length < 1 || category.length < 1) return NextResponse.json({ error: "Quote, author and category are required" }, { status: 400 });

  // Persistence is intentionally left for the database migration. Never claim a
  // submission was stored until a durable database write succeeds.
  console.info("MAYALINES quote submission received", { quote, author, source, category, submitter });
  return NextResponse.json({ received: true, persisted: false });
}
