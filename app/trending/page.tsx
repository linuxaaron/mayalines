import { getDb } from "../../lib/db";
import QuoteResults from "../../components/QuoteResults";
import quotesData from "../../data/quotes";

export const revalidate = 300;
export const metadata = {
  title: "Trending Quotes — What Readers Are Liking",
  description: "Discover quotes that readers are liking right now on MAYALINES.",
  alternates: { canonical: "https://mayalines.com/trending" },
};

const FALLBACK_LIMIT = 60;

function dailySeed() {
  const now = new Date();
  return Number(`${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(2, "0")}${String(now.getUTCDate()).padStart(2, "0")}`);
}

function scoreQuote(id: string, seed: number) {
  let hash = seed >>> 0;
  for (let i = 0; i < id.length; i += 1) hash = Math.imul(hash ^ id.charCodeAt(i), 2654435761) >>> 0;
  return hash;
}

function getTrendingFallback() {
  const seed = dailySeed();
  return quotesData
    .filter((quote) => quote.indexable !== false)
    .map((quote) => ({ quote, score: scoreQuote(quote.id, seed) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, FALLBACK_LIMIT)
    .map(({ quote }, index) => ({ ...quote, likes: 0, rank: index + 1 }));
}

async function getTrending() {
  const db = getDb();
  if (!db) return getTrendingFallback();

  try {
    const rows = await db`SELECT quote_id, COUNT(*)::int AS likes FROM quote_likes WHERE created_at >= NOW() - INTERVAL '7 days' GROUP BY quote_id ORDER BY likes DESC, MAX(created_at) DESC LIMIT 60`;
    const byId = new Map(quotesData.map((quote) => [quote.id, quote]));
    const ranked = rows.map((row, index) => {
      const item = row as { quote_id: string; likes: number };
      const quote = byId.get(item.quote_id);
      return quote ? { ...quote, likes: Number(item.likes) || 0, rank: index + 1 } : null;
    }).filter((quote): quote is NonNullable<typeof quote> => Boolean(quote && quote.indexable !== false));

    return ranked.length ? ranked : getTrendingFallback();
  } catch {
    return getTrendingFallback();
  }
}

export default async function TrendingPage() {
  const quotes = await getTrending();
  const hasRecentLikes = quotes.some((quote) => quote.likes > 0);

  return <main className="site-shell"><header className="header"><a className="brand" href="/"><span className="brand-name">MAYALINES</span></a><div className="header-rule"/><nav className="nav" aria-label="Primary navigation"><a href="/">Quotes</a><a href="/popular">Popular</a><a href="/trending" aria-current="page">Trending</a><a href="/topics">Topics</a><a href="/authors">Authors</a></nav></header><section className="hero"><p className="eyebrow">MAYALINES · LIVE DISCOVERY</p><h1>Trending Quotes</h1><p className="hero-copy">See quotes receiving attention from readers. When recent activity is still sparse, MAYALINES keeps this page useful with a fresh daily selection from the verified quote library.</p></section><section className="library" aria-labelledby="trending-heading"><h2 className="section-heading" id="trending-heading">Trending now</h2><p className="library-meta">{hasRecentLikes ? "Most liked during the last seven days" : "Fresh daily selection while recent community activity grows"}</p><QuoteResults quotes={quotes}/></section></main>;
}
