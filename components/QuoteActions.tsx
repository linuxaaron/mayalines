"use client";

import { useState } from "react";

export default function QuoteActions({ quote, author }: { quote: string; author: string }) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const text = `“${quote}” — ${author}`;
  const pageUrl = typeof window === "undefined" ? "https://mayalines.com" : window.location.href;

  async function copy(textToCopy = text) {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({ title: `${author} quote`, text, url: pageUrl });
        setShared(true);
        window.setTimeout(() => setShared(false), 1600);
        return;
      }
      await navigator.clipboard.writeText(`${text}\n\n${pageUrl}`);
      setShared(true);
      window.setTimeout(() => setShared(false), 1600);
    } catch {
      setShared(false);
    }
  }

  const whatsappText = encodeURIComponent(`${text}\n\n${pageUrl}`);

  return (
    <div className="quote-action-suite">
      <button className="copy-button" type="button" onClick={() => copy()}>{copied ? "COPIED" : "COPY"}</button>
      <button className="copy-button" type="button" onClick={() => copy(`${text}\n\n${pageUrl}`)}>COPY WITH LINK</button>
      <a className="copy-button" href={`https://wa.me/?text=${whatsappText}`} target="_blank" rel="noopener noreferrer">WHATSAPP</a>
      <button className="copy-button" type="button" onClick={share}>{shared ? "SHARED" : "SHARE"}</button>
    </div>
  );
}
