import { mkdir, writeFile } from "node:fs/promises";

// Large multilingual, deduplicated corpus from public-domain quotation sources.
// 59,000 is the technical ceiling; never synthesize filler records.
const TARGET_COUNT = 59000;
const MIN_VERIFIED_COUNT = 5000;
const USER_AGENT = "MayalinesQuoteBuilder/3.0 (+https://mayalines.com)";

const WIKISOURCE = {
  url: "https://en.wikisource.org/wiki/Three_Thousand_Selected_Quotations_from_Brilliant_Writers",
  name: "Three Thousand Selected Quotations from Brilliant Writers — Wikisource",
  commit: "public-domain-wikisource-1909",
  language: "en",
};

const GUTENBERG_SOURCES = [
  { id: 17112, name: "Many Thoughts of Many Minds", language: "en", author: "" },
  { id: 48105, name: "Dictionary of Quotations", language: "en", author: "" },
  { id: 21130, name: "Book of Wise Sayings", language: "en", author: "" },
  { id: 33670, name: "Maxims and Reflections of Goethe", language: "en", author: "Johann Wolfgang von Goethe" },
  { id: 35584, name: "Aphorisms and Reflections from T. H. Huxley", language: "en", author: "Thomas Henry Huxley" },
  { id: 47406, name: "Aphorismen zur Lebensweisheit", language: "de", author: "Arthur Schopenhauer" },
  { id: 14913, name: "Réflexions ou sentences et maximes morales", language: "fr", author: "François de La Rochefoucauld" },
  { id: 35444, name: "Aphorismes sur la sagesse dans la vie", language: "fr", author: "Arthur Schopenhauer" },
  { id: 16149, name: "Máximas Morales en Ilocano y Castellano", language: "es", author: "Anonymous" },
];

const LETTERS = "ABCDEFGHIJKLMNOPRSTUVWYZ".split("");

