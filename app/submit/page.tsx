"use client";

import { FormEvent, useState } from "react";

const categories = ["Love", "Life", "Wisdom", "Success", "Motivation", "Courage", "Happiness", "Friendship", "Hope", "Inspiration", "Philosophy", "Other"];

export default function SubmitQuotePage() {
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch("/api/quote-submissions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error("Submission failed");
      setSubmitted(true);
      form.reset();
    } catch {
      setError("The submission could not be sent. Please try again later.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="site-shell">
      <header className="header">
        <a className="brand" href="/" aria-label="Mayalines home"><span className="brand-name">MAYALINES</span><span className="brand-tagline">WORDS THAT LAST.</span></a>
        <div className="header-rule" aria-hidden="true" />
        <nav className="nav" aria-label="Main navigation"><a href="/">Quotes</a><a href="/poems">Poems</a><a href="/authors">Authors</a></nav>
      </header>

      <section className="submit-page" aria-labelledby="submit-title">
        <p className="eyebrow">MAYALINES · COMMUNITY</p>
        <h1 id="submit-title">Share a quote worth keeping.</h1>
        <p className="hero-copy">Know a quotation that belongs in the library? Send it to the editors. Submissions are reviewed before publication.</p>

        {submitted && <div className="submit-success" role="status"><strong>Thank you.</strong> Your submission has been received for review.</div>}
        {error && <div className="submit-success" role="alert"><strong>Something went wrong.</strong> {error}</div>}

        <form className="submit-form" onSubmit={submit}>
          <label>Quote<textarea name="quote" required maxLength={2000} placeholder="Enter the exact quotation…" /></label>
          <label>Author<input name="author" required maxLength={160} placeholder="Who said it?" /></label>
          <label>Source or publication <span>(optional)</span><input name="source" maxLength={300} placeholder="Book, speech, interview, publication…" /></label>
          <label>Category<select name="category" defaultValue="" required><option value="" disabled>Select a category</option>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
          <label>Your name <span>(optional)</span><input name="submitter" maxLength={120} placeholder="How should we credit you?" /></label>
          <button className="submit-button" type="submit" disabled={busy}>{busy ? "SENDING…" : "SUBMIT QUOTE →"}</button>
        </form>
      </section>

      <footer className="footer">
        <div className="footer-inner"><div><div className="footer-brand">MAYALINES</div><p className="footer-note">Timeless words, carefully collected. Discover quotes, authors, poems and ideas worth keeping.</p></div><nav className="footer-links" aria-label="Footer navigation"><a href="/submit">Submit a quote</a><a href="/poems">Poems</a><a href="/authors">Authors</a><a href="/imprint">Imprint</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/copyright">Copyright</a><a href="/accessibility">Accessibility</a></nav></div>
        <div className="footer-bottom">© 2026 Mayalines · Words that last.</div>
      </footer>
    </main>
  );
}
