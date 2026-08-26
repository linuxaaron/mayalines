"use client";
import { useEffect, useState } from "react";
export default function PersistentLikeButton({ quoteId, author }: { quoteId: string; author: string }) {
  const [liked, setLiked] = useState(false); const [likes, setLikes] = useState(0); const [pending, setPending] = useState(false);
  useEffect(() => { fetch(`/api/quotes/${encodeURIComponent(quoteId)}/like`, { cache: "no-store" }).then((r) => r.ok ? r.json() : null).then((data) => data && setLikes(Math.max(0, Number(data.likes) || 0))).catch(() => undefined); }, [quoteId]);
  async function toggleLike() { if (pending) return; const nextLiked = !liked; setLiked(nextLiked); setPending(true); try { const response = await fetch(`/api/quotes/${encodeURIComponent(quoteId)}/like`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: nextLiked ? "like" : "unlike" }) }); if (!response.ok) throw new Error("Like request failed"); const data = await response.json(); setLikes(Math.max(0, Number(data.likes) || 0)); } catch { setLiked(!nextLiked); } finally { setPending(false); } }
  return <div className="like-control"><button className={`like-button${liked ? " is-liked" : ""}`} type="button" onClick={toggleLike} disabled={pending} aria-pressed={liked} aria-label={liked ? `Remove like from the quote by ${author}` : `Like the quote by ${author}`}><span className="heart-icon" aria-hidden="true">♥</span><span className="sr-only">{liked ? "Liked" : "Like"}</span></button><span className="like-count" aria-live="polite">{likes.toLocaleString("en-US")}</span></div>;
}
