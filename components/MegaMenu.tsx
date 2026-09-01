"use client";

import { useEffect, useRef, useState } from "react";

const topics = [["Life","/topics/life"],["Love","/topics/love"],["Wisdom","/topics/wisdom"],["Success","/topics/success"],["Motivation","/topics/motivation"],["Happiness","/topics/happiness"],["Courage","/topics/courage"],["Friendship","/topics/friendship"],["Hope","/topics/hope"],["Philosophy","/topics/philosophy"],["Truth","/topics/truth"],["Inspiration","/topics/inspiration"]] as const;
const popularAuthors = [["William Shakespeare","/authors/william-shakespeare"],["Oscar Wilde","/authors/oscar-wilde"],["Friedrich Nietzsche","/authors/friedrich-nietzsche"],["Maya Angelou","/authors/maya-angelou"],["Albert Einstein","/authors/albert-einstein"],["Mark Twain","/authors/mark-twain"]] as const;
const collections = [["Quotes About Life","/collections/quotes-about-life"],["Quotes About Love","/collections/quotes-about-love"],["Quotes About Success","/collections/quotes-about-success"],["Motivational Quotes","/collections/quotes-about-motivation"],["Wisdom Quotes","/collections/quotes-about-wisdom"],["Short Inspirational Quotes","/collections/short-inspirational-quotes"]] as const;

const MENU_CLOSE_DELAY = 650;
type MobileSection = "quotes" | "topics" | "authors" | "collections";

function SunflowerMark() {
  return (
    <span className="menu-sunflower" aria-hidden="true">
      <svg viewBox="0 0 28 36" focusable="false">
        <g className="sunflower-grow">
          <path className="sunflower-stem" d="M14 33V17" />
          <path className="sunflower-leaf sunflower-leaf-left" d="M13.7 27c-5.8.4-8-2.4-8.5-5.7 4.3-.4 7.3 1.5 8.5 5.7Z" />
          <path className="sunflower-leaf sunflower-leaf-right" d="M14.3 23c5.7-.1 7.9-2.8 8.2-6-4.2-.1-7.1 2-8.2 6Z" />
          <g className="sunflower-bloom">
            <ellipse className="sunflower-petal" cx="14" cy="4.7" rx="1.8" ry="3.8" />
            <ellipse className="sunflower-petal" cx="14" cy="11.3" rx="1.8" ry="3.8" />
            <ellipse className="sunflower-petal" cx="10.7" cy="8" rx="3.8" ry="1.8" />
            <ellipse className="sunflower-petal" cx="17.3" cy="8" rx="3.8" ry="1.8" />
            <ellipse className="sunflower-petal" cx="11.7" cy="5.7" rx="1.7" ry="3.5" transform="rotate(-45 11.7 5.7)" />
            <ellipse className="sunflower-petal" cx="16.3" cy="5.7" rx="1.7" ry="3.5" transform="rotate(45 16.3 5.7)" />
            <ellipse className="sunflower-petal" cx="11.7" cy="10.3" rx="1.7" ry="3.5" transform="rotate(45 11.7 10.3)" />
            <ellipse className="sunflower-petal" cx="16.3" cy="10.3" rx="1.7" ry="3.5" transform="rotate(-45 16.3 10.3)" />
            <circle className="sunflower-center" cx="14" cy="8" r="3.3" />
          </g>
        </g>
      </svg>
    </span>
  );
}

