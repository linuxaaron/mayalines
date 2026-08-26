import type { Metadata } from "next";
import quotesData from "../../../data/quotes.json";

export const dynamicParams = false;

const descriptions: Record<string, string> = {
  motivation: "A curated collection of motivational quotes about action, persistence, discipline, and moving forward.",
  inspiration: "Inspirational quotes selected for clarity, perspective, creativity, and a sense of possibility.",
  wisdom: "Wisdom quotes exploring judgment, experience, truth, character, and the lessons people carry through life.",
  life: "Quotes about life, change, time, relationships, purpose, and the experiences that shape us.",
  love: "Quotes about love, affection, connection, friendship, and the complexity of human relationships.",
  success: "Quotes about achievement, work, ambition, discipline, and the habits behind meaningful success.",
  courage: "Quotes about courage, fear, resilience, conviction, and acting when the outcome is uncertain.",
  philosophy: "Philosophical quotes exploring existence, morality, meaning, nature, and the human condition.",
  happiness: "Quotes about happiness, contentment, gratitude, and the pursuit of a good life.",
  friendship: "Quotes about friendship, loyalty, trust, companionship, and the relationships that last.",
  freedom: "Quotes about freedom, independence, responsibility, and the choices that define a life.",
  science: "Quotes about science, discovery, curiosity, evidence, and the pursuit of knowledge.",
};

function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function generateStaticParams() {
  return [...new Set(quotesData.map((quote) => quote.category))].map((category) => ({ category: slugify(category) }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const title = category.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  return {
    title: `${title} Quotes — Quote Archive`,
    description: descriptions[category] ?? `Explore a curated collection of ${title.toLowerCase()} quotes from notable authors.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const title = category.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  const quotes = quotesData.filter((quote) => slugify(quote.category) === category);

  return (
    <main className="quote-detail">
      <a className="back-link" href="/">← Quote Archive</a>
      <p className="eyebrow">QUOTE CATEGORY</p>
      <h1>{title} Quotes</h1>
      <p className="hero-copy">{descriptions[category] ?? `Explore ${title.toLowerCase()} quotes from the archive.`}</p>
      <p className="library-meta">{quotes.length.toLocaleString()} quotes in this category.</p>
      <div className="quote-grid">
        {quotes.slice(0, 60).map((quote) => (
          <article className="quote-card" key={quote.id}>
            <div className="quote-mark" aria-hidden="true">“</div>
            <p className="quote-text">{quote.quote}</p>
            <p className="quote-author">— {quote.author}</p>
            <a className="copy-button" href={`/quotes/${quote.slug}`}>READ QUOTE</a>
          </article>
        ))}
      </div>
    </main>
  );
}
