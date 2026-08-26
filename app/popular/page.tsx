import { Redis } from "@upstash/redis";
import QuoteResults from "../../components/QuoteResults";
import quotesData from "../../data/quotes";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Popular Quotes — Most Liked Quotes | MAYALINES",
  description: "Discover the most liked famous and inspirational quotes on MAYALINES, ranked by our reader community.",
  alternates: { canonical: "https://mayalines.com/popular" },
};

async function getPopular() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return [];
  const redis = new Redis({ url, token });
  const quotes = quotesData.filter((quote) => quote.indexable !== false);
  const counts = await redis.mget<number[]>(...quotes.map((quote) => `quote:likes:${quote.id}`));
  return quotes.map((quote, index) => ({ ...quote, likes: Number(counts[index]) || 0 })).filter((quote) => quote.likes > 0).sort((a, b) => b.likes - a.likes).slice(0, 60);
}

export default async function PopularPage() {
  const quotes = await getPopular();
  return <main className="site-shell"><header className="header"><a className="brand" href="/"><span className="brand-name">MAYALINES</span></a><div className="header-rule"/><nav className="nav"><a href="/">Quotes</a><a href="/popular" aria-current="page">Popular</a><a href="/trending">Trending</a><a href="/topics">Topics</a><a href="/authors">Authors</a></nav></header><section className="hero"><p className="eyebrow">MAYALINES · COMMUNITY RANKING</p><h1>Popular Quotes</h1><p className="hero-copy">The quotes readers have liked most. Rankings are based on persistent community likes and update as people discover and save their favorite words.</p></section><section className="library"><div className="section-heading">Most liked quotes</div><p className="library-meta">{quotes.length ? "Ranked by reader likes" : "Like your favorite quotes to build the ranking."}</p>{quotes.length ? <QuoteResults quotes={quotes}/> : <div className="empty-ranking">No community ranking is available yet. Be the first to like a quote.</div>}</section><footer className="footer">© 2026 Mayalines</footer></main>;
}
