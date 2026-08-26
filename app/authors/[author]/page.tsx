import type { Metadata } from "next";
import quotesData from "../../../data/quotes.json";

export const dynamicParams = false;

function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function generateStaticParams() {
  return Array.from(new Set(quotesData.map((quote) => quote.author))).map((author) => ({ author: slugify(author) }));
}

export async function generateMetadata({ params }: { params: Promise<{ author: string }> }): Promise<Metadata> {
  const { author: slug } = await params;
  const authorName = Array.from(new Set(quotesData.map((quote) => quote.author))).find((name) => slugify(name) === slug);
  return {
    title: authorName ? `${authorName} Quotes` : "Author Quotes",
    description: authorName ? `Memorable quotes by ${authorName}.` : "Explore memorable quotes by author.",
  };
}

export default async function AuthorPage({ params }: { params: Promise<{ author: string }> }) {
  const { author: slug } = await params;
  const authorName = Array.from(new Set(quotesData.map((quote) => quote.author))).find((name) => slugify(name) === slug);
  if (!authorName) return null;
  const quotes = quotesData.filter((quote) => quote.author === authorName);

  return (
    <main className="quote-detail">
      <a className="back-link" href="/">← Quote Archive</a>
      <p className="eyebrow">AUTHOR</p>
      <h1>{authorName}</h1>
      <p className="hero-copy">A collection of {quotes.length} attributed quotes by {authorName}.</p>
      <div className="quote-grid">
        {quotes.slice(0, 24).map((quote) => (
          <article className="quote-card" key={quote.id}>
            <div className="quote-mark" aria-hidden="true">“</div>
            <p className="quote-text">{quote.quote}</p>
            <p className="quote-author">— {quote.author}</p>
            <a className="copy-button" href={`/quotes/${quote.slug}`}>VIEW QUOTE</a>
          </article>
        ))}
      </div>
    </main>
  );
}
