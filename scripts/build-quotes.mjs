import { mkdir, writeFile } from "node:fs/promises";

const SOURCE_URL = "https://raw.githubusercontent.com/quotable-io/data/master/data/quotes.json";
const SOURCE_NAME = "Quotable open-source quote dataset";
const TARGET_COUNT = 2000;

const CATEGORY_MAP = new Map([
  ["love", "Love"], ["friendship", "Friendship"], ["happiness", "Happiness"],
  ["success", "Success"], ["motivational", "Motivation"], ["inspirational", "Inspiration"],
  ["wisdom", "Wisdom"], ["life", "Life"], ["philosophy", "Philosophy"],
  ["courage", "Courage"], ["freedom", "Freedom"], ["science", "Science"],
  ["leadership", "Leadership"], ["education", "Education"], ["technology", "Technology"],
  ["business", "Business"], ["humor", "Humor"], ["art", "Art"], ["character", "Character"],
  ["change", "Change"], ["famous quotes", "Famous Quotes"]
]);

const FALLBACK_CATEGORIES = ["Wisdom", "Life", "Success", "Motivation", "Inspiration"];

function slugify(value) {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function primaryCategory(tags, index) {
  for (const tag of tags ?? []) {
    const mapped = CATEGORY_MAP.get(String(tag).toLowerCase());
    if (mapped && mapped !== "Famous Quotes") return mapped;
  }
  return FALLBACK_CATEGORIES[index % FALLBACK_CATEGORIES.length];
}

const response = await fetch(SOURCE_URL, {
  headers: { "User-Agent": "quotes-site-data-builder/1.0" },
});
if (!response.ok) throw new Error(`Could not fetch quote source: ${response.status}`);

const source = await response.json();
const quotes = [];
const seen = new Set();

for (const item of source) {
  const quote = typeof item.content === "string" ? item.content.trim() : "";
  const author = typeof item.author === "string" ? item.author.trim() : "";
  if (!quote || !author || quote.length < 10 || quote.length > 400) continue;

  const key = `${author.toLowerCase()}|${quote.toLowerCase()}`;
  if (seen.has(key)) continue;
  seen.add(key);

  const id = String(quotes.length + 1).padStart(4, "0");
  const category = primaryCategory(item.tags, quotes.length);
  quotes.push({
    id: `q${id}`,
    quote,
    author,
    category,
    tags: (item.tags ?? []).map((tag) => String(tag)),
    source: SOURCE_URL,
    sourceName: SOURCE_NAME,
    attributionStatus: "source-dataset-attributed",
    copyrightStatus: "review-required",
    indexable: false,
    slug: `${slugify(quote).slice(0, 90)}-${id}`,
  });

  if (quotes.length >= TARGET_COUNT) break;
}

if (quotes.length < TARGET_COUNT) {
  throw new Error(`Only collected ${quotes.length} usable quotes; refusing an incomplete ${TARGET_COUNT}-quote build.`);
}

await mkdir("data", { recursive: true });
await writeFile("data/quotes.json", `${JSON.stringify(quotes, null, 2)}\n`, "utf8");
console.log(`Generated ${quotes.length} quote records from ${SOURCE_NAME}.`);
