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
  const [persistent, setPersistent] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    fetch(`/api/quotes/${encodeURIComponent(quoteId)}/like`, {
      cache: "no-store",
      credentials: "same-origin",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Like status request failed");
        return response.json() as Promise<LikeResponse>;
      })
      .then((data) => {
        if (cancelled) return;
        setLikes(Math.max(0, Number(data.likes) || 0));
        setLiked(Boolean(data.liked));
        setPersistent(data.persistent !== false);
        setReady(true);
      })
      .catch((error: unknown) => {
        if (cancelled || (error instanceof DOMException && error.name === "AbortError")) return;

        // A failed read must not permanently disable the heart. The POST endpoint
        // is still authoritative and can recover from transient GET failures.
        setReady(true);
        setPersistent(true);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [quoteId]);

  async function toggleLike() {
    if (pending || !ready || !persistent) return;

    const nextLiked = !liked;
    const previousLiked = liked;
    const previousLikes = likes;

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
      if (data.persistent === false) throw new Error("Persistent like storage unavailable");
      setLikes(Math.max(0, Number(data.likes) || 0));
      setLiked(Boolean(data.liked));
    } catch {
      setLiked(previousLiked);
      setLikes(previousLikes);
    } finally {
      setPending(false);
    }
  }

  const disabled = pending || !ready || !persistent;
  const label = !persistent
    ? "Like storage is currently unavailable"
    : liked
      ? `Remove like from the quote by ${author}`
      : `Like the quote by ${author}`;

  return (
    <div className="like-control" data-persistent={persistent ? "true" : "false"}>
      <button
        className={`like-button${liked ? " is-liked" : ""}`}
        type="button"
        onClick={toggleLike}
        disabled={disabled}
        aria-pressed={liked}
        aria-label={label}
        title={!ready ? "Loading likes" : !persistent ? "Like storage unavailable" : liked ? "Unlike" : "Like this quote"}
      >
        <span className="heart-icon" aria-hidden="true">♥</span>
        <span className="sr-only">{liked ? "Liked" : "Like"}</span>
      </button>
      <span className="like-count" aria-live="polite">{likes.toLocaleString("en-US")}</span>
    </div>
  );
}
