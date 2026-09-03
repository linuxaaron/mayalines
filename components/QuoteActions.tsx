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

  async function copyForSocial(channel: "whatsapp" | "instagram" | "tiktok" | "snapchat") {
    const pageUrl = window.location.href;
    const target = channel === "whatsapp"
      ? `https://wa.me/?text=${encodeURIComponent(`${text}\n\n${pageUrl}`)}`
      : channel === "instagram"
        ? "https://www.instagram.com/"
        : channel === "tiktok"
          ? "https://www.tiktok.com/"
          : "https://www.snapchat.com/";

    // Open synchronously to avoid popup blockers, then copy so the quote is
    // ready to paste on platforms without a prefilled-share URL.
    const shareWindow = window.open(target, "_blank", "noopener,noreferrer");

    // The other platforms do not expose a browser API for pre-filling a post.
    // Copy first so the quote is ready to paste when the platform opens.
    try {
      await navigator.clipboard.writeText(`${text}\n\n${pageUrl}`);
      setShared(true);
      await record("share", channel);
      window.setTimeout(() => setShared(false), 1600);
    } catch {
      setShared(false);
    }

    if (!shareWindow) window.location.href = target;
  }

  function SocialIcon({ name }: { name: "whatsapp" | "instagram" | "tiktok" | "snapchat" }) {
    if (name === "whatsapp") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 3.5A11.2 11.2 0 0 0 12.1 0C5.9 0 .8 5 .8 11.2c0 2 .5 4 1.5 5.7L.7 24l7.3-1.9a11.2 11.2 0 0 0 4.1.8h.1c6.1 0 11.1-5 11.1-11.2 0-3-1-6-2.8-8.2ZM12.1 21c-1.3 0-2.6-.3-3.8-.8l-.3-.2-4.3 1.1 1.1-4.2-.2-.3a9.7 9.7 0 0 1-1.5-5.2c0-5.3 4.3-9.6 9.7-9.6 2.6 0 5 1 6.8 2.8a9.6 9.6 0 0 1 2.8 6.8c0 5.3-4.3 9.6-9.6 9.6Zm5.3-7.2c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.2-.2.3-.8.9-1 .9-.2.2-.4.2-.7.1-1.9-.9-3.1-1.6-4.3-3.6-.3-.5.3-.5.8-1.6.1-.2.1-.4 0-.6l-.9-2.1c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.8.4-.3.3-1.1 1.1-1.1 2.6s1.1 3 1.2 3.2c.1.2 2.2 3.4 5.4 4.8 2 .9 2.7 1 3.7.8.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.1-1.4 0-.2-.2-.3-.5-.4Z" /></svg>;
    if (name === "instagram") return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.5" cy="6.7" r="1" className="social-icon-cutout" /></svg>;
    if (name === "tiktok") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 3h3.1c.2 1.7 1.1 3 2.4 3.8v3.1c-1.5-.1-2.9-.7-4-1.6v7.1c0 3.3-2.7 5.6-6 5.6-3.2 0-5.5-2.1-5.5-5.1 0-3.4 2.9-5.5 6.7-5.4v3.2c-1.8-.2-3.4.5-3.4 2 0 1.1.9 2 2.2 2 1.5 0 2.3-1 2.3-2.6V3h2.2Z" /></svg>;
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5c-5 0-8.6 2.8-8.6 7.1 0 2.2 1.2 4.1 3.2 5.3-.2.9-.6 2.1-1.2 3.1-.1.2.1.4.3.3 1.3-.3 2.6-.9 3.5-1.5 1 .3 1.9.5 2.8.5 5 0 8.6-2.8 8.6-7.1S17 2.5 12 2.5Z" /></svg>;
  }

  return (
    <div ref={ref} className="quote-action-suite">
      <button className="copy-button" type="button" onClick={() => copy()}>{copied ? "COPIED" : "COPY"}</button>
      <button className="copy-button" type="button" onClick={() => copy(`${text}\n\n${window.location.href}`)}>COPY WITH LINK</button>
      <div className="social-share-buttons" aria-label="Share quote on social media">
        {(["whatsapp", "instagram", "tiktok", "snapchat"] as const).map((channel) => (
          <button className={`social-share-button social-share-${channel}`} type="button" key={channel} onClick={() => void copyForSocial(channel)} aria-label={`Copy quote and open ${channel}`} title={`Copy quote and open ${channel}`}>
            <SocialIcon name={channel} />
          </button>
        ))}
      </div>
      <button className="copy-button" type="button" onClick={share}>{shared ? "SHARED" : "SHARE"}</button>
      {quoteId && <SaveQuoteButton quoteId={quoteId} />}
      {quoteId && <span className="engagement-counts" aria-label="Quote engagement">
        {copies.toLocaleString("en-US")} Copies · {shares.toLocaleString("en-US")} Shares
      </span>}
    </div>
  );
}
