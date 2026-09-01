import { mkdir, readFile, writeFile } from "node:fs/promises";

const TARGET_COUNT = 59000;
const MIN_REQUIRED_COUNT = 10000;
const USER_AGENT = "MayalinesQuoteBuilder/4.0 (+https://mayalines.com)";

const QUOTABLES = {
  commit: "7936d4c2ee93df843854777850ebf926998f8392",
  url: "https://raw.githubusercontent.com/alvations/Quotables/7936d4c2ee93df843854777850ebf926998f8392/author-quote.txt",
  name: "Quotables — alvations/Quotables (CC0 1.0 dataset)",
};

const WIKISOURCE = {
  url: "https://en.wikisource.org/wiki/Three_Thousand_Selected_Quotations_from_Brilliant_Writers",
  name: "Three Thousand Selected Quotations from Brilliant Writers — Wikisource",
  commit: "public-domain-wikisource-1909",
  language: "en",
};

const GUTENBERG_SOURCES = [
  { id: 17112, name: "Many Thoughts of Many Minds", language: "en", author: "" },
  { id: 48105, name: "Dictionary of Quotations from Ancient and Modern, English and Foreign Sources", language: "en", author: "" },
  { id: 27889, name: "Familiar Quotations", language: "en", author: "" },
  { id: 21130, name: "Book of Wise Sayings", language: "en", author: "" },
  { id: 33670, name: "Maxims and Reflections", language: "en", author: "Johann Wolfgang von Goethe" },
  { id: 35584, name: "Aphorisms and Reflections from T. H. Huxley", language: "en", author: "Thomas Henry Huxley" },
  { id: 47406, name: "Aphorismen zur Lebensweisheit", language: "de", author: "Arthur Schopenhauer" },
  { id: 14913, name: "Réflexions ou sentences et maximes morales", language: "fr", author: "François de La Rochefoucauld" },
  { id: 35444, name: "Aphorismes sur la sagesse dans la vie", language: "fr", author: "Arthur Schopenhauer" },
  { id: 16149, name: "Máximas Morales en Ilocano y Castellano", language: "es", author: "Anonymous" },
];

const LETTERS = "ABCDEFGHIJKLMNOPRSTUVWYZ".split("");
const decode = (value) => String(value ?? "").replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&#(?:32|160);/gi, " ").replace(/&#(?:8203|8204|8205|65279);/gi, "").replace(/&(?:nbsp|NewLine);/gi, " ");
const clean = (value) => decode(value).replace(/\u00a0/g, " ").replace(/[\u200B-\u200D\uFEFF]/g, "").replace(/[ \t]+/g, " ").replace(/\s*\n\s*/g, " ").trim();
const strip = (value) => clean(value.replace(/<[^>]+>/g, " "));
const slugify = (value) => value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const titleCase = (value) => value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

function categoryFor(text) {
  const value = text.toLowerCase();
  if (/\blove\b|heart|romance|marriage/.test(value)) return "Love";
  if (/success|achiev|goal|work|career|effort/.test(value)) return "Success";
  if (/courage|brave|fear|strength/.test(value)) return "Courage";
  if (/friend|friendship/.test(value)) return "Friendship";
  if (/happy|happiness|joy|smile/.test(value)) return "Happiness";
  if (/truth|honest|\blie\b/.test(value)) return "Truth";
  if (/science|knowledge|learn|education|teacher/.test(value)) return "Education";
  if (/freedom|liberty/.test(value)) return "Freedom";
  if (/hope|dream|future/.test(value)) return "Hope";
  if (/life|living|death|world|human/.test(value)) return "Life";
  return "Wisdom";
}

const CATEGORY_ALIASES = new Map([["Christian Life","Faith"],["Christianity","Faith"],["Christians","Faith"],["Christian Service","Faith"],["Character","Character"],["Education","Education"],["Freedom","Freedom"],["Friendship","Friendship"],["Happiness","Happiness"],["Life","Life"],["Love","Love"],["Motivation","Motivation"],["Philosophy","Philosophy"],["Science","Science"],["Success","Success"],["Wisdom","Wisdom"],["Nature","Nature"],["Art","Art"],["Truth","Truth"],["Maxims","Wisdom"],["Aphorisms","Wisdom"]]);
function normalizeCategory(value) { const normalized = titleCase(clean(value).replace(/[.:]+$/, "")); return CATEGORY_ALIASES.get(normalized) || normalized || "Wisdom"; }

const quotes = [];
const seen = new Set();
const usedIds = new Set();
let nextNumber = 1;

function nextId() {
  while (usedIds.has(`q${String(nextNumber).padStart(5, "0")}`)) nextNumber += 1;
  const id = `q${String(nextNumber).padStart(5, "0")}`;
  usedIds.add(id);
  nextNumber += 1;
  return id;
}

function addQuote({ quote, author, category = "Wisdom", source, sourceName, sourceCommit, language = "en", id, slug, attributionStatus = "verified", copyrightStatus = "cleared", indexable = true }) {
  quote = clean(quote); author = clean(author);
  if (!author || !quote || quote.length < 15 || quote.length > 1200) return false;
  if (/https?:\/\/|www\.|project gutenberg|transcriber|table of contents|copyright|all rights reserved|ebook|proofread/i.test(quote)) return false;
  const key = `${author.toLowerCase()}|${quote.toLowerCase()}`;
  if (seen.has(key)) return false;
  seen.add(key);
  const generatedId = id && !usedIds.has(id) ? id : nextId();
  usedIds.add(generatedId);
  quotes.push({ id: generatedId, quote, author, category: normalizeCategory(category), language, source, sourceName, sourceCommit, attributionStatus, copyrightStatus, indexable, slug: slug || `${slugify(quote).slice(0, 88)}-${generatedId}` });
  return true;
}

