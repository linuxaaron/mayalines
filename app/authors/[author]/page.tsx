import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "../../../components/Breadcrumbs";
import StructuredData from "../../../components/StructuredData";
import QuoteActions from "../../../components/QuoteActions";
import FollowButton from "../../../components/FollowButton";
import quotesData from "../../../data/quotes";
import {
  isAuthorPageIndexable,
  isPublicQuote,
  isSeoIndexable,
  MIN_INDEXABLE_QUOTES_PER_AUTHOR_PAGE,
} from "../../../lib/seo";

export const dynamicParams = true;
export const revalidate = 86400;

function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function generateMetadata({ params }: { params: Promise<{ author: string }> }): Promise<Metadata> {
  const { author: slug } = await params;
  const authorName = Array.from(new Set(quotesData.map((quote) => quote.author))).find((name) => slugify(name) === slug);
  const authorQuotes = authorName ? quotesData.filter((quote) => quote.author === authorName) : [];
  const indexable = isAuthorPageIndexable(authorQuotes);
  const count = authorQuotes.filter(isSeoIndexable).length;
  const description = authorName
    ? `Explore ${count.toLocaleString("en-US")} verified and sourced quotes attributed to ${authorName}, with topic links and individual quote pages on Mayalines.`
    : "Explore verified and sourced quote collections by author on Mayalines.";

  return {
    title: authorName ? `Quotes by ${authorName} – Verified & Sourced Quotes` : "Quotes by Author",
    description,
    alternates: { canonical: authorName ? `/authors/${slug}` : "/authors" },
    robots: {
      index: indexable,
      follow: true,
      googleBot: { index: indexable, follow: true, "max-snippet": -1, "max-image-preview": "large" },
    },
    openGraph: authorName ? {
      type: "website",
      title: `Quotes by ${authorName} | Mayalines`,
      description,
      url: `/authors/${slug}`,
      images: [{ url: "/mayalines-og.svg", width: 1200, height: 630, alt: `Mayalines quotes by ${authorName}` }],
    } : undefined,
  };
}

export default async function AuthorPage({ params }: { params: Promise<{ author: string }> }) {
  const { author: slug } = await params;
  const authorName = Array.from(new Set(quotesData.map((quote) => quote.author))).find((name) => slugify(name) === slug);
  if (!authorName) notFound();

  const quotes = quotesData.filter((quote) => quote.author === authorName);
  const publicQuotes = quotes.filter(isPublicQuote);
  if (publicQuotes.length === 0) notFound();

  const seoQuotes = quotes.filter(isSeoIndexable);
  const indexable = isAuthorPageIndexable(quotes);
  const displayQuotes = indexable ? seoQuotes : publicQuotes;
  const visibleQuotes = displayQuotes.slice(0, 24);
  const topics = Array.from(new Set(displayQuotes.map((quote) => quote.category))).sort().slice(0, 8);
  const topicSet = new Set(topics);
  const relatedAuthorCounts = new Map<string, number>();

  for (const quote of quotesData) {
    if (quote.author === authorName || !topicSet.has(quote.category) || !isSeoIndexable(quote)) continue;
    relatedAuthorCounts.set(quote.author, (relatedAuthorCounts.get(quote.author) ?? 0) + 1);
  }

  const relatedAuthors = [...relatedAuthorCounts.entries()]
    .filter(([, count]) => count >= MIN_INDEXABLE_QUOTES_PER_AUTHOR_PAGE)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "en"))
    .slice(0, 8);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mayalines.com";
  const authorUrl = `${siteUrl}/authors/${slug}`;
  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Quotes by ${authorName}`,
    url: authorUrl,
    inLanguage: "en-US",
    isPartOf: { "@type": "WebSite", name: "Mayalines", url: siteUrl },
    about: { "@type": "Thing", name: authorName },
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
    <p className="hero-copy">
      Explore {displayQuotes.length.toLocaleString("en-US")} {indexable ? "verified and sourced" : "published"} quotes attributed to {authorName}. Open any quote for its dedicated page, source details and related topics.
    </p>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 22 }} aria-label="Author quote statistics">
      <span className="copy-button" style={{ color: "var(--muted)" }}>{displayQuotes.length.toLocaleString("en-US")} QUOTES</span>
      <span className="copy-button" style={{ color: "var(--muted)" }}>{topics.length.toLocaleString("en-US")} TOPICS</span>
      <FollowButton targetType="author" target={authorName} />
    </div>

    {topics.length > 0 && <section aria-labelledby="author-topics" style={{ marginTop: 38, padding: "22px 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <p className="eyebrow" id="author-topics">EXPLORE BY TOPIC</p>
      <div className="topic-pills">{topics.map((topic) => <a href={`/categories/${slugify(topic)}`} key={topic}>{topic}</a>)}</div>
    </section>}

    <section aria-labelledby="author-library" style={{ marginTop: 38 }}>
      <h2 className="section-heading" id="author-library">Selected quotes by {authorName}</h2>
      <div className="quote-grid">{visibleQuotes.map((quote) => <article className="quote-card" key={quote.id} lang={quote.language ?? "en"}>
        <div className="quote-mark" aria-hidden="true">“</div>
        <p className="quote-text">{quote.quote}</p>
        <p className="quote-author">— {quote.author}</p>
        <p className="quote-category"><a href={`/categories/${slugify(quote.category)}`}>{quote.category}</a></p>
        <div className="quote-actions">
          <a className="copy-button" href={`/quotes/${quote.slug}`}>Read quote</a>
          <QuoteActions quote={quote.quote} author={quote.author} quoteId={quote.id} />
        </div>
      </article>)}</div>
    </section>

    {displayQuotes.length > visibleQuotes.length && <p className="hero-copy" style={{ marginTop: 24 }}>More quotes attributed to {authorName} are available across the Mayalines library.</p>}

    {relatedAuthors.length > 0 && <section aria-labelledby="related-authors" style={{ marginTop: 44, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
      <h2 className="section-heading" id="related-authors">Related author collections</h2>
      <p className="hero-copy">Explore authors represented in the same topics.</p>
      <div className="topic-pills">{relatedAuthors.map(([author, count]) => <a href={`/authors/${slugify(author)}`} key={author}>{author} ({count})</a>)}</div>
    </section>}

    <StructuredData data={collectionPageSchema} />
    <StructuredData data={itemListSchema} />
  </main>;
}
