import type { Metadata } from "next";
import CopyButton from "../../../components/CopyButton";
import PersistentLikeButton from "../../../components/PersistentLikeButton";
import Breadcrumbs from "../../../components/Breadcrumbs";
import StructuredData from "../../../components/StructuredData";
import quotesData from "../../../data/quotes";

export const dynamicParams = false;

export function generateStaticParams() {
  return quotesData.map((quote) => ({ slug: quote.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const quote = quotesData.find((item) => item.slug === slug);
  const isIndexable = quote?.indexable === true && quote?.attributionStatus === "verified" && quote?.copyrightStatus === "cleared";
  const quotePreview = quote?.quote.replace(/\s+/g, " ").trim() ?? "";
  const description = quote
    ? `Read this famous quote by ${quote.author}: “${quotePreview.slice(0, 145)}${quotePreview.length > 145 ? "…" : ""}” on Mayalines."
    : "Read famous, inspirational and timeless quotes from notable authors on Mayalines.";

  return {
    title: quote ? `${quote.author} Quote – “${quotePreview.slice(0, 62)}${quotePreview.length > 62 ? "…" : ""}”` : "Famous Quote",
    description,
    alternates: quote ? { canonical: `/quotes/${quote.slug}` } : undefined,
    robots: {
      index: isIndexable,
      follow: true,
      googleBot: { index: isIndexable, follow: true, "max-snippet": -1 },
    },
    openGraph: quote ? {
      type: "article",
      title: `${quote.author} Quote | Mayalines`,
      description,
      url: `/quotes/${quote.slug}`,
      locale: "en_US",
    } : undefined,
  };
}

export default async function QuotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const quote = quotesData.find((item) => item.slug === slug);
  if (!quote) return null;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mayalines.com";
  const authorSlug = quote.author.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const categorySlug = quote.category.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Quotes", item: `${siteUrl}/#main-content` },
      { "@type": "ListItem", position: 3, name: `${quote.category} Quotes`, item: `${siteUrl}/categories/${categorySlug}` },
      { "@type": "ListItem", position: 4, name: `${quote.author} Quote`, item: `${siteUrl}/quotes/${quote.slug}` },
    ],
  };
  const quoteSchema = {
    "@context": "https://schema.org",
    "@type": "Quotation",
    text: quote.quote,
    creator: { "@type": "Person", name: quote.author },
    inLanguage: "en",
    url: `${siteUrl}/quotes/${quote.slug}`,
    isPartOf: { "@type": "WebSite", name: "Mayalines", url: siteUrl },
  };

  return <main className="quote-detail">
    <Breadcrumbs items={[{ name: "Home", url: "/" }, { name: "Quotes", url: "/#main-content" }, { name: `${quote.category} Quotes`, url: `/categories/${categorySlug}` }, { name: quote.author, url: `/authors/${authorSlug}` }]} />
    <p className="eyebrow">{quote.category.toUpperCase()} · VERIFIED QUOTE</p>
    <h1>{quote.author} Quote</h1>
    <blockquote>“{quote.quote}”</blockquote>
    <p className="quote-author">— {quote.author}</p>
    <div className="quote-detail-actions"><PersistentLikeButton quoteId={quote.id} author={quote.author} /><CopyButton quote={quote.quote} author={quote.author} /></div>
    <p className="source-note">Source: <a href={quote.source} rel="noreferrer">{quote.sourceName}</a></p>
    <p className="source-note">Attribution status: {quote.attributionStatus} · Publication status: {quote.copyrightStatus}</p>
    <p className="source-note">Explore more <a href={`/authors/${authorSlug}`}>quotes by {quote.author}</a> or browse <a href={`/categories/${categorySlug}`}>{quote.category.toLowerCase()} quotes</a>.</p>
    <p className="source-note">If you believe this quote is incorrectly attributed or should be removed, see <a href="/copyright">Copyright and quote corrections</a>.</p>
    <StructuredData data={breadcrumbSchema} />
    <StructuredData data={quoteSchema} />
  </main>;
}
