import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quote Collections | MAYALINES",
  description: "Explore curated collections of famous quotes about life, love, success, motivation, wisdom and more.",
  alternates: { canonical: "https://mayalines.com/collections" },
  openGraph: {
    title: "Quote Collections | MAYALINES",
    description: "Curated quote collections for life, love, success, motivation and wisdom.",
    images: [{ url: "/mayalines-poetry.svg", width: 1200, height: 675, alt: "MAYALINES curated words illustration" }],
  },
};

const collections = [
  { slug: "quotes-about-life", title: "Quotes About Life", description: "Thoughtful words about life, experience, change and the way we choose to live.", category: "Life" },
  { slug: "famous-love-quotes", title: "Famous Love Quotes", description: "Memorable words about love, affection, devotion and human connection.", category: "Love" },
  { slug: "quotes-about-success", title: "Quotes About Success", description: "Perspectives on achievement, ambition, work, discipline and success.", category: "Success" },
  { slug: "motivational-quotes", title: "Motivational Quotes", description: "Words about courage, action, persistence and moving forward.", category: "Motivation" },
  { slug: "wisdom-quotes", title: "Wisdom Quotes", description: "Timeless observations from writers and thinkers on character, knowledge and life.", category: "Wisdom" },
  { slug: "short-inspirational-quotes", title: "Short Inspirational Quotes", description: "Concise, memorable lines for moments when a few words are enough.", category: "Inspiration", short: true },
];

export default function CollectionsPage() {
  return <main className="collections-page">
    <style>{`.collections-page{min-height:100vh;background:#d8d5cf;color:#171513}.collections-wrap{width:min(1180px,calc(100% - 36px));margin:0 auto}.collections-header{padding:28px 0;border-bottom:1px solid #bdb8af;display:flex;align-items:center;justify-content:space-between}.collections-brand{font:500 25px Georgia,serif;letter-spacing:.13em}.collections-nav{display:flex;gap:22px;color:#5f5a53;font:12px Inter,system-ui,sans-serif}.collections-nav a:hover,.collection-link:hover{color:#765843}.collections-hero{padding:76px 0 58px;display:grid;grid-template-columns:minmax(0,1fr) 360px;gap:58px;align-items:center}.eyebrow{margin:0 0 14px;color:#765843;font:750 9px/1 Inter,system-ui,sans-serif;letter-spacing:.19em}.collections-hero h1{margin:0;font:500 clamp(48px,7vw,82px)/.95 Georgia,serif;letter-spacing:-.05em}.collections-hero p:not(.eyebrow){max-width:690px;margin:24px 0 0;color:#48433d;font:16px/1.65 Inter,system-ui,sans-serif}.collections-visual{width:100%;aspect-ratio:16/9;border:1px solid #bdb8af;border-radius:8px;overflow:hidden;background:#e7e4de;box-shadow:0 16px 36px rgba(23,21,19,.06)}.collections-visual img{display:block;width:100%;height:100%;object-fit:cover}.collection-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;padding-bottom:78px}.collection-card{min-height:245px;padding:28px;border:1px solid #bdb8af;border-radius:7px;background:#e7e4de;display:flex;flex-direction:column;box-shadow:0 8px 24px rgba(23,21,19,.035);transition:transform .15s ease,box-shadow .15s ease}.collection-card:hover{transform:translateY(-2px);box-shadow:0 12px 28px rgba(23,21,19,.06)}.collection-card h2{margin:12px 0 0;font:500 30px/1.08 Georgia,serif;letter-spacing:-.025em}.collection-card p:not(.eyebrow){margin:16px 0 0;color:#5f5a53;font:14px/1.6 Inter,system-ui,sans-serif}.collection-link{margin-top:auto;padding-top:24px;color:#765843;font:750 10px Inter,system-ui,sans-serif;letter-spacing:.09em;text-transform:uppercase}.collections-footer{padding:24px 0;border-top:1px solid #bdb8af;color:#5f5a53;font:10px Inter,system-ui,sans-serif}.collections-footer a{text-decoration:underline;text-underline-offset:3px}@media(max-width:900px){.collections-hero{grid-template-columns:1fr;gap:32px}.collection-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:560px){.collections-header{align-items:flex-start;gap:18px;flex-direction:column}.collections-nav{width:100%;justify-content:space-between}.collections-hero{padding-top:56px}.collection-grid{grid-template-columns:1fr}.collection-card{min-height:220px}}`}</style>
    <div className="collections-wrap">
      <header className="collections-header"><a href="/" className="collections-brand">MAYALINES</a><nav className="collections-nav" aria-label="Collections navigation"><a href="/">Quotes</a><a href="/authors">Authors</a><a href="/poems">Poems</a></nav></header>
      <section className="collections-hero"><div><p className="eyebrow">MAYALINES · CURATED COLLECTIONS</p><h1>Quotes worth returning to.</h1><p>Focused collections make it easier to find the right words for a moment, a subject or a search. Every collection links back to the broader MAYALINES quote library.</p></div><figure className="collections-visual"><img src="/mayalines-poetry.svg" alt="Minimal paper and ink illustration for MAYALINES quote collections" width="1200" height="675" /></figure></section>
      <section className="collection-grid" aria-label="Quote collections">{collections.map((collection) => <article className="collection-card" key={collection.slug}><p className="eyebrow">COLLECTION</p><h2>{collection.title}</h2><p>{collection.description}</p><a className="collection-link" href={`/collections/${collection.slug}`}>Explore collection →</a></article>)}</section>
      <footer className="collections-footer"><a href="/">Back to famous quotes</a></footer>
    </div>
  </main>;
}
