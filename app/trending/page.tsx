import { Redis } from "@upstash/redis";
import QuoteResults from "../../components/QuoteResults";
import quotesData from "../../data/quotes";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Trending Quotes — What Readers Are Liking | MAYALINES",
  description: "Discover quotes that readers are liking right now on MAYALINES.",
  alternates: { canonical: "https://mayalines.com/trending" },
};

async function getTrending() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return [];
  const redis = new Redis({ url, token });
  const ids = await redis.zrange<string[]>("quotes:trending", 0, 59, { rev: true });
  const byId = new Map(quotesData.map((quote) => [quote.id, quote]));
  return ids.map((id) => byId.get(id)).filter((quote): quote is (typeof quotesData)[number] => Boolean(quote && quote.indexable !== false));
}

export default async function TrendingPage() {
  const quotes = await getTrending();
  return <main className="site-shell"><header className="header"><a className="brand" href="/"><span className="brand-name">MAYALINES</span></a><div className="header-rule"/><nav className="nav"><a href="/">Quotes</a><a href="/popular">Popular</a><a href="/trending" aria-current="page">Trending</a><a href="/topics">Topics</a><a href="/authors">Authors</a></nav></header><section className="hero"><p className="eyebrow">MAYALINES · LIVE DISCOVERY</p><h1>Trending Quotes</h1><p className="hero-copy">See the quotes receiving new attention from readers. Trending is driven by recent community likes rather than lifetime totals.</p></section><section className="library"><div className="section-heading">Trending now</div><p className="library-meta">Recently liked by readers</p>{quotes.length ? <QuoteResults quotes={quotes}/> : <div className="empty-ranking">Trending will appear as readers start liking quotes.</div>}</section><footer className="footer">© 2026 Mayalines</footer></main>;
}
