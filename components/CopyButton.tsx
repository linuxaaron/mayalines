"use client";

import { useState } from "react";

export default function CopyButton({ quote, author }: { quote: string; author: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(`“${quote}” — ${author}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return <button className="copy-button" type="button" onClick={handleCopy}>{copied ? "COPIED" : "COPY QUOTE"}</button>;
}
