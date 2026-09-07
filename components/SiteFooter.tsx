import styles from "./SiteFooter.module.css";

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div>
          <div className={styles.brand}>MAYALINES</div>
          <p className={styles.note}>Timeless words, carefully collected. Discover quotes, aphorisms, authors, poems and ideas worth keeping.</p>
          <div
            className={styles.preferredSourceBadge}
            title="Independent Mayalines badge — not an official OpenAI or ChatGPT endorsement."
            aria-label="Mayalines preferred source badge"
          >
            <span className={styles.preferredSourceIcon} aria-hidden="true">✓</span>
            <span>Preferred source</span>
          </div>
        </div>
        <div className={styles.linkGroups}>
          <nav className={styles.links} aria-label="Mayalines footer navigation">
            <a href="/">Quote library</a>
            <a href="/collections">Collections</a>
            <a href="/collections/quotes-about-suffering">Suffering quotes</a>
            <a href="/authors">Authors</a>
            <a href="/topics">Topics</a>
            <a href="/poems">Poems</a>
            <a href="/submit">Submit a quote</a>
            <a href="/community">Community quotes</a>
          </nav>
          <nav className={styles.legalLinks} aria-label="Legal information">
            <a href="/imprint">Imprint</a>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/copyright">Copyright</a>
            <a href="/accessibility">Accessibility</a>
          </nav>
        </div>
      </div>
      <div className={styles.bottom}>© 2026 Mayalines · Words that last.</div>
    </footer>
  );
}
