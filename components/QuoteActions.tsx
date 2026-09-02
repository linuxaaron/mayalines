"use client";

import { useEffect, useState } from "react";
import SaveQuoteButton from "./SaveQuoteButton";
import { useWhenVisible } from "./useWhenVisible";

type EngagementStats = {
  likes?: number;
  copies?: number;
  shares?: number;
  persistent?: boolean;
};

export default function QuoteActions({ quote, author, quoteId }: { quote: string; author: string; quoteId?: string }) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [copies, setCopies] = useState(0);
  const [shares, setShares] = useState(0);
  const { ref, visible } = useWhenVisible<HTMLDivElement>();

  const text = `“${quote}” — ${author}`;

  useEffect(() => {
    if (!quoteId || !visible) return;
    let cancelled = false;

    fetch(`/api/quotes/${encodeURIComponent(quoteId)}/stats`, {
      cache: "no-store",
      credentials: "same-origin",
    })
      .then((response) => (response.ok ? response.json() as Promise<EngagementStats> : null))
      .then((data) => {
        if (cancelled || !data || data.persistent === false) return;
        setCopies(Math.max(0, Number(data.copies) || 0));
        setShares(Math.max(0, Number(data.shares) || 0));
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [quoteId, visible]);

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
    const pageUrl = window.location.href;
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

  async function whatsapp() {
    await record("share", "whatsapp");
    const whatsappText = encodeURIComponent(`${text}\n\n${window.location.href}`);
    window.open(`https://wa.me/?text=${whatsappText}`, "_blank", "noopener,noreferrer");
  }

  return (
    <div ref={ref} className="quote-action-suite">
      <button className="copy-button" type="button" onClick={() => copy()}>{copied ? "COPIED" : "COPY"}</button>
      <button className="copy-button" type="button" onClick={() => copy(`${text}\n\n${window.location.href}`)}>COPY WITH LINK</button>
      <button className="copy-button" type="button" onClick={whatsapp}>WHATSAPP</button>
      <button className="copy-button" type="button" onClick={share}>{shared ? "SHARED" : "SHARE"}</button>
      {quoteId && <SaveQuoteButton quoteId={quoteId} />}
      {quoteId && <span className="engagement-counts" aria-label="Quote engagement">
        {copies.toLocaleString("en-US")} Copies · {shares.toLocaleString("en-US")} Shares
      </span>}
    </div>
  );
}
