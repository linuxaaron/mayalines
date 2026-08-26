"use client";

import { useMemo, useState } from "react";
import quotesData from "../../data/quotes";
import PersistentLikeButton from "../../components/PersistentLikeButton";

export default function RandomPage() {
  const [seed, setSeed] = useState(0);
  const quote = useMemo(() => {
    const index = Math.floor(Math.abs(Math.sin(seed + 1) * 100000) % quotesData.length);
    return quotesData[index];
  }, [seed]);
  return <main className="site-shell"><header className="header"><a className="brand" href="/"><span className="brand-name">MAYALINES</span></a><div className="header-rule"/><nav className="nav"><a href="/">Quotes</a><a href="/popular">Popular</a><a href="/trending">Trending</a><a href="/topics">Topics</a><a href="/random" aria-current="page">Random</a></nav></header><section className="quote-detail"><p className="eyebrow">MAYALINES · DISCOVER</p><h1 className="section-heading">Random Quote</h1><blockquote>“{quote.quote}”</blockquote><p className="quote-author">— {quote.author}</p><div className="quote-detail-actions"><PersistentLikeButton quoteId={quote.id} author={quote.author}/><button className="load-more-button" type="button" onClick={() => setSeed((value) => value + 1)}>NEW QUOTE</button></div><p className="source-note">Discover another quote whenever you want. All indexable quotes are selected from MAYALINES' sourced library.</p></section><footer className="footer">© 2026 Mayalines</footer></main>;
}
