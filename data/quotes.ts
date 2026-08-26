import quotesJson from "./quotes.json";
import nietzscheQuotes from "./quotes.pending.json";

type BaseQuote = (typeof quotesJson)[number];
type NietzscheQuote = (typeof nietzscheQuotes)[number];

export type Quote = (BaseQuote | NietzscheQuote) & {
  indexable: boolean;
};

const allQuotes = [...quotesJson, ...nietzscheQuotes];

export const quotes: Quote[] = allQuotes.map((quote) => ({
  ...quote,
  indexable: quote.indexable === true || (quote.attributionStatus === "verified" && quote.copyrightStatus === "cleared"),
}));

export default quotes;
