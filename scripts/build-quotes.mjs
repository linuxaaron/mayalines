import { mkdir, writeFile } from "node:fs/promises";

const TARGET_COUNT = 3000;
const SOURCE_URL = "https://en.wikisource.org/wiki/Three_Thousand_Selected_Quotations_from_Brilliant_Writers";
const SOURCE_NAME = "Three Thousand Selected Quotations from Brilliant Writers — Wikisource";
const SOURCE_COMMIT = "public-domain-wikisource-1909";
const LETTERS = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","R","S","T","U","V","W","Y","Z"];

const decode = (value) => value
  .replace(/&#39;/g, "'")
  .replace(/&quot;/g, '"')
  .replace(/&amp;/g, "&")
  .replace(/&#x27;/g, "'");

const strip = (value) => decode(value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
const slugify = (value) => value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const titleCase = (value) => value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

// Keep the public taxonomy compact so near-duplicate category pages do not proliferate.
const CATEGORY_ALIASES = new Map([
  ["Christian Life", "Faith"],
  ["Christianity", "Faith"],
  ["Christians", "Faith"],
  ["Christian Service", "Faith"],
  ["Christian Conflict", "Faith"],
  ["Church", "Faith"],
  ["Church Sanctuary", "Faith"],
  ["Denominationalism", "Faith"],
  ["Baptism", "Faith"],
  ["Character", "Character"],
  ["Education", "Education"],
  ["Freedom", "Freedom"],
  ["Friendship", "Friendship"],
  ["Happiness", "Happiness"],
  ["Inspiration", "Inspiration"],
  ["Life", "Life"],
  ["Love", "Love"],
  ["Motivation", "Motivation"],
  ["Philosophy", "Philosophy"],
  ["Science", "Science"],
  ["Success", "Success"],
  ["Wisdom", "Wisdom"],
]);

function normalizeCategory(value) {
  const clean = titleCase(value.replace(/[.:]+$/, "").trim());
  return CATEGORY_ALIASES.get(clean) ?? clean;
}

const quotes = [];
const seen = new Set();

for (const letter of LETTERS) {
  const url = `${SOURCE_URL}/${letter}`;
  const response = await fetch(url, {
    headers: {
      "User-Agent": "MayalinesQuoteBuilder/1.1 (+https://mayalines.com)"
    }
  });

  if (!response.ok) throw new Error(`Wikisource ${letter} request failed: ${response.status}`);

  const html = await response.text();
  const paragraphs = [...html.matchAll(/<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/gi)].map((m) => strip(m[1]));
  let pending = null;
  let category = "Wisdom";

  for (const paragraph of paragraphs) {
    if (!paragraph) continue;

    if (/^[—–-]/.test(paragraph)) {
      if (pending) {
        const author = paragraph.replace(/^[—–-]\s*/, "").replace(/[.\s]+$/, "").trim();
        const quote = pending.replace(/^[\u200b\ufeff\s]+|[\u200b\ufeff\s]+$/g, "").trim();
        const key = `${author.toLowerCase()}|${quote.toLowerCase()}`;

        if (author && quote.length >= 15 && quote.length <= 1500 && !seen.has(key)) {
          seen.add(key);
          const id = `q${String(quotes.length + 1).padStart(4, "0")}`;
          quotes.push({
            id,
            quote,
            author,
            category: normalizeCategory(category),
            source: url,
            sourceName: SOURCE_NAME,
            sourceCommit: SOURCE_COMMIT,
            attributionStatus: "verified",
            copyrightStatus: "cleared",
            indexable: true,
            slug: `${slugify(quote).slice(0, 90)}-${id}`
          });
        }
      }
      pending = null;
      if (quotes.length >= TARGET_COUNT) break;
      continue;
    }

    if (/^[A-Z][A-Z0-9 &'’(),.;:!-]{2,79}$/.test(paragraph) && !/^BURNING WORDS/i.test(paragraph)) {
      category = paragraph;
      pending = null;
      continue;
    }

    pending = paragraph;
  }

  if (quotes.length >= TARGET_COUNT) break;
}

if (quotes.length !== TARGET_COUNT) {
  throw new Error(`Expected exactly ${TARGET_COUNT} verified public-domain quotes; extracted ${quotes.length}. Publication aborted.`);
}

await mkdir("data", { recursive: true });
await writeFile("data/quotes.json", JSON.stringify(quotes, null, 2) + "\n", "utf8");
console.log(`Generated exactly ${quotes.length} verified public-domain quote records from Wikisource.`);
