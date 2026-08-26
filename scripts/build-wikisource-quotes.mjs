import { mkdir, writeFile } from "node:fs/promises";

const BASE = "https://en.wikisource.org/w/api.php";
const BOOK = "Three Thousand Selected Quotations from Brilliant Writers";
const TARGET = 2000;
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const sourceUrl = "https://en.wikisource.org/wiki/Three_Thousand_Selected_Quotations_from_Brilliant_Writers";

function clean(value) {
  return value.replace(/\u200b/g, "").replace(/\s+/g, " ").trim();
}
function slugify(value) {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
function category(subject) {
  const s = subject.toLowerCase();
  if (/love|affection|friend/.test(s)) return "Love";
  if (/wisdom|prudence|knowledge|thought/.test(s)) return "Wisdom";
  if (/success|achievement|work|industry|action/.test(s)) return "Success";
  if (/life|death|happiness|sorrow/.test(s)) return "Life";
  if (/courage|bravery|fortitude/.test(s)) return "Courage";
  if (/character|virtue|honor/.test(s)) return "Character";
  if (/education|learning/.test(s)) return "Education";
  if (/freedom|liberty/.test(s)) return "Freedom";
  if (/faith|religion|christ/.test(s)) return "Faith";
  return "Quotes";
}

async function getWikitext(title) {
  const url = new URL(BASE);
  url.searchParams.set("action", "query");
  url.searchParams.set("prop", "revisions");
  url.searchParams.set("rvprop", "content");
  url.searchParams.set("rvslots", "main");
  url.searchParams.set("format", "json");
  url.searchParams.set("formatversion", "2");
  url.searchParams.set("titles", title);
  const response = await fetch(url, { headers: { "User-Agent": "mayalines-quote-import/1.0" } });
  if (!response.ok) throw new Error(`Wikisource API ${response.status}`);
  const data = await response.json();
  return data.query?.pages?.[0]?.revisions?.[0]?.slots?.main?.content ?? "";
}

const quotes = [];
const seen = new Set();
for (const letter of letters) {
  const text = await getWikitext(`${BOOK}/${letter}`);
  const lines = text.split(/\r?\n/);
  let subject = "Quotes";
  let body = [];
  for (const raw of lines) {
    const line = raw.trim();
    const heading = line.match(/^={2,4}\s*([^=]+?)\s*={2,4}$/);
    if (heading) { subject = clean(heading[1]); continue; }
    if (!line || /^\*+\s*$/.test(line) || /^----/.test(line)) continue;
    if (/^—\s*/.test(line) || /^-\s*/.test(line)) {
      const author = clean(line.replace(/^[-—]+\s*/, "").replace(/\[\[|\]\]/g, "").replace(/\.$/, ""));
      const quote = clean(body.join(" ").replace(/'{2,}/g, "").replace(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g, "$1"));
      body = [];
      if (!quote || !author || quote.length < 15 || quote.length > 700) continue;
      const key = `${author.toLowerCase()}|${quote.toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const id = String(quotes.length + 1).padStart(4, "0");
      quotes.push({ id: `q${id}`, quote, author, category: category(subject), source: sourceUrl, sourceName: BOOK, sourceType: "public-domain-book", attributionStatus: "source-attributed", copyrightStatus: "public-domain-source", indexable: true, slug: `${slugify(quote).slice(0, 90)}-${id}` });
      if (quotes.length >= TARGET) break;
    } else if (!/^\s*\|/.test(line) && !/^\[\[/.test(line)) {
      body.push(line);
    }
  }
  if (quotes.length >= TARGET) break;
}
if (quotes.length < TARGET) throw new Error(`Only extracted ${quotes.length} verified-source quotations; refusing partial dataset.`);
await mkdir("data", { recursive: true });
await writeFile("data/quotes.json", `${JSON.stringify(quotes, null, 2)}\n`, "utf8");
console.log(`Generated ${quotes.length} quotations from ${BOOK}.`);
