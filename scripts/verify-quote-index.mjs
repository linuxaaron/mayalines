import { readFile } from "node:fs/promises";
const quotes = JSON.parse(await readFile("data/quotes.json", "utf8"));
if (quotes.length !== 2000) throw new Error(`Quote dataset must contain exactly 2000 records; found ${quotes.length}`);
const ids = new Set(); const slugs = new Set();
for (const q of quotes) {
  if (!q.id || !q.slug || !q.quote || !q.author) throw new Error(`Incomplete record: ${q.id}`);
  if (ids.has(q.id) || slugs.has(q.slug)) throw new Error(`Duplicate id/slug: ${q.id}`);
  ids.add(q.id); slugs.add(q.slug);
  if (!q.indexable) throw new Error(`Indexing disabled for ${q.id}`);
  if (q.copyrightStatus !== "public-domain-source") throw new Error(`Rights gate failed: ${q.id}`);
  if (q.attributionStatus !== "source-attributed") throw new Error(`Attribution gate failed: ${q.id}`);
  if (!q.source?.startsWith("https://en.wikisource.org/")) throw new Error(`Missing Wikisource provenance: ${q.id}`);
}
console.log(`Quote audit passed: ${quotes.length} indexable records.`);
