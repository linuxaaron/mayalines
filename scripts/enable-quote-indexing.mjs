import { readFile, writeFile } from "node:fs/promises";
const path = "data/quotes.json";
const quotes = JSON.parse(await readFile(path, "utf8"));
if (quotes.length !== 2000) throw new Error(`Expected 2000 quotes, found ${quotes.length}`);
for (const q of quotes) {
  if (q.copyrightStatus !== "public-domain-source" || q.attributionStatus !== "source-attributed") {
    throw new Error(`Refusing to index uncleared quote ${q.id}`);
  }
  q.indexable = true;
}
await writeFile(path, `${JSON.stringify(quotes, null, 2)}\n`, "utf8");
console.log("Indexing gate enabled for 2000 verified-source quotes.");
