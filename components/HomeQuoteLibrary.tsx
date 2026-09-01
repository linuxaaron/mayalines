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
const TOAST_DURATION = 1450;

export default function HomeQuoteLibrary({ initialQuotes, initialTotal, categories }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [quotes, setQuotes] = useState(initialQuotes);
  const [total, setTotal] = useState(initialTotal);
  const [hasMore, setHasMore] = useState(initialQuotes.length < initialTotal);
  const [loading, setLoading] = useState(false);
  const [resultToast, setResultToast] = useState<number | null>(null);
  const requestId = useRef(0);
  const firstRun = useRef(true);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showResultToast(count: number) {
    setResultToast(count);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => {
      setResultToast(null);
      toastTimer.current = null;
    }, TOAST_DURATION);
  }

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
      if (reset) showResultToast(data.total);
    } catch (error) {
      console.error("Could not load quotes", error);
    } finally {
      if (currentRequest === requestId.current) setLoading(false);
    }
  }

  useEffect(() => () => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
  }, []);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const timer = window.setTimeout(() => { void load(true); }, 260);
    return () => window.clearTimeout(timer);
  }, [query, category]);

  return <>
    <style>{`
      .quote-count-toast{position:fixed;z-index:500;left:50%;top:50%;transform:translate(-50%,-50%);min-width:150px;padding:15px 22px;border-radius:10px;background:#090909;color:#fff;text-align:center;font-size:18px;font-weight:800;letter-spacing:.01em;box-shadow:0 18px 52px rgba(0,0,0,.28);pointer-events:none;animation:quote-count-toast ${TOAST_DURATION}ms ease both}
      @keyframes quote-count-toast{0%{opacity:0;transform:translate(-50%,-44%) scale(.96)}12%,76%{opacity:.96;transform:translate(-50%,-50%) scale(1)}100%{opacity:0;transform:translate(-50%,-56%) scale(.98)}}
      @media(max-width:560px){.quote-count-toast{min-width:128px;padding:13px 18px;font-size:16px}}
      @media(prefers-reduced-motion:reduce){.quote-count-toast{animation:none}}
    `}</style>

    {resultToast !== null && <div className="quote-count-toast" role="status" aria-live="polite">{resultToast.toLocaleString("en-US")} quotes</div>}

    <section className="hero" id="top" aria-labelledby="page-title">
      <p className="eyebrow">MAYALINES · FAMOUS &amp; INSPIRATIONAL QUOTES</p>
      <h1 id="page-title">Famous Quotes, Inspirational Words &amp; Timeless Wisdom</h1>
      <p className="hero-copy">Discover memorable words by author, topic and occasion. Copy a quote for your status, share it with someone, or stay awhile and find something unexpected.</p>
      <label className="search-box"><span className="sr-only">Search quotes, authors and topics</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search quotes, authors or topics …" autoComplete="off" /></label>
      <div className="hero-links"><a href="/random">✦ Surprise me</a><a href="/popular">Most liked</a><a href="/trending">Trending now</a><a href="/collections/short-inspirational-quotes">Short quotes</a><a href="/community">Community quotes</a></div>
    </section>

    <section className="library" id="main-content" aria-labelledby="library-title">
      <div className="section-heading" id="library-title">Quote library</div>
      <p className="sr-only" aria-live="polite">{total.toLocaleString("en-US")} quotes</p>
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
