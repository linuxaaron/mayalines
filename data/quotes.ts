import quotesJson from "./quotes.json";
import nietzscheQuotes from "./quotes.pending.json";
import importedQuotes from "./quotes.imported.json";
import licensedQuotes from "./quotes.licensed.json";

export type Quote = {
  id: string;
  quote: string;
  author: string;
  category: string;
  slug: string;
  indexable: boolean;
  language?: string;
  source?: string;
  sourceName?: string;
  sourceCommit?: string;
  attributionStatus?: string;
  copyrightStatus?: string;
};

/** Normalize imported quote text so HTML entities and invisible Unicode characters
 * never leak into the rendered quote UI or generated metadata. */
export function cleanQuoteText(value: string): string {
  return value
    .replace(/&#(?:32|160);/gi, " ")
    .replace(/&#(?:8203|8204|8205|65279);/gi, "")
    .replace(/&(?:nbsp|NewLine);/gi, " ")
    .replace(/\u00a0/g, " ")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/[ \t]+/g, " ")
    .trim();
}

const allQuotes = [
  ...(quotesJson as Quote[]),
  ...(nietzscheQuotes as Quote[]),
  ...(importedQuotes as Quote[]),
  ...(licensedQuotes as Quote[]),
];

export const quotes: Quote[] = allQuotes.map((quote) => ({
  ...quote,
  quote: cleanQuoteText(quote.quote),
  // Only editorially verified, copyright-cleared records may be shown publicly.
  // Source-derived records remain available to the moderation workflow only.
  indexable: quote.indexable === true && quote.attributionStatus === "verified" && quote.copyrightStatus === "cleared",
}));

export default quotes;
