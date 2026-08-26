"use client";

import { useEffect, useState } from "react";

type LikeResponse = {
  likes?: number;
  liked?: boolean;
  persistent?: boolean;
};

export default function PersistentLikeButton({ quoteId, author }: { quoteId: string; author: string }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [pending, setPending] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/quotes/${encodeURIComponent(quoteId)}/like`, {
      cache: "no-store",
      credentials: "same-origin",
    })
      .then((response) => (response.ok ? response.json() as Promise<LikeResponse> : null))
      .then((data) => {
        if (cancelled || !data) return;
        setLikes(Math.max(0, Number(data.likes) || 0));
        setLiked(Boolean(data.liked));
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [quoteId]);

  async function toggleLike() {
    if (pending || !ready) return;

    const nextLiked = !liked;
    const previousLiked = liked;
    const previousLikes = likes;

    // Optimistic UI: the heart and counter respond immediately.
    setLiked(nextLiked);
    setLikes(Math.max(0, previousLikes + (nextLiked ? 1 : -1)));
    setPending(true);

    try {
      const response = await fetch(`/api/quotes/${encodeURIComponent(quoteId)}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ action: nextLiked ? "like" : "unlike" }),
      });

      if (!response.ok) throw new Error("Like request failed");

      const data = await response.json() as LikeResponse;
      setLikes(Math.max(0, Number(data.likes) || 0));
      setLiked(Boolean(data.liked));
    } catch {
      setLiked(previousLiked);
      setLikes(previousLikes);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="like-control">
      <button
        className={`like-button${liked ? " is-liked" : ""}`}
        type="button"
        onClick={toggleLike}
        disabled={pending || !ready}
        aria-pressed={liked}
        aria-label={liked ? `Remove like from the quote by ${author}` : `Like the quote by ${author}`}
        title={liked ? "Unlike" : "Like this quote"}
      >
        <span className="heart-icon" aria-hidden="true">♥</span>
        <span className="sr-only">{liked ? "Liked" : "Like"}</span>
      </button>
      <span className="like-count" aria-live="polite">{likes.toLocaleString("en-US")}</span>
    </div>
  );
}
