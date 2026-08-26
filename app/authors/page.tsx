import type { Metadata } from "next";
import quotesData from "../../data/quotes";

export const metadata: Metadata = {
  title: "Famous Quotes by Author – Quote Collection",
  description: "Browse famous, inspirational and timeless quotes by author. Explore sourced quote collections from notable writers, thinkers and public figures on Mayalines.",
  alternates: { canonical: "/authors" },
  robots: { index: true, follow: true },
};

function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function isIndexable(quote: (typeof quotesData)[number]) {
  return quote.indexable === true && quote.attributionStatus === "verified" && quote.copyrightStatus === "cleared";
}

export default function AuthorsPage() {
  const authors = Array.from(new Set(quotesData.filter(isIndexable).map((quote) => quote.author))).sort((a, b) => a.localeCompare(b, "en"));

  return <main className="quote-detail">
    <nav className="legal-nav" aria-label="Primary navigation"><a href="/">← Mayalines</a></nav>
    <p className="eyebrow">MAYALINES · AUTHORS</p>
    <h1>Famous Quotes by Author</h1>
    <p className="hero-copy">Browse verified quote collections by notable authors, writers, thinkers and public figures. Select an author to explore their memorable words and sourced quotes.</p>
    <div className="author-row">{authors.map((author) => <a href={`/authors/${slugify(author)}`} key={author}>{author}</a>)}</div>
  </main>;
}
