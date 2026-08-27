"use client";

import { useMemo, useState } from "react";
import quotesData from "../data/quotes";
import PersistentLikeButton from "../components/PersistentLikeButton";
import QuoteActions from "../components/QuoteActions";
import CommunitySections from "../components/CommunitySections";
import MegaMenu from "../components/MegaMenu";
import { quoteTopics } from "../lib/quote-topics";

type Quote = (typeof quotesData)[number];
const quotes = quotesData as Quote[];
const categoryLabels: Record<string, string> = { Love: "Love", Wisdom: "Wisdom", Success: "Success", Life: "Life", Courage: "Courage", Character: "Character", Education: "Education", Freedom: "Freedom", Faith: "Faith", Quotes: "Quotes", Motivation: "Motivation", Inspiration: "Inspiration", Happiness: "Happiness", Friendship: "Friendship", Science: "Science", Philosophy: "Philosophy" };
const categories = ["All", ...Array.from(new Set(quotes.map((item) => item.category))).sort()];
const authors = Array.from(new Set(quotes.map((item) => item.author))).sort();
const featuredTopics = quoteTopics.slice(0, 12);
const PAGE_SIZE = 48;

function slugify(value: string) { return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const filteredQuotes = useMemo(() => { const normalized = query.trim().toLowerCase(); return quotes.filter((item) => (category === "All" || item.category === category) && (!normalized || `${item.quote} ${item.author} ${item.category}`.toLowerCase().includes(normalized))); }, [query, category]);
  function handleSearch(value: string) { setQuery(value); setVisibleCount(PAGE_SIZE); }
  function handleCategory(value: string) { setCategory(value); setVisibleCount(PAGE_SIZE); }
  const visibleQuotes = filteredQuotes.slice(0, visibleCount);
  const hasMore = visibleCount < filteredQuotes.length;
  const featured = quotes.slice(0, 3);
  const daily = quotes[0];

  return <main className="site-shell">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="header"><a className="brand" href="#top" aria-label="Mayalines home"><img className="brand-mark" src="/mayalines-mark.svg" alt="" aria-hidden="true" /><span className="brand-copy"><span className="brand-name">MAYALINES</span><span className="brand-tagline">WORDS THAT LAST.</span></span></a><div className="header-rule" aria-hidden="true" /><nav className="nav" aria-label="Main navigation"><a href="#top">Home</a><MegaMenu /></nav></header>

    <section className="hero" id="top" aria-labelledby="page-title"><p className="eyebrow">MAYALINES · FAMOUS &amp; INSPIRATIONAL QUOTES</p><h1 id="page-title">Famous Quotes, Inspirational Words &amp; Timeless Wisdom</h1><p className="hero-copy">Discover memorable words by author, topic and occasion. Copy a quote for your status, share it with someone, or stay awhile and find something unexpected.</p><label className="search-box"><span className="sr-only">Search quotes, authors and topics</span><input type="search" value={query} onChange={(event) => handleSearch(event.target.value)} placeholder="Search quotes, authors or topics …" autoComplete="off" /></label><div className="hero-links"><a href="/random">✦ Surprise me</a><a href="/popular">Most liked</a><a href="/trending">Trending now</a><a href="/collections/short-inspirational-quotes">Short quotes</a></div></section>

    <section className="feature-band" aria-labelledby="featured-heading"><div className="section-heading" id="featured-heading">A few words worth keeping</div><div className="feature-grid">{featured.map((item) => <article className="feature-card" key={item.id}><p className="feature-quote">“{item.quote}”</p><p className="quote-author">— {item.author}</p><div className="feature-actions"><PersistentLikeButton quoteId={item.id} author={item.author} /><QuoteActions quote={item.quote} author={item.author} quoteId={item.id} /></div></article>)}</div></section>

    <CommunitySections />

    <section className="topic-strip" aria-labelledby="topic-strip-title"><div className="community-heading"><div><p className="eyebrow">EXPLORE BY TOPIC</p><h2 id="topic-strip-title">Find the right words.</h2></div><a href="/topics">All topics →</a></div><div className="topic-pills">{featuredTopics.map((topic) => <a href={`/topics/${topic.slug}`} key={topic.slug}>{topic.label}</a>)}</div></section>

    <section className="library" id="main-content" aria-labelledby="library-title"><div className="section-heading" id="library-title">Quote library</div><p className="library-meta" aria-live="polite">{filteredQuotes.length.toLocaleString("en-US")} quotes · {authors.length.toLocaleString("en-US")} authors</p><div className="category-rail" id="categories" aria-label="Quote categories">{categories.map((item) => item === "All" ? <button key={item} type="button" onClick={() => handleCategory(item)} aria-pressed={category === item}>{item}</button> : <a key={item} href={`/categories/${slugify(item)}`}>{categoryLabels[item] ?? item}</a>)}</div>
      <div className="quote-grid">{visibleQuotes.map((item) => <article className="quote-card" key={item.id}><div className="quote-mark" aria-hidden="true">“</div><p className="quote-text">{item.quote}</p><p className="quote-author">— {item.author}</p><p className="quote-category">{categoryLabels[item.category] ?? item.category}</p><div className="quote-actions"><PersistentLikeButton quoteId={item.id} author={item.author} /><QuoteActions quote={item.quote} author={item.author} quoteId={item.id} /></div></article>)}</div>
      {filteredQuotes.length === 0 && <p className="hero-copy" role="status">No matching quotes found. Try another author, topic or category.</p>}{hasMore && <div className="load-more-wrap"><button className="load-more-button" type="button" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>Load {PAGE_SIZE} more quotes</button></div>}
    </section>

    <section className="discovery-grid" aria-label="Discover more on Mayalines"><a className="discovery-card discovery-card-feature" href="/poems"><span className="eyebrow">POETRY</span><strong>Famous Poems</strong><p>Read timeless poetry and discover writers beyond the quote.</p><span>Explore poems →</span></a><a className="discovery-card" href="/collections"><span className="eyebrow">CURATED</span><strong>Quote Collections</strong><p>Focused collections about life, love, wisdom, success and more.</p><span>Explore collections →</span></a><a className="discovery-card" href="/authors"><span className="eyebrow">AUTHORS</span><strong>Discover Authors</strong><p>Browse memorable words from writers, thinkers and public figures.</p><span>Browse authors →</span></a><a className="discovery-card" href="/submit"><span className="eyebrow">COMMUNITY</span><strong>Share a Quote</strong><p>Know a quote worth preserving? Send it to the MAYALINES editors.</p><span>Submit a quote →</span></a></section>

    {daily && <section className="quote-of-the-day" aria-labelledby="daily-title"><p className="eyebrow" id="daily-title">QUOTE OF THE DAY</p><blockquote>{daily.quote}</blockquote><p className="quote-author">— {daily.author}</p><div className="quote-actions"><PersistentLikeButton quoteId={daily.id} author={daily.author} /><QuoteActions quote={daily.quote} author={daily.author} quoteId={daily.id} /></div></section>}

    <section className="seo-intro" aria-labelledby="explore-title"><div className="section-heading" id="explore-title">Explore Famous Quotes by Topic</div><p className="hero-copy">Find quotes about love, life, success, motivation, wisdom, courage, happiness, friendship, freedom, philosophy, science, education and more. Browse by topic, author or collection to keep discovering new words.</p><div className="author-row">{authors.slice(0, 24).map((author) => <a href={`/authors/${slugify(author)}`} key={author}>{author}</a>)}</div></section>

    <footer className="footer" id="about"><span>© 2026 Mayalines</span><nav className="footer-links" aria-label="Legal and accessibility navigation"><a href="/submit">Submit a quote</a><a href="/poems">Poems</a><a href="/imprint">Imprint</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/copyright">Copyright</a><a href="/accessibility">Accessibility</a></nav></footer>
  </main>;
}
