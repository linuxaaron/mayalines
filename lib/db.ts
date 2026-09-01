import { neon } from "@neondatabase/serverless";
import { randomUUID } from "node:crypto";

export function getDb() {
  const url = process.env.DATABASE_URL;
  return url ? neon(url) : null;
}

export function isValidQuoteId(id: string) {
  return /^[a-zA-Z0-9_-]{1,128}$/.test(id);
}

export function getOrCreateVisitorId(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const match = cookieHeader.match(/(?:^|;\s*)mayalines_visitor=([^;]+)/);
  let candidate = "";
  try { candidate = match?.[1] ? decodeURIComponent(match[1]) : ""; } catch { /* Invalid cookie encoding receives a new visitor id. */ }
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(candidate)
    ? candidate
    : randomUUID();
}

export function setVisitorCookie(response: Response, visitorId: string) {
  const headers = new Headers(response.headers);
  headers.set("set-cookie", `mayalines_visitor=${encodeURIComponent(visitorId)}; Path=/; Max-Age=63072000; HttpOnly; Secure; SameSite=Lax`);
  return headers;
}
