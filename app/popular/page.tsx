import { getDb } from "../../lib/db";
import QuoteResults from "../../components/QuoteResults";
import quotesData from "../../data/quotes";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Popular Quotes — Most Liked Quotes | MAYALINES",
  description: "Discover the most liked famous and inspirational quotes on MAYALINES, ranked by our reader community.",
  alternates: { canonical: "https://mayalines.com/popular" },
};

const FALLBACK_LIMIT = 60;

function getPopularFallback() {
  return quotesData
    .filter((quote) => quote.indexable !== false)
    .slice(0, FALLBACK_LIMIT)
    .map((quote, index) => ({ ...quote, likes: 0, rank: index + 1 }));
}

async function getPopular() {
  const db = getDb();
  if (!db) return getPopularFallback();

  try {
    const rows = await db`SELECT quote_id, COUNT(*)::int AS likes FROM quote_likes GROUP BY quote_id ORDER BY likes DESC, quote_id ASC LIMIT 60`;
    const byId = new Map(quotesData.map((quote) => [quote.id, quote]));
    const ranked = rows.map((row, index) => {
      const item = row as { quote_id: string; likes: number };
      const quote = byId.get(item.quote_id);
      return quote ? { ...quote, likes: Number(item.likes) || 0, rank: index + 1 } : null;
    }).filter((quote): quote is NonNullable<typeof quote> => Boolean(quote && quote.indexable !== false));

    return ranked.length ? ranked : getPopularFallback();
  } catch {
    return getPopularFallback();
  }
}

export default async function PopularPage() {
  const quotes = await getPopular();
  const hasCommunityLikes = quotes.some((quote) => quote.likes > 0);

  return <main className="site-shell"><header className="header"><a className="brand" href="/" aria-label="MAYALINES home"><span className="brand-name">MAYALINES</span></a><div className="header-rule"/><nav className="nav" aria-label="Primary navigation"><a href="/">Quotes</a><a href="/popular" aria-current="page">Popular</a><a href="/trending">Trending</a><a href="/topics">Topics</a><a href="/authors">Authors</a></nav></header><section className="hero"><p className="eyebrow">MAYALINES · COMMUNITY RANKING</p><h1>Popular Quotes</h1><p className="hero-copy">The quotes readers have liked most. As community activity grows, this ranking updates automatically from persistent reader likes.</p></section><section className="library" aria-labelledby="popular-heading"><div className="section-heading" id="popular-heading">Popular quotes</div><p className="library-meta">{hasCommunityLikes ? `Top ${quotes.length} ranked by total reader likes` : `${quotes.length} selected quotes while the community ranking grows`}</p><QuoteResults quotes={quotes}/></section><footer className="footer">© 2026 Mayalines</footer></main>;
}
