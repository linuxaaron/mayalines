import seoRedirects from "../data/seo-redirects.json";

type SeoQuote = {
  slug?: string;
  indexable?: boolean;
  attributionStatus?: string;
  copyrightStatus?: string;
};

// Redirected quote URLs must never be advertised as independent indexable pages.
const redirectedQuoteSlugs = new Set(
  seoRedirects
    .filter(({ source }) => source.startsWith("/quotes/"))
    .map(({ source }) => source.slice("/quotes/".length)),
);

export const PRIMARY_SITEMAP_QUOTE_LIMIT = 30_000;

/**
 * Avoid indexing thin author archive pages that only contain a single eligible quote.
 * Individual quote pages remain independently indexable.
 */
export const MIN_INDEXABLE_QUOTES_PER_AUTHOR_PAGE = 2;

/** Public browsing is controlled by the explicit editorial release flag. */
export function isPublicQuote(quote: SeoQuote | undefined): boolean {
  return quote?.indexable === true;
}

/**
 * Only editorially verified, rights-cleared quotes may be exposed to search engines.
 * `indexable` alone controls public-library visibility and is intentionally not enough.
 */
export function isSeoIndexable(quote: SeoQuote | undefined): boolean {
  return Boolean(
    quote?.indexable === true
      && !redirectedQuoteSlugs.has(quote.slug ?? "")
      && quote.attributionStatus === "verified"
      && quote.copyrightStatus === "cleared",
  );
}

export function countSeoIndexableQuotes(quotes: readonly (SeoQuote | undefined)[]): number {
  return quotes.reduce((count, quote) => count + (isSeoIndexable(quote) ? 1 : 0), 0);
}

export function isAuthorPageIndexable(quotes: readonly (SeoQuote | undefined)[]): boolean {
  return countSeoIndexableQuotes(quotes) >= MIN_INDEXABLE_QUOTES_PER_AUTHOR_PAGE;
}
