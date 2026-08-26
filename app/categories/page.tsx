import type { Metadata } from "next";
import quotesData from "../../data/quotes";

export const metadata: Metadata = {
  title: "Quote Categories – Famous, Inspirational & Life Quotes",
  description: "Explore quote categories including motivation, inspiration, wisdom, life, love, success, courage, philosophy, happiness, friendship and more on Mayalines.",
  alternates: { canonical: "/categories" },
  robots: { index: true, follow: true },
};

function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function isIndexable(quote: (typeof quotesData)[number]) {
  return quote.indexable === true && quote.attributionStatus === "verified" && quote.copyrightStatus === "cleared";
}

export default function CategoriesPage() {
  const categories = Array.from(new Set(quotesData.filter(isIndexable).map((quote) => quote.category))).sort((a, b) => a.localeCompare(b, "en"));

  return <main className="quote-detail">
    <nav className="legal-nav" aria-label="Primary navigation"><a href="/">← Mayalines</a></nav>
    <p className="eyebrow">MAYALINES · CATEGORIES</p>
    <h1>Quote Categories</h1>
    <p className="hero-copy">Explore famous, inspirational and timeless quotes organized by topic. Find words about life, love, success, motivation, wisdom, courage and more.</p>
    <div className="author-row">{categories.map((category) => <a href={`/categories/${slugify(category)}`} key={category}>{category}</a>)}</div>
  </main>;
}
