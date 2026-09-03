"use client";

import { useState } from "react";
import QuoteActions from "./QuoteActions";

export type RandomQuote = {
  id: string;
  quote: string;
  author: string;
};

export default function RandomQuoteCard({ initialQuote }: { initialQuote: RandomQuote }) {
  const [quote, setQuote] = useState(initialQuote);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadQuote() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/quotes/random", { cache: "no-store", headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error(`Random quote API returned ${response.status}`);
      const data = await response.json() as { quote?: RandomQuote };
      if (!data.quote) throw new Error("Random quote API returned no quote");
      setQuote(data.quote);
    } catch {
      setError("Another quote could not be loaded. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="quote-detail" aria-labelledby="random-quote-heading">
      <p className="eyebrow">MAYALINES · DISCOVER</p>
      <h1 className="section-heading" id="random-quote-heading">Random Quote</h1>
      <blockquote>“{quote.quote}”</blockquote>
      <p className="quote-author">— {quote.author}</p>
      <div className="quote-detail-actions">
        <QuoteActions quote={quote.quote} author={quote.author} quoteId={quote.id} />
        <button className="load-more-button" type="button" disabled={loading} onClick={() => void loadQuote()}>
          {loading ? "LOADING…" : "NEW QUOTE"}
        </button>
      </div>
      {error && <p className="source-note" role="alert">{error}</p>}
      <p className="source-note">Discover another quote whenever you want. All displayed quotes come from MAYALINES&apos; verified public library.</p>
    </section>
  );
}
