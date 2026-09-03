"use client";

import { useEffect, useState } from "react";

type RatingResponse = { average?: number; count?: number; value?: number | null; persistent?: boolean };

export default function SiteRating() {
  const [open, setOpen] = useState(false);
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);
  const [value, setValue] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = () => fetch("/api/site-rating", { cache: "no-store", credentials: "same-origin" })
      .then((response) => response.ok ? response.json() as Promise<RatingResponse> : null)
      .then((data) => {
        if (!cancelled && data?.persistent) {
          setAverage(Number(data.average) || 0);
          setCount(Number(data.count) || 0);
          setValue(typeof data.value === "number" ? data.value : null);
        }
      }).catch(() => undefined);
    load();
    window.addEventListener("mayalines:site-rating-updated", load);
    return () => { cancelled = true; window.removeEventListener("mayalines:site-rating-updated", load); };
  }, []);

  async function rate(nextValue: number) {
    if (pending) return;
    setPending(true);
    setMessage("");
    try {
      const response = await fetch("/api/site-rating", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin", cache: "no-store", body: JSON.stringify({ value: nextValue }) });
      if (!response.ok) throw new Error("Rating failed");
      const data = await response.json() as RatingResponse;
      setAverage(Number(data.average) || 0);
      setCount(Number(data.count) || 0);
      setValue(nextValue);
      setMessage("Gespeichert");
      window.dispatchEvent(new Event("mayalines:site-rating-updated"));
    } catch {
      setMessage("Bewertung momentan nicht verfügbar");
    } finally { setPending(false); }
  }

  return <div className="site-rating"><button className="site-rating-link" type="button" onClick={() => setOpen((current) => !current)} aria-expanded={open}>Webseite bewerten</button>{count > 0 && <span className="site-rating-summary" aria-label={`${average.toFixed(1)} von 5 Sternen aus ${count} Bewertungen`}>★ {average.toFixed(1)}/5 · {count}</span>}{open && <div className="site-rating-panel" role="group" aria-label="Mayalines bewerten"><span>Wie findest du Mayalines?</span><div className="site-rating-stars">{[1, 2, 3, 4, 5].map((star) => <button key={star} type="button" className={value !== null && star <= value ? "is-selected" : ""} onClick={() => void rate(star)} disabled={pending} aria-label={`${star} von 5 Sternen`}>★</button>)}</div>{message && <small role="status">{message}</small>}</div>}</div>;
}
