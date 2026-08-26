"use client";

import { useMemo, useState } from "react";
import quotesData from "../data/quotes.json";
import PersistentLikeButton from "../components/PersistentLikeButton";

type Quote = { id: string; quote: string; author: string; category: string; source: string; sourceName: string; attributionStatus: string; copyrightStatus: string; indexable?: boolean; slug: string };
const quotes = quotesData as Quote[];
const categories = ["Alle", ...Array.from(new Set(quotes.map((item) => item.category))).sort()];
const authors = Array.from(new Set(quotes.map((item) => item.author))).sort();
const PAGE_SIZE = 60;
function slugify(value: string) { return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

export default function Home() {
  const [query, setQuery] = useState(""); const [category, setCategory] = useState("Alle"); const [copied, setCopied] = useState<string | null>(null); const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const filteredQuotes = useMemo(() => { const normalized = query.trim().toLowerCase(); return quotes.filter((item) => (category === "Alle" || item.category === category) && (!normalized || `${item.quote} ${item.author} ${item.category}`.toLowerCase().includes(normalized))); }, [query, category]);
  async function copyQuote(quote: string, author: string) { try { await navigator.clipboard.writeText(`“${quote}” — ${author}`); setCopied(quote); window.setTimeout(() => setCopied(null), 1600); } catch { setCopied(null); } }
  function handleSearch(value: string) { setQuery(value); setVisibleCount(PAGE_SIZE); }
  function handleCategory(value: string) { setCategory(value); setVisibleCount(PAGE_SIZE); }
  const visibleQuotes = filteredQuotes.slice(0, visibleCount); const hasMore = visibleCount < filteredQuotes.length;

  return <main className="site-shell">
    <a className="skip-link" href="#main-content">Zum Inhalt springen</a>
    <header className="header"><a className="brand" href="#top" aria-label="Mayalines Startseite"><img className="brand-mark" src="/mayalines-mark.svg" alt="" aria-hidden="true" /><span className="brand-copy"><span className="brand-name">MAYALINES</span><span className="brand-tagline">WORTE, DIE BLEIBEN.</span></span></a><div className="header-rule" aria-hidden="true" /><nav className="nav" aria-label="Hauptnavigation"><a href="#top">Startseite</a><a href="#categories">Kategorien</a><a href="#authors">Autoren</a><a href="#about">Über MAYALINES</a></nav></header>
    <section className="hero" id="top" aria-labelledby="page-title"><p className="eyebrow">MAYALINES · ZITATE &amp; GEDANKEN</p><h1 id="page-title">Zitate, die bleiben.</h1><p className="hero-copy">Entdecke bekannte Zitate, inspirierende Worte, Gedanken über das Leben und Ideen bedeutender Persönlichkeiten. Suche nach Autor, Thema oder Kategorie.</p><label className="search-box"><span className="sr-only">Zitate, Autoren und Themen durchsuchen</span><input type="search" value={query} onChange={(event) => handleSearch(event.target.value)} placeholder="Zitate, Autoren oder Themen suchen …" autoComplete="off" /></label></section>
    <section className="library" id="main-content" aria-labelledby="library-title"><div className="section-heading" id="library-title">Zitatbibliothek</div><p className="library-meta" aria-live="polite">{filteredQuotes.length.toLocaleString("de-DE")} Zitate · {authors.length.toLocaleString("de-DE")} Autoren</p>
      <div className="category-rail" id="categories" aria-label="Zitatkategorien">{categories.map((item) => item === "Alle" ? <button key={item} type="button" onClick={() => handleCategory(item)} aria-pressed={category === item}>{item}</button> : <a key={item} href={`/categories/${slugify(item)}`}>{item}</a>)}</div>
      <div className="quote-grid">{visibleQuotes.map((item) => <article className="quote-card" key={item.id}><div className="quote-mark" aria-hidden="true">“</div><p className="quote-text">{item.quote}</p><p className="quote-author">— {item.author}</p><p className="quote-category">{item.category}</p><div className="quote-actions"><PersistentLikeButton quoteId={item.id} author={item.author} /><button className="copy-button" type="button" onClick={() => copyQuote(item.quote, item.author)} aria-label={`Zitat von ${item.author} kopieren`}>{copied === item.quote ? "KOPIERT" : "KOPIEREN"}</button></div></article>)}</div>
      {filteredQuotes.length === 0 && <p className="hero-copy" role="status">Keine passenden Zitate gefunden. Versuche einen anderen Autor, ein anderes Thema oder eine andere Kategorie.</p>}{hasMore && <div className="load-more-wrap"><button className="load-more-button" type="button" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>Weitere {PAGE_SIZE} Zitate laden</button></div>}
      <section className="quote-of-the-day" aria-labelledby="daily-title"><p className="eyebrow" id="daily-title">ZITAT DES TAGES</p><blockquote>{quotes[0]?.quote}</blockquote><p className="quote-author">— {quotes[0]?.author}</p></section>
      <section className="author-index" id="authors" aria-labelledby="author-title"><div className="section-heading" id="author-title">Nach Autor entdecken</div><div className="author-row">{authors.slice(0, 30).map((author) => <a href={`/authors/${slugify(author)}`} key={author}>{author}</a>)}</div></section>
    </section>
    <footer className="footer" id="about"><span>© 2026 Mayalines</span><nav className="footer-links" aria-label="Navigation zu Recht und Barrierefreiheit"><a href="/imprint">Impressum</a><a href="/privacy">Datenschutz</a><a href="/terms">Nutzungsbedingungen</a><a href="/copyright">Urheberrecht</a><a href="/accessibility">Barrierefreiheit</a></nav></footer>
  </main>;
}
