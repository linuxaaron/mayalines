"use client";

import { useActionState } from "react";
import { QUOTE_CATEGORIES } from "../../lib/quote-categories";
import { submitQuote, type SubmitState } from "./actions";
import SubmitButton from "./SubmitButton";

const initialState: SubmitState = { status: "idle", message: "" };

export default function SubmitQuotePage() {
  const [state, formAction] = useActionState(submitQuote, initialState);

  return (
    <main className="site-shell">
      <header className="header">
        <a className="brand" href="/" aria-label="Mayalines home">
          <span className="brand-name">MAYALINES</span>
          <span className="brand-tagline">WORDS THAT LAST.</span>
        </a>
        <div className="header-rule" aria-hidden="true" />
        <nav className="nav" aria-label="Main navigation">
          <a href="/">Quotes</a>
          <a href="/poems">Poems</a>
          <a href="/authors">Authors</a>
          <a className="nav-submit" href="/submit" aria-current="page">Submit a quote</a>
        </nav>
      </header>

      <section className="submit-page" aria-labelledby="submit-title">
        <p className="eyebrow">MAYALINES · COMMUNITY</p>
        <h1 id="submit-title">Share a quote worth keeping.</h1>
        <p className="hero-copy">Know a quotation that belongs in the library? Send it to the editors. Every submission is reviewed before publication.</p>

        {state.status === "success" && <div className="submit-success" role="status">{state.message}</div>}
        {state.status === "error" && <div className="submit-error" role="alert"><strong>Something went wrong.</strong> {state.message}</div>}

        <form className="submit-form" action={formAction}>
          <input name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ display: "none" }} />
          <label>
            Quote
            <textarea name="quote" required maxLength={2000} placeholder="Enter the exact quotation…" />
          </label>
          <label>
            Author
            <input name="author" required maxLength={160} placeholder="Who said it?" />
          </label>
          <label>
            Source or publication
            <input name="source" required maxLength={300} placeholder="Book, speech, interview, publication…" />
          </label>
          <label>
            Category
            <select name="category" defaultValue="" required>
              <option value="" disabled>Select a category</option>
              {QUOTE_CATEGORIES.map((category) => <option key={category}>{category}</option>)}
            </select>
          </label>
          <label>
            Your name <span>(optional)</span>
            <input name="submitter" maxLength={120} placeholder="How should we credit you?" />
          </label>
          <SubmitButton />
        </form>
      </section>

    </main>
  );
}
