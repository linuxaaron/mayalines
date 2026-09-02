"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="status-page">
      <p className="status-page__eyebrow">TEMPORARY ERROR</p>
      <h1>Something interrupted the page.</h1>
      <p>Please try once more. If the problem continues, the rest of Mayalines remains available from the homepage.</p>
      <button className="status-page__link" onClick={reset} type="button">
        Try again
      </button>
    </main>
  );
}
