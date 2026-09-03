"use client";

import { useEffect, useState } from "react";
import { useWhenVisible } from "./useWhenVisible";

type RatingResponse = { average?: number; count?: number; value?: number | null; persistent?: boolean };

export default function QuoteRating({ quoteId }: { quoteId: string }) {
  const [open, setOpen] = useState(false);
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);
  const [value, setValue] = useState<number | null>(null);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const { ref, visible } = useWhenVisible<HTMLDivElement>();

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    fetch(`/api/quotes/${encodeURIComponent(quoteId)}/rating`, { cache: "no-store", credentials: "same-origin" })
      .then((response) => (response.ok ? response.json() as Promise<RatingResponse> : null))
      .then((data) => {
        if (cancelled || !data?.persistent) return;
        setAverage(Number(data.average) || 0);
        setCount(Number(data.count) || 0);
        setValue(typeof data.value === "number" ? data.value : null);
      })
      .catch(() => undefined);
    return () => { cancelled = true; };
  }, [quoteId, visible]);

  async function rate(nextValue: number) {
    if (pending) return;
    setPending(true);
    setMessage("");
    try {
      const response = await fetch(`/api/quotes/${encodeURIComponent(quoteId)}/rating`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        cache: "no-store",
        body: JSON.stringify({ value: nextValue }),
      });
      if (!response.ok) throw new Error("Rating failed");
      const data = await response.json() as RatingResponse;
      setAverage(Number(data.average) || 0);
      setCount(Number(data.count) || 0);
      setValue(nextValue);
      setMessage("Gespeichert");
    } catch {
      setMessage("Bewertung momentan nicht verfügbar");
    } finally {
      setPending(false);
    }
  }

  return (
    <div ref={ref} className="quote-rating">
      <button className="rating-link" type="button" onClick={() => setOpen((current) => !current)} aria-expanded={open}>
        {value ? `★ ${value}/5` : "BEWERTEN"}
      </button>
      {count > 0 && <span className="rating-summary" aria-label={`${average.toFixed(1)} von 5 Sternen aus ${count} Bewertungen`}>{average.toFixed(1)}/5 · {count}</span>}
      {open && <div className="rating-panel" role="group" aria-label="Zitat bewerten">
        <span className="rating-panel-label">Wie gut findest du dieses Zitat?</span>
        <div className="rating-stars">
          {[1, 2, 3, 4, 5].map((star) => <button key={star} type="button" className={value !== null && star <= value ? "is-selected" : ""} onClick={() => void rate(star)} disabled={pending} aria-label={`${star} von 5 Sternen`}>★</button>)}
        </div>
        {message && <span className="rating-message" role="status">{message}</span>}
      </div>}
    </div>
  );
}
