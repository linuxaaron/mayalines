import type { CSSProperties } from "react";
import quotesData from "../data/quotes";
import PersistentLikeButton from "../components/PersistentLikeButton";
import QuoteActions from "../components/QuoteActions";
import CommunitySections from "../components/CommunitySections";
import MegaMenu from "../components/MegaMenu";
import HomeQuoteLibrary from "../components/HomeQuoteLibrary";
import { quoteTopics } from "../lib/quote-topics";

const PAGE_SIZE = 48;
const NIETZSCHE_WORDS = ["Man", "muss", "schon", "Chaos", "in", "sich", "tragen,", "um", "einen", "Stern", "gebären", "zu", "können."];

function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function Home() {
  const indexableQuotes = quotesData.filter((item) => item.indexable !== false);
  const categories = ["All", ...Array.from(new Set(indexableQuotes.map((item) => item.category))).sort()];
  const authors = Array.from(new Set(indexableQuotes.map((item) => item.author))).sort();
  const featuredTopics = quoteTopics.slice(0, 12);
  const initialQuotes = indexableQuotes.slice(0, PAGE_SIZE);
  const featured = indexableQuotes.slice(0, 3);
  const daily = indexableQuotes[0];

  return <main className="site-shell redesign-shell">
    <style>{`
      .redesign-shell{--background:#f4f3f0;--surface:#fbfaf8;--surface-strong:#fff;--foreground:#191817;--quote-black:#151413;--muted:#6d6963;--border:#d9d6d0;--brown:#5d554d;--brown-soft:#81786f;--brown-wash:#e9e5df}
      .redesign-shell .header{min-height:82px;padding:14px 48px;border-bottom:1px solid var(--border);background:rgba(244,243,240,.88);backdrop-filter:blur(16px)}
      .redesign-shell .header-rule{background:#d2cec7}
      .redesign-shell .brand:hover .brand-name{color:#5d554d}
      .redesign-shell .hero{padding-top:72px;padding-bottom:52px}
      .redesign-shell .hero h1{max-width:900px}
      .redesign-shell .feature-card,.redesign-shell .quote-card,.redesign-shell .discovery-card{background:rgba(255,255,255,.72);border-color:#d7d3cc}
      .redesign-shell .feature-card{transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease}
      .redesign-shell .feature-card:hover{transform:translateY(-2px);box-shadow:0 12px 28px rgba(30,27,24,.06);border-color:#c8c2ba}
      .redesign-shell .quote-card{position:relative;overflow:hidden;transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease}
      .redesign-shell .quote-card:before{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:#a69b90;opacity:.7}
      .redesign-shell .quote-card:hover{transform:translateY(-2px);box-shadow:0 12px 28px rgba(30,27,24,.07);border-color:#c8c2ba}
      .redesign-shell .quote-mark{color:#85786c}
      .redesign-shell .quote-category{color:#85786c}
      .redesign-shell .topic-strip{background-color:#eeece8;background-image:radial-gradient(circle at 1px 1px,rgba(93,85,77,.08) 1px,transparent 1.5px)}
      .redesign-shell .topic-strip>*{background:transparent}
      .redesign-shell .discovery-grid{padding-top:34px;padding-bottom:76px}
      .redesign-shell .discovery-card-feature{background:#e7e2dc}
      .redesign-shell .quote-of-the-day{margin:0 auto 54px;width:min(1296px,84%);padding:52px 58px;background:#e6e2dc;border:1px solid #d2cdc5;border-radius:10px}
      .redesign-shell .quote-of-the-day blockquote{max-width:980px}
      .redesign-shell .seo-intro{width:min(1296px,84%);margin:0 auto;padding:20px 0 68px}
      .redesign-shell .seo-intro .section-heading{font-family:Georgia,"Times New Roman",serif;font-size:31px;font-weight:500}
      .redesign-shell .footer{margin-top:0;padding:0;background:#1e1d1b;color:#d9d5cf;border-top:1px solid #34312e}
      .redesign-shell .footer-inner{width:min(1296px,84%);margin:0 auto;padding:42px 0 26px;display:grid;grid-template-columns:1.4fr 2fr;gap:50px;align-items:start}
      .redesign-shell .footer-brand{font-family:Georgia,"Times New Roman",serif;font-size:22px;letter-spacing:.08em;color:#f2efea}
      .redesign-shell .footer-note{max-width:360px;margin:10px 0 0;color:#a9a39b;font-size:11px;line-height:1.55}
      .redesign-shell .footer-links{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px 22px;margin:0}
      .redesign-shell .footer-links a{color:#c5c0b9;text-decoration:none;font-size:10px;letter-spacing:.05em}
      .redesign-shell .footer-links a:hover{color:#fff}
      .redesign-shell .footer-bottom{width:min(1296px,84%);margin:0 auto;padding:16px 0 20px;border-top:1px solid #34312e;color:#858078;font-size:9px;letter-spacing:.05em}
      .nietzsche-float{position:relative;height:0;z-index:35;pointer-events:none}
      .nietzsche-float-inner{position:absolute;top:15px;left:50%;width:min(760px,76vw);transform:translateX(-50%);text-align:center;color:#080808;opacity:1;animation:nietzsche-fade 5s ease-in-out forwards}
      .nietzsche-quote{margin:0;font-family:Palatino,"Palatino Linotype","Book Antiqua",Georgia,serif;font-size:clamp(15px,1.55vw,23px);font-style:italic;font-weight:500;line-height:1.45;letter-spacing:.02em;color:#050505;text-shadow:0 .3px 0 rgba(0,0,0,.18)}
      .nietzsche-word{display:inline-block;margin-right:.27em;opacity:0;filter:blur(2px);transform:translateY(5px) scale(.98);animation:nietzsche-word-in .34s cubic-bezier(.2,.75,.25,1) forwards;animation-delay:calc(var(--word-index) * .135s)}
      .nietzsche-author{margin:5px 0 0;font-family:Palatino,"Palatino Linotype","Book Antiqua",Georgia,serif;font-size:10px;font-style:italic;letter-spacing:.08em;color:#111;opacity:0;animation:nietzsche-author-in .45s ease forwards;animation-delay:2s}
      @keyframes nietzsche-word-in{to{opacity:1;filter:blur(0);transform:translateY(0) scale(1)}}
      @keyframes nietzsche-author-in{to{opacity:.78}}
      @keyframes nietzsche-fade{0%,82%{opacity:1}100%{opacity:0}}
      @media(max-width:900px){.redesign-shell .header{padding:12px 20px}.redesign-shell .quote-of-the-day,.redesign-shell .seo-intro{width:auto;margin-left:20px;margin-right:20px}.redesign-shell .quote-of-the-day{padding:36px 28px}.redesign-shell .footer-inner{width:auto;margin:0 20px;grid-template-columns:1fr;gap:28px}.redesign-shell .footer-links{grid-template-columns:repeat(2,minmax(0,1fr))}.redesign-shell .footer-bottom{width:auto;margin:0 20px}.nietzsche-float-inner{top:12px;width:calc(100vw - 42px)}.nietzsche-quote{font-size:15px;line-height:1.38}.nietzsche-author{font-size:9px}.redesign-shell .hero{padding-top:92px}}
      @media(max-width:560px){.redesign-shell .hero{padding-top:104px}.nietzsche-float-inner{top:12px;width:calc(100vw - 32px)}.nietzsche-quote{font-size:14px;line-height:1.42}.nietzsche-word{margin-right:.23em}.redesign-shell .quote-of-the-day{margin-left:16px;margin-right:16px;padding:30px 22px}.redesign-shell .seo-intro{margin-left:16px;margin-right:16px}.redesign-shell .footer-inner{margin:0 16px}.redesign-shell .footer-bottom{margin:0 16px}.redesign-shell .quote-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:12px}.redesign-shell .quote-card{min-height:170px;padding:13px 12px 10px;border-radius:5px}.redesign-shell .quote-card:before{width:2px}.redesign-shell .quote-mark{font-size:23px}.redesign-shell .quote-text{margin-top:9px;font-size:14px;line-height:1.25;letter-spacing:-.015em}.redesign-shell .quote-author{margin-top:7px;font-size:9px;line-height:1.2}.redesign-shell .quote-category{margin-top:4px;font-size:7px;line-height:1.15;letter-spacing:.08em}.redesign-shell .quote-actions{gap:5px;padding-top:7px}.redesign-shell .like-button{width:28px;height:28px}.redesign-shell .heart-icon{font-size:12px}.redesign-shell .like-count{font-size:8px}.redesign-shell .copy-button{padding:5px 6px;font-size:7px;letter-spacing:.05em}.redesign-shell .category-rail{gap:7px 12px;padding:12px 0}.redesign-shell .category-rail button,.redesign-shell .category-rail a{font-size:8px}}
      @media(prefers-reduced-motion:reduce){.nietzsche-float-inner,.nietzsche-word,.nietzsche-author{animation:none!important;opacity:1!important;filter:none!important;transform:none!important}}
    `}</style>

    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="header"><a className="brand" href="#top" aria-label="Mayalines home"><img className="brand-mark" src="/mayalines-mark.svg" alt="" aria-hidden="true" /><span className="brand-copy"><span className="brand-name">MAYALINES</span><span className="brand-tagline">WORDS THAT LAST.</span></span></a><div className="header-rule" aria-hidden="true" /><nav className="nav" aria-label="Main navigation"><MegaMenu /></nav></header>

    <div className="nietzsche-float" aria-label="Zitat von Friedrich Nietzsche"><div className="nietzsche-float-inner"><p className="nietzsche-quote">{NIETZSCHE_WORDS.map((word, index) => <span className="nietzsche-word" style={{ "--word-index": index } as CSSProperties} key={`${word}-${index}`}>{word}</span>)}</p><p className="nietzsche-author">— Friedrich Nietzsche</p></div></div>

    <HomeQuoteLibrary initialQuotes={initialQuotes} initialTotal={indexableQuotes.length} categories={categories} />

    <section className="feature-band" aria-labelledby="featured-heading"><div className="section-heading" id="featured-heading">A few words worth keeping</div><div className="feature-grid">{featured.map((item) => <article className="feature-card" key={item.id}><p className="feature-quote">“{item.quote}”</p><p className="quote-author">— {item.author}</p><div className="feature-actions"><PersistentLikeButton quoteId={item.id} author={item.author} /><QuoteActions quote={item.quote} author={item.author} quoteId={item.id} /></div></article>)}</div></section>

    <CommunitySections />

    <section className="topic-strip" aria-labelledby="topic-strip-title"><div className="community-heading"><div><p className="eyebrow">EXPLORE BY TOPIC</p><h2 id="topic-strip-title">Find the right words.</h2></div><a href="/topics">All topics →</a></div><div className="topic-pills">{featuredTopics.map((topic) => <a href={`/topics/${topic.slug}`} key={topic.slug}>{topic.label}</a>)}</div></section>

    <section className="discovery-grid" aria-label="Discover more on Mayalines"><a className="discovery-card discovery-card-feature" href="/poems"><span className="eyebrow">POETRY</span><strong>Famous Poems</strong><p>Read timeless poetry in multiple languages and discover writers beyond the quote.</p><span>Explore poems →</span></a><a className="discovery-card" href="/collections"><span className="eyebrow">CURATED</span><strong>Quote Collections</strong><p>Focused collections about life, love, wisdom, success and more.</p><span>Explore collections →</span></a><a className="discovery-card" href="/authors"><span className="eyebrow">AUTHORS</span><strong>Discover Authors</strong><p>Browse memorable words from writers, thinkers and public figures.</p><span>Browse authors →</span></a><a className="discovery-card" href="/submit"><span className="eyebrow">COMMUNITY</span><strong>Share a Quote</strong><p>Know a quote worth preserving? Send it to the MAYALINES editors.</p><span>Submit a quote →</span></a><a className="discovery-card" href="/community"><span className="eyebrow">COMMUNITY</span><strong>Community Quotes</strong><p>Read quotations submitted by readers and approved by the editors.</p><span>Read community quotes →</span></a></section>

    {daily && <section className="quote-of-the-day" aria-labelledby="daily-title"><p className="eyebrow" id="daily-title">QUOTE OF THE DAY</p><blockquote>{daily.quote}</blockquote><p className="quote-author">— {daily.author}</p><div className="quote-actions"><PersistentLikeButton quoteId={daily.id} author={daily.author} /><QuoteActions quote={daily.quote} author={daily.author} quoteId={daily.id} /></div></section>}

    <section className="seo-intro" aria-labelledby="explore-title"><div className="section-heading" id="explore-title">Explore Famous Quotes by Topic</div><p className="hero-copy">Find sourced quotes and aphorisms about love, life, success, motivation, wisdom, courage, happiness, friendship, freedom, philosophy, science, education and more. Browse by topic, author or collection and discover words in multiple languages.</p><div className="author-row">{authors.slice(0, 24).map((author) => <a href={`/authors/${slugify(author)}`} key={author}>{author}</a>)}</div></section>

    <footer className="footer" id="about"><div className="footer-inner"><div><div className="footer-brand">MAYALINES</div><p className="footer-note">Timeless words, carefully collected. Discover quotes, aphorisms, authors, poems and ideas worth keeping.</p></div><nav className="footer-links" aria-label="Legal and accessibility navigation"><a href="/submit">Submit a quote</a><a href="/community">Community quotes</a><a href="/poems">Poems</a><a href="/imprint">Imprint</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/copyright">Copyright</a><a href="/accessibility">Accessibility</a></nav></div><div className="footer-bottom">© 2026 Mayalines · Words that last.</div></footer>
  </main>;
}
