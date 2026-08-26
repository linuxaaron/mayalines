import { mkdir, writeFile } from "node:fs/promises";

const SOURCE_URL = "https://www.gutenberg.org/cache/epub/27889/pg27889-images.html";
const SOURCE_NAME = "John Bartlett, Familiar Quotations (9th ed., 1905)";

// Restrict the first import to authors whose works are safely historical/public-domain
// candidates. Final publication rights should still be checked for the jurisdiction where
// the site operates; this is an editorial filter, not legal advice.
const AUTHOR_ALLOWLIST = new Set([
  "William Shakespeare", "Francis Bacon", "Benjamin Franklin", "Thomas Jefferson",
  "Abraham Lincoln", "Ralph Waldo Emerson", "Henry David Thoreau", "Mark Twain",
  "Edgar Allan Poe", "Walt Whitman", "Emily Dickinson", "Nathaniel Hawthorne",
  "Henry Wadsworth Longfellow", "John Keats", "Percy Bysshe Shelley", "Lord Byron",
  "William Wordsworth", "Samuel Taylor Coleridge", "John Milton", "Alexander Pope",
  "Samuel Johnson", "Charles Dickens", "Jane Austen", "George Eliot", "Robert Burns",
  "Robert Browning", "Elizabeth Barrett Browning", "Oscar Wilde", "Alfred Tennyson",
  "Thomas Carlyle", "John Ruskin", "George Herbert", "John Bunyan", "Jonathan Swift",
  "Daniel Defoe", "Miguel de Cervantes", "Dante Alighieri", "Geoffrey Chaucer",
  "Aristotle", "Plato", "Socrates", "Cicero", "Seneca", "Epictetus", "Marcus Aurelius",
  "Horace", "Ovid", "Virgil", "Aesop", "Confucius", "Lao Tzu", "Blaise Pascal",
  "Michel de Montaigne", "François de La Rochefoucauld", "Johann Wolfgang von Goethe",
  "Friedrich Schiller", "Victor Hugo", "Alexandre Dumas", "Arthur Schopenhauer"
]);

const ALIASES = new Map([
  ["BACON, FRANCIS", "Francis Bacon"], ["FRANKLIN, BENJAMIN", "Benjamin Franklin"],
  ["JEFFERSON, THOMAS", "Thomas Jefferson"], ["SHAKESPEARE, WILLIAM", "William Shakespeare"],
  ["SHAKESPEARE", "William Shakespeare"], ["EMERSON, RALPH WALDO", "Ralph Waldo Emerson"],
  ["THOREAU, HENRY DAVID", "Henry David Thoreau"], ["TWAIN, MARK", "Mark Twain"],
  ["POE, EDGAR ALLAN", "Edgar Allan Poe"], ["WHITMAN, WALT", "Walt Whitman"],
  ["DICKINSON, EMILY", "Emily Dickinson"], ["LONGFELLOW, HENRY WADSWORTH", "Henry Wadsworth Longfellow"],
  ["KEATS, JOHN", "John Keats"], ["SHELLEY, PERCY BYSSHE", "Percy Bysshe Shelley"],
  ["BYRON, LORD", "Lord Byron"], ["WORDSWORTH, WILLIAM", "William Wordsworth"],
  ["COLERIDGE, S. TAYLOR", "Samuel Taylor Coleridge"], ["MILTON, JOHN", "John Milton"],
  ["POPE, ALEXANDER", "Alexander Pope"], ["JOHNSON, SAMUEL", "Samuel Johnson"],
  ["DICKENS, CHARLES", "Charles Dickens"], ["AUSTEN, JANE", "Jane Austen"],
  ["ELIOT, GEORGE", "George Eliot"], ["BURNS, ROBERT", "Robert Burns"],
  ["BROWNING, ROBERT", "Robert Browning"], ["BROWNING, ELIZABETH B.", "Elizabeth Barrett Browning"],
  ["WILDE, OSCAR", "Oscar Wilde"], ["TENNYSON, ALFRED", "Alfred Tennyson"],
  ["CARLYLE, THOMAS", "Thomas Carlyle"], ["RUSKIN, JOHN", "John Ruskin"],
  ["BUNYAN, JOHN", "John Bunyan"], ["SWIFT, JONATHAN", "Jonathan Swift"],
  ["DEFOE, DANIEL", "Daniel Defoe"], ["CERVANTES", "Miguel de Cervantes"],
  ["CHAUCER, GEOFFREY", "Geoffrey Chaucer"], ["ARISTOTLE", "Aristotle"],
  ["CICERO", "Cicero"], ["SENECA", "Seneca"], ["EPICTETUS", "Epictetus"],
  ["MARCUS AURELIUS", "Marcus Aurelius"], ["HORACE", "Horace"], ["OVID", "Ovid"],
  ["VIRGIL", "Virgil"], ["CONFUCIUS", "Confucius"], ["LAO TSU", "Lao Tzu"],
  ["PASCAL, BLAISE", "Blaise Pascal"], ["MONTAIGNE, MICHEL DE", "Michel de Montaigne"],
  ["LA ROCHEFOUCAULD", "François de La Rochefoucauld"], ["GOETHE, WOLFGANG VON", "Johann Wolfgang von Goethe"],
  ["SCHILLER, FRIEDRICH", "Friedrich Schiller"], ["HUGO, VICTOR", "Victor Hugo"],
  ["DUMAS, ALEXANDRE", "Alexandre Dumas"], ["SCHOPENHAUER, ARTHUR", "Arthur Schopenhauer"]
]);

