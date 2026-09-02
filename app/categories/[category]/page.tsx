import type { Metadata } from "next";
import quotesData from "../../../data/quotes";
import Breadcrumbs from "../../../components/Breadcrumbs";
import StructuredData from "../../../components/StructuredData";
import PersistentLikeButton from "../../../components/PersistentLikeButton";
import { isPublicQuote, isSeoIndexable } from "../../../lib/seo";

export const dynamicParams = false;

const labels: Record<string, string> = {
  motivation: "Motivation", inspiration: "Inspiration", wisdom: "Wisdom", life: "Life", love: "Love", success: "Success", courage: "Courage", philosophy: "Philosophy", happiness: "Happiness", friendship: "Friendship", freedom: "Freedom", science: "Science", character: "Character", education: "Education", faith: "Faith", quotes: "Quotes",
};

const descriptions: Record<string, string> = {
  motivation: "Explore motivational quotes about action, persistence, discipline, ambition and taking the next step.", inspiration: "Discover inspirational quotes about creativity, perspective, possibility, purpose and seeing life differently.", wisdom: "Explore timeless wisdom quotes about judgment, experience, truth, character and the lessons of life.", life: "Discover life quotes about change, time, relationships, meaning, growth and formative experiences.", love: "Explore love quotes about affection, connection, devotion, friendship and human relationships.", success: "Discover success quotes about achievement, work, ambition, discipline, persistence and lasting accomplishment.", courage: "Explore courage quotes about fear, resilience, conviction and acting with strength despite uncertainty.", philosophy: "Discover philosophical quotes about existence, morality, meaning, nature and the human condition.", happiness: "Explore happiness quotes about contentment, gratitude, joy and the search for a good life.", friendship: "Discover friendship quotes about loyalty, trust, connection, companionship and lasting relationships.", freedom: "Explore freedom quotes about independence, responsibility, choice and the principles that shape a life.", science: "Discover science quotes about discovery, curiosity, evidence, reason and the search for knowledge.", character: "Explore character quotes about integrity, courage, values, conduct and the qualities that define a person.", education: "Discover education quotes about learning, knowledge, teaching, curiosity and personal development.", faith: "Explore faith quotes about belief, trust, spirituality, hope and the search for meaning.", quotes: "Browse a broad collection of notable quotes, memorable words and timeless thoughts from influential authors.",
};

function slugify(value: string) { return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
export function generateStaticParams() { return [...new Set(quotesData.map((quote) => quote.category))].map((category) => ({ category: slugify(category) })); }

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const title = labels[category] ?? category.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  const hasQuotes = quotesData.some((quote) => slugify(quote.category) === category && isSeoIndexable(quote));
  const description = descriptions[category] ?? `Discover notable ${title.toLowerCase()} quotes by influential authors on Mayalines.`;
  return { title: `${title} Quotes – Famous & Timeless Words`, description, alternates: { canonical: `/categories/${category}` }, robots: { index: hasQuotes, follow: true }, openGraph: { type: "website", title: `${title} Quotes – Famous & Timeless Words | Mayalines`, description, url: `/categories/${category}` } };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const title = labels[category] ?? category.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  const description = descriptions[category] ?? `Discover notable ${title.toLowerCase()} quotes by influential authors on Mayalines.`;
  const quotes = quotesData.filter((quote) => slugify(quote.category) === category && isPublicQuote(quote));
  const visibleQuotes = quotes.slice(0, 60);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mayalines.com";
  const categoryUrl = `${siteUrl}/categories/${category}`;
  const collectionSchema = { "@context": "https://schema.org", "@type": "CollectionPage", name: `${title} Quotes – Famous & Timeless Words | Mayalines`, description, url: categoryUrl, inLanguage: "en-US", isPartOf: { "@type": "WebSite", name: "Mayalines", url: siteUrl } };
  const itemListSchema = { "@context": "https://schema.org", "@type": "ItemList", name: `${title} Quotes`, numberOfItems: visibleQuotes.length, itemListElement: visibleQuotes.map((quote, index) => ({ "@type": "ListItem", position: index + 1, name: `${quote.author} quote`, url: `${siteUrl}/quotes/${quote.slug}` })) };

  return <main className="quote-detail">
    <Breadcrumbs items={[{ name: "Home", url: "/" }, { name: "Categories", url: "/categories" }, { name: `${title} Quotes`, url: `/categories/${category}` }]} />
    <p className="eyebrow">MAYALINES CATEGORY</p><h1>{title} Quotes</h1><p className="hero-copy">{description}</p><p className="library-meta">{quotes.length.toLocaleString("en-US")} sourced quotes in this category.</p>
    <div className="quote-grid">{visibleQuotes.map((quote) => <article className="quote-card" key={quote.id} lang={quote.language ?? "en"}><div className="quote-mark" aria-hidden="true">“</div><p className="quote-text">{quote.quote}</p><p className="quote-author">— {quote.author}</p><div className="quote-actions"><PersistentLikeButton quoteId={quote.id} author={quote.author} /><a className="copy-button" href={`/quotes/${quote.slug}`}>READ QUOTE</a></div></article>)}</div>
    <StructuredData data={collectionSchema} /><StructuredData data={itemListSchema} />
  </main>;
}
