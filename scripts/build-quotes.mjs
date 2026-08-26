import { mkdir, writeFile } from "node:fs/promises";

// CC0 dataset. The dataset license does not automatically clear the underlying
// quotation copyrights, so generated records remain non-indexable until reviewed.
const SOURCE_URL = "https://raw.githubusercontent.com/alvations/Quotables/master/author-quote.txt";
const SOURCE_NAME = "alvations/Quotables — CC0 dataset";
const TARGET_COUNT = 2000;

const FALLBACK_CATEGORIES = ["Wisdom", "Life", "Success", "Motivation", "Inspiration"];
const CATEGORY_RULES = [
  ["Love", /\b(love|heart|romance|lover|affection|marriage|friendship)\b/i],
  ["Success", /\b(success|achievement|accomplish|goal|victory|winning|failure)\b/i],
  ["Motivation", /\b(action|courage|effort|discipline|perseverance|determination|work|try|dare)\b/i],
  ["Wisdom", /\b(wisdom|wise|truth|knowledge|understand|learn|reason|mind)\b/i],
  ["Life", /\b(life|living|death|born|age|future|past|present|time)\b/i],
  ["Happiness", /\b(happy|happiness|joy|pleasure|delight|content)\b/i],
  ["Freedom", /\b(freedom|liberty|free|independence)\b/i],
  ["Courage", /\b(brave|bravery|fear|courage|bold)\b/i],
  ["Leadership", /\b(leader|leadership|command|government|king|president)\b/i],
  ["Education", /\b(education|school|teacher|student|study|book)\b/i],
  ["Science", /\b(science|scientist|nature|universe|physics|mathematics)\b/i],
  ["Art", /\b(art|artist|music|poetry|poet|beauty|literature)\b/i],
  ["Humor", /\b(laugh|laughing|humor|funny|joke|wit)\b/i],
];

function slugify(value) {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function categoryFor(quote, index) {
  for (const [category, pattern] of CATEGORY_RULES) {
    if (pattern.test(quote)) return category;
  }
  return FALLBACK_CATEGORIES[index % FALLBACK_CATEGORIES.length];
}

const response = await fetch(SOURCE_URL, {
  headers: { "User-Agent": "mayalines-data-builder/1.0" },
});
if (!response.ok) throw new Error(`Could not fetch quote source: ${response.status}`);

const raw = await response.text();
const quotes = [];
const seen = new Set();

for (const line of raw.split(/\r?\n/)) {
  const separator = line.indexOf("\t");
  if (separator <= 0) continue;

  const author = line.slice(0, separator).trim();
  const quote = line.slice(separator + 1).trim();
  if (!author || !quote || quote.length < 10 || quote.length > 400) continue;

  const normalized = `${author.toLowerCase()}|${quote.toLowerCase()}`;
  if (seen.has(normalized)) continue;
  seen.add(normalized);

  const id = String(quotes.length + 1).padStart(4, "0");
  quotes.push({
    id: `q${id}`,
    quote,
    author,
    category: categoryFor(quote, quotes.length),
    tags: [],
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