const CATEGORY_RULES = [
  ["Love", /love|heart|kiss|friendship|affection|beauty/i],
  ["Wisdom", /wisdom|truth|knowledge|reason|learn|understand|thought|mind/i],
  ["Courage", /courage|brave|fear|dare|strength|bold/i],
  ["Success", /success|work|labor|achievement|fortune|great|effort/i],
  ["Motivation", /action|begin|start|dream|hope|purpose|persevere|progress/i],
  ["Life", /life|live|death|time|world|human|man|woman/i],
  ["Philosophy", /exist|nature|soul|god|moral|virtue|philosophy/i],
];

function cleanHtml(value) {
  return value.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&mdash;/g, "—").replace(/&ldquo;|&rdquo;/g, '"').replace(/&lsquo;|&rsquo;/g, "'")
    .replace(/\s+/g, " ").trim();
}

function normalizeAuthor(raw) {
  const key = cleanHtml(raw).replace(/[.:]+$/, "").trim().toUpperCase();
  return ALIASES.get(key) ?? null;
}

function slugify(value) {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function categoryFor(text) {
  return CATEGORY_RULES.find(([, pattern]) => pattern.test(text))?.[0] ?? "Wisdom";
}

const response = await fetch(SOURCE_URL);
if (!response.ok) throw new Error(`Could not fetch source: ${response.status}`);
const html = await response.text();
const authorBlocks = html.split(/<h3[^>]*>/i).slice(1);
const quotes = [];
const seen = new Set();

for (const block of authorBlocks) {
  const heading = block.match(/^([\s\S]*?)<\/h3>/i)?.[1] ?? "";
  const author = normalizeAuthor(heading);
  if (!author || !AUTHOR_ALLOWLIST.has(author)) continue;
  const body = block.split(/<h[1-3][^>]*>/i)[0];
  const paragraphs = [...body.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map((m) => cleanHtml(m[1]));

  for (const text of paragraphs) {
    if (text.length < 25 || text.length > 220) continue;
    if (/^(act|scene|book|chapter|stanza|line|page|part)\b/i.test(text)) continue;
    if (/^(from|see|compare|note|ibid|source)\b/i.test(text)) continue;
    if (text.includes("Project Gutenberg") || text.includes("INDEX")) continue;
    const key = `${author}|${text.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const id = `${quotes.length + 1}`;
    quotes.push({
      id, quote: text, author, category: categoryFor(text), source: SOURCE_URL,
      sourceName: SOURCE_NAME, attributionStatus: "source-traced",
      copyrightStatus: "historical-source-review-required", slug: `${slugify(text).slice(0, 90)}-${id}`
    });
    if (quotes.length >= 500) break;
  }
  if (quotes.length >= 500) break;
}

if (quotes.length < 500) throw new Error(`Only extracted ${quotes.length} usable quotes; refusing to create an incomplete 500-quote dataset.`);
await mkdir("data", { recursive: true });
await writeFile("data/quotes.json", `${JSON.stringify(quotes, null, 2)}\n`, "utf8");
console.log(`Generated ${quotes.length} quote records from ${SOURCE_NAME}.`);
