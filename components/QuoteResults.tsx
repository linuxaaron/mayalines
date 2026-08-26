"use client";

import { useState } from "react";
import PersistentLikeButton from "./PersistentLikeButton";
import type { Quote } from "../data/quotes";

type QuoteResult = Quote & { likes?: number; rank?: number };

export default function QuoteResults({ quotes }: { quotes: QuoteResult[] }) {
  const [copied, setCopied] = useState<string | null>(null);

  async function copyQuote(quote: string, author: string) {
    try {
      await navigator.clipboard.writeText(`“${quote}” — ${author}`);
      setCopied(quote);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      setCopied(null);
    }
  }

  return (
    <div className="quote-grid">
      {quotes.map((item) => (
        <article className="quote-card" key={item.id}>
          {typeof item.rank === "number" && <div className="quote-rank" aria-label={`Rank ${item.rank}`}>#{item.rank}</div>}
          <div className="quote-mark" aria-hidden="true">“</div>
          <p className="quote-text">{item.quote}</p>
          <p className="quote-author">— {item.author}</p>
          <p className="quote-category">{item.category}</p>
          <div className="quote-actions">
            <PersistentLikeButton quoteId={item.id} author={item.author} />
            {typeof item.likes === "number" && item.likes > 0 && <span className="rank-like-count">{item.likes.toLocaleString("en-US")} likes</span>}
            <button className="copy-button" type="button" onClick={() => copyQuote(item.quote, item.author)} aria-label={`Copy quote by ${item.author}`}>
              {copied === item.quote ? "COPIED" : "COPY"}
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