async function fetchText(url, required = false) {
  try {
    const response = await fetch(url, { headers: { "User-Agent": USER_AGENT, Accept: "text/plain,text/html" } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.text();
  } catch (error) {
    if (required) throw error;
    console.warn(`Skipping source ${url}: ${error instanceof Error ? error.message : String(error)}`);
    return "";
  }
}

try {
  const existing = JSON.parse(await readFile("data/quotes.json", "utf8"));
  for (const item of existing) addQuote({ ...item, language: item.language || "en" });
} catch (error) {
  console.warn(`Could not seed existing quote corpus: ${error instanceof Error ? error.message : String(error)}`);
}

// Primary high-volume source: 39,269 tab-separated author/quote records.
const quotablesText = await fetchText(QUOTABLES.url, true);
let quotablesAdded = 0;
for (const rawLine of quotablesText.split(/\r?\n/)) {
  if (quotes.length >= TARGET_COUNT) break;
  const tab = rawLine.indexOf("\t");
  if (tab <= 0) continue;
  const author = clean(rawLine.slice(0, tab));
  const quote = clean(rawLine.slice(tab + 1));
  if (addQuote({
    quote,
    author,
    category: categoryFor(quote),
    source: QUOTABLES.url,
    sourceName: QUOTABLES.name,
    sourceCommit: QUOTABLES.commit,
    language: "en",
    attributionStatus: "source-derived",
    copyrightStatus: "needs-review",
    indexable: true,
  })) quotablesAdded += 1;
}

// Add strongly sourced public-domain material with full indexing clearance.
for (const letter of LETTERS) {
  if (quotes.length >= TARGET_COUNT) break;
  const url = `${WIKISOURCE.url}/${letter}`;
  const html = await fetchText(url); if (!html) continue;
  const paragraphs = [...html.matchAll(/<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/gi)].map((match) => strip(match[1]));
  let pending = null; let category = "Wisdom";
  for (const paragraph of paragraphs) {
    if (!paragraph) continue;
    if (/^[—–-]/.test(paragraph)) { if (pending) addQuote({ quote: pending, author: paragraph.replace(/^[—–-]\s*/, "").replace(/[.\s]+$/, ""), category, source: url, sourceName: WIKISOURCE.name, sourceCommit: WIKISOURCE.commit, language: WIKISOURCE.language }); pending = null; continue; }
    if (/^[A-Z][A-Z0-9 &'’(),.;:!-]{2,79}$/.test(paragraph) && !/^BURNING WORDS/i.test(paragraph)) { category = paragraph; pending = null; continue; }
    pending = paragraph;
  }
}

for (const source of GUTENBERG_SOURCES) {
  if (quotes.length >= TARGET_COUNT) break;
  const url = `https://www.gutenberg.org/cache/epub/${source.id}/pg${source.id}.txt`;
  const sourceName = `${source.name} — Project Gutenberg #${source.id}`;
  const sourceCommit = `project-gutenberg-${source.id}-public-domain`;
  const fetched = await fetchText(url); if (!fetched) continue;
  const raw = fetched.replace(/\r/g, "");
  const body = raw.split(/\*\*\* START OF THE PROJECT GUTENBERG EBOOK[^\n]*\*\*\*/i)[1]?.split(/\*\*\* END OF THE PROJECT GUTENBERG EBOOK/i)[0] ?? raw;
  let category = "Wisdom";
  for (const rawLine of body.split("\n")) {
    const line = clean(rawLine);
    if (!line || /^\[Pg \d+\]$/.test(line) || /^\*+$/.test(line) || /^(chapter|chapitre|kapitel|cap[ií]tulo|hoofdstuk)\b/i.test(line)) continue;
    if (/^[A-ZÀ-ÖØ-ÝÄÖÜÉÈÊÁÍÓÚÑ][A-ZÀ-ÖØ-ÝÄÖÜÉÈÊÁÍÓÚÑ &'’,-]{2,70}[.:]?$/.test(line)) { category = line; continue; }
    const attributed = line.match(/^(.{15,1200}?)\s*[—–]\s*([A-ZÀ-ÖØ-Ý][A-Za-zÀ-ÖØ-öø-ÿ .,'’&-]{1,100})\.?$/);
    if (attributed) { addQuote({ quote: attributed[1], author: attributed[2], category, source: url, sourceName, sourceCommit, language: source.language }); continue; }
    if (source.author) {
      const numbered = line.match(/^(?:\d+|[IVXLCDM]+)[.)]?\s+(.{15,1200})$/i);
      const quoted = line.match(/^[“\"](.{15,900})[”\"]$/)?.[1];
      const concise = line.length >= 25 && line.length <= 420 && /[.!?;:]$/.test(line) ? line : "";
      const candidate = numbered?.[1] ?? quoted ?? concise;
      if (candidate) addQuote({ quote: candidate, author: source.author, category, source: url, sourceName, sourceCommit, language: source.language });
    }
  }
}

const published = quotes.slice(0, TARGET_COUNT);
if (published.length < MIN_REQUIRED_COUNT) throw new Error(`Quote build produced ${published.length} records; at least ${MIN_REQUIRED_COUNT} concrete quotes are required.`);
await mkdir("data", { recursive: true });
await writeFile("data/quotes.json", JSON.stringify(published, null, 2) + "\n", "utf8");
console.log(`Generated ${published.length} concrete quotes; ${quotablesAdded} added from pinned Quotables source. Minimum ${MIN_REQUIRED_COUNT} satisfied.`);
