type SeoQuote = {
  indexable?: boolean;
  attributionStatus?: string;
  copyrightStatus?: string;
};

export const PRIMARY_SITEMAP_QUOTE_LIMIT = 30_000;

/**
 * Only editorially verified, rights-cleared quotes may be exposed to search engines.
 * `indexable` alone controls public-library visibility and is intentionally not enough.
 */
export function isSeoIndexable(quote: SeoQuote | undefined): boolean {
  return Boolean(
    quote?.indexable === true
      && quote.attributionStatus === "verified"
      && quote.copyrightStatus === "cleared",
  );
}
