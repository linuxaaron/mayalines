"use client";

import { useEffect, useState } from "react";

type TotalLikesResponse = { likes?: number | null; persistent?: boolean };

export default function TotalLikes() {
  const [likes, setLikes] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const refresh = () => {
      fetch("/api/likes/total", { cache: "no-store", credentials: "same-origin" })
        .then((response) => (response.ok ? response.json() as Promise<TotalLikesResponse> : null))
        .then((data) => {
          if (!cancelled && data?.persistent && typeof data.likes === "number") {
            setLikes(Math.max(0, data.likes));
          }
        })
        .catch(() => undefined);
    };

    refresh();
    window.addEventListener("mayalines:like-added", refresh);

    return () => {
      cancelled = true;
      window.removeEventListener("mayalines:like-added", refresh);
    };
  }, []);

  return (
    <div className="total-likes" aria-label="Total likes on Mayalines">
      <span className="total-likes-heart" aria-hidden="true">♥</span>
      <span><strong>{likes === null ? "…" : likes.toLocaleString("en-US")}</strong> total likes</span>
    </div>
  );
}
