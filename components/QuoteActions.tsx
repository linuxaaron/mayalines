"use client";

import { useState } from "react";

export default function QuoteActions({ quote, author, quoteId }: { quote: string; author: string; quoteId?: string }) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [copies, setCopies] = useState(0);
  const [shares, setShares] = useState(0);

  const text = `“${quote}” — ${author}`;
  const pageUrl = typeof window === "undefined" ? "https://mayalines.com" : window.location.href;
  const record = async (kind: "copy" | "share", channel = "native") => {
    if (!quoteId) return;
    try {
      const response = await fetch(`/api/quotes/${encodeURIComponent(quoteId)}/${kind}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: kind === "share" ? JSON.stringify({ channel }) : "{}",
        cache: "no-store",
      });
      if (!response.ok) return;
      const data = await response.json();
      if (kind === "copy" && data.persistent) setCopies(Number(data.copies) || 0);
      if (kind === "share" && data.persistent) setShares(Number(data.shares) || 0);
    } catch { /* Analytics must never break copying or sharing. */ }
  };

  async function copy(textToCopy = text) {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      await record("copy");
      window.setTimeout(() => setCopied(false), 1600);
    } catch { setCopied(false); }
  }

  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({ title: `${author} quote`, text, url: pageUrl });
        setShared(true);
        await record("share", "native");
        window.setTimeout(() => setShared(false), 1600);
        return;
      }
      await navigator.clipboard.writeText(`${text}\n\n${pageUrl}`);
      setShared(true);
      await record("share", "clipboard");
      window.setTimeout(() => setShared(false), 1600);
    } catch { setShared(false); }
  }

  const whatsappText = encodeURIComponent(`${text}\n\n${pageUrl}`);

  async function whatsapp() {
    await record("share", "whatsapp");
    window.open(`https://wa.me/?text=${whatsappText}`, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="quote-action-suite">
      <button className="copy-button" type="button" onClick={() => copy()}>{copied ? "COPIED" : "COPY"}</button>
      <button className="copy-button" type="button" onClick={() => copy(`${text}\n\n${pageUrl}`)}>COPY WITH LINK</button>
      <button className="copy-button" type="button" onClick={whatsapp}>WHATSAPP</button>
      <button className="copy-button" type="button" onClick={share}>{shared ? "SHARED" : "SHARE"}</button>
      {quoteId && (copies > 0 || shares > 0) && <span className="engagement-counts" aria-label="Quote engagement">{copies > 0 ? `${copies.toLocaleString("en-US")} copies` : ""}{copies > 0 && shares > 0 ? " · " : ""}{shares > 0 ? `${shares.toLocaleString("en-US")} shares` : ""}</span>}
    </div>
  );
}
