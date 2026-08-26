import type { Metadata } from "next";
import quotesData from "../../../data/quotes";
import Breadcrumbs from "../../../components/Breadcrumbs";
import StructuredData from "../../../components/StructuredData";

export const dynamicParams = false;

const labels: Record<string, string> = { motivation: "Motivation", inspiration: "Inspiration", wisdom: "Weisheit", life: "Leben", love: "Liebe", success: "Erfolg", courage: "Mut", philosophy: "Philosophie", happiness: "Glück", friendship: "Freundschaft", freedom: "Freiheit", science: "Wissenschaft", character: "Charakter", education: "Bildung", faith: "Glaube", quotes: "Zitate" };
const descriptions: Record<string, string> = {
  motivation: "Eine kuratierte Sammlung motivierender Zitate über Handeln, Ausdauer, Disziplin und den nächsten Schritt.",
  inspiration: "Inspirierende Zitate über Klarheit, Perspektive, Kreativität und neue Möglichkeiten.",
  wisdom: "Zitate über Urteilskraft, Erfahrung, Wahrheit, Charakter und die Lehren des Lebens.",
  life: "Zitate über Leben, Veränderung, Zeit, Beziehungen, Sinn und prägende Erfahrungen.",
  love: "Zitate über Liebe, Zuneigung, Verbundenheit, Freundschaft und menschliche Beziehungen.",
  success: "Zitate über Leistung, Arbeit, Ehrgeiz, Disziplin und die Grundlagen nachhaltigen Erfolgs.",
  courage: "Zitate über Mut, Angst, Widerstandskraft, Überzeugung und Handeln trotz Unsicherheit.",
  philosophy: "Philosophische Zitate über Existenz, Moral, Sinn, Natur und die menschliche Verfassung.",
  happiness: "Zitate über Glück, Zufriedenheit, Dankbarkeit und die Suche nach einem guten Leben.",
  friendship: "Zitate über Freundschaft, Loyalität, Vertrauen, Verbundenheit und dauerhafte Beziehungen.",
  freedom: "Zitate über Freiheit, Unabhängigkeit, Verantwortung und Entscheidungen, die ein Leben prägen.",
  science: "Zitate über Wissenschaft, Entdeckung, Neugier, Belege und die Suche nach Wissen.",
};

function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function isIndexable(quote: (typeof quotesData)[number]) {
  return quote.indexable === true && quote.attributionStatus === "verified" && quote.copyrightStatus === "cleared";
}

export function generateStaticParams() {
  return [...new Set(quotesData.map((quote) => quote.category))].map((category) => ({ category: slugify(category) }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const title = labels[category] ?? category.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  const hasClearedQuotes = quotesData.some((quote) => slugify(quote.category) === category && isIndexable(quote));
  return {
    title: `${title} – Zitate | Mayalines`,
    description: descriptions[category] ?? `Entdecke eine kuratierte Sammlung von Zitaten zum Thema ${title.toLowerCase()} von bekannten Autoren.`,
    alternates: { canonical: `/categories/${category}` },
    robots: { index: hasClearedQuotes, follow: true },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const title = labels[category] ?? category.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  const quotes = quotesData.filter((quote) => slugify(quote.category) === category);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mayalines.com";
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${title} – Zitate | Mayalines`,
    description: descriptions[category] ?? `Entdecke ${title.toLowerCase()}-Zitate auf Mayalines.`,
    url: `${siteUrl}/categories/${category}`,
    isPartOf: { "@type": "WebSite", name: "Mayalines", url: siteUrl },
  };

  return (
    <main className="quote-detail">
      <Breadcrumbs items={[{ name: "Startseite", url: "/" }, { name: "Kategorien", url: "/#categories" }, { name: `${title} – Zitate`, url: `/categories/${category}` }]} />
      <p className="eyebrow">MAYALINES KATEGORIE</p>
      <h1>{title} – Zitate</h1>
      <p className="hero-copy">{descriptions[category] ?? `Entdecke ${title.toLowerCase()}-Zitate auf Mayalines.`}</p>
      <p className="library-meta">{quotes.length.toLocaleString("de-DE")} Zitate in dieser Kategorie.</p>
      <div className="quote-grid">
        {quotes.slice(0, 60).map((quote) => (
          <article className="quote-card" key={quote.id}>
            <div className="quote-mark" aria-hidden="true">“</div>
            <p className="quote-text">{quote.quote}</p>
            <p className="quote-author">— {quote.author}</p>
            <a className="copy-button" href={`/quotes/${quote.slug}`}>ZITAT LESEN</a>
          </article>
        ))}
      </div>
      <StructuredData data={collectionSchema} />
    </main>
  );
}
