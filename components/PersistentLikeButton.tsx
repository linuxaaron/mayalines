"use client";

import { useEffect, useState } from "react";

export default function PersistentLikeButton({ quoteId, author }: { quoteId: string; author: string }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    fetch(`/api/quotes/${encodeURIComponent(quoteId)}/like`, { cache: "no-store" })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => data && setLikes(Math.max(0, Number(data.likes) || 0)))
      .catch(() => undefined);
  }, [quoteId]);

  async function toggleLike() {
    if (pending) return;
    const nextLiked = !liked;
    setLiked(nextLiked);
    setPending(true);
    try {
      const response = await fetch(`/api/quotes/${encodeURIComponent(quoteId)}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: nextLiked ? "like" : "unlike" }),
      });
      if (!response.ok) throw new Error("Bewertung fehlgeschlagen");
      const data = await response.json();
      setLikes(Math.max(0, Number(data.likes) || 0));
    } catch {
      setLiked(!nextLiked);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="like-control">
      <button className={`like-button${liked ? " is-liked" : ""}`} type="button" onClick={toggleLike} disabled={pending} aria-pressed={liked} aria-label={liked ? `Gefällt mir nicht mehr für das Zitat von ${author}` : `Zitat von ${author} gefällt mir`}>
        <span className="heart-icon" aria-hidden="true">♥</span>
        <span className="sr-only">{liked ? "Gefällt mir" : "Gefällt mir nicht"}</span>
      </button>
      <span className="like-count" aria-live="polite">{likes.toLocaleString("de-DE")}</span>
    </div>
  );
}
