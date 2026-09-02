import type { Metadata } from "next";
import quotesData from "../../data/quotes";
import StructuredData from "../../components/StructuredData";
import { isPublicQuote } from "../../lib/seo";

export const metadata: Metadata = {
  title: "Quote Categories | Famous, Inspirational & Life Quotes",
  description: "Explore verified quote categories including motivation, inspiration, wisdom, life, love, success, courage, philosophy, happiness, friendship and more on Mayalines.",
  alternates: { canonical: "/categories" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    title: "Quote Categories | Mayalines",
    description: "Explore verified famous, inspirational and timeless quotes organized by topic.",
    url: "/categories",
  },
};

function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function CategoriesPage() {
  const categories = Array.from(new Set(quotesData.filter(isPublicQuote).map((quote) => quote.category))).sort((a, b) => a.localeCompare(b, "en"));
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mayalines.com";
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Quote Categories",
    description: "Verified quote collections organized by topic on Mayalines.",
    itemListElement: categories.map((category, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${category} Quotes`,
      url: `${siteUrl}/categories/${slugify(category)}`,
    })),
  };

  return <main className="quote-detail">
    <nav className="legal-nav" aria-label="Primary navigation"><a href="/">← Mayalines</a></nav>
    <p className="eyebrow">MAYALINES · CATEGORIES</p>
    <h1>Quote Categories</h1>
    <p className="hero-copy">Explore verified famous, inspirational and timeless quotes organized by topic. Find words about life, love, success, motivation, wisdom, courage, philosophy and more.</p>
    <p className="library-meta">{categories.length.toLocaleString("en-US")} quote categories.</p>
    <div className="author-row">{categories.map((category) => <a href={`/categories/${slugify(category)}`} key={category}>{category} Quotes</a>)}</div>
    <StructuredData data={itemListSchema} />
  </main>;
}
