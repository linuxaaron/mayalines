import { getDb } from "../../lib/db";
import QuoteResults from "../../components/QuoteResults";
import quotesData from "../../data/quotes";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Popular Quotes — Most Liked Quotes | MAYALINES",
  description: "Discover the most liked famous and inspirational quotes on MAYALINES, ranked by our reader community.",
  alternates: { canonical: "https://mayalines.com/popular" },
};

async function getPopular() {
  const db = getDb();
  if (!db) return [];
  const rows = await db`SELECT quote_id, COUNT(*)::int AS likes FROM quote_likes GROUP BY quote_id ORDER BY likes DESC, quote_id ASC LIMIT 60`;
  const byId = new Map(quotesData.map((quote) => [quote.id, quote]));
  return rows.map((row, index) => {
    const item = row as { quote_id: string; likes: number };
    const quote = byId.get(item.quote_id);
    return quote ? { ...quote, likes: Number(item.likes) || 0, rank: index + 1 } : null;
  }).filter((quote): quote is NonNullable<typeof quote> => Boolean(quote && quote.indexable !== false));
}

export default async function PopularPage() {
  const quotes = await getPopular();
  return <main className="site-shell"><header className="header"><a className="brand" href="/" aria-label="MAYALINES home"><span className="brand-name">MAYALINES</span></a><div className="header-rule"/><nav className="nav" aria-label="Primary navigation"><a href="/">Quotes</a><a href="/popular" aria-current="page">Popular</a><a href="/trending">Trending</a><a href="/topics">Topics</a><a href="/authors">Authors</a></nav></header><section className="hero"><p className="eyebrow">MAYALINES · COMMUNITY RANKING</p><h1>Popular Quotes</h1><p className="hero-copy">The quotes readers have liked most. Every position is based on persistent community likes and updates as readers discover their favorite words.</p></section><section className="library" aria-labelledby="popular-heading"><div className="section-heading" id="popular-heading">Most liked quotes</div><p className="library-meta">{quotes.length ? `Top ${quotes.length} ranked by total reader likes` : "Like your favorite quotes to build the community ranking."}</p>{quotes.length ? <QuoteResults quotes={quotes}/> : <div className="empty-ranking">No community ranking is available yet. Be the first to like a quote.</div>}</section><footer className="footer">© 2026 Mayalines</footer></main>;
}
