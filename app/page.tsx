"use client";

import { useMemo, useState } from "react";

const quotes = [
  { quote: "Life is like riding a bicycle. To keep your balance you must keep moving.", author: "Albert Einstein", category: "Life" },
  { quote: "In the middle of difficulty lies opportunity.", author: "Albert Einstein", category: "Wisdom" },
  { quote: "Well done is better than well said.", author: "Benjamin Franklin", category: "Success" },
  { quote: "The secret of getting ahead is getting started.", author: "Mark Twain", category: "Motivation" },
  { quote: "It is never too late to be what you might have been.", author: "George Eliot", category: "Life" },
  { quote: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle", category: "Success" },
  { quote: "Happiness depends upon ourselves.", author: "Aristotle", category: "Happiness" },
  { quote: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt", category: "Courage" },
  { quote: "That which does not kill us makes us stronger.", author: "Friedrich Nietzsche", category: "Courage" },
  { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", category: "Motivation" },
  { quote: "Do what you feel in your heart to be right—for you'll be criticized anyway.", author: "Eleanor Roosevelt", category: "Courage" },
  { quote: "The journey of a thousand miles begins with one step.", author: "Lao Tzu", category: "Wisdom" },
];

const categories = ["All", "Life", "Love", "Wisdom", "Motivation", "Success", "Philosophy", "Courage", "Happiness"];
const authors = ["Albert Einstein", "Maya Angelou", "Oscar Wilde", "Mark Twain", "William Shakespeare"];

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
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search quotes, authors, topics…"
          />
        </label>
      </section>

      <section className="library" id="categories">
        <div className="section-heading">Today&apos;s selection</div>
        <div className="quote-grid">
          {filteredQuotes.slice(0, 6).map((item) => (
            <article className="quote-card" key={`${item.author}-${item.quote}`}>
              <div className="quote-mark" aria-hidden="true">“</div>
              <p className="quote-text">{item.quote}</p>
              <p className="quote-author">— {item.author}</p>
              <button
                className="copy-button"
                type="button"
                onClick={() => copyQuote(item.quote, item.author)}
                aria-label={`Copy quote by ${item.author}`}
              >
                {copied === item.quote ? "COPIED" : "COPY"}
              </button>
            </article>
          ))}
        </div>

        {filteredQuotes.length === 0 && (
          <p className="hero-copy">No quotes match your search. Try another author, topic, or category.</p>
        )}

        <div className="category-rail" aria-label="Quote categories">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
            >
              {item}
            </button>
          ))}
        </div>

        <section className="quote-of-the-day">
          <p className="eyebrow">QUOTE OF THE DAY</p>
          <blockquote>“The future belongs to those who believe in the beauty of their dreams.”</blockquote>
          <p className="quote-author">— Eleanor Roosevelt</p>
        </section>

        <section className="author-index" id="authors">
          <div className="section-heading">Explore by author</div>
          <div className="author-row">
            {authors.map((author) => <a href="#authors" key={author}>{author}</a>)}
          </div>
        </section>
      </section>

      <footer className="footer" id="about">
        <span>© 2026 Quote Archive</span>
      </footer>
    </main>
  );
}
