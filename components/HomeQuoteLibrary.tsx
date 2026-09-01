"use client";

import { useEffect, useRef, useState } from "react";
import PersistentLikeButton from "./PersistentLikeButton";
import QuoteActions from "./QuoteActions";

type QuoteItem = {
  id: string;
  quote: string;
  author: string;
  category: string;
  slug: string;
  language?: string;
  indexable?: boolean;
};

type Props = {
  initialQuotes: QuoteItem[];
  initialTotal: number;
  categories: string[];
};

const PAGE_SIZE = 48;

export default function HomeQuoteLibrary({ initialQuotes, initialTotal, categories }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [quotes, setQuotes] = useState(initialQuotes);
  const [total, setTotal] = useState(initialTotal);
  const [hasMore, setHasMore] = useState(initialQuotes.length < initialTotal);
  const [loading, setLoading] = useState(false);
  const requestId = useRef(0);
  const firstRun = useRef(true);

  async function load(reset: boolean) {
    const currentRequest = ++requestId.current;
    const offset = reset ? 0 : quotes.length;
    const params = new URLSearchParams({ offset: String(offset), limit: String(PAGE_SIZE) });
    if (query.trim()) params.set("q", query.trim());
    if (category !== "All") params.set("category", category);

    setLoading(true);
    try {
      const response = await fetch(`/api/library?${params.toString()}`, { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error(`Quote API returned ${response.status}`);
      const data = await response.json() as { items: QuoteItem[]; total: number; hasMore: boolean };
      if (currentRequest !== requestId.current) return;
      setQuotes((current) => reset ? data.items : [...current, ...data.items]);
      setTotal(data.total);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error("Could not load quotes", error);
    } finally {
      if (currentRequest === requestId.current) setLoading(false);
    }
  }

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const timer = window.setTimeout(() => { void load(true); }, 260);
    return () => window.clearTimeout(timer);
  }, [query, category]);

  return <>
    <section className="hero" id="top" aria-labelledby="page-title">
      <p className="eyebrow">MAYALINES · FAMOUS &amp; INSPIRATIONAL QUOTES</p>
      <h1 id="page-title">Famous Quotes, Inspirational Words &amp; Timeless Wisdom</h1>
      <p className="hero-copy">Discover memorable words by author, topic and occasion. Copy a quote for your status, share it with someone, or stay awhile and find something unexpected.</p>
      <label className="search-box"><span className="sr-only">Search quotes, authors and topics</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search quotes, authors or topics …" autoComplete="off" /></label>
      <div className="hero-links"><a href="/random">✦ Surprise me</a><a href="/popular">Most liked</a><a href="/trending">Trending now</a><a href="/collections/short-inspirational-quotes">Short quotes</a><a href="/community">Community quotes</a></div>
    </section>

    <section className="library" id="main-content" aria-labelledby="library-title">
      <div className="section-heading" id="library-title">Quote library</div>
      <p className="library-meta" aria-live="polite">{total.toLocaleString("en-US")} quotes</p>
      <div className="category-rail" id="categories" aria-label="Quote categories">
        {categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} aria-pressed={category === item}>{item}</button>)}
      </div>
      <div className="quote-grid">
        {quotes.map((item) => <article className="quote-card" key={item.id}><div className="quote-mark" aria-hidden="true">“</div><p className="quote-text">{item.quote}</p><p className="quote-author">— {item.author}</p><p className="quote-category">{item.category}</p><div className="quote-actions"><PersistentLikeButton quoteId={item.id} author={item.author} /><QuoteActions quote={item.quote} author={item.author} quoteId={item.id} /></div></article>)}
      </div>
      {!loading && quotes.length === 0 && <p className="hero-copy" role="status">No matching quotes found. Try another author, topic or category.</p>}
      {hasMore && <div className="load-more-wrap"><button className="load-more-button" type="button" disabled={loading} onClick={() => void load(false)}>{loading ? "Loading …" : `Load ${PAGE_SIZE} more quotes`}</button></div>}
    </section>
  </>;
}
