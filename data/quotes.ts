import quotesJson from "./quotes.json";

export type Quote = (typeof quotesJson)[number] & {
  indexable: boolean;
};

export const quotes: Quote[] = quotesJson.map((quote) => ({
  ...quote,
  indexable: quote.indexable === true || (quote.attributionStatus === "verified" && quote.copyrightStatus === "cleared"),
}));

export default quotes;
