import type { Metadata } from "next";
import Link from "next/link";
import quotesData from "../../../data/quotes";
import PersistentLikeButton from "../../../components/PersistentLikeButton";
import CopyQuoteButton from "../../../components/CopyQuoteButton";
import StructuredData from "../../../components/StructuredData";

const collections = {
  "quotes-about-life": { title: "Quotes About Life", description: "Thoughtful words about life, experience, change and the way we choose to live.", category: "Life" },
  "quotes-about-love": { title: "Love Quotes", description: "Memorable words about love, affection, devotion and human connection.", category: "Love" },
  "quotes-about-hope": { title: "Hope Quotes", description: "Hope quotes about perseverance, renewal, optimism, difficult times and believing that things can improve.", category: "Hope" },
  "quotes-about-suffering": { title: "Suffering Quotes", description: "Suffering quotes about pain, hardship, grief, adversity, resilience and finding meaning through difficult moments.", match: /(suffer|suffering|pain|painful|grief|sorrow|hardship|adversity|anguish|misery|wound|sacrifice)/i },
  "pain-quotes": { title: "Pain Quotes", description: "Quotes about emotional pain, physical pain, heartbreak, struggle, endurance and finding perspective in difficult experiences.", match: /(pain|painful|hurt|hurting|ache|wound|suffer|agony|anguish)/i },
  "healing-quotes": { title: "Healing Quotes", description: "Healing quotes about recovery, emotional healing, resilience, growth, peace and moving forward after difficult experiences.", match: /(heal|healing|recover|recovery|restore|peace|repair|renew|renewal|recovering)/i },
  "sad-quotes": { title: "Sad Quotes", description: "Sad quotes about sorrow, loneliness, heartbreak, loss, grief and the emotional experiences that shape us.", match: /(sad|sadness|sorrow|lonely|loneliness|heartbreak|grief|loss|tears|weep|weeping)/i },
  "strength-quotes": { title: "Strength Quotes", description: "Strength quotes about resilience, courage, endurance, determination, overcoming adversity and staying strong through difficult times.", match: /(strength|strong|resilien|endure|endurance|overcome|courage|brave|fortitude|persever)/i },
  "positive-quotes": { title: "Positive Quotes", description: "Positive quotes about optimism, happiness, gratitude, confidence, hope and approaching life with a constructive mindset.", match: /(positive|optimis|happiness|happy|joy|gratitude|hope|smile|confidence|cheer)/i },
  "maya-angelou-quotes": { title: "Maya Angelou Quotes", description: "Explore Maya Angelou quotes about life, courage, love, dignity, resilience, change and the human experience.", author: "Maya Angelou" },
  "quotes-about-success": { title: "Quotes About Success", description: "Perspectives on achievement, ambition, work, discipline and success.", category: "Success" },
  "quotes-about-motivation": { title: "Motivational Quotes", description: "Words about courage, action, persistence and moving forward.", category: "Motivation" },
  "quotes-about-wisdom": { title: "Wisdom Quotes", description: "Timeless observations from writers and thinkers on character, knowledge and life.", category: "Wisdom" },
  "short-inspirational-quotes": { title: "Short Inspirational Quotes", description: "Concise, memorable lines for moments when a few words are enough.", short: true },
  "quotes-about-friendship": { title: "Friendship Quotes", description: "Quotes about loyalty, trust, companionship and lasting friendships.", category: "Friendship" },
  "quotes-about-courage": { title: "Courage Quotes", description: "Words about bravery, fear, resilience and finding the strength to act.", category: "Courage" },
  "quotes-about-happiness": { title: "Happiness Quotes", description: "Quotes about joy, contentment and meaningful living.", category: "Happiness" },
} as const;

type CollectionSlug = keyof typeof collections;

