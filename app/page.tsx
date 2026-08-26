"use client";

import { useMemo, useState } from "react";
import quotesData from "../data/quotes";
import PersistentLikeButton from "../components/PersistentLikeButton";
import CommunitySections from "../components/CommunitySections";
import MegaMenu from "../components/MegaMenu";
import { quoteTopics } from "../lib/quote-topics";

type Quote = (typeof quotesData)[number];
const quotes = quotesData as Quote[];
const categoryLabels: Record<string, string> = { Love: "Love", Wisdom: "Wisdom", Success: "Success", Life: "Life", Courage: "Courage", Character: "Character", Education: "Education", Freedom: "Freedom", Faith: "Faith", Quotes: "Quotes", Motivation: "Motivation", Inspiration: "Inspiration", Happiness: "Happiness", Friendship: "Friendship", Science: "Science", Philosophy: "Philosophy" };
const categories = ["All", ...Array.from(new Set(quotes.map((item) => item.category))).sort()];
const authors = Array.from(new Set(quotes.map((item) => item.author))).sort();
const PAGE_SIZE = 60;
function slugify(value: string) { return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

export default function Home() {
  const [query, setQuery] = useState(""); const [category, setCategory] = useState("All"); const [copied, setCopied] = useState<string | null>(null); const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const filteredQuotes = useMemo(() => { const normalized = query.trim().toLowerCase(); return quotes.filter((item) => (category === "All" || item.category === category) && (!normalized || `${item.quote} ${item.author} ${item.category}`.toLowerCase().includes(normalized))); }, [query, category]);
  async function copyQuote(quote: string, author: string) { try { await navigator.clipboard.writeText(`“${quote}” — ${author}`); setCopied(quote); window.setTimeout(() => setCopied(null), 1600); } catch { setCopied(null); } }
  function handleSearch(value: string) { setQuery(value); setVisibleCount(PAGE_SIZE); }
  function handleCategory(value: string) { setCategory(value); setVisibleCount(PAGE_SIZE); }
  const visibleQuotes = filteredQuotes.slice(0, visibleCount); const hasMore = visibleCount < filteredQuotes.length;

  return <main className="site-shell">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="header"><a className="brand" href="#top" aria-label="Mayalines home"><img className="brand-mark" src="/mayalines-mark.svg" alt="" aria-hidden="true" /><span className="brand-copy"><span className="brand-name">MAYALINES</span><span className="brand-tagline">WORDS THAT LAST.</span></span></a><div className="header-rule" aria-hidden="true" /><nav className="nav" aria-label="Main navigation"><a href="#top">Home</a><MegaMenu /></nav></header>
    <section className="hero" id="top" aria-labelledby="page-title"><p className="eyebrow">MAYALINES · FAMOUS &amp; INSPIRATIONAL QUOTES</p><h1 id="page-title">Famous Quotes, Inspirational Words &amp; Timeless Wisdom</h1><p className="hero-copy">Explore famous quotes, inspirational quotes, motivational quotes, life quotes and timeless wisdom from notable authors. Search by author, topic or category, then read and copy the quote instantly.</p><label className="search-box"><span className="sr-only">Search quotes, authors and topics</span><input type="search" value={query} onChange={(event) => handleSearch(event.target.value)} placeholder="Search quotes, authors or topics …" autoComplete="off" /></label></section>
    <CommunitySections />
    <section className="topic-strip" aria-labelledby="topic-strip-title"><div className="community-heading"><div><p className="eyebrow">EXPLORE BY TOPIC</p><h2 id="topic-strip-title">Find the right words.</h2></div><a href="/topics">All topics →</a></div><div className="topic-pills">{quoteTopics.map((topic) => <a href={`/topics/${topic.slug}`} key={topic.slug}>{topic.label}</a>)}</div></section>
    <section className="library" id="main-content" aria-labelledby="library-title"><div className="section-heading" id="library-title">Quote library</div><p className="library-meta" aria-live="polite">{filteredQuotes.length.toLocaleString("en-US")} quotes · {authors.length.toLocaleString("en-US")} authors</p>
      <div className="category-rail" id="categories" aria-label="Quote categories">{categories.map((item) => item === "All" ? <button key={item} type="button" onClick={() => handleCategory(item)} aria-pressed={category === item}>{item}</button> : <a key={item} href={`/categories/${slugify(item)}`}>{categoryLabels[item] ?? item}</a>)}</div>
      <div className="quote-grid">{visibleQuotes.map((item) => <article className="quote-card" key={item.id}><div className="quote-mark" aria-hidden="true">“</div><p className="quote-text">{item.quote}</p><p className="quote-author">— {item.author}</p><p className="quote-category">{categoryLabels[item.category] ?? item.category}</p><div className="quote-actions"><PersistentLikeButton quoteId={item.id} author={item.author} /><button className="copy-button" type="button" onClick={() => copyQuote(item.quote, item.author)} aria-label={`Copy quote by ${item.author}`}>{copied === item.quote ? "COPIED" : "COPY"}</button></div></article>)}</div>
      {filteredQuotes.length === 0 && <p className="hero-copy" role="status">No matching quotes found. Try another author, topic or category.</p>}{hasMore && <div className="load-more-wrap"><button className="load-more-button" type="button" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>Load {PAGE_SIZE} more quotes</button></div>}
      <section className="quote-of-the-day" aria-labelledby="daily-title"><p className="eyebrow" id="daily-title">QUOTE OF THE DAY</p><blockquote>{quotes[0]?.quote}</blockquote><p className="quote-author">— {quotes[0]?.author}</p></section>
      <section aria-labelledby="poetry-title" style={{ marginTop: 72, padding: "42px 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}><div style={{ display: "flex", justifyContent: "space-between", gap: 30, alignItems: "end", flexWrap: "wrap" }}><div><p className="eyebrow">MAYALINES · POETRY</p><div className="section-heading" id="poetry-title">Famous Poems</div><p className="hero-copy">Read timeless public-domain poetry from writers including Emily Dickinson, Edgar Allan Poe, William Blake and Percy Bysshe Shelley.</p></div><a className="copy-button" href="/poems" style={{ display: "inline-block" }}>EXPLORE POEMS →</a></div><div aria-hidden="true" style={{ marginTop: 30, letterSpacing: "18px", color: "var(--brown-soft)", fontSize: 12 }}>✦ · ✦ · ✦</div></section>
      <section aria-labelledby="collections-title" style={{ marginTop: 72, padding: "42px 0", borderBottom: "1px solid var(--border)" }}><p className="eyebrow">MAYALINES · CURATED COLLECTIONS</p><div className="section-heading" id="collections-title">Quotes worth returning to.</div><p className="hero-copy">Explore focused collections about life, love, success, motivation, wisdom and inspiration.</p><a className="copy-button" href="/collections" style={{ display: "inline-block", marginTop: 18 }}>EXPLORE COLLECTIONS →</a></section>
      <section className="author-index" id="authors" aria-labelledby="author-title" style={{ marginTop: 72, paddingTop: 8 }}><div className="section-heading" id="author-title">Discover Quotes by Author</div><p className="hero-copy">Browse quotes by author to find famous words, inspirational thoughts and memorable lines from notable writers, thinkers and public figures. <a href="/authors">Browse all authors</a>.</p><div className="author-row">{authors.slice(0, 30).map((author) => <a href={`/authors/${slugify(author)}`} key={author}>{author}</a>)}</div></section>
      <section className="seo-intro" aria-labelledby="explore-title" style={{ marginTop: 76, paddingTop: 48, borderTop: "1px solid var(--border)" }}><div className="section-heading" id="explore-title">Explore Famous Quotes by Topic</div><p className="hero-copy">Find quotes about love, life, success, motivation, wisdom, courage, happiness, friendship, freedom, philosophy, science, education and more. <a href="/topics">Browse all quote topics</a>. Mayalines organizes a growing library of sourced quotes so you can discover memorable words by topic or author.</p></section>
    </section>
    <footer className="footer" id="about"><span>© 2026 Mayalines</span><nav className="footer-links" aria-label="Legal and accessibility navigation"><a href="/imprint">Imprint</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/copyright">Copyright</a><a href="/accessibility">Accessibility</a></nav></footer>
  </main>;
}
