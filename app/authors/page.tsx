import type { Metadata } from "next";
import quotesData from "../../data/quotes";
import StructuredData from "../../components/StructuredData";
import { isSeoIndexable, MIN_INDEXABLE_QUOTES_PER_AUTHOR_PAGE } from "../../lib/seo";

export const metadata: Metadata = {
  title: "Famous Quotes by Author | Inspirational & Timeless Quotes",
  description: "Browse verified famous, inspirational and timeless quotes by author. Explore sourced quote collections from notable writers, thinkers and public figures on Mayalines.",
  alternates: { canonical: "/authors" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    title: "Famous Quotes by Author | Mayalines",
    description: "Browse verified quote collections by author and discover famous, inspirational and timeless words.",
    url: "/authors",
  },
};

function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function AuthorsPage() {
  const authorCounts = new Map<string, number>();
  for (const quote of quotesData.filter(isSeoIndexable)) {
    authorCounts.set(quote.author, (authorCounts.get(quote.author) ?? 0) + 1);
  }

  const authors = [...authorCounts.entries()]
    .filter(([, count]) => count >= MIN_INDEXABLE_QUOTES_PER_AUTHOR_PAGE)
    .sort(([a], [b]) => a.localeCompare(b, "en"));

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mayalines.com";
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Famous Quotes by Author",
    description: "Verified quote collections by author on Mayalines.",
    numberOfItems: authors.length,
    itemListElement: authors.slice(0, 500).map(([author], index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: author,
      url: `${siteUrl}/authors/${slugify(author)}`,
    })),
  };

  return <main className="quote-detail">
    <nav className="legal-nav" aria-label="Primary navigation"><a href="/">← Mayalines</a></nav>
    <p className="eyebrow">MAYALINES · AUTHORS</p>
    <h1>Famous Quotes by Author</h1>
    <p className="hero-copy">Browse verified quote collections with multiple sourced quotes. Each author page links directly to individual quote pages and related topics, helping readers explore the library naturally.</p>
    <p className="library-meta">{authors.length.toLocaleString("en-US")} author collections with at least {MIN_INDEXABLE_QUOTES_PER_AUTHOR_PAGE} verified quotes.</p>
    <div className="author-row">{authors.map(([author, count]) => <a href={`/authors/${slugify(author)}`} key={author}>{author} <span aria-label={`${count} quotes`}>({count})</span></a>)}</div>
    <StructuredData data={itemListSchema} />
  </main>;
}