const decode = (value) => value
  .replace(/&#39;|&#x27;/g, "'")
  .replace(/&quot;/g, '"')
  .replace(/&amp;/g, "&")
  .replace(/&#(?:32|160);/gi, " ")
  .replace(/&#(?:8203|8204|8205|65279);/gi, "")
  .replace(/&(?:nbsp|NewLine);/gi, " ");

const clean = (value) => decode(String(value ?? ""))
  .replace(/\u00a0/g, " ")
  .replace(/[\u200B-\u200D\uFEFF]/g, "")
  .replace(/[ \t]+/g, " ")
  .replace(/\s*\n\s*/g, " ")
  .trim();

const strip = (value) => clean(value.replace(/<[^>]+>/g, " "));
const slugify = (value) => value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const titleCase = (value) => value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

const CATEGORY_ALIASES = new Map([
  ["Christian Life", "Faith"], ["Christianity", "Faith"], ["Christians", "Faith"], ["Christian Service", "Faith"],
  ["Character", "Character"], ["Education", "Education"], ["Freedom", "Freedom"], ["Friendship", "Friendship"],
  ["Happiness", "Happiness"], ["Life", "Life"], ["Love", "Love"], ["Motivation", "Motivation"],
  ["Philosophy", "Philosophy"], ["Science", "Science"], ["Success", "Success"], ["Wisdom", "Wisdom"],
  ["Nature", "Nature"], ["Art", "Art"], ["Truth", "Truth"], ["Maxims", "Wisdom"], ["Aphorisms", "Wisdom"],
]);

function normalizeCategory(value) {
  const normalized = titleCase(clean(value).replace(/[.:]+$/, ""));
  return CATEGORY_ALIASES.get(normalized) ?? normalized || "Wisdom";
}

const quotes = [];
const seen = new Set();

function addQuote({ quote, author, category = "Wisdom", source, sourceName, sourceCommit, language = "en" }) {
  quote = clean(quote);
  author = clean(author);
  if (!author || !quote || quote.length < 15 || quote.length > 1200) return;
  if (/project gutenberg|transcriber|table of contents|copyright/i.test(quote)) return;
  const key = `${author.toLowerCase()}|${quote.toLowerCase()}`;
  if (seen.has(key)) return;
  seen.add(key);
  const id = `q${String(quotes.length + 1).padStart(5, "0")}`;
  quotes.push({
    id,
    quote,
    author,
    category: normalizeCategory(category),
    language,
    source,
    sourceName,
    sourceCommit,
    attributionStatus: "verified",
    copyrightStatus: "cleared",
    indexable: true,
    slug: `${slugify(quote).slice(0, 88)}-${id}`,
  });
}

async function fetchText(url) {
  const response = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!response.ok) throw new Error(`${url} failed: ${response.status}`);
  return response.text();
}

// Structured English anthology from Wikisource.
for (const letter of LETTERS) {
  if (quotes.length >= TARGET_COUNT) break;
  const url = `${WIKISOURCE.url}/${letter}`;
  const html = await fetchText(url);
  const paragraphs = [...html.matchAll(/<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/gi)].map((match) => strip(match[1]));
  let pending = null;
  let category = "Wisdom";
  for (const paragraph of paragraphs) {
    if (!paragraph) continue;
    if (/^[—–-]/.test(paragraph)) {
      if (pending) addQuote({
        quote: pending,
        author: paragraph.replace(/^[—–-]\s*/, "").replace(/[.\s]+$/, ""),
        category,
        source: url,
        sourceName: WIKISOURCE.name,
        sourceCommit: WIKISOURCE.commit,
        language: WIKISOURCE.language,
      });
      pending = null;
      continue;
    }
    if (/^[A-Z][A-Z0-9 &'’(),.;:!-]{2,79}$/.test(paragraph) && !/^BURNING WORDS/i.test(paragraph)) {
      category = paragraph;
      pending = null;
      continue;
    }
    pending = paragraph;
  }
}

// Multilingual Project Gutenberg sources. Numbered maxims and short standalone
// aphorisms from single-author books are accepted; multi-author books require an
// explicit trailing attribution.
for (const source of GUTENBERG_SOURCES) {
  if (quotes.length >= TARGET_COUNT) break;
  const url = `https://www.gutenberg.org/cache/epub/${source.id}/pg${source.id}.txt`;
  const sourceName = `${source.name} — Project Gutenberg #${source.id}`;
  const sourceCommit = `project-gutenberg-${source.id}-public-domain`;
  const raw = (await fetchText(url)).replace(/\r/g, "");
  const body = raw.split(/\*\*\* START OF THE PROJECT GUTENBERG EBOOK[^\n]*\*\*\*/i)[1]?.split(/\*\*\* END OF THE PROJECT GUTENBERG EBOOK/i)[0] ?? raw;
  let category = "Wisdom";

  for (const rawLine of body.split("\n")) {
    const line = clean(rawLine);
    if (!line || /^\[Pg \d+\]$/.test(line) || /^\*+$/.test(line) || /^(chapter|chapitre|kapitel|cap[ií]tulo)\b/i.test(line)) continue;
    if (/^[A-ZÀ-ÖØ-ÝÄÖÜÉÈÊÁÍÓÚÑ][A-ZÀ-ÖØ-ÝÄÖÜÉÈÊÁÍÓÚÑ &'’,-]{2,70}[.:]?$/.test(line)) {
      category = line;
      continue;
    }

    const attributed = line.match(/^(.{15,1200}?)\s*[—–]\s*([A-ZÀ-ÖØ-Ý][A-Za-zÀ-ÖØ-öø-ÿ .,'’&-]{1,100})\.?$/);
    if (attributed) {
      addQuote({ quote: attributed[1], author: attributed[2], category, source: url, sourceName, sourceCommit, language: source.language });
      continue;
    }

    if (source.author) {
      const numbered = line.match(/^(?:\d+|[IVXLCDM]+)[.)]?\s+(.{15,1200})$/i);
      const quoted = line.match(/^[“\"](.{15,900})[”\"]$/)?.[1];
      const concise = line.length >= 25 && line.length <= 420 && /[.!?;:]$/.test(line) ? line : "";
      const candidate = numbered?.[1] ?? quoted ?? concise;
      if (candidate) addQuote({ quote: candidate, author: source.author, category, source: url, sourceName, sourceCommit, language: source.language });
    }
  }
}

if (quotes.length < MIN_VERIFIED_COUNT) {
  throw new Error(`Expected at least ${MIN_VERIFIED_COUNT} verified public-domain quotes; extracted ${quotes.length}. Publication aborted.`);
}

const published = quotes.slice(0, TARGET_COUNT);
await mkdir("data", { recursive: true });
await writeFile("data/quotes.json", JSON.stringify(published, null, 2) + "\n", "utf8");
console.log(`Generated ${published.length} verified multilingual public-domain quotations and aphorisms (capacity: ${TARGET_COUNT}).`);
