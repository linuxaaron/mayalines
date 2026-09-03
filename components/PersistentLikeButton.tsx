"use client";

import { useEffect, useState } from "react";
import { useWhenVisible } from "./useWhenVisible";

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
  const { ref, visible } = useWhenVisible<HTMLDivElement>();

  useEffect(() => {
    if (!visible) return;
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
        setPersistent(data.persistent !== false);
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) {
          setPersistent(false);
          setReady(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [quoteId, visible]);

  async function toggleLike() {
    if (pending || !ready || !persistent) return;

    const nextLiked = true;
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
      if (!previousLiked && data.liked) {
        window.dispatchEvent(new Event("mayalines:like-added"));
      }
    } catch {
      setLiked(previousLiked);
      setLikes(previousLikes);
    } finally {
      setPending(false);
    }
  }

  const disabled = pending || !ready || !persistent || liked;
  const label = !persistent
    ? "Like storage is currently unavailable"
    : liked
      ? `Quote by ${author} already liked`
      : `Like the quote by ${author}`;

  return (
    <div ref={ref} className="like-control" data-persistent={persistent ? "true" : "false"}>
      <button
        className={`like-button${liked ? " is-liked" : ""}`}
        type="button"
        onClick={toggleLike}
        disabled={disabled}
        aria-pressed={liked}
        aria-label={label}
        title={!ready ? "Loading likes" : !persistent ? "Like storage unavailable" : liked ? "Already liked" : "Like this quote"}
      >
        <span className="heart-icon" aria-hidden="true">♥</span>
        <span className="sr-only">{liked ? "Liked" : "Like"}</span>
      </button>
      <span className="like-count" aria-live="polite">{likes.toLocaleString("en-US")}</span>
    </div>
  );
}
