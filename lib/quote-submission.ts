import { Redis } from "@upstash/redis";
import { getDb } from "./db";
import { QUOTE_CATEGORIES } from "./quote-categories";

const allowedCategories = new Set<string>(QUOTE_CATEGORIES);
const submissionsKey = "mayalines:quote-submissions";

type StoredSubmission = {
  id: number;
  quote: string;
  author: string;
  source: string;
  category: string;
  submitter_name: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? new Redis({ url, token }) : null;
}

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
  if (db) {
    try {
      await db`INSERT INTO quote_submissions (quote, author, source, category, submitter_name) VALUES (${quote}, ${author}, ${source}, ${category}, ${submitter || null})`;
      return { ok: true, persisted: true };
    } catch {
      // Use the configured Redis store when the optional Neon table is unavailable.
    }
  }

  const redis = getRedis();
  if (!redis) return { ok: false, status: 503, error: "Submission storage is not configured" };

  try {
    const submission: StoredSubmission = {
      id: Date.now(),
      quote,
      author,
      source,
      category,
      submitter_name: submitter || null,
      status: "pending",
      created_at: new Date().toISOString(),
    };
    await redis.rpush(submissionsKey, JSON.stringify(submission));
    return { ok: true, persisted: true };
  } catch {
    return { ok: false, status: 503, error: "Submission storage is temporarily unavailable" };
  }
}

export async function listQuoteSubmissions(): Promise<StoredSubmission[]> {
  const db = getDb();
  if (db) {
    try {
      const rows = await db`
        SELECT id, quote, author, source, category, submitter_name, status, created_at
        FROM quote_submissions
        ORDER BY created_at DESC
        LIMIT 100
      `;
      return rows as StoredSubmission[];
    } catch {
      // Fall through to Redis.
    }
  }

  const redis = getRedis();
  if (!redis) return [];
  const rows = await redis.lrange<string>(submissionsKey, 0, -1);
  return rows
    .map((row) => {
      try { return typeof row === "string" ? JSON.parse(row) as StoredSubmission : row as unknown as StoredSubmission; } catch { return null; }
    })
    .filter((row): row is StoredSubmission => Boolean(row))
    .reverse()
    .slice(0, 100);
}

export async function updateQuoteSubmission(id: number, status: "approved" | "rejected") {
  const db = getDb();
  if (db) {
    try {
      await db`UPDATE quote_submissions SET status = ${status} WHERE id = ${id}`;
      return true;
    } catch {
      // Fall through to Redis.
    }
  }

  const redis = getRedis();
  if (!redis) return false;
  const rows = await redis.lrange<string>(submissionsKey, 0, -1);
  for (let index = 0; index < rows.length; index += 1) {
    try {
      const row = typeof rows[index] === "string" ? JSON.parse(rows[index]) as StoredSubmission : rows[index] as unknown as StoredSubmission;
      if (row.id === id) {
        await redis.lset(submissionsKey, index, JSON.stringify({ ...row, status }));
        return true;
      }
    } catch {
      // Ignore malformed legacy entries.
    }
  }
  return false;
}
