import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CopyButton from "../../../components/CopyButton";
import PersistentLikeButton from "../../../components/PersistentLikeButton";
import Breadcrumbs from "../../../components/Breadcrumbs";
import StructuredData from "../../../components/StructuredData";
import quotesData from "../../../data/quotes";
import { isPublicQuote, isSeoIndexable } from "../../../lib/seo";

export const dynamicParams = true;
export const revalidate = 86400;

const localeByLanguage: Record<string, string> = {
  en: "en_US", de: "de_DE", fr: "fr_FR", es: "es_ES", it: "it_IT", pt: "pt_PT", nl: "nl_NL", ilo: "fil_PH",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const quote = quotesData.find((item) => item.slug === slug);
  const isIndexable = isSeoIndexable(quote);
  const quotePreview = quote?.quote.replace(/\s+/g, " ").trim() ?? "";
  const language = (quote as { language?: string } | undefined)?.language ?? "en";
  const description = quote
    ? `Read this ${language.toUpperCase()} quote by ${quote.author}: “${quotePreview.slice(0, 145)}${quotePreview.length > 145 ? "…" : ""}” on Mayalines.`
    : "Read famous, inspirational and timeless quotes from notable authors on Mayalines.";

  return {
    title: quote ? `${quote.author} Quote – “${quotePreview.slice(0, 62)}${quotePreview.length > 62 ? "…" : ""}”` : "Famous Quote",
    description,
    alternates: quote ? { canonical: `/quotes/${quote.slug}` } : undefined,
    robots: { index: isIndexable, follow: true, googleBot: { index: isIndexable, follow: true, "max-snippet": -1, "max-image-preview": "large" } },
    openGraph: quote ? {
      type: "article",
      title: `${quote.author} Quote | Mayalines`,
      description,
      url: `/quotes/${quote.slug}`,
      locale: localeByLanguage[language] ?? "en_US",
    } : undefined,
  };
}

export default async function QuotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const quote = quotesData.find((item) => item.slug === slug);
  if (!quote) notFound();

  const language = (quote as { language?: string }).language ?? "en";
  const isVerified = quote.attributionStatus === "verified" && quote.copyrightStatus === "cleared";
  const statusLabel = isVerified ? "VERIFIED" : "SOURCE-DERIVED";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mayalines.com";
  const authorSlug = quote.author.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const categorySlug = quote.category.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const quoteSchema = {
    "@context": "https://schema.org", "@type": "Quotation", text: quote.quote,
    creator: { "@type": "Person", name: quote.author }, inLanguage: language,
    url: `${siteUrl}/quotes/${quote.slug}`,
    isPartOf: { "@type": "WebSite", name: "Mayalines", url: siteUrl },
  };
  const relatedIds = new Set<string>();
  const relatedQuotes = [
    ...quotesData.filter((item) => item.id !== quote.id && item.author === quote.author && isPublicQuote(item)),
    ...quotesData.filter((item) => item.id !== quote.id && item.category === quote.category && isPublicQuote(item)),
  ].filter((item) => {
    if (relatedIds.has(item.id)) return false;
    relatedIds.add(item.id);
    return true;
  }).slice(0, 6);

  return <main className="quote-detail" lang={language}>
    <Breadcrumbs items={[{ name: "Home", url: "/" }, { name: "Quotes", url: "/#main-content" }, { name: `${quote.category} Quotes`, url: `/categories/${categorySlug}` }, { name: quote.author, url: `/authors/${authorSlug}` }]} />
    <p className="eyebrow">{quote.category.toUpperCase()} · {statusLabel} · {language.toUpperCase()}</p>
    <h1>{quote.author} Quote</h1>
    <blockquote>“{quote.quote}”</blockquote>
    <p className="quote-author">— {quote.author}</p>
    <div className="quote-detail-actions"><PersistentLikeButton quoteId={quote.id} author={quote.author} /><CopyButton quote={quote.quote} author={quote.author} /></div>
    <p className="source-note">Source: {quote.sourceName ?? quote.source}</p>
    <p className="source-note">Attribution status: {quote.attributionStatus} · Publication status: {quote.copyrightStatus}</p>
    <p className="source-note">Explore more <a href={`/authors/${authorSlug}`}>quotes by {quote.author}</a> or browse <a href={`/categories/${categorySlug}`}>{quote.category.toLowerCase()} quotes</a>.</p>
    <p className="source-note">If you believe this quote is incorrectly attributed or should be removed, see <a href="/copyright">Copyright and quote corrections</a>.</p>
    {relatedQuotes.length > 0 && <section aria-labelledby="related-quotes" style={{ marginTop: 52, paddingTop: 28, borderTop: "1px solid var(--border)" }}>
      <h2 className="section-heading" id="related-quotes">Related verified quotes</h2>
      <div className="quote-grid">{relatedQuotes.map((item) => <article className="quote-card" key={item.id} lang={item.language ?? "en"}>
        <div className="quote-mark" aria-hidden="true">“</div>
        <p className="quote-text">{item.quote}</p>
        <p className="quote-author">— {item.author}</p>
        <a className="copy-button" style={{ marginTop: "auto", alignSelf: "flex-start" }} href={`/quotes/${item.slug}`}>READ QUOTE</a>
      </article>)}</div>
    </section>}
    <StructuredData data={quoteSchema} />
  </main>;
}
