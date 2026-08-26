"use client";

import { useEffect, useState } from "react";
import PersistentLikeButton from "./PersistentLikeButton";

type Quote = { id: string; quote: string; author: string; category: string; likes?: number };

function MiniQuote({ item }: { item: Quote }) {
  return <article className="mini-quote"><p className="mini-quote-text">“{item.quote}”</p><p className="quote-author">— {item.author}</p><div className="mini-quote-actions"><PersistentLikeButton quoteId={item.id} author={item.author}/>{typeof item.likes === "number" && item.likes > 0 && <span>{item.likes.toLocaleString("en-US")} likes</span>}<a href={`/authors/${item.author.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`}>Author →</a></div></article>;
}

export default function CommunitySections() {
  const [popular, setPopular] = useState<Quote[]>([]);
  const [trending, setTrending] = useState<Quote[]>([]);
  useEffect(() => {
    Promise.all([fetch("/api/quotes/popular", { cache: "no-store" }).then((r) => r.ok ? r.json() : null), fetch("/api/quotes/trending", { cache: "no-store" }).then((r) => r.ok ? r.json() : null)]).then(([p, t]) => { setPopular(p?.quotes ?? []); setTrending(t?.quotes ?? []); }).catch(() => undefined);
  }, []);
  if (!popular.length && !trending.length) return null;
  return <section className="community-sections" aria-label="Community quote rankings">
    {popular.length > 0 && <div className="community-block"><div className="community-heading"><div><p className="eyebrow">COMMUNITY RANKING</p><h2>Popular Quotes</h2></div><a href="/popular">View all →</a></div><div className="mini-quote-grid">{popular.slice(0, 6).map((item) => <MiniQuote item={item} key={item.id}/>)}</div></div>}
    {trending.length > 0 && <div className="community-block"><div className="community-heading"><div><p className="eyebrow">RECENTLY LIKED</p><h2>Trending Quotes</h2></div><a href="/trending">View all →</a></div><div className="mini-quote-grid">{trending.slice(0, 6).map((item) => <MiniQuote item={item} key={item.id}/>)}</div></div>}
  </section>;
}
