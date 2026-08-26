import type { Metadata } from "next";
import CopyButton from "../../../components/CopyButton";
import quotesData from "../../../data/quotes.json";

export const dynamicParams = false;

export function generateStaticParams() {
  return quotesData.map((quote) => ({ slug: quote.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const quote = quotesData.find((item) => item.slug === slug);
  return {
    title: quote ? `${quote.author} — Quote` : "Quote",
    description: quote?.quote,
    robots: quote?.indexable === false ? { index: false, follow: true } : undefined,
  };
}

export default async function QuotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const quote = quotesData.find((item) => item.slug === slug);
  if (!quote) return null;

  return (
    <main className="quote-detail">
      <a className="back-link" href="/">← Quote Archive</a>
      <p className="eyebrow">{quote.category.toUpperCase()}</p>
      <blockquote>“{quote.quote}”</blockquote>
      <p className="quote-author">— {quote.author}</p>
      <CopyButton quote={quote.quote} author={quote.author} />
      <p className="source-note">Source: {quote.sourceName}</p>
      <p className="source-note">Attribution: {quote.attributionStatus} · Publication review: {quote.copyrightStatus}</p>
    </main>
  );
}
