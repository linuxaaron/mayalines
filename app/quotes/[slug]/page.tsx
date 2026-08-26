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
  const description = quote ? `Read this quote by ${quote.author}: “${quotePreview.slice(0, 145)}${quotePreview.length > 145 ? "…" : ""}” on Mayalines.` : "Read famous and inspirational quotes on Mayalines.";

  return {
    title: quote ? `${quote.author} Quote – “${quotePreview.slice(0, 62)}${quotePreview.length > 62 ? "…" : ""}”` : "Quote",
    description,
    alternates: quote ? { canonical: `/quotes/${quote.slug}` } : undefined,
    robots: { index: isIndexable, follow: true },
    openGraph: quote ? {
      type: "article",
      title: `${quote.author} Quote | Mayalines`,
      description,
      url: `/quotes/${quote.slug}`,
    } : undefined,
  };
}

export default async function QuotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const quote = quotesData.find((item) => item.slug === slug);
  if (!quote) return null;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mayalines.com";
  const quoteSchema = {
    "@context": "https://schema.org",
    "@type": "Quotation",
    text: quote.quote,
    creator: { "@type": "Person", name: quote.author },
    inLanguage: "en",
    isPartOf: { "@type": "WebSite", name: "Mayalines", url: siteUrl },
  };

  return <main className="quote-detail">
    <Breadcrumbs items={[{ name: "Home", url: "/" }, { name: "Quotes", url: "/#main-content" }, { name: quote.author, url: `/authors/${quote.author.toLowerCase().replace(/[^a-z0-9]+/g, "-")}` }]} />
    <p className="eyebrow">{quote.category.toUpperCase()}</p>
    <h1>{quote.author} Quote</h1>
    <blockquote>“{quote.quote}”</blockquote>
    <p className="quote-author">— {quote.author}</p>
    <div className="quote-detail-actions"><PersistentLikeButton quoteId={quote.id} author={quote.author} /><CopyButton quote={quote.quote} author={quote.author} /></div>
    <p className="source-note">Source: <a href={quote.source} rel="noreferrer">{quote.sourceName}</a></p>
    <p className="source-note">Attribution status: {quote.attributionStatus} · Publication status: {quote.copyrightStatus}</p>
    <p className="source-note">If you believe this quote is incorrectly attributed or should be removed, see <a href="/copyright">Copyright and quote corrections</a>.</p>
    <StructuredData data={quoteSchema} />
  </main>;
}
