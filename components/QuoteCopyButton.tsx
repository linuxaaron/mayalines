"use client";

import { useState } from "react";

type Props = {
  quote: string;
  author: string;
};

export default function QuoteCopyButton({ quote, author }: Props) {
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

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Quote copied" : "Copy quote"}
      style={{
        border: 0,
        background: "transparent",
        color: "#765843",
        cursor: "pointer",
        font: "750 10px Inter,system-ui,sans-serif",
        letterSpacing: ".08em",
        textTransform: "uppercase",
      }}
    >
      {copied ? "Copied" : "Copy quote"}
    </button>
  );
}
