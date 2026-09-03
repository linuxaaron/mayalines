"use client";

import QuoteActions from "./QuoteActions";
import type { Quote } from "../data/quotes";

type QuoteResult = Quote & { rank?: number };

type Props = {
  quotes: QuoteResult[];
  metricLabel?: string;
};

export default function QuoteResults({ quotes, metricLabel = "likes" }: Props) {
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
            <QuoteActions quote={item.quote} author={item.author} quoteId={item.id} />
          </div>
        </article>
      ))}
    </div>
  );
}
