import { readFile } from "node:fs/promises";

const file = process.argv[2] ?? "data/quotes.json";
const quotes = JSON.parse(await readFile(file, "utf8"));

const errors = [];
const warnings = [];
const seenExact = new Map();
const seenNormalized = new Map();
const categories = new Map();

const normalize = (value) => String(value)
  .toLowerCase()
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/\s+/g, " ")
  .trim();

if (!Array.isArray(quotes)) errors.push("Quote data must be an array.");

for (const [index, quote] of (quotes ?? []).entries()) {
  const label = `record ${index + 1}`;
  if (!quote?.id) errors.push(`${label}: missing id`);
  if (!quote?.quote) errors.push(`${label}: missing quote text`);
  if (!quote?.author) errors.push(`${label}: missing author`);
  if (!quote?.category) errors.push(`${label}: missing category`);
  if (!quote?.slug) errors.push(`${label}: missing slug`);
  if (!quote?.source) errors.push(`${label}: missing source URL`);
  if (!quote?.sourceName) errors.push(`${label}: missing source name`);
  if (!quote?.sourceCommit) errors.push(`${label}: missing source commit`);

  if (quote?.attributionStatus !== "verified") warnings.push(`${label}: attribution is not verified`);
  if (quote?.copyrightStatus !== "cleared") warnings.push(`${label}: copyright status is not cleared`);
  if (quote?.indexable !== false && quote?.indexable !== true) errors.push(`${label}: indexable must be explicitly true or false`);
  if (quote?.indexable === true && (quote?.attributionStatus !== "verified" || quote?.copyrightStatus !== "cleared")) {
    errors.push(`${label}: indexable quote is not fully cleared`);
  }

  const exactKey = `${normalize(quote?.author)}|${normalize(quote?.quote)}`;
  const textKey = normalize(quote?.quote);
  if (seenExact.has(exactKey)) errors.push(`${label}: duplicate author + quote of ${seenExact.get(exactKey)}`);
  else seenExact.set(exactKey, label);
  if (seenNormalized.has(textKey)) warnings.push(`${label}: duplicate quote text found in ${seenNormalized.get(textKey)}`);
  else seenNormalized.set(textKey, label);

  const category = quote?.category ?? "Unknown";
  categories.set(category, (categories.get(category) ?? 0) + 1);
}

const expected = Number(process.env.EXPECTED_QUOTES ?? "3000");
if ((quotes?.length ?? 0) !== expected) errors.push(`Expected ${expected} quotes, found ${quotes?.length ?? 0}.`);

const indexableCount = (quotes ?? []).filter((quote) => quote?.indexable === true).length;
console.log(`Quote audit: ${quotes?.length ?? 0} records`);
console.log(`Indexable: ${indexableCount}`);
console.log(`Categories: ${categories.size}`);
for (const [category, count] of [...categories.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${category}: ${count}`);
}
console.log(`Warnings: ${warnings.length}`);
for (const warning of warnings.slice(0, 20)) console.warn(`WARN: ${warning}`);
if (warnings.length > 20) console.warn(`WARN: ... ${warnings.length - 20} more warnings`);
console.log(`Errors: ${errors.length}`);
for (const error of errors) console.error(`ERROR: ${error}`);

if (errors.length) process.exit(1);