export function generateStaticParams() {
  return Object.keys(collections).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const collection = collections[slug as CollectionSlug];
  if (!collection) return { title: "Collection Not Found | MAYALINES", robots: { index: false, follow: false } };

  return {
    title: `${collection.title} – Famous, Meaningful & Inspirational Quotes`,
    description: collection.description,
    alternates: { canonical: `https://mayalines.com/collections/${slug}` },
    robots: { index: true, follow: true },
    openGraph: {
      title: `${collection.title} | MAYALINES`,
      description: collection.description,
      type: "website",
      url: `/collections/${slug}`,
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
  if (!collection) return <main className="collection-page"><div className="collection-wrap"><h1>Collection not found</h1><Link href="/collections">Browse collections →</Link></div></main>;

  const quotes = quotesData.filter((quote) => {
    if (quote.indexable !== true || quote.attributionStatus !== "verified" || quote.copyrightStatus !== "cleared") return false;
    if ("short" in collection && collection.short && quote.quote.length > 120) return false;
    if ("author" in collection) return quote.author.toLowerCase() === collection.author.toLowerCase();
    if ("match" in collection) return collection.match.test(`${quote.quote} ${quote.category}`);
    if ("category" in collection) return quote.category === collection.category;
    return false;
  });
  const related = Object.entries(collections).filter(([otherSlug]) => otherSlug !== slug).slice(0, 6);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mayalines.com";
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: collection.title,
    description: collection.description,
    url: `${siteUrl}/collections/${slug}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: Math.min(quotes.length, 90),
      itemListElement: quotes.slice(0, 90).map((quote, index) => ({ "@type": "ListItem", position: index + 1, url: `${siteUrl}/quotes/${quote.slug}`, name: `${quote.author} quote` })),
    },
  };

  return <main className="collection-page">
    <StructuredData data={itemListSchema} />
    <style>{`
      .collection-page,.collection-page *{box-sizing:border-box}.collection-page{width:100%;max-width:100%;min-height:100vh;overflow-x:clip;background:#d8d5cf;color:#171513}.collection-page *{min-width:0}.collection-wrap{width:min(1180px,calc(100% - 36px));max-width:100%;margin:0 auto;overflow:hidden}.collection-header{padding:28px 0;border-bottom:1px solid #bdb8af;display:flex;justify-content:space-between;align-items:center;gap:24px}.collection-brand{font:500 25px Georgia,serif;letter-spacing:.13em;white-space:nowrap}.collection-nav{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:14px 22px;color:#5f5a53;font:12px Inter,system-ui,sans-serif}.collection-nav a:hover,.collection-author:hover,.related-link:hover{color:#765843}.collection-hero{padding:70px 0 42px}.eyebrow{margin:0 0 14px;color:#765843;font:750 9px/1 Inter,system-ui,sans-serif;letter-spacing:.19em}.collection-hero h1{margin:0;max-width:900px;font:500 clamp(44px,6.5vw,78px)/.97 Georgia,serif;letter-spacing:-.05em;overflow-wrap:break-word}.collection-hero p:not(.eyebrow){max-width:760px;margin:22px 0 0;color:#48433d;font:15px/1.65 Inter,system-ui,sans-serif}.collection-meta{margin-top:18px!important;color:#765843!important;font:750 10px Inter,system-ui,sans-serif!important;letter-spacing:.08em;text-transform:uppercase}.collection-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;padding:12px 0 70px}.collection-quote{min-height:300px;max-width:100%;padding:24px 22px 18px;border:1px solid #bdb8af;border-radius:6px;background:#e7e4de;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 6px 18px rgba(23,21,19,.03)}.quote-mark{color:#765843;font:36px Georgia,serif;line-height:.7}.quote-text{margin:18px 0 0;color:#11100f;font:20px/1.34 Georgia,serif;letter-spacing:-.01em;overflow-wrap:break-word}.quote-author{margin:14px 0 0;color:#514b45;font:700 11px Inter,system-ui,sans-serif;overflow-wrap:break-word}.quote-actions{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-top:auto;padding-top:18px}.like-control{display:flex;align-items:center;gap:6px}.like-button{width:34px;height:34px;display:inline-grid;place-items:center;border:1px solid #bdb8af;border-radius:50%;color:#766f67}.like-button.is-liked{color:#c62828;background:rgba(198,40,40,.08);border-color:rgba(198,40,40,.55)}.heart-icon{font-size:14px}.like-count{font:10px Inter,system-ui,sans-serif;color:#5f5a53}.copy-button{padding:7px 10px;border:1px solid #bdb8af;border-radius:4px;color:#765843;background:transparent;font:750 9px Inter,system-ui,sans-serif;letter-spacing:.08em}.copy-button:hover{background:#765843;color:#fff}.collection-author{margin-top:18px;display:inline-block;max-width:100%;color:#765843;font:750 10px/1.4 Inter,system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;overflow-wrap:anywhere}.related{padding:34px 0 62px;border-top:1px solid #bdb8af}.related-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.related-link{display:block;padding:16px;border:1px solid #bdb8af;border-radius:5px;background:#e7e4de;color:#514b45;font:600 11px/1.4 Inter,system-ui,sans-serif;overflow-wrap:break-word}@media(max-width:900px){.collection-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.related-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:560px){.collection-page{overflow-x:hidden}.collection-wrap{width:calc(100% - 28px);margin:0 14px}.collection-header{padding:20px 0;align-items:flex-start;gap:15px;flex-direction:column}.collection-brand{font-size:21px}.collection-nav{width:100%;justify-content:flex-start;gap:10px 18px;font-size:11px}.collection-hero{padding:42px 0 30px}.collection-hero h1{font-size:clamp(38px,12vw,54px);line-height:1;letter-spacing:-.04em}.collection-hero p:not(.eyebrow){margin-top:18px;font-size:14px;line-height:1.6}.collection-grid{grid-template-columns:minmax(0,1fr);gap:10px;padding:8px 0 48px}.collection-quote{width:100%;min-height:220px;padding:20px 18px 16px}.quote-text{font-size:17px;line-height:1.33}.related{padding:28px 0 44px}.related-grid{grid-template-columns:minmax(0,1fr)}}
    `}</style>
    <div className="collection-wrap">
      <header className="collection-header"><Link href="/" className="collection-brand">MAYALINES</Link><nav className="collection-nav" aria-label="Collection navigation"><Link href="/collections">Collections</Link><Link href="/authors">Authors</Link><Link href="/poems">Poems</Link></nav></header>
      <section className="collection-hero"><p className="eyebrow">MAYALINES · CURATED COLLECTION</p><h1>{collection.title}</h1><p>{collection.description}</p><p className="collection-meta">{quotes.length.toLocaleString("en-US")} sourced quotes</p></section>
      <section className="collection-grid" aria-label={collection.title}>{quotes.slice(0, 90).map((quote) => <article className="collection-quote" key={quote.id} lang={quote.language ?? "en"}><div className="quote-mark" aria-hidden="true">“</div><p className="quote-text">{quote.quote}</p><p className="quote-author">— {quote.author}</p><Link className="collection-author" href={`/authors/${slugify(quote.author)}`}>More by {quote.author} →</Link><div className="quote-actions"><PersistentLikeButton quoteId={quote.id} author={quote.author} /><CopyQuoteButton quote={quote.quote} author={quote.author} /></div></article>)}</section>
      {related.length > 0 && <section className="related" aria-labelledby="related-heading"><p className="eyebrow">KEEP EXPLORING</p><h2 id="related-heading">More quote collections</h2><div className="related-grid">{related.map(([relatedSlug, relatedCollection]) => <Link className="related-link" key={relatedSlug} href={`/collections/${relatedSlug}`}>{relatedCollection.title} →</Link>)}</div></section>}
      <footer className="collection-footer"><Link href="/collections">← All collections</Link></footer>
    </div>
  </main>;
}
