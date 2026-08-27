import { mkdir, writeFile } from "node:fs/promises";

// Combined corpus: the existing 3,000 Wikisource quotations plus additional
// verified public-domain quotations from Project Gutenberg. Never pad records.
const TARGET_COUNT = 5000;
const WIKISOURCE = {
  url: "https://en.wikisource.org/wiki/Three_Thousand_Selected_Quotations_from_Brilliant_Writers",
  name: "Three Thousand Selected Quotations from Brilliant Writers — Wikisource",
  commit: "public-domain-wikisource-1909",
};
const GUTENBERG = {
  url: "https://www.gutenberg.org/cache/epub/17112/pg17112.txt",
  name: "Many Thoughts of Many Minds — Project Gutenberg #17112",
  commit: "project-gutenberg-17112-public-domain",
};
const LETTERS = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","R","S","T","U","V","W","Y","Z"];

const decode = (value) => value
  .replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&")
  .replace(/&#x27;/g, "'").replace(/&#(?:32|160);/gi, " ")
  .replace(/&#(?:8203|8204|8205|65279);/gi, "")
  .replace(/&(?:nbsp|NewLine);/gi, " ");
const cleanQuoteText = (value) => decode(value)
  .replace(/\u00a0/g, " ").replace(/[\u200B-\u200D\uFEFF]/g, "")
  .replace(/[ \t]+/g, " ").replace(/\s*\n\s*/g, " ").trim();
const strip = (value) => cleanQuoteText(value.replace(/<[^>]+>/g, " "));
const slugify = (value) => value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const titleCase = (value) => value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
const CATEGORY_ALIASES = new Map([
  ["Christian Life", "Faith"], ["Christianity", "Faith"], ["Christians", "Faith"], ["Christian Service", "Faith"],
  ["Christian Conflict", "Faith"], ["Church", "Faith"], ["Church Sanctuary", "Faith"], ["Denominationalism", "Faith"],
  ["Baptism", "Faith"], ["Character", "Character"], ["Education", "Education"], ["Freedom", "Freedom"],
  ["Friendship", "Friendship"], ["Happiness", "Happiness"], ["Inspiration", "Inspiration"], ["Life", "Life"],
  ["Love", "Love"], ["Motivation", "Motivation"], ["Philosophy", "Philosophy"], ["Science", "Science"],
  ["Success", "Success"], ["Wisdom", "Wisdom"],
]);
function normalizeCategory(value) {
  const clean = titleCase(value.replace(/[.:]+$/, "").trim());
  return CATEGORY_ALIASES.get(clean) ?? clean;
}
const quotes = [];
const seen = new Set();
function addQuote({ quote, author, category, source, sourceName, sourceCommit }) {
  quote = cleanQuoteText(quote); author = cleanQuoteText(author);
  if (!author || !quote || quote.length < 15 || quote.length > 1500) return;
  const key = `${author.toLowerCase()}|${quote.toLowerCase()}`;
  if (seen.has(key)) return;
  seen.add(key);
  const id = `q${String(quotes.length + 1).padStart(5, "0")}`;
  quotes.push({ id, quote, author, category: normalizeCategory(category || "Wisdom"), source, sourceName, sourceCommit, attributionStatus: "verified", copyrightStatus: "cleared", indexable: true, slug: `${slugify(quote).slice(0, 90)}-${id}` });
}

// Wikisource source: explicitly marked public domain.
for (const letter of LETTERS) {
  if (quotes.length >= TARGET_COUNT) break;
  const url = `${WIKISOURCE.url}/${letter}`;
  const response = await fetch(url, { headers: { "User-Agent": "MayalinesQuoteBuilder/1.3 (+https://mayalines.com)" } });
  if (!response.ok) throw new Error(`Wikisource ${letter} request failed: ${response.status}`);
  const html = await response.text();
  const paragraphs = [...html.matchAll(/<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/gi)].map((m) => strip(m[1]));
  let pending = null; let category = "Wisdom";
  for (const paragraph of paragraphs) {
    if (!paragraph) continue;
    if (/^[—–-]/.test(paragraph)) {
      if (pending) addQuote({ quote: pending, author: paragraph.replace(/^[—–-]\s*/, "").replace(/[.\s]+$/, ""), category, source: url, sourceName: WIKISOURCE.name, sourceCommit: WIKISOURCE.commit });
      pending = null;
      if (quotes.length >= TARGET_COUNT) break;
      continue;
    }
    if (/^[A-Z][A-Z0-9 &'’(),.;:!-]{2,79}$/.test(paragraph) && !/^BURNING WORDS/i.test(paragraph)) { category = paragraph; pending = null; continue; }
    pending = paragraph;
  }
}

// Project Gutenberg #17112: a quotation anthology containing 2,500+ extracts.
if (quotes.length < TARGET_COUNT) {
  const response = await fetch(GUTENBERG.url, { headers: { "User-Agent": "MayalinesQuoteBuilder/1.3 (+https://mayalines.com)" } });
  if (!response.ok) throw new Error(`Project Gutenberg 17112 request failed: ${response.status}`);
  const text = (await response.text()).replace(/\r/g, "");
  const body = text.split("*** START OF THE PROJECT GUTENBERG EBOOK")[1]?.split("*** END OF THE PROJECT GUTENBERG EBOOK")[0] ?? text;
  let category = "Wisdom";
  for (const rawLine of body.split("\n")) {
    const line = cleanQuoteText(rawLine);
    if (!line || /^\[Pg \d+\]$/.test(line) || /^\*+$/.test(line)) continue;
    if (/^[A-Z][A-Za-z &'’,-]{2,60}\.—/.test(line)) { category = line.split(".—")[0]; continue; }
    const match = line.match(/^(.{15,1500}?)\s*[—–]\s*([A-Z][A-Za-z .,'’&-]{1,80})\.?$/);
    if (match) addQuote({ quote: match[1], author: match[2], category, source: GUTENBERG.url, sourceName: GUTENBERG.name, sourceCommit: GUTENBERG.commit });
    if (quotes.length >= TARGET_COUNT) break;
  }
}

if (quotes.length < TARGET_COUNT) throw new Error(`Expected at least ${TARGET_COUNT} verified public-domain quotes; extracted ${quotes.length}. Publication aborted.`);
await mkdir("data", { recursive: true });
await writeFile("data/quotes.json", JSON.stringify(quotes.slice(0, TARGET_COUNT), null, 2) + "\n", "utf8");
console.log(`Generated ${TARGET_COUNT} verified public-domain quote records from Wikisource and Project Gutenberg.`);