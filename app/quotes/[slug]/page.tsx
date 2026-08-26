import type { Metadata } from "next";
import CopyButton from "../../../components/CopyButton";
import Breadcrumbs from "../../../components/Breadcrumbs";
import StructuredData from "../../../components/StructuredData";
import quotesData from "../../../data/quotes.json";

export const dynamicParams = false;

export function generateStaticParams() {
  return quotesData.map((quote) => ({ slug: quote.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const quote = quotesData.find((item) => item.slug === slug);
  return {
    title: quote ? `${quote.author}: “${quote.quote.slice(0, 58)}${quote.quote.length > 58 ? "…" : ""}”` : "Quote",
    description: quote?.quote,
    alternates: quote ? { canonical: `/quotes/${quote.slug}` } : undefined,
    robots: quote?.indexable === false ? { index: false, follow: true } : undefined,
  };
}

export default async function QuotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const quote = quotesData.find((item) => item.slug === slug);
  if (!quote) return null;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://quotes-git-main-aaron-727f.vercel.app";
  const quoteSchema = {
    "@context": "https://schema.org",
    "@type": "Quotation",
    text: quote.quote,
    creator: { "@type": "Person", name: quote.author },
    isPartOf: { "@type": "WebSite", name: "Quote Archive", url: siteUrl },
  };

  return (
    <main className="quote-detail">
      <Breadcrumbs items={[{ name: "Home", url: "/" }, { name: "Quotes", url: "/#main-content" }, { name: quote.author, url: `/authors/${quote.author.toLowerCase().replace(/[^a-z0-9]+/g, "-")}` }]} />
      <p className="eyebrow">{quote.category.toUpperCase()}</p>
      <blockquote>“{quote.quote}”</blockquote>
      <p className="quote-author">— {quote.author}</p>
      <CopyButton quote={quote.quote} author={quote.author} />
      <p className="source-note">Source: {quote.sourceName}</p>
      <p className="source-note">Attribution: {quote.attributionStatus} · Publication review: {quote.copyrightStatus}</p>
      <StructuredData data={quoteSchema} />
    </main>
  );
}
