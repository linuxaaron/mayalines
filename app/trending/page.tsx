import { getDb } from "../../lib/db";
import QuoteResults from "../../components/QuoteResults";
import quotesData from "../../data/quotes";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Trending Quotes — What Readers Are Liking | MAYALINES",
  description: "Discover quotes that readers are liking right now on MAYALINES.",
  alternates: { canonical: "https://mayalines.com/trending" },
};

async function getTrending() {
  const db = getDb();
  if (!db) return [];
  const rows = await db`SELECT quote_id, COUNT(*)::int AS likes FROM quote_likes WHERE created_at >= NOW() - INTERVAL '7 days' GROUP BY quote_id ORDER BY likes DESC, MAX(created_at) DESC LIMIT 60`;
  const byId = new Map(quotesData.map((quote) => [quote.id, quote]));
  return rows.map((row, index) => {
    const item = row as { quote_id: string; likes: number };
    const quote = byId.get(item.quote_id);
    return quote ? { ...quote, likes: Number(item.likes) || 0, rank: index + 1 } : null;
  }).filter((quote): quote is NonNullable<typeof quote> => Boolean(quote && quote.indexable !== false));
}

export default async function TrendingPage() {
  const quotes = await getTrending();
  return <main className="site-shell"><header className="header"><a className="brand" href="/"><span className="brand-name">MAYALINES</span></a><div className="header-rule"/><nav className="nav"><a href="/">Quotes</a><a href="/popular">Popular</a><a href="/trending" aria-current="page">Trending</a><a href="/topics">Topics</a><a href="/authors">Authors</a></nav></header><section className="hero"><p className="eyebrow">MAYALINES · LIVE DISCOVERY</p><h1>Trending Quotes</h1><p className="hero-copy">See the quotes receiving new attention from readers. Trending is based on community likes from the last seven days.</p></section><section className="library"><div className="section-heading">Trending now</div><p className="library-meta">Most liked during the last seven days</p>{quotes.length ? <QuoteResults quotes={quotes}/> : <div className="empty-ranking">Trending will appear as readers start liking quotes.</div>}</section><footer className="footer">© 2026 Mayalines</footer></main>;
}
