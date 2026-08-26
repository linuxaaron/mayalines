import type { Metadata } from "next";
import quotesData from "../../../data/quotes";
import Breadcrumbs from "../../../components/Breadcrumbs";
import StructuredData from "../../../components/StructuredData";

export const dynamicParams = false;
const labels: Record<string, string> = { motivation: "Motivation", inspiration: "Inspiration", wisdom: "Wisdom", life: "Life", love: "Love", success: "Success", courage: "Courage", philosophy: "Philosophy", happiness: "Happiness", friendship: "Friendship", freedom: "Freedom", science: "Science", character: "Character", education: "Education", faith: "Faith", quotes: "Quotes" };
const descriptions: Record<string, string> = {
  motivation: "A curated collection of motivational quotes about action, persistence, discipline and taking the next step.",
  inspiration: "Inspirational quotes about clarity, perspective, creativity and new possibilities.",
  wisdom: "Quotes about judgment, experience, truth, character and the lessons of life.",
  life: "Quotes about life, change, time, relationships, meaning and formative experiences.",
  love: "Quotes about love, affection, connection, friendship and human relationships.",
  success: "Quotes about achievement, work, ambition, discipline and the foundations of lasting success.",
  courage: "Quotes about courage, fear, resilience, conviction and acting despite uncertainty.",
  philosophy: "Philosophical quotes about existence, morality, meaning, nature and the human condition.",
  happiness: "Quotes about happiness, contentment, gratitude and the search for a good life.",
  friendship: "Quotes about friendship, loyalty, trust, connection and lasting relationships.",
  freedom: "Quotes about freedom, independence, responsibility and choices that shape a life.",
  science: "Quotes about science, discovery, curiosity, evidence and the search for knowledge.",
};
function slugify(value: string) { return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
function isIndexable(quote: (typeof quotesData)[number]) { return quote.indexable === true && quote.attributionStatus === "verified" && quote.copyrightStatus === "cleared"; }
export function generateStaticParams() { return [...new Set(quotesData.map((quote) => quote.category))].map((category) => ({ category: slugify(category) })); }

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const title = labels[category] ?? category.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  const hasClearedQuotes = quotesData.some((quote) => slugify(quote.category) === category && isIndexable(quote));
  return { title: `${title} – Quotes | Mayalines`, description: descriptions[category] ?? `Discover a curated collection of ${title.toLowerCase()} quotes by notable authors.`, alternates: { canonical: `/categories/${category}` }, robots: { index: hasClearedQuotes, follow: true } };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const title = labels[category] ?? category.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  const quotes = quotesData.filter((quote) => slugify(quote.category) === category);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mayalines.com";
  const collectionSchema = { "@context": "https://schema.org", "@type": "CollectionPage", name: `${title} – Quotes | Mayalines`, description: descriptions[category] ?? `Discover ${title.toLowerCase()} quotes on Mayalines.`, url: `${siteUrl}/categories/${category}`, isPartOf: { "@type": "WebSite", name: "Mayalines", url: siteUrl } };
  return <main className="quote-detail">
    <Breadcrumbs items={[{ name: "Home", url: "/" }, { name: "Categories", url: "/#categories" }, { name: `${title} – Quotes`, url: `/categories/${category}` }]} />
    <p className="eyebrow">MAYALINES CATEGORY</p><h1>{title} – Quotes</h1>
    <p className="hero-copy">{descriptions[category] ?? `Discover ${title.toLowerCase()} quotes on Mayalines.`}</p>
    <p className="library-meta">{quotes.length.toLocaleString("en-US")} quotes in this category.</p>
    <div className="quote-grid">{quotes.slice(0, 60).map((quote) => <article className="quote-card" key={quote.id}><div className="quote-mark" aria-hidden="true">“</div><p className="quote-text">{quote.quote}</p><p className="quote-author">— {quote.author}</p><a className="copy-button" href={`/quotes/${quote.slug}`}>READ QUOTE</a></article>)}</div>
    <StructuredData data={collectionSchema} />
  </main>;
}
