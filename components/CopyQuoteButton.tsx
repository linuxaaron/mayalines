"use client";

import { useState } from "react";

type Props = { quote: string; author: string };

export default function CopyQuoteButton({ quote, author }: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(`“${quote}” — ${author}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }

  return <button className="copy-button" type="button" onClick={copy} aria-label={`Copy quote by ${author}`}>{copied ? "COPIED" : "COPY"}</button>;
}
