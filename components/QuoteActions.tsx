"use client";

import { useState } from "react";
import QuoteRating from "./QuoteRating";

export default function QuoteActions({ quote, author, quoteId }: { quote: string; author: string; quoteId?: string }) {
  const [copied, setCopied] = useState(false);
  const text = `“${quote}” — ${author}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="quote-action-suite">
      <button className="copy-button" type="button" onClick={() => void copy()}>{copied ? "COPIED" : "COPY"}</button>
      {quoteId && <QuoteRating quoteId={quoteId} />}
    </div>
  );
}
