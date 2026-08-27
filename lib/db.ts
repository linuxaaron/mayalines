import { neon } from "@neondatabase/serverless";

export function getDb() {
  const url = process.env.DATABASE_URL;
  return url ? neon(url) : null;
}

export function isValidQuoteId(id: string) {
  return /^[a-zA-Z0-9_-]{1,128}$/.test(id);
}

export function getVisitorId(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const match = cookieHeader.match(/(?:^|;\s*)mayalines_visitor=([^;]+)/);
  return match?.[1] ?? null;
}
