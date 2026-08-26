"use client";

import { useMemo, useState } from "react";
import quotesData from "../data/quotes.json";

type Quote = {
  id: string;
  quote: string;
  author: string;
  category: string;
  source: string;
  sourceName: string;
  attributionStatus: string;
  copyrightStatus: string;
  slug: string;
};

const quotes = quotesData as Quote[];
const categories = ["All", ...Array.from(new Set(quotes.map((item) => item.category))).sort()];
const authors = Array.from(new Set(quotes.map((item) => item.author))).sort();

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [copied, setCopied] = useState<string | null>(null);

  const filteredQuotes = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return quotes.filter((item) => {
      const matchesCategory = category === "All" || item.category === category;
      const matchesQuery = !normalized || `${item.quote} ${item.author} ${item.category}`.toLowerCase().includes(normalized);
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  async function copyQuote(quote: string, author: string) {
    try {
      await navigator.clipboard.writeText(`“${quote}” — ${author}`);
      setCopied(quote);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      setCopied(null);
    }
  }

  return (
    <main className="site-shell">
      <header className="header">
        <a className="brand" href="#top" aria-label="Quote Archive home">QUOTES</a>
        <div className="header-rule" />
        <nav className="nav" aria-label="Primary navigation">
          <a href="#top">Home</a>
          <a href="#categories">Categories</a>
          <a href="#authors">Authors</a>
          <a href="#about">About</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <p className="eyebrow">THE QUOTE ARCHIVE</p>
        <h1>Words worth keeping.</h1>
        <p className="hero-copy">A considered collection of memorable words, ideas, and voices.</p>
        <label className="search-box">
          <span className="sr-only">Search quotes, authors, and topics</span>
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search quotes, authors, topics…" />
        </label>
      </section>

      <section className="library" id="categories">
        <div className="section-heading">Quote library</div>
        <p className="library-meta">{filteredQuotes.length.toLocaleString()} quotes · {authors.length.toLocaleString()} authors</p>

        <div className="quote-grid">
          {filteredQuotes.slice(0, 12).map((item) => (
            <article className="quote-card" key={item.id}>
              <div className="quote-mark" aria-hidden="true">“</div>
              <p className="quote-text">{item.quote}</p>
              <p className="quote-author">— {item.author}</p>
              <p className="quote-category">{item.category}</p>
              <button className="copy-button" type="button" onClick={() => copyQuote(item.quote, item.author)} aria-label={`Copy quote by ${item.author}`}>
                {copied === item.quote ? "COPIED" : "COPY"}
              </button>
            </article>
          ))}
        </div>

        {filteredQuotes.length === 0 && <p className="hero-copy">No quotes match your search. Try another author, topic, or category.</p>}

        <div className="category-rail" aria-label="Quote categories">
          {categories.map((item) => (
            <button key={item} type="button" onClick={() => setCategory(item)} aria-pressed={category === item}>{item}</button>
          ))}
        </div>

        <section className="quote-of-the-day">
          <p className="eyebrow">QUOTE OF THE DAY</p>
          <blockquote>{quotes[0]?.quote}</blockquote>
          <p className="quote-author">— {quotes[0]?.author}</p>
        </section>

        <section className="author-index" id="authors">
          <div className="section-heading">Explore by author</div>
          <div className="author-row">
            {authors.slice(0, 24).map((author) => <a href="#authors" key={author}>{author}</a>)}
          </div>
        </section>
      </section>

      <footer className="footer" id="about"><span>© 2026 Quote Archive</span></footer>
    </main>
  );
}
