import quotesJson from "./quotes.json";

export type Quote = (typeof quotesJson)[number] & {
  indexable: boolean;
};

export const quotes = quotesJson as Quote[];

export default quotes;
