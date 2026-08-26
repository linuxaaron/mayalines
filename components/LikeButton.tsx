"use client";

import { useEffect, useState } from "react";

const LIKES_STORAGE_KEY = "mayalines-liked-quotes";

type LikeMap = Record<string, boolean>;

export default function LikeButton({ quoteId, author }: { quoteId: string; author: string }) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(LIKES_STORAGE_KEY);
      if (stored) setLiked(Boolean((JSON.parse(stored) as LikeMap)[quoteId]));
    } catch {
      setLiked(false);
    }
  }, [quoteId]);

  function toggleLike() {
    setLiked((current) => {
      const nextLiked = !current;
      try {
        const stored = window.localStorage.getItem(LIKES_STORAGE_KEY);
        const likes = stored ? (JSON.parse(stored) as LikeMap) : {};
        likes[quoteId] = nextLiked;
        window.localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(likes));
      } catch {
        // Keep the current interaction working even when storage is unavailable.
      }
      return nextLiked;
    });
  }

  return (
    <button
      className={`like-button${liked ? " is-liked" : ""}`}
      type="button"
      onClick={toggleLike}
      aria-pressed={liked}
      aria-label={liked ? `Unlike quote by ${author}` : `Like quote by ${author}`}
      title={liked ? "Unlike" : "Like this quote"}
    >
      <span className="heart-icon" aria-hidden="true">♥</span>
      <span className="sr-only">{liked ? "Liked" : "Like"}</span>
    </button>
  );
}
