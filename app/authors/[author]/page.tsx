import type { Metadata } from "next";
import Breadcrumbs from "../../../components/Breadcrumbs";
import StructuredData from "../../../components/StructuredData";
import quotesData from "../../../data/quotes";

export const dynamicParams = false;

function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function isIndexable(quote: (typeof quotesData)[number]) {
  return quote.indexable === true && quote.attributionStatus === "verified" && quote.copyrightStatus === "cleared";
}

export function generateStaticParams() {
  return Array.from(new Set(quotesData.map((quote) => quote.author))).map((author) => ({ author: slugify(author) }));
}

export async function generateMetadata({ params }: { params: Promise<{ author: string }> }): Promise<Metadata> {
  const { author: slug } = await params;
  const authorName = Array.from(new Set(quotesData.map((quote) => quote.author))).find((name) => slugify(name) === slug);
  const indexable = authorName ? quotesData.some((quote) => quote.author === authorName && isIndexable(quote)) : false;
  const count = authorName ? quotesData.filter((quote) => quote.author === authorName && isIndexable(quote)).length : 0;
  const description = authorName
    ? `Explore ${count.toLocaleString("en-US")} verified quotes by ${authorName}, including famous, inspirational and timeless words, on Mayalines.`
    : "Explore famous quotes by notable authors on Mayalines.";

  return {
    title: authorName ? `Quotes by ${authorName} – Famous & Inspirational Quotes` : "Quotes by Author",
    description,
    alternates: { canonical: authorName ? `/authors/${slug}` : "/authors" },
    robots: { index: indexable, follow: true },
    openGraph: authorName ? {
      type: "profile",
      title: `Quotes by ${authorName} | Mayalines`,
      description,
      url: `/authors/${slug}`,
    } : undefined,
  };
}

export default async function AuthorPage({ params }: { params: Promise<{ author: string }> }) {
  const { author: slug } = await params;
  const authorName = Array.from(new Set(quotesData.map((quote) => quote.author))).find((name) => slugify(name) === slug);
  if (!authorName) return null;

  const quotes = quotesData.filter((quote) => quote.author === authorName);
  const indexableQuotes = quotes.filter(isIndexable);
  const visibleQuotes = indexableQuotes.slice(0, 24);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mayalines.com";
  const authorUrl = `${siteUrl}/authors/${slug}`;
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: authorName,
    subjectOf: { "@type": "WebPage", url: authorUrl, inLanguage: "en-US" },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Authors", item: `${siteUrl}/authors` },
      { "@type": "ListItem", position: 3, name: authorName, item: authorUrl },
    ],
  };
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Quotes by ${authorName}`,
    numberOfItems: visibleQuotes.length,
    itemListElement: visibleQuotes.map((quote, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${authorName} quote`,
      url: `${siteUrl}/quotes/${quote.slug}`,
    })),
  };

  return <main className="quote-detail">
    <Breadcrumbs items={[{ name: "Home", url: "/" }, { name: "Authors", url: "/authors" }, { name: authorName, url: `/authors/${slug}` }]} />
    <p className="eyebrow">AUTHOR QUOTES</p>
    <h1>Quotes by {authorName}</h1>
    <p className="hero-copy">Explore {indexableQuotes.length.toLocaleString("en-US")} verified quotes by {authorName}. Discover famous, inspirational and timeless words with source information.</p>
    <div className="quote-grid">{visibleQuotes.map((quote) => <article className="quote-card" key={quote.id}><div className="quote-mark" aria-hidden="true">“</div><p className="quote-text">{quote.quote}</p><p className="quote-author">— {quote.author}</p><a className="copy-button" href={`/quotes/${quote.slug}`}>VIEW QUOTE</a></article>)}</div>
    <StructuredData data={personSchema} />
    <StructuredData data={breadcrumbSchema} />
    <StructuredData data={itemListSchema} />
  </main>;
}
