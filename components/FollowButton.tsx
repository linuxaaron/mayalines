"use client";
import { useEffect, useState } from "react";
export default function FollowButton({ targetType, target }: { targetType: "author" | "topic"; target: string }) {
  const [following, setFollowing] = useState(false); const [ready, setReady] = useState(false);
  useEffect(() => { fetch("/api/follows", { cache: "no-store" }).then((r) => r.ok ? r.json() : null).then((data) => { setFollowing(Boolean(data?.follows?.some((item: { target_type: string; target: string }) => item.target_type === targetType && item.target === target))); setReady(true); }).catch(() => setReady(true)); }, [target, targetType]);
  async function toggle() { const action = following ? "unfollow" : "follow"; const response = await fetch("/api/follows", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, targetType, target }) }); if (response.ok) setFollowing(!following); }
  return <button className="copy-button" type="button" onClick={() => void toggle()} disabled={!ready}>{following ? "FOLLOWING" : "FOLLOW"}</button>;
}
