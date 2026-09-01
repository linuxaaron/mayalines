"use client";

import { useEffect, useRef, useState } from "react";

const topics = [["Life","/topics/life"],["Love","/topics/love"],["Wisdom","/topics/wisdom"],["Success","/topics/success"],["Motivation","/topics/motivation"],["Happiness","/topics/happiness"],["Courage","/topics/courage"],["Friendship","/topics/friendship"],["Hope","/topics/hope"],["Philosophy","/topics/philosophy"],["Truth","/topics/truth"],["Inspiration","/topics/inspiration"]] as const;
const popularAuthors = [["William Shakespeare","/authors/william-shakespeare"],["Oscar Wilde","/authors/oscar-wilde"],["Friedrich Nietzsche","/authors/friedrich-nietzsche"],["Maya Angelou","/authors/maya-angelou"],["Albert Einstein","/authors/albert-einstein"],["Mark Twain","/authors/mark-twain"]] as const;
const collections = [["Quotes About Life","/collections/quotes-about-life"],["Quotes About Love","/collections/quotes-about-love"],["Quotes About Success","/collections/quotes-about-success"],["Motivational Quotes","/collections/quotes-about-motivation"],["Wisdom Quotes","/collections/quotes-about-wisdom"],["Short Inspirational Quotes","/collections/short-inspirational-quotes"]] as const;

const MENU_CLOSE_DELAY = 4500;

type MobileSection = "quotes" | "topics" | "authors" | "collections" | null;