export default function MegaMenu() {
  const [open, setOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<MobileSection>("quotes");
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeButton = useRef<HTMLButtonElement | null>(null);

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

  useEffect(() => () => cancelClose(), []);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    const previousOverflowX = document.body.style.overflowX;
    document.body.style.overflow = "hidden";
    document.body.style.overflowX = "hidden";
    closeButton.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.overflowX = previousOverflowX;
      window.removeEventListener("keydown", onKeyDown);
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

  return <>
    <style>{`
      .mega-desktop{display:flex;align-items:center;gap:19px;position:relative}
      .mega-desktop-menu-mark{display:inline-flex;align-items:center;gap:5px;color:#1f4d3a;font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap}
      .mega-trigger{display:inline-flex;align-items:center;gap:5px;color:var(--muted);font-size:12px;font-weight:600;padding:8px 0}
      .mega-trigger:hover,.mega-trigger[aria-expanded="true"]{color:#1f4d3a}
      .mega-submit{position:relative;color:var(--foreground);font-weight:700;padding:8px 0}
      .mega-submit:after{content:"";position:absolute;left:0;right:0;bottom:4px;height:1px;background:#1f4d3a;transform:scaleX(0);transform-origin:left;transition:transform .18s ease}
      .mega-submit:hover:after{transform:scaleX(1)}
      .mega-chevron{font-size:9px;transition:transform .22s cubic-bezier(.2,.8,.2,1)}
      .mega-trigger[aria-expanded="true"] .mega-chevron{transform:rotate(180deg)}
      .mega-panel{position:absolute;z-index:80;top:76px;left:50%;width:min(1180px,calc(100% - 56px));transform:translateX(-50%);padding:0 26px 22px;background:rgba(251,250,248,.98);border:1px solid #d7d3cc;border-top:0;border-radius:0 0 12px 12px;box-shadow:0 22px 55px rgba(23,21,19,.12);backdrop-filter:blur(18px);animation:mega-in .24s cubic-bezier(.2,.8,.2,1)}
      .mega-inner{padding:22px 0 0;display:grid;grid-template-columns:1.15fr 1.15fr 1fr 1fr;gap:26px}
      .mega-column{min-width:0}
      .mega-label{margin:0 0 10px;color:#1f4d3a;font-size:8px;font-weight:800;letter-spacing:.15em;text-transform:uppercase}
      .mega-links{display:grid;gap:5px}
      .mega-links a{font-family:Georgia,"Times New Roman",serif;font-size:14px;line-height:1.15;color:#1f4d3a;transition:color .18s ease,transform .18s ease}
      .mega-links a:hover{color:#163a2c;transform:translateX(3px)}
      .mega-feature{padding:14px 16px;background:#e9e5df;border:1px solid #d5d0c8;border-radius:8px;align-self:start}
      .mega-feature p{margin:0 0 8px;color:var(--muted);font-size:9px;line-height:1.45}
      .mega-feature a{color:#1f4d3a;font-size:9px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}
      .mega-mobile-button,.mobile-menu{display:none}

      .menu-sunflower{display:inline-block;width:17px;height:22px;flex:0 0 17px;overflow:visible;pointer-events:none;vertical-align:middle}
      .menu-sunflower svg{display:block;width:100%;height:100%;overflow:visible}
      .sunflower-grow{transform-box:fill-box;transform-origin:center bottom;animation:sunflower-grow 3.4s cubic-bezier(.45,0,.2,1) infinite}
      .sunflower-bloom{transform-box:fill-box;transform-origin:center;animation:sunflower-bloom 3.4s ease-in-out infinite}
      .sunflower-stem{fill:none;stroke:#111;stroke-width:1.7;stroke-linecap:round}
      .sunflower-leaf{fill:#111;stroke:#111;stroke-width:.6}
      .sunflower-petal{fill:#ffd21f;stroke:#b88900;stroke-width:.45}
      .sunflower-center{fill:#111}

      @keyframes mega-in{from{opacity:0;transform:translate(-50%,-10px) scale(.985)}to{opacity:1;transform:translate(-50%,0) scale(1)}}
      @keyframes sunflower-grow{0%,10%{opacity:0;transform:scaleY(0)}28%,68%{opacity:1;transform:scaleY(1)}90%,100%{opacity:0;transform:scaleY(0)}}
      @keyframes sunflower-bloom{0%,22%{opacity:0;transform:scale(.3) rotate(-6deg)}36%,68%{opacity:1;transform:scale(1) rotate(0)}86%,100%{opacity:0;transform:scale(.25) rotate(5deg)}}

      @media(max-width:900px){
        .mega-desktop{display:none}
        .mega-mobile-button{display:inline-flex;align-items:center;gap:5px;min-height:44px;padding:8px 2px;color:#1f4d3a;font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap}
        .mega-mobile-button .menu-sunflower{width:17px;height:21px;flex-basis:17px}

        .mobile-menu,.mobile-menu *{box-sizing:border-box}
        .mobile-menu{display:flex;position:fixed;z-index:200;inset:0;width:100%;max-width:100vw;height:100dvh;flex-direction:column;overflow:hidden;overscroll-behavior:none;touch-action:pan-y;background:#f5f4f1;color:#1c1d1b;animation:mobile-menu-in .2s ease-out}
        .mobile-menu-head{flex:0 0 auto;display:flex;align-items:center;justify-content:space-between;width:100%;max-width:100%;min-width:0;min-height:72px;padding:10px 18px;border-bottom:1px solid #d7d3cc;background:#f5f4f1;overflow:hidden}
        .mobile-menu-brand{display:grid;gap:3px;min-width:0}
        .mobile-menu-brand strong{font-family:Georgia,"Times New Roman",serif;font-size:19px;font-weight:500;letter-spacing:.05em}
        .mobile-menu-brand span{font-size:8px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#77716a}
        .mobile-menu-close{flex:0 0 44px;display:grid;place-items:center;width:44px;height:44px;border:1px solid #d3cec6;border-radius:50%;background:#fff;color:#214d39;font-size:22px;line-height:1}

        .mobile-menu-body{flex:1;min-width:0;min-height:0;width:100%;max-width:100%;overflow-y:auto;overflow-x:hidden;overscroll-behavior-x:none;overscroll-behavior-y:contain;touch-action:pan-y;padding:16px 16px 22px;-webkit-overflow-scrolling:touch}
        .mobile-menu-body>*{max-width:100%;min-width:0}
        .mobile-menu-intro{display:block;box-sizing:border-box;width:100%;max-width:none;margin:0 0 14px;padding:0 4px 0 0;color:#77716a;font-size:10px;line-height:1.55;white-space:normal!important;word-break:normal!important;overflow-wrap:normal!important;overflow:visible!important;text-overflow:clip!important}

        .mobile-menu-sections{display:grid;width:100%;max-width:100%;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin-bottom:14px;overflow:hidden}
        .mobile-menu-tab{min-width:0;max-width:100%;display:flex;align-items:center;justify-content:space-between;min-height:62px;padding:12px 13px;border:1px solid #d8d4cd;border-radius:11px;background:#fbfaf8;color:#292a27;text-align:left;font-family:Georgia,"Times New Roman",serif;font-size:15px;box-shadow:0 1px 0 rgba(20,20,20,.02);overflow:hidden}
        .mobile-menu-tab span:first-child{min-width:0;overflow:hidden;text-overflow:ellipsis}
        .mobile-menu-tab span:last-child{flex:0 0 25px;display:grid;place-items:center;width:25px;height:25px;border-radius:50%;background:#ece9e3;color:#315642;font-family:Arial,sans-serif;font-size:13px}
        .mobile-menu-tab[aria-selected="true"]{border-color:#28513e;background:#28513e;color:#fff;box-shadow:0 6px 18px rgba(31,77,58,.13)}
        .mobile-menu-tab[aria-selected="true"] span:last-child{background:rgba(255,255,255,.16);color:#fff}

        .mobile-menu-panel{width:100%;max-width:100%;min-width:0;border:1px solid #d7d3cc;border-radius:13px;background:#fff;overflow:hidden}
        .mobile-menu-panel-head{max-width:100%;padding:14px 15px 11px;border-bottom:1px solid #e2ded7;background:#f0eee9;overflow:hidden}
        .mobile-menu-panel-head span{display:block;margin-bottom:3px;color:#315642;font-size:8px;font-weight:850;letter-spacing:.14em;text-transform:uppercase}
        .mobile-menu-panel-head strong{font-family:Georgia,"Times New Roman",serif;font-size:18px;font-weight:500}
        .mobile-menu-links{display:grid;width:100%;max-width:100%;min-width:0;grid-template-columns:repeat(2,minmax(0,1fr));gap:1px;padding:7px;background:#e8e4de;overflow:hidden}
        .mobile-menu-links a{min-width:0;max-width:100%;display:flex;align-items:center;min-height:47px;padding:10px 11px;background:#fff;color:#315642;font-size:11px;font-weight:700;line-height:1.3;overflow-wrap:anywhere}
        .mobile-menu-links a:nth-child(1){border-radius:7px 0 0 0}
        .mobile-menu-links a:nth-child(2){border-radius:0 7px 0 0}
        .mobile-menu-links a:active{background:#eeece7}
        .mobile-menu-all{display:flex!important;grid-column:1/-1!important;justify-content:space-between!important;border-radius:0 0 7px 7px!important;background:#f6f4f0!important;font-weight:800!important}

        .mobile-menu-shortcuts{display:grid;width:100%;max-width:100%;min-width:0;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:14px;overflow:hidden}
        .mobile-menu-shortcuts a{min-width:0;display:flex;align-items:center;justify-content:center;min-height:46px;padding:9px;border:1px solid #d7d3cc;border-radius:9px;background:#fbfaf8;color:#315642;font-size:10px;font-weight:800;text-align:center;overflow-wrap:anywhere}
        .mobile-menu-shortcuts .primary{grid-column:1/-1;background:#1f4d3a;color:#fff;border-color:#1f4d3a}
      }

      @media(max-width:390px){
        .mobile-menu-head{padding-left:14px;padding-right:14px}
        .mobile-menu-body{padding-left:12px;padding-right:12px}
        .mobile-menu-intro{font-size:9.5px;line-height:1.55;padding-right:2px}
        .mobile-menu-tab{min-height:58px;padding:10px;font-size:14px}
        .mobile-menu-links a{min-height:45px;padding:9px;font-size:10px}
      }

      @keyframes mobile-menu-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
      @media(prefers-reduced-motion:reduce){.mega-panel,.mobile-menu{animation:none}.mega-chevron{transition:none}.sunflower-grow,.sunflower-bloom{animation:none;opacity:1;transform:none}}
    `}</style>

    <div className="mega-desktop" onMouseEnter={cancelClose} onMouseLeave={scheduleClose}>
      <span className="mega-desktop-menu-mark">Menu <SunflowerMark /></span>
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

    <button className="mega-mobile-button" type="button" aria-expanded={mobileOpen} aria-controls="mobile-navigation" onClick={() => setMobileOpen(true)}>
      Menu <SunflowerMark />
    </button>

    {mobileOpen && <div className="mobile-menu" id="mobile-navigation" role="dialog" aria-modal="true" aria-label="Main menu">
      <div className="mobile-menu-head">
        <div className="mobile-menu-brand"><strong>MAYALINES</strong><span>Explore the library</span></div>
        <button ref={closeButton} className="mobile-menu-close" type="button" aria-label="Close menu" onClick={closeMenu}>×</button>
      </div>

      <div className="mobile-menu-body">
        <p className="mobile-menu-intro">Choose a section. Only one section opens at a time.</p>

        <div className="mobile-menu-sections" role="tablist" aria-label="Menu sections">
          <button className="mobile-menu-tab" type="button" role="tab" aria-selected={mobileSection === "quotes"} onClick={() => setMobileSection("quotes")}><span>Quotes</span><span>01</span></button>
          <button className="mobile-menu-tab" type="button" role="tab" aria-selected={mobileSection === "topics"} onClick={() => setMobileSection("topics")}><span>Topics</span><span>02</span></button>
          <button className="mobile-menu-tab" type="button" role="tab" aria-selected={mobileSection === "authors"} onClick={() => setMobileSection("authors")}><span>Authors</span><span>03</span></button>
          <button className="mobile-menu-tab" type="button" role="tab" aria-selected={mobileSection === "collections"} onClick={() => setMobileSection("collections")}><span>Collections</span><span>04</span></button>
        </div>

        {mobileSection === "quotes" && <section className="mobile-menu-panel" role="tabpanel">
          <div className="mobile-menu-panel-head"><span>01 · Quotes</span><strong>Discover quotes</strong></div>
          <div className="mobile-menu-links"><a href="/popular" onClick={closeMenu}>Popular Quotes</a><a href="/trending" onClick={closeMenu}>Trending Quotes</a><a href="/most-copied" onClick={closeMenu}>Most Copied</a><a href="/random" onClick={closeMenu}>Random Quote</a><a href="/collections/short-inspirational-quotes" onClick={closeMenu}>Short Quotes</a><a href="/collections/quotes-about-love" onClick={closeMenu}>Love Quotes</a><a className="mobile-menu-all" href="/" onClick={closeMenu}>Open Quote Library <span>→</span></a></div>
        </section>}

        {mobileSection === "topics" && <section className="mobile-menu-panel" role="tabpanel">
          <div className="mobile-menu-panel-head"><span>02 · Topics</span><strong>Browse by topic</strong></div>
          <div className="mobile-menu-links">{topics.map(([label,url])=><a key={url} href={url} onClick={closeMenu}>{label}</a>)}<a className="mobile-menu-all" href="/topics" onClick={closeMenu}>All Topics <span>→</span></a></div>
        </section>}

        {mobileSection === "authors" && <section className="mobile-menu-panel" role="tabpanel">
          <div className="mobile-menu-panel-head"><span>03 · Authors</span><strong>Popular authors</strong></div>
          <div className="mobile-menu-links">{popularAuthors.map(([label,url])=><a key={url} href={url} onClick={closeMenu}>{label}</a>)}<a className="mobile-menu-all" href="/authors" onClick={closeMenu}>All Authors <span>→</span></a></div>
        </section>}

        {mobileSection === "collections" && <section className="mobile-menu-panel" role="tabpanel">
          <div className="mobile-menu-panel-head"><span>04 · Collections</span><strong>Curated collections</strong></div>
          <div className="mobile-menu-links">{collections.map(([label,url])=><a key={url} href={url} onClick={closeMenu}>{label}</a>)}<a className="mobile-menu-all" href="/collections" onClick={closeMenu}>All Collections <span>→</span></a></div>
        </section>}

        <div className="mobile-menu-shortcuts">
          <a href="/poems" onClick={closeMenu}>Famous Poems</a>
          <a href="/community" onClick={closeMenu}>Community Quotes</a>
          <a className="primary" href="/submit" onClick={closeMenu}>Submit a Quote →</a>
        </div>
      </div>
    </div>}
  </>;
}
