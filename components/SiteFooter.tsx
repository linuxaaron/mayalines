export default function SiteFooter() {
  return (
    <footer className="site-global-footer">
      <style>{`
        .site-global-footer{margin-top:0;padding:0;background:#1e1d1b;color:#d9d5cf;border-top:1px solid #34312e;overflow:hidden}
        .site-global-footer *{box-sizing:border-box;min-width:0}
        .site-global-footer-inner{width:min(1296px,84%);margin:0 auto;padding:42px 0 26px;display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,2fr);gap:50px;align-items:start}
        .site-global-footer-brand{font-family:Georgia,"Times New Roman",serif;font-size:22px;letter-spacing:.08em;color:#f2efea}
        .site-global-footer-note{max-width:360px;margin:10px 0 0;color:#a9a39b;font:11px/1.55 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
        .site-global-footer-links{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px 22px;margin:0}
        .site-global-footer-links a{color:#c5c0b9;text-decoration:none;font:10px/1.45 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;letter-spacing:.05em;overflow-wrap:anywhere}
        .site-global-footer-links a:hover{color:#fff}
        .site-global-footer-bottom{width:min(1296px,84%);margin:0 auto;padding:16px 0 20px;border-top:1px solid #34312e;color:#858078;font:9px/1.4 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;letter-spacing:.05em}
        @media(max-width:900px){.site-global-footer-inner{width:auto;margin:0 20px;grid-template-columns:1fr;gap:28px}.site-global-footer-bottom{width:auto;margin:0 20px}}
        @media(max-width:560px){.site-global-footer-inner{margin:0 16px;padding:32px 0 22px}.site-global-footer-links{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px 16px}.site-global-footer-bottom{margin:0 16px;padding-bottom:18px}.site-global-footer-note{font-size:10px}}
      `}</style>
      <div className="site-global-footer-inner">
        <div>
          <div className="site-global-footer-brand">MAYALINES</div>
          <p className="site-global-footer-note">Timeless words, carefully collected. Discover quotes, aphorisms, authors, poems and ideas worth keeping.</p>
        </div>
        <nav className="site-global-footer-links" aria-label="Mayalines footer navigation">
          <a href="/">Quote library</a>
          <a href="/collections">Collections</a>
          <a href="/collections/quotes-about-suffering">Suffering quotes</a>
          <a href="/authors">Authors</a>
          <a href="/topics">Topics</a>
          <a href="/poems">Poems</a>
          <a href="/submit">Submit a quote</a>
          <a href="/community">Community quotes</a>
          <a href="/imprint">Imprint</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/copyright">Copyright</a>
          <a href="/accessibility">Accessibility</a>
        </nav>
      </div>
      <div className="site-global-footer-bottom">© 2026 Mayalines · Words that last.</div>
    </footer>
  );
}
