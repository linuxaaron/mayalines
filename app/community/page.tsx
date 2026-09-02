import type { Metadata } from "next";
import { getDb } from "../../lib/db";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Community Quotes",
  description: "Discover quotes submitted by the MAYALINES community and approved by the editors.",
  alternates: { canonical: "https://mayalines.com/community" },
  robots: { index: false, follow: true },
};

type Submission = {
  id: number;
  quote: string;
  author: string;
  source: string | null;
  category: string;
  created_at: string;
};

async function getSubmissions(): Promise<Submission[]> {
  const db = getDb();
  if (!db) return [];
  return db`
    SELECT id, quote, author, source, category, created_at
    FROM quote_submissions
    WHERE status = 'approved'
    ORDER BY created_at DESC
    LIMIT 120
  ` as unknown as Promise<Submission[]>;
}

export default async function CommunityPage() {
  const submissions = await getSubmissions();

  return (
    <main className="community-page">
      <style>{`
        .community-page{min-height:100vh;background:#f4f3f0;color:#191817}
        .community-header,.community-main,.community-footer{width:min(1180px,calc(100% - 36px));margin:0 auto}
        .community-header{padding:26px 0;border-bottom:1px solid #d4d0ca;display:flex;justify-content:space-between;align-items:center;gap:24px}
        .community-brand{font:500 25px Georgia,"Times New Roman",serif;letter-spacing:.13em}
        .community-nav{display:flex;gap:22px;color:#5d554d;font:11px Inter,system-ui,sans-serif}
        .community-nav a:hover{color:#5d554d}
        .community-main{padding:70px 0 90px}
        .community-main .eyebrow{margin:0 0 14px;color:#5d554d;font:800 11px/1 Inter,system-ui,sans-serif;letter-spacing:.16em}
        .community-main h1{max-width:820px;margin:0;font:500 clamp(46px,7vw,78px)/.95 Georgia,"Times New Roman",serif;letter-spacing:-.05em}
        .community-lead{max-width:680px;margin:22px 0 0;color:#5f5a53;font:15px/1.65 Inter,system-ui,sans-serif}
        .community-meta{margin-top:18px;color:#5d554d;font:11px/1.4 Inter,system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase}
        .community-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin-top:52px}
        .community-card{position:relative;min-height:220px;padding:24px;border:1px solid #d7d3cc;border-radius:7px;background:#fbfaf8;display:flex;flex-direction:column;box-shadow:0 6px 18px rgba(30,27,24,.035)}
        .community-card:before{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:#a69b90;opacity:.55;border-radius:7px 0 0 7px}
        .community-card blockquote{margin:0;font:500 20px/1.32 Georgia,"Times New Roman",serif;letter-spacing:-.015em;color:#151413}
        .community-card footer{margin-top:auto;padding-top:20px;color:#514b45;font:700 13px/1.4 Inter,system-ui,sans-serif}
        .community-card .category{margin-top:5px;color:#5d554d;font:800 11px/1.4 Inter,system-ui,sans-serif;letter-spacing:.1em;text-transform:uppercase}
        .community-card .source{margin-top:9px;color:#716b64;font:12px/1.45 Inter,system-ui,sans-serif}
        .community-empty{margin-top:52px;padding:34px;border:1px dashed #c9c4bc;border-radius:7px;background:#fbfaf8;color:#6d6963;font:14px/1.6 Inter,system-ui,sans-serif}
        .community-cta{margin-top:64px;padding:34px 0;border-top:1px solid #d4d0ca;display:flex;justify-content:space-between;align-items:center;gap:24px}
        .community-cta h2{margin:0;font:500 31px/1 Georgia,"Times New Roman",serif;letter-spacing:-.03em}
        .community-cta p{margin:8px 0 0;color:#6d6963;font:13px/1.5 Inter,system-ui,sans-serif}
        .community-button{display:inline-flex;align-items:center;padding:12px 16px;border:1px solid #5d554d;border-radius:5px;color:#5d554d;font:800 10px Inter,system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap}
        .community-button:hover{background:#5d554d;color:#fff}
        .community-footer{padding:20px 0 28px;border-top:1px solid #d4d0ca;color:#5d554d;display:flex;justify-content:space-between;font:11px/1.4 Inter,system-ui,sans-serif;letter-spacing:.05em}
        @media(max-width:800px){.community-header{align-items:flex-start;flex-direction:column}.community-nav{width:100%;justify-content:space-between}.community-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.community-main{padding-top:52px}.community-cta{align-items:flex-start;flex-direction:column}}
        @media(max-width:560px){.community-header,.community-main,.community-footer{width:calc(100% - 32px)}.community-main{padding:44px 0 60px}.community-main h1{font-size:50px}.community-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:34px}.community-card{min-height:205px;padding:16px 14px}.community-card blockquote{font-size:16px;line-height:1.32}.community-card footer{padding-top:14px;font-size:12px}.community-card .category{font-size:11px}.community-card .source{font-size:12px}.community-cta{margin-top:44px;padding-top:26px}.community-cta h2{font-size:26px}.community-footer{flex-direction:column;gap:8px}}
      `}</style>

      <header className="community-header">
        <a className="community-brand" href="/">MAYALINES</a>
        <nav className="community-nav" aria-label="Community navigation">
          <a href="/">Quotes</a><a href="/poems">Poems</a><a href="/authors">Authors</a><a href="/categories">Categories</a><a href="/submit">Submit a quote</a>
        </nav>
      </header>

      <section className="community-main" aria-labelledby="community-title">
        <p className="eyebrow">MAYALINES · COMMUNITY</p>
        <h1 id="community-title">Words from the community.</h1>
        <p className="community-lead">A growing collection of quotations submitted by readers and approved by the MAYALINES editors. New submissions appear here after review.</p>
        <p className="community-meta">{submissions.length.toLocaleString("en-US")} published community quotes</p>

        {submissions.length > 0 ? (
          <div className="community-grid">
            {submissions.map((item) => (
              <article className="community-card" key={item.id}>
                <blockquote>“{item.quote}”</blockquote>
                <footer>
                  — {item.author}
                  <div className="category">{item.category}</div>
                  {item.source && <div className="source">Source: {item.source}</div>}
                </footer>
              </article>
            ))}
          </div>
        ) : (
          <div className="community-empty">No community quotes have been published yet. Submit a quote and it may appear here after editorial review.</div>
        )}

        <div className="community-cta">
          <div><h2>Have a quote worth keeping?</h2><p>Send it to the editors for review.</p></div>
          <a className="community-button" href="/submit">Submit a quote →</a>
        </div>
      </section>

      <footer className="community-footer"><span>© 2026 MAYALINES</span><span>Community submissions are reviewed before publication.</span></footer>
    </main>
  );
}
