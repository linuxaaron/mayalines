import type { Metadata } from "next";
import Breadcrumbs from "../../../components/Breadcrumbs";
import StructuredData from "../../../components/StructuredData";
import quotesData from "../../../data/quotes";

export const dynamicParams = false;

function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function isIndexable(quote: (typeof quotesData)[number]) {
  return quote.indexable === true && quote.attributionStatus === "verified" && quote.copyrightStatus === "cleared";
}

export function generateStaticParams() {
  return Array.from(new Set(quotesData.map((quote) => quote.author))).map((author) => ({ author: slugify(author) }));
}

export async function generateMetadata({ params }: { params: Promise<{ author: string }> }): Promise<Metadata> {
  const { author: slug } = await params;
  const authorName = Array.from(new Set(quotesData.map((quote) => quote.author))).find((name) => slugify(name) === slug);
  const indexable = authorName ? quotesData.some((quote) => quote.author === authorName && isIndexable(quote)) : false;
  return {
    title: authorName ? `Zitate von ${authorName}` : "Zitate nach Autor",
    description: authorName ? `Entdecke bemerkenswerte Zitate von ${authorName} auf Mayalines, mit Zuordnung und Quellenangaben, soweit verfügbar.` : "Entdecke bemerkenswerte Zitate nach Autor auf Mayalines.",
    alternates: { canonical: authorName ? `/authors/${slug}` : "/authors" },
    robots: { index: indexable, follow: true },
  };
}

export default async function AuthorPage({ params }: { params: Promise<{ author: string }> }) {
  const { author: slug } = await params;
  const authorName = Array.from(new Set(quotesData.map((quote) => quote.author))).find((name) => slugify(name) === slug);
  if (!authorName) return null;
  const quotes = quotesData.filter((quote) => quote.author === authorName);
  const indexableQuotes = quotes.filter(isIndexable);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mayalines.com";
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: authorName,
    subjectOf: { "@type": "WebPage", url: `${siteUrl}/authors/${slug}` },
  };

  return (
    <main className="quote-detail">
      <Breadcrumbs items={[{ name: "Startseite", url: "/" }, { name: "Autoren", url: "/#authors" }, { name: authorName, url: `/authors/${slug}` }]} />
      <p className="eyebrow">AUTOR</p>
      <h1>Zitate von {authorName}</h1>
      <p className="hero-copy">Entdecke {quotes.length} zugeordnete Zitate von {authorName}. Davon sind {indexableQuotes.length} Zitate derzeit für die Suchmaschinenindexierung freigegeben.</p>
      <div className="quote-grid">
        {quotes.slice(0, 24).map((quote) => (
          <article className="quote-card" key={quote.id}>
            <div className="quote-mark" aria-hidden="true">“</div>
            <p className="quote-text">{quote.quote}</p>
            <p className="quote-author">— {quote.author}</p>
            <a className="copy-button" href={`/quotes/${quote.slug}`}>ZITAT ANSEHEN</a>
          </article>
        ))}
      </div>
      <StructuredData data={personSchema} />
    </main>
  );
}
