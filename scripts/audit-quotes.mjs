import { readFile } from "node:fs/promises";

const file = process.argv[2] ?? "data/quotes.json";
const quotes = JSON.parse(await readFile(file, "utf8"));

const errors = [];
const warnings = [];
const editorial = { attribution: 0, copyright: 0, noindex: 0 };
const seenExact = new Map();
const seenNormalized = new Map();
const categories = new Map();
const languages = new Map();

const normalize = (value) => String(value ?? "")
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

  if (quote?.attributionStatus !== "verified") editorial.attribution += 1;
  if (quote?.copyrightStatus !== "cleared") editorial.copyright += 1;
  if (quote?.indexable !== false && quote?.indexable !== true) errors.push(`${label}: indexable must be explicitly true or false`);
  // `indexable` controls whether a record may appear in the public browsing library.
  // Search-engine indexing has a stricter gate in metadata/sitemap code and requires
  // verified attribution plus copyrightStatus=cleared.
  if (quote?.indexable === true && (quote?.attributionStatus !== "verified" || quote?.copyrightStatus !== "cleared")) {
    editorial.noindex += 1;
  }

  const exactKey = `${normalize(quote?.author)}|${normalize(quote?.quote)}`;
  const textKey = normalize(quote?.quote);
  if (seenExact.has(exactKey)) errors.push(`${label}: duplicate author + quote of ${seenExact.get(exactKey)}`);
  else seenExact.set(exactKey, label);
  if (seenNormalized.has(textKey)) warnings.push(`${label}: duplicate quote text found in ${seenNormalized.get(textKey)}`);
  else seenNormalized.set(textKey, label);

  const category = quote?.category ?? "Unknown";
  categories.set(category, (categories.get(category) ?? 0) + 1);
  const language = quote?.language ?? "en";
  languages.set(language, (languages.get(language) ?? 0) + 1);
}

const count = quotes?.length ?? 0;
const expected = process.env.EXPECTED_QUOTES ? Number(process.env.EXPECTED_QUOTES) : null;
const minQuotes = Number(process.env.MIN_QUOTES ?? "10000");
const maxQuotes = Number(process.env.MAX_QUOTES ?? "59000");
if (expected !== null && count !== expected) errors.push(`Expected exactly ${expected} quotes, found ${count}.`);
if (count < minQuotes) errors.push(`Expected at least ${minQuotes} quotes, found ${count}.`);
if (count > maxQuotes) errors.push(`Quote corpus exceeds configured maximum of ${maxQuotes}: found ${count}.`);

const publicCount = (quotes ?? []).filter((quote) => quote?.indexable === true && quote?.attributionStatus === "verified" && quote?.copyrightStatus === "cleared").length;
const seoClearedCount = publicCount;
console.log(`Quote audit: ${count} records`);
console.log(`Public library: ${publicCount}`);
console.log(`SEO-cleared: ${seoClearedCount}`);
console.log(`Categories: ${categories.size}`);
console.log(`Languages: ${[...languages.entries()].map(([language, amount]) => `${language}:${amount}`).join(", ")}`);
console.log(`Warnings: ${warnings.length}`);
console.log(`Editorial review pending: attribution=${editorial.attribution}, copyright=${editorial.copyright}, search-engine noindex=${editorial.noindex}`);
for (const warning of warnings.slice(0, 20)) console.warn(`WARN: ${warning}`);
if (warnings.length > 20) console.warn(`WARN: ... ${warnings.length - 20} more warnings`);
console.log(`Errors: ${errors.length}`);
for (const error of errors) console.error(`ERROR: ${error}`);
if (errors.length) process.exit(1);
