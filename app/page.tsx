const quotes = [
  {
    quote: "Life is like riding a bicycle. To keep your balance you must keep moving.",
    author: "Albert Einstein",
  },
  {
    quote: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    quote: "It is never too late to be what you might have been.",
    author: "George Eliot",
  },
];

const categories = ["All", "Life", "Love", "Wisdom", "Motivation", "Success", "Philosophy", "Courage"];
const authors = ["Albert Einstein", "Maya Angelou", "Oscar Wilde", "Mark Twain", "William Shakespeare"];

export default function Home() {
  return (
    <main className="site-shell">
      <header className="header">
        <div className="brand">QUOTES</div>
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
        <p className="hero-copy">
          A considered collection of memorable words, ideas, and voices.
        </p>
        <label className="search-box">
          <span className="sr-only">Search quotes, authors, and topics</span>
          <input type="search" placeholder="Search quotes, authors, topics…" />
        </label>
      </section>

      <section className="library" id="categories">
        <div className="section-heading">Today&apos;s selection</div>
        <div className="quote-grid">
          {quotes.map((item) => (
            <article className="quote-card" key={item.quote}>
              <div className="quote-mark" aria-hidden="true">“</div>
              <p className="quote-text">{item.quote}</p>
              <p className="quote-author">— {item.author}</p>
              <button className="copy-button" type="button">COPY</button>
            </article>
          ))}
        </div>

        <div className="category-rail" aria-label="Quote categories">
          {categories.map((category) => (
            <button key={category} type="button">{category}</button>
          ))}
        </div>

        <section className="quote-of-the-day">
          <p className="eyebrow">QUOTE OF THE DAY</p>
          <blockquote>
            “The future belongs to those who believe in the beauty of their dreams.”
          </blockquote>
          <p className="quote-author">— Eleanor Roosevelt</p>
        </section>

        <section className="author-index" id="authors">
          <div className="section-heading">Explore by author</div>
          <div className="author-row">
            {authors.map((author) => (
              <a href="#authors" key={author}>{author}</a>
            ))}
          </div>
        </section>
      </section>

      <footer className="footer" id="about">
        <span>© 2026 Quote Archive</span>
      </footer>
    </main>
  );
}
