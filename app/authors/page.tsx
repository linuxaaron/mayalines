import type { Metadata } from "next";
import quotesData from "../../data/quotes";
import StructuredData from "../../components/StructuredData";

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

function isIndexable(quote: (typeof quotesData)[number]) {
  return quote.indexable === true && quote.attributionStatus === "verified" && quote.copyrightStatus === "cleared";
}

export default function AuthorsPage() {
  const authors = Array.from(new Set(quotesData.filter(isIndexable).map((quote) => quote.author))).sort((a, b) => a.localeCompare(b, "en"));
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mayalines.com";
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Famous Quotes by Author",
    description: "Verified quote collections by author on Mayalines.",
    itemListElement: authors.map((author, index) => ({
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
    <p className="hero-copy">Browse verified quote collections by notable authors, writers, thinkers and public figures. Select an author to explore memorable words, source information and individual quote pages.</p>
    <p className="library-meta">{authors.length.toLocaleString("en-US")} authors with verified quotes.</p>
    <div className="author-row">{authors.map((author) => <a href={`/authors/${slugify(author)}`} key={author}>{author}</a>)}</div>
    <StructuredData data={itemListSchema} />
  </main>;
}
