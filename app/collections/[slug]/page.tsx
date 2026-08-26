import type { Metadata } from "next";
import quotesData from "../../../data/quotes";
import PersistentLikeButton from "../../../components/PersistentLikeButton";

const collections = {
  "quotes-about-life": { title: "Quotes About Life", description: "Thoughtful words about life, experience, change and the way we choose to live.", category: "Life" },
  "famous-love-quotes": { title: "Famous Love Quotes", description: "Memorable words about love, affection, devotion and human connection.", category: "Love" },
  "quotes-about-success": { title: "Quotes About Success", description: "Perspectives on achievement, ambition, work, discipline and success.", category: "Success" },
  "motivational-quotes": { title: "Motivational Quotes", description: "Words about courage, action, persistence and moving forward.", category: "Motivation" },
  "wisdom-quotes": { title: "Wisdom Quotes", description: "Timeless observations from writers and thinkers on character, knowledge and life.", category: "Wisdom" },
  "short-inspirational-quotes": { title: "Short Inspirational Quotes", description: "Concise, memorable lines for moments when a few words are enough.", category: "Inspiration", short: true },
} as const;

type CollectionSlug = keyof typeof collections;

export function generateStaticParams() {
  return Object.keys(collections).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const collection = collections[slug as CollectionSlug];
  if (!collection) return { title: "Collection Not Found | MAYALINES" };
  return {
    title: `${collection.title} | MAYALINES`,
    description: collection.description,
    alternates: { canonical: `https://mayalines.com/collections/${slug}` },
    openGraph: {
      title: `${collection.title} | MAYALINES`,
      description: collection.description,
      images: [{ url: "/mayalines-poetry.svg", width: 1200, height: 675, alt: `MAYALINES ${collection.title} illustration` }],
    },
  };
}

function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = collections[slug as CollectionSlug];
  if (!collection) return <main className="collection-page"><div className="collection-wrap"><h1>Collection not found</h1><a href="/collections">Browse collections →</a></div></main>;

  const quotes = quotesData.filter((quote) => quote.indexable === true && quote.attributionStatus === "verified" && quote.copyrightStatus === "cleared" && quote.category === collection.category && (!collection.short || quote.quote.length <= 120));

  return <main className="collection-page">
    <style>{`.collection-page{min-height:100vh;background:#d8d5cf;color:#171513}.collection-wrap{width:min(1180px,calc(100% - 36px));margin:0 auto}.collection-header{padding:28px 0;border-bottom:1px solid #bdb8af;display:flex;justify-content:space-between;align-items:center}.collection-brand{font:500 25px Georgia,serif;letter-spacing:.13em}.collection-nav{display:flex;gap:22px;color:#5f5a53;font:12px Inter,system-ui,sans-serif}.collection-nav a:hover,.collection-author:hover{color:#765843}.collection-hero{padding:70px 0 42px}.eyebrow{margin:0 0 14px;color:#765843;font:750 9px/1 Inter,system-ui,sans-serif;letter-spacing:.19em}.collection-hero h1{margin:0;max-width:900px;font:500 clamp(46px,6.5vw,78px)/.97 Georgia,serif;letter-spacing:-.05em}.collection-hero p:not(.eyebrow){max-width:720px;margin:22px 0 0;color:#48433d;font:15px/1.65 Inter,system-ui,sans-serif}.collection-meta{margin-top:18px;color:#765843;font:750 10px Inter,system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase}.collection-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;padding:12px 0 70px}.collection-quote{min-height:300px;padding:24px 22px 18px;border:1px solid #bdb8af;border-radius:6px;background:#e7e4de;display:flex;flex-direction:column;box-shadow:0 6px 18px rgba(23,21,19,.03)}.quote-mark{color:#765843;font:36px Georgia,serif;line-height:.7}.quote-text{margin:18px 0 0;color:#11100f;font:20px/1.34 Georgia,serif;letter-spacing:-.01em}.quote-author{margin:14px 0 0;color:#514b45;font:700 11px Inter,system-ui,sans-serif}.quote-actions{display:flex;align-items:center;gap:8px;margin-top:auto;padding-top:18px}.like-control{display:flex;align-items:center;gap:6px}.like-button{width:34px;height:34px;display:inline-grid;place-items:center;border:1px solid #bdb8af;border-radius:50%;color:#766f67}.like-button.is-liked{color:#c62828;background:rgba(198,40,40,.08);border-color:rgba(198,40,40,.55)}.heart-icon{font-size:14px}.like-count{font:10px Inter,system-ui,sans-serif;color:#5f5a53}.copy-button{padding:7px 10px;border:1px solid #bdb8af;border-radius:4px;color:#765843;font:750 9px Inter,system-ui,sans-serif;letter-spacing:.08em}.copy-button:hover{background:#765843;color:#fff}.collection-author{margin-top:18px;display:inline-block;color:#765843;font:750 10px Inter,system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase}.collection-footer{padding:24px 0;border-top:1px solid #bdb8af;color:#5f5a53;font:10px Inter,system-ui,sans-serif}.collection-footer a{text-decoration:underline;text-underline-offset:3px}@media(max-width:900px){.collection-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:560px){.collection-header{align-items:flex-start;gap:18px;flex-direction:column}.collection-nav{width:100%;justify-content:space-between}.collection-grid{grid-template-columns:1fr}.collection-hero{padding-top:56px}.collection-quote{min-height:260px}}`}</style>
    <header className="collection-header"><a href="/" className="collection-brand">MAYALINES</a><nav className="collection-nav" aria-label="Collection navigation"><a href="/collections">Collections</a><a href="/authors">Authors</a><a href="/poems">Poems</a></nav></header>
    <section className="collection-hero"><p className="eyebrow">MAYALINES · CURATED COLLECTION</p><h1>{collection.title}</h1><p>{collection.description}</p><p className="collection-meta">{quotes.length.toLocaleString("en-US")} sourced quotes</p></section>
    <section className="collection-grid" aria-label={collection.title}>{quotes.slice(0, 90).map((quote) => <article className="collection-quote" key={quote.id}><div className="quote-mark" aria-hidden="true">“</div><p className="quote-text">{quote.quote}</p><p className="quote-author">— {quote.author}</p><a className="collection-author" href={`/authors/${slugify(quote.author)}`}>More by {quote.author} →</a><div className="quote-actions"><PersistentLikeButton quoteId={quote.id} author={quote.author} /><button className="copy-button" type="button" onClick={() => navigator.clipboard?.writeText(`“${quote.quote}” — ${quote.author}`)}>COPY</button></div></article>)}</section>
    <footer className="collection-footer"><a href="/collections">← All collections</a></footer>
  </main>;
}
