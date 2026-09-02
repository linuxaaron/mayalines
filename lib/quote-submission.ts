import { getDb } from "./db";
import { QUOTE_CATEGORIES } from "./quote-categories";

const allowedCategories = new Set<string>(QUOTE_CATEGORIES);

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export type QuoteSubmissionResult =
  | { ok: true; persisted: boolean }
  | { ok: false; status: 400 | 503; error: string };

export async function saveQuoteSubmission(input: Record<string, unknown>): Promise<QuoteSubmissionResult> {
  if (typeof input.website === "string" && input.website.trim()) return { ok: true, persisted: false };

  const quote = clean(input.quote, 2000);
  const author = clean(input.author, 160);
  const source = clean(input.source, 300);
  const category = clean(input.category, 80);
  const submitter = clean(input.submitter, 120);

  if (quote.length < 3 || !author || source.length < 3 || !allowedCategories.has(category)) {
    return { ok: false, status: 400, error: "Quote, author, verifiable source and a supported category are required" };
  }

  const db = getDb();
  if (!db) return { ok: false, status: 503, error: "Submission storage is not configured" };

  try {
    await db`INSERT INTO quote_submissions (quote, author, source, category, submitter_name) VALUES (${quote}, ${author}, ${source}, ${category}, ${submitter || null})`;
    return { ok: true, persisted: true };
  } catch {
    return { ok: false, status: 503, error: "Submission storage is temporarily unavailable" };
  }
}