export default function MegaMenu() {
  const [open, setOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<MobileSection>("quotes");
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mobileCloseButton = useRef<HTMLButtonElement | null>(null);

  function cancelClose() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function keepMenuOpen(name?: string) {
    cancelClose();
    if (name) setOpen(name);
  }

  function scheduleClose() {
    cancelClose();
    closeTimer.current = setTimeout(() => {
      setOpen(null);
      closeTimer.current = null;
    }, MENU_CLOSE_DELAY);
  }

  function closeMenu() {
    cancelClose();
    setOpen(null);
    setMobileOpen(false);
  }

  function toggleMobileSection(section: Exclude<MobileSection, null>) {
    setMobileSection((current) => (current === section ? null : section));
  }

  useEffect(() => () => cancelClose(), []);

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    mobileCloseButton.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeMenu();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen]);

  const trigger = (name: string, label: string) => (
    <button
      className="mega-trigger"
      type="button"
      aria-expanded={open === name}
      onMouseEnter={() => keepMenuOpen(name)}
      onFocus={() => keepMenuOpen(name)}
      onMouseLeave={scheduleClose}
      onBlur={scheduleClose}
      onClick={() => {
        cancelClose();
        setOpen(open === name ? null : name);
      }}
    >
      {label} <span className="mega-chevron" aria-hidden="true">⌄</span>
    </button>
  );

  const mobileSectionButton = (section: Exclude<MobileSection, null>, label: string) => (
    <button
      className="mobile-section-trigger"
      type="button"
      aria-expanded={mobileSection === section}
      aria-controls={`mobile-${section}`}
      onClick={() => toggleMobileSection(section)}
    >
      <span>{label}</span>
      <span className="mobile-section-icon" aria-hidden="true">+</span>
    </button>
  );

  return <>
    <style>{`
      .mega-desktop{display:flex;align-items:center;gap:19px;position:relative}
      .mega-trigger{display:inline-flex;align-items:center;gap:5px;color:var(--muted);font-size:12px;font-weight:600;padding:8px 0}
      .mega-trigger:hover,.mega-trigger[aria-expanded="true"]{color:#1f4d3a}
      .mega-submit{position:relative;color:var(--foreground);font-weight:700;padding:8px 0}
      .mega-submit:after{content:"";position:absolute;left:0;right:0;bottom:4px;height:1px;background:#1f4d3a;transform:scaleX(0);transform-origin:left;transition:transform .18s ease}
      .mega-submit:hover:after,.mega-submit[aria-current="page"]:after{transform:scaleX(1)}
      .mega-chevron{font-size:9px;transition:transform .22s cubic-bezier(.2,.8,.2,1)}
      .mega-trigger[aria-expanded="true"] .mega-chevron{transform:rotate(180deg)}
      .mega-panel{position:absolute;z-index:80;top:76px;left:50%;right:auto;width:min(1180px,calc(100% - 56px));transform:translateX(-50%);padding:0 26px 22px;background:rgba(251,250,248,.98);border:1px solid #d7d3cc;border-top:0;border-radius:0 0 12px 12px;box-shadow:0 22px 55px rgba(23,21,19,.12);backdrop-filter:blur(18px);animation:mega-in .24s cubic-bezier(.2,.8,.2,1)}
      .mega-inner{padding:22px 0 0;display:grid;grid-template-columns:1.15fr 1.15fr 1fr 1fr;gap:26px}
      .mega-column{min-width:0}
      .mega-label{margin:0 0 10px;color:#1f4d3a;font-size:8px;font-weight:800;letter-spacing:.15em;text-transform:uppercase}
      .mega-links{display:grid;gap:5px}
      .mega-links a{font-family:Georgia,"Times New Roman",serif;font-size:14px;line-height:1.15;color:#1f4d3a;transition:color .18s ease,transform .18s ease}
      .mega-links a:hover{color:#163a2c;transform:translateX(3px)}
      .mega-feature{padding:14px 16px;background:#e9e5df;border:1px solid #d5d0c8;border-radius:8px;align-self:start}
      .mega-feature p{margin:0 0 8px;color:var(--muted);font-size:9px;line-height:1.45}
      .mega-feature a{color:#1f4d3a;font-size:9px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}
      .mega-mobile-button,.mega-mobile-layer{display:none}
      @keyframes mega-in{from{opacity:0;transform:translate(-50%,-10px) scale(.985)}to{opacity:1;transform:translate(-50%,0) scale(1)}}

      @media(max-width:900px){
        .mega-desktop{display:none}
        .mega-mobile-button{display:inline-flex;align-items:center;gap:9px;min-height:44px;padding:8px 2px;color:#1f4d3a;font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}
        .mega-mobile-button-icon{position:relative;width:19px;height:12px;border-top:1.5px solid currentColor;border-bottom:1.5px solid currentColor}
        .mega-mobile-button-icon:after{content:"";position:absolute;left:0;right:0;top:4px;border-top:1.5px solid currentColor}
        .mega-mobile-layer{display:block;position:fixed;z-index:150;inset:0}
        .mega-mobile-backdrop{position:absolute;inset:0;border:0;background:rgba(18,19,18,.38);backdrop-filter:blur(2px);animation:mobile-fade-in .2s ease-out}
        .mega-mobile-drawer{position:absolute;z-index:1;top:0;right:0;bottom:0;width:min(88vw,390px);display:flex;flex-direction:column;background:#f8f7f4;border-left:1px solid #d6d2cb;box-shadow:-24px 0 60px rgba(20,22,20,.16);animation:mobile-drawer-in .24s cubic-bezier(.2,.8,.2,1)}
        .mega-mobile-head{display:flex;align-items:center;justify-content:space-between;min-height:72px;padding:12px 18px 12px 20px;border-bottom:1px solid #ddd9d2;background:#f8f7f4}
        .mega-mobile-title{display:grid;gap:2px}
        .mega-mobile-title strong{font-family:Georgia,"Times New Roman",serif;color:#171916;font-size:18px;font-weight:500;letter-spacing:.05em}
        .mega-mobile-title span{color:#7a756e;font-size:8px;font-weight:800;letter-spacing:.13em;text-transform:uppercase}
        .mega-close{display:grid;place-items:center;width:44px;height:44px;border:1px solid #d8d3cc;border-radius:50%;color:#1f4d3a;font-size:22px;line-height:1;background:#fff}
        .mega-mobile-scroll{overflow-y:auto;overscroll-behavior:contain;padding:14px 16px 24px;-webkit-overflow-scrolling:touch}
        .mega-mobile-quick{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-bottom:14px}
        .mega-mobile-quick a{display:flex;align-items:center;min-height:46px;padding:10px 12px;border:1px solid #ddd8d1;border-radius:9px;background:#fff;color:#264f3d;font-size:11px;font-weight:750;line-height:1.25}
        .mega-mobile-submit{grid-column:1/-1;justify-content:space-between;background:#1f4d3a!important;color:#fff!important;border-color:#1f4d3a!important}
        .mobile-section{border-top:1px solid #dfdbd4}
        .mobile-section:last-of-type{border-bottom:1px solid #dfdbd4}
        .mobile-section-trigger{display:flex;align-items:center;justify-content:space-between;width:100%;min-height:52px;padding:10px 2px;color:#20211f;text-align:left;font-family:Georgia,"Times New Roman",serif;font-size:16px}
        .mobile-section-icon{display:grid;place-items:center;width:28px;height:28px;border-radius:50%;background:#ebe8e2;color:#315642;font-family:Arial,sans-serif;font-size:17px;transition:transform .2s ease}
        .mobile-section-trigger[aria-expanded="true"] .mobile-section-icon{transform:rotate(45deg)}
        .mobile-section-content{padding:0 0 14px;animation:mobile-section-in .18s ease-out}
        .mobile-section-content a{display:flex;align-items:center;min-height:42px;padding:8px 12px;margin:2px 0;border-radius:7px;color:#315642;font-size:12px;font-weight:650;line-height:1.35}
        .mobile-section-content a:active{background:#e9e6e0}
        .mobile-section-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:2px 4px}
        .mega-mobile-footer{display:grid;gap:4px;padding-top:16px;color:#817b73;font-size:9px;line-height:1.45}
        .mega-mobile-footer a{color:#315642;font-weight:750}
      }

      @media(max-width:420px){
        .mega-mobile-drawer{width:92vw}
        .mega-mobile-head{padding-left:16px;padding-right:14px}
        .mega-mobile-scroll{padding-left:14px;padding-right:14px}
        .mega-mobile-quick a{font-size:10px}
        .mobile-section-content a{font-size:11px}
      }

      @keyframes mobile-fade-in{from{opacity:0}to{opacity:1}}
      @keyframes mobile-drawer-in{from{transform:translateX(24px);opacity:.65}to{transform:translateX(0);opacity:1}}
      @keyframes mobile-section-in{from{opacity:0;transform:translateY(-3px)}to{opacity:1;transform:translateY(0)}}
      @media(prefers-reduced-motion:reduce){.mega-panel,.mega-mobile-backdrop,.mega-mobile-drawer,.mobile-section-content{animation:none}.mega-chevron,.mobile-section-icon{transition:none}}
    `}</style>

    <div className="mega-desktop" onMouseEnter={cancelClose} onMouseLeave={scheduleClose}>
      {trigger("quotes","Quotes")}
      {trigger("topics","Topics")}
      {trigger("authors","Authors")}
      {trigger("collections","Collections")}
      <a className="mega-trigger" href="/poems" onMouseEnter={cancelClose} onFocus={cancelClose}>Poems</a>
      <a className="mega-submit" href="/submit" onMouseEnter={cancelClose} onFocus={cancelClose}>Submit a quote</a>

      {open && <div className="mega-panel" onMouseEnter={cancelClose} onMouseLeave={scheduleClose}><div className="mega-inner">
        {open === "quotes" && <><div className="mega-column"><p className="mega-label">Discover</p><div className="mega-links"><a href="/popular">Popular Quotes</a><a href="/trending">Trending Quotes</a><a href="/most-copied">Most Copied</a><a href="/random">Random Quote</a><a href="/">Quote Library</a></div></div><div className="mega-column"><p className="mega-label">By Type</p><div className="mega-links"><a href="/collections/short-inspirational-quotes">Short Quotes</a><a href="/collections/quotes-about-love">Love Quotes</a><a href="/collections/quotes-about-life">Life Quotes</a><a href="/collections/quotes-about-success">Success Quotes</a></div></div><div className="mega-column"><p className="mega-label">Explore</p><div className="mega-links"><a href="/topics">All Topics</a><a href="/authors">All Authors</a><a href="/collections">All Collections</a><a href="/submit">Submit a Quote</a></div></div><div className="mega-feature"><p>Find memorable words by author, topic, popularity or recent community activity.</p><a href="/most-copied">Explore most copied →</a></div></>}
        {open === "topics" && <><div className="mega-column"><p className="mega-label">Popular Topics</p><div className="mega-links">{topics.slice(0,6).map(([label,url])=><a key={url} href={url}>{label}</a>)}</div></div><div className="mega-column"><p className="mega-label">More Topics</p><div className="mega-links">{topics.slice(6).map(([label,url])=><a key={url} href={url}>{label}</a>)}</div></div><div className="mega-column"><p className="mega-label">Collections</p><div className="mega-links"><a href="/collections/quotes-about-life">Life Quotes</a><a href="/collections/quotes-about-love">Love Quotes</a><a href="/collections/quotes-about-wisdom">Wisdom Quotes</a><a href="/collections/quotes-about-motivation">Motivation</a></div></div><div className="mega-feature"><p>Browse the full topic directory and discover quotes by theme.</p><a href="/topics">View all topics →</a></div></>}
        {open === "authors" && <><div className="mega-column"><p className="mega-label">Popular Authors</p><div className="mega-links">{popularAuthors.map(([label,url])=><a key={url} href={url}>{label}</a>)}</div></div><div className="mega-column"><p className="mega-label">Browse</p><div className="mega-links"><a href="/authors">All Authors</a><a href="/popular">Most Popular Quotes</a><a href="/most-copied">Most Copied Quotes</a><a href="/trending">Trending Quotes</a></div></div><div className="mega-column"><p className="mega-label">Also Explore</p><div className="mega-links"><a href="/topics">Topics</a><a href="/collections">Collections</a><a href="/poems">Poems</a><a href="/submit">Submit a Quote</a></div></div><div className="mega-feature"><p>Explore quotes from writers, thinkers and cultural figures.</p><a href="/authors">Browse all authors →</a></div></>}
        {open === "collections" && <><div className="mega-column"><p className="mega-label">Featured Collections</p><div className="mega-links">{collections.slice(0,3).map(([label,url])=><a key={url} href={url}>{label}</a>)}</div></div><div className="mega-column"><p className="mega-label">More Collections</p><div className="mega-links">{collections.slice(3).map(([label,url])=><a key={url} href={url}>{label}</a>)}</div></div><div className="mega-column"><p className="mega-label">Discover</p><div className="mega-links"><a href="/popular">Popular Quotes</a><a href="/most-copied">Most Copied</a><a href="/trending">Trending Quotes</a><a href="/topics">Browse Topics</a></div></div><div className="mega-feature"><p>Curated collections built around themes and search intent.</p><a href="/collections">View all collections →</a></div></>}
      </div></div>}
    </div>

    <button
      className="mega-mobile-button"
      type="button"
      aria-expanded={mobileOpen}
      aria-controls="mobile-navigation"
      onClick={() => setMobileOpen(true)}
    >
      <span className="mega-mobile-button-icon" aria-hidden="true" />
      Menu
    </button>

    {mobileOpen && <div className="mega-mobile-layer">
      <button className="mega-mobile-backdrop" type="button" aria-label="Close menu" onClick={closeMenu} />
      <aside id="mobile-navigation" className="mega-mobile-drawer" aria-label="Mobile navigation">
        <div className="mega-mobile-head">
          <div className="mega-mobile-title"><strong>Explore</strong><span>Mayalines</span></div>
          <button ref={mobileCloseButton} className="mega-close" type="button" aria-label="Close menu" onClick={closeMenu}>×</button>
        </div>

        <div className="mega-mobile-scroll">
          <div className="mega-mobile-quick">
            <a href="/popular" onClick={closeMenu}>Popular</a>
            <a href="/trending" onClick={closeMenu}>Trending</a>
            <a href="/random" onClick={closeMenu}>Random quote</a>
            <a href="/poems" onClick={closeMenu}>Poems</a>
            <a className="mega-mobile-submit" href="/submit" onClick={closeMenu}>Submit a quote <span aria-hidden="true">→</span></a>
          </div>

          <section className="mobile-section">
            {mobileSectionButton("quotes", "Quotes")}
            {mobileSection === "quotes" && <div id="mobile-quotes" className="mobile-section-content"><div className="mobile-section-grid"><a href="/" onClick={closeMenu}>Quote Library</a><a href="/most-copied" onClick={closeMenu}>Most Copied</a><a href="/collections/short-inspirational-quotes" onClick={closeMenu}>Short Quotes</a><a href="/collections/quotes-about-love" onClick={closeMenu}>Love Quotes</a><a href="/collections/quotes-about-life" onClick={closeMenu}>Life Quotes</a><a href="/collections/quotes-about-success" onClick={closeMenu}>Success Quotes</a></div></div>}
          </section>

          <section className="mobile-section">
            {mobileSectionButton("topics", "Topics")}
            {mobileSection === "topics" && <div id="mobile-topics" className="mobile-section-content"><div className="mobile-section-grid">{topics.map(([label,url])=><a key={url} href={url} onClick={closeMenu}>{label}</a>)}</div><a href="/topics" onClick={closeMenu}>View all topics →</a></div>}
          </section>

          <section className="mobile-section">
            {mobileSectionButton("authors", "Authors")}
            {mobileSection === "authors" && <div id="mobile-authors" className="mobile-section-content"><div className="mobile-section-grid">{popularAuthors.map(([label,url])=><a key={url} href={url} onClick={closeMenu}>{label}</a>)}</div><a href="/authors" onClick={closeMenu}>View all authors →</a></div>}
          </section>

          <section className="mobile-section">
            {mobileSectionButton("collections", "Collections")}
            {mobileSection === "collections" && <div id="mobile-collections" className="mobile-section-content">{collections.map(([label,url])=><a key={url} href={url} onClick={closeMenu}>{label}</a>)}<a href="/collections" onClick={closeMenu}>View all collections →</a></div>}
          </section>

          <div className="mega-mobile-footer">
            <span>Browse quotes without losing your place on the page.</span>
            <a href="/community" onClick={closeMenu}>Community quotes →</a>
          </div>
        </div>
      </aside>
    </div>}
  </>;
}
