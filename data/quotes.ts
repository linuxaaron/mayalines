import quotesJson from "./quotes.json";
import nietzscheQuotes from "./quotes.pending.json";

type BaseQuote = (typeof quotesJson)[number];
type NietzscheQuote = (typeof nietzscheQuotes)[number];

export type Quote = (BaseQuote | NietzscheQuote) & {
  indexable: boolean;
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

const allQuotes = [...quotesJson, ...nietzscheQuotes];

export const quotes: Quote[] = allQuotes.map((quote) => ({
  ...quote,
  quote: cleanQuoteText(quote.quote),
  indexable: quote.indexable === true || (quote.attributionStatus === "verified" && quote.copyrightStatus === "cleared"),
}));

export default quotes;
