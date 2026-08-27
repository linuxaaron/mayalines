"use client";

import { FormEvent, useState } from "react";

export default function SubmitQuotePage() {
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const response = await fetch("/api/quote-submissions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error("Submission failed");
      setSubmitted(true);
      event.currentTarget.reset();
    } catch {
      window.alert("The submission could not be sent. Please try again later.");
    } finally {
      setBusy(false);
    }
  }

  return <main className="site-shell"><header className="header"><a className="brand" href="/"><span className="brand-name">MAYALINES</span></a><div className="header-rule"/><nav className="nav"><a href="/">Quotes</a><a href="/poems">Poems</a><a href="/authors">Authors</a></nav></header><section className="submit-page"><p className="eyebrow">MAYALINES · COMMUNITY</p><h1>Share a quote worth keeping.</h1><p className="hero-copy">Know a quotation that belongs in the library? Send it to the editors. Every submission is reviewed before publication.</p>{submitted && <div className="submit-success" role="status"><strong>Thank you.</strong> Your submission has been received for review.</div>}<form className="submit-form" onSubmit={submit}><label>Quote<textarea name="quote" required maxLength={2000} placeholder="Enter the exact quotation…"/></label><label>Author<input name="author" required maxLength={160} placeholder="Who said it?"/></label><label>Source or publication<input name="source" maxLength={300} placeholder="Book, speech, interview, publication…"/></label><label>Category<select name="category" defaultValue=""><option value="" disabled>Select a category</option><option>Love</option><option>Life</option><option>Wisdom</option><option>Success</option><option>Motivation</option><option>Courage</option><option>Happiness</option><option>Friendship</option><option>Hope</option><option>Inspiration</option><option>Philosophy</option><option>Other</option></select></label><label>Your name <span>(optional)</span><input name="submitter" maxLength={120} placeholder="How should we credit you?"/></label><button className="submit-button" type="submit" disabled={busy}>{busy ? "SENDING…" : "SUBMIT QUOTE →"}</button></form></section><footer className="footer">© 2026 Mayalines</footer></main>;
}
