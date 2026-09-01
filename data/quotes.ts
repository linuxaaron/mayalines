import quotesJson from "./quotes.json";
import nietzscheQuotes from "./quotes.pending.json";
import importedQuotes from "./quotes.imported.json";
import licensedQuotes from "./quotes.licensed.json";

type BaseQuote = (typeof quotesJson)[number];
type NietzscheQuote = (typeof nietzscheQuotes)[number];
type ImportedQuote = (typeof importedQuotes)[number];
type LicensedQuote = (typeof licensedQuotes)[number];

export type Quote = (BaseQuote | NietzscheQuote | ImportedQuote | LicensedQuote) & {
  indexable: boolean;
  sourceName?: string;
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

const allQuotes = [...quotesJson, ...nietzscheQuotes, ...importedQuotes, ...licensedQuotes];

export const quotes: Quote[] = allQuotes.map((quote) => ({
  ...quote,
  quote: cleanQuoteText(quote.quote),
  indexable: quote.indexable === true || (quote.attributionStatus === "verified" && quote.copyrightStatus === "cleared"),
}));

export default quotes;
