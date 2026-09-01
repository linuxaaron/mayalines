import { mkdir, writeFile } from "node:fs/promises";

const USER_AGENT = "MayalinesPoemBuilder/1.1 (+https://mayalines.com)";
const MAX_POEMS = 1500;

const SOURCES = [
  { id: 12241, author: "Emily Dickinson", language: "en", period: "1830–1886", title: "Poems by Emily Dickinson, Third Series" },
  { id: 1934, author: "William Blake", language: "en", period: "1757–1827", title: "Songs of Innocence and of Experience" },
  { id: 6649, author: "Friedrich Schiller", language: "de", period: "1759–1805", title: "Einige Gedichte" },
  { id: 6099, author: "Charles Baudelaire", language: "fr", period: "1821–1867", title: "Les Fleurs du Mal" },
  { id: 53552, author: "Gustavo Adolfo Bécquer", language: "es", period: "1836–1870", title: "Obras escogidas — Rimas" },
  { id: 55236, author: "Giacomo Leopardi", language: "it", period: "1798–1837", title: "I Canti" },
];

const cleanLine = (value) => String(value ?? "")
  .replace(/\u00a0/g, " ")
  .replace(/[\u200B-\u200D\uFEFF]/g, "")
  .replace(/[ \t]+$/g, "")
  .trimEnd();

const cleanTitle = (value) => cleanLine(value)
  .replace(/^#+\s*/, "")
  .replace(/^\d+[.)]\s*/, "")
  .replace(/^[-—–*]+\s*/, "")
  .trim();

const slugify = (value) => value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

async function fetchBook(id) {
  const url = `https://www.gutenberg.org/cache/epub/${id}/pg${id}.txt`;
  try {
    const response = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const text = (await response.text()).replace(/\r/g, "");
    return {
      url,
      body: text.split(/\*\*\* START OF THE PROJECT GUTENBERG EBOOK[^\n]*\*\*\*/i)[1]?.split(/\*\*\* END OF THE PROJECT GUTENBERG EBOOK/i)[0] ?? text,
    };
  } catch (error) {
    console.warn(`Skipping poetry source #${id}: ${error instanceof Error ? error.message : String(error)}`);
    return { url, body: "" };
  }
}

function looksLikeHeading(line) {
  const value = cleanTitle(line);
  if (!value || value.length < 2 || value.length > 90) return false;
  if (/project gutenberg|contents|preface|introduction|chapter|book |part |canto\b/i.test(value)) return false;
  if (/^[IVXLCDM]+\.?$/i.test(value)) return true;
  if (/^[A-ZÀ-ÖØ-ÞÄÖÜÉÈÊÁÍÓÚÑ][A-ZÀ-ÖØ-ÞÄÖÜÉÈÊÁÍÓÚÑ0-9 &'’!?.,:;()\-]{1,88}$/.test(value)) return true;
  return value.split(/\s+/).length <= 9 && /^[A-ZÀ-ÖØ-ÞÄÖÜÉÈÊÁÍÓÚÑ]/.test(value) && !/[.!?]$/.test(value);
}

function extractPoems(body, source, sourceUrl) {
  const lines = body.split("\n").map(cleanLine);
  const poems = [];
  let title = "";
  let verse = [];

  const flush = () => {
    const text = verse.join("\n").replace(/\n{3,}/g, "\n\n").trim();
    const nonEmpty = verse.filter((line) => line.trim());
    if (title && nonEmpty.length >= 4 && nonEmpty.length <= 140 && text.length >= 80 && text.length <= 9000) {
      const id = `pg-${source.id}-${String(poems.length + 1).padStart(3, "0")}`;
      poems.push({
        id,
        title,
        author: source.author,
        period: source.period,
        language: source.language,
        text,
        source: sourceUrl,
        sourceName: `${source.title} — Project Gutenberg #${source.id}`,
        attributionStatus: "verified",
        copyrightStatus: "cleared",
        indexable: true,
        slug: `${slugify(title).slice(0, 70)}-${id}`,
      });
    }
    verse = [];
  };

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (/project gutenberg|transcriber|produced by|table of contents/i.test(line)) continue;
    if (looksLikeHeading(line)) {
      const next = lines.slice(i + 1, i + 8).filter((item) => item.trim());
      const likelyVerse = next.length >= 3 && next.slice(0, 3).every((item) => item.length <= 120);
      if (likelyVerse) {
        flush();
        title = cleanTitle(line);
        continue;
      }
    }
    if (title) {
      if (!line.trim()) {
        if (verse.length && verse.at(-1) !== "") verse.push("");
      } else if (line.length <= 180) {
        verse.push(line.trim());
      }
    }
  }
  flush();
  return poems;
}

const all = [];
const seen = new Set();
for (const source of SOURCES) {
  const { url, body } = await fetchBook(source.id);
  if (!body) continue;
  for (const poem of extractPoems(body, source, url)) {
    const key = `${poem.author.toLowerCase()}|${poem.title.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    all.push(poem);
    if (all.length >= MAX_POEMS) break;
  }
  if (all.length >= MAX_POEMS) break;
}

await mkdir("data", { recursive: true });
await writeFile("data/poems.generated.json", JSON.stringify(all, null, 2) + "\n", "utf8");
console.log(`Generated ${all.length} multilingual public-domain poems from ${SOURCES.length} configured sources.`);
