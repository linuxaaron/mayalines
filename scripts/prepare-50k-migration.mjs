import { readFile, writeFile } from "node:fs/promises";

// One-shot migration helper. Removed automatically after a verified build.
async function patchFile(path, transform) {
  const before = await readFile(path, "utf8");
  const after = transform(before);
  if (after === before) console.log(`${path}: no changes`);
  else await writeFile(path, after, "utf8");
}

await patchFile("scripts/build-quotes.mjs", (input) => {
  let s = input
    .replace("const PUBLISH_TARGET = 12000;", "const PUBLISH_TARGET = 49000;")
    .replace("const MIN_REQUIRED_COUNT = 10000;", "const MIN_REQUIRED_COUNT = 47000;")
    .replace("MayalinesQuoteBuilder/4.3", "MayalinesQuoteBuilder/5.0");

  if (!s.includes("const PUBLIC_DOMAIN_ARCHIVE =")) {
    s = s.replace("const WIKISOURCE = {", `const PUBLIC_DOMAIN_ARCHIVE = {\n  commit: "dea847392de0d4a36c632d410b73587e4987852b",\n  url: "https://raw.githubusercontent.com/ConceptJunkie/quote/dea847392de0d4a36c632d410b73587e4987852b/quote.txt",\n  name: "ConceptJunkie quote archive — curated public-domain collection",\n};\n\nconst WIKISOURCE = {`);
  }

  const oldNormalize = 'function normalizeCategory(value) { const normalized = titleCase(clean(value).replace(/[.:]+$/, "")); return CATEGORY_ALIASES.get(normalized) || normalized || "Wisdom"; }';
  const newNormalize = `const CORE_CATEGORIES = new Set(["Art","Character","Courage","Education","Faith","Freedom","Friendship","Happiness","Hope","Life","Love","Motivation","Nature","Philosophy","Science","Success","Truth","Wisdom"]);\nfunction normalizeCategory(value, quoteText = "") {\n  const normalized = titleCase(clean(value).replace(/[.:]+$/, ""));\n  const mapped = CATEGORY_ALIASES.get(normalized) || normalized;\n  return CORE_CATEGORIES.has(mapped) ? mapped : categoryFor(quoteText || normalized);\n}`;
  s = s.replace(oldNormalize, newNormalize);
  s = s.replace("category: normalizeCategory(category), language, source,", "category: normalizeCategory(category, quote), language, source,");

  const gate = 'if (quotes.length < MIN_REQUIRED_COUNT) throw new Error(`Quote build produced ${quotes.length} records; at least ${MIN_REQUIRED_COUNT} concrete quotes are required.`);';
  if (!s.includes("const archiveText = await fetchText(PUBLIC_DOMAIN_ARCHIVE.url)")) {
    const fallback = `if (quotes.length < PUBLISH_TARGET) {\n  const archiveText = await fetchText(PUBLIC_DOMAIN_ARCHIVE.url);\n  if (archiveText) {\n    const blocks = archiveText.replace(/\\r/g, "").split(/\\n%\\n/);\n    for (const block of blocks) {\n      if (quotes.length >= PUBLISH_TARGET) break;\n      const lines = block.split("\\n").map((line) => clean(line)).filter(Boolean);\n      if (lines.length < 2) continue;\n      const last = lines.at(-1) ?? "";\n      const match = last.match(/^(?:--|—|-)\\s*(.{2,120})$/);\n      if (!match) continue;\n      const author = clean(match[1]);\n      const quote = clean(lines.slice(0, -1).join(" "));\n      addQuote({ quote, author, category: categoryFor(quote), source: PUBLIC_DOMAIN_ARCHIVE.url, sourceName: PUBLIC_DOMAIN_ARCHIVE.name, sourceCommit: PUBLIC_DOMAIN_ARCHIVE.commit, language: "en", attributionStatus: "source-derived", copyrightStatus: "needs-review", indexable: true });\n    }\n  }\n}\n\n`;
    s = s.replace(gate, fallback + gate);
  }
  return s;
});

await patchFile(".github/workflows/materialize-quotes.yml", (input) => input
  .replace("MIN_QUOTES=10000 MAX_QUOTES=59000", "MIN_QUOTES=47000 MAX_QUOTES=59000")
  .replace("data: materialize 12000 sourced quotes", "data: materialize up to 49000 sourced quotes"));

console.log("50k migration source patches prepared.");
