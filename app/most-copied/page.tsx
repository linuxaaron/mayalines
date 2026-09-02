import { getDb } from "../../lib/db";
import QuoteResults from "../../components/QuoteResults";
import quotesData from "../../data/quotes";

export const revalidate = 300;
export const metadata = {
  title: "Most Copied Quotes",
  description: "Discover the quotes readers copy most often for messages, statuses and social posts.",
  alternates: { canonical: "https://mayalines.com/most-copied" },
};

async function getMostCopied() {
  const db = getDb();
  if (!db) return [];
  const rows = await db`SELECT quote_id, COUNT(*)::int AS copies FROM quote_copies GROUP BY quote_id ORDER BY copies DESC, quote_id ASC LIMIT 60`;
  const byId = new Map(quotesData.map((quote) => [quote.id, quote]));
  return rows.map((row, index) => {
    const item = row as { quote_id: string; copies: number };
    const quote = byId.get(item.quote_id);
    return quote ? { ...quote, likes: Number(item.copies) || 0, rank: index + 1 } : null;
  }).filter((quote): quote is NonNullable<typeof quote> => Boolean(quote && quote.indexable !== false));
}

export default async function MostCopiedPage() {
  const quotes = await getMostCopied();
  return <main className="site-shell"><header className="header"><a className="brand" href="/"><span className="brand-name">MAYALINES</span></a><div className="header-rule"/><nav className="nav"><a href="/">Quotes</a><a href="/popular">Popular</a><a href="/trending">Trending</a><a href="/most-copied" aria-current="page">Most copied</a></nav></header><section className="hero"><p className="eyebrow">MAYALINES · COPY RANKING</p><h1>Most Copied Quotes</h1><p className="hero-copy">Quotes readers copy most often for messages, WhatsApp statuses, captions and social posts.</p></section><section className="library"><div className="section-heading">Most copied</div><p className="library-meta">Ranked by total recorded copies</p>{quotes.length ? <QuoteResults quotes={quotes} metricLabel="copies"/> : <div className="empty-ranking">The copy ranking will appear as readers start copying quotes.</div>}</section><footer className="footer">© 2026 Mayalines</footer></main>;
}
