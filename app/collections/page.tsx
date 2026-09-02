import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Quote Collections – Love, Hope, Pain, Healing & Strength Quotes",
  description: "Explore curated quote collections including love quotes, hope quotes, pain quotes, healing quotes, sad quotes, strength quotes and positive quotes.",
  alternates: { canonical: "https://mayalines.com/collections" },
  openGraph: {
    title: "Quote Collections | MAYALINES",
    description: "Curated quote collections about life, love, hope, pain, healing, strength, positivity, famous authors and more.",
    images: [{ url: "/mayalines-poetry.svg", width: 1200, height: 675, alt: "MAYALINES curated words illustration" }],
  },
};

const collections = [
  { slug: "quotes-about-life", title: "Quotes About Life", description: "Thoughtful words about life, experience, change and the way we choose to live." },
  { slug: "quotes-about-love", title: "Love Quotes", description: "Memorable words about love, affection, devotion and human connection." },
  { slug: "quotes-about-hope", title: "Hope Quotes", description: "Quotes about hope, renewal, optimism, perseverance and difficult times." },
  { slug: "quotes-about-suffering", title: "Suffering Quotes", description: "Quotes about suffering, hardship, grief, resilience and finding meaning through difficult moments." },
  { slug: "pain-quotes", title: "Pain Quotes", description: "Quotes about emotional pain, hurt, struggle, endurance and difficult experiences." },
  { slug: "healing-quotes", title: "Healing Quotes", description: "Quotes about healing, recovery, resilience, peace, growth and moving forward." },
  { slug: "sad-quotes", title: "Sad Quotes", description: "Quotes about sadness, loneliness, heartbreak, loss, grief and sorrow." },
  { slug: "strength-quotes", title: "Strength Quotes", description: "Quotes about strength, resilience, courage, endurance and overcoming adversity." },
  { slug: "positive-quotes", title: "Positive Quotes", description: "Positive quotes about optimism, gratitude, happiness, hope and confidence." },
  { slug: "quotes-about-success", title: "Quotes About Success", description: "Perspectives on achievement, ambition, work, discipline and success." },
  { slug: "quotes-about-motivation", title: "Motivational Quotes", description: "Words about courage, action, persistence and moving forward." },
  { slug: "quotes-about-wisdom", title: "Wisdom Quotes", description: "Timeless observations on character, knowledge, perspective and life." },
  { slug: "short-inspirational-quotes", title: "Short Inspirational Quotes", description: "Concise, memorable lines for moments when a few words are enough." },
  { slug: "quotes-about-friendship", title: "Friendship Quotes", description: "Quotes about loyalty, trust, companionship and lasting friendships." },
  { slug: "quotes-about-courage", title: "Courage Quotes", description: "Words about bravery, fear, resilience and finding the strength to act." },
  { slug: "quotes-about-happiness", title: "Happiness Quotes", description: "Quotes about joy, contentment and meaningful living." },
];

export default function CollectionsPage() {
  return <main className="collections-page">
    <style>{`
      .collections-page,.collections-page *{box-sizing:border-box}.collections-page{width:100%;max-width:100%;min-height:100vh;overflow-x:clip;background:#d8d5cf;color:#171513}.collections-page *{min-width:0}.collections-wrap{width:min(1180px,calc(100% - 36px));max-width:100%;margin:0 auto;overflow:hidden}.collections-header{padding:28px 0;border-bottom:1px solid #bdb8af;display:flex;align-items:center;justify-content:space-between;gap:24px}.collections-brand{font:500 25px Georgia,serif;letter-spacing:.13em;white-space:nowrap}.collections-nav{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:14px 22px;color:#5f5a53;font:12px Inter,system-ui,sans-serif}.collections-nav a:hover,.collection-link:hover{color:#765843}.collections-hero{padding:76px 0 58px;display:grid;grid-template-columns:minmax(0,1fr) minmax(240px,360px);gap:58px;align-items:center}.eyebrow{margin:0 0 14px;color:#765843;font:750 9px/1 Inter,system-ui,sans-serif;letter-spacing:.19em}.collections-hero h1{max-width:100%;margin:0;font:500 clamp(44px,7vw,82px)/.95 Georgia,serif;letter-spacing:-.05em;overflow-wrap:break-word}.collections-hero p:not(.eyebrow){max-width:690px;margin:24px 0 0;color:#48433d;font:16px/1.65 Inter,system-ui,sans-serif}.collections-visual{width:100%;max-width:100%;aspect-ratio:16/9;margin:0;border:1px solid #bdb8af;border-radius:8px;overflow:hidden;background:#e7e4de;box-shadow:0 16px 36px rgba(23,21,19,.06)}.collections-visual img{display:block;width:100%;max-width:100%;height:100%;object-fit:cover}.collection-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;padding-bottom:78px}.collection-card{min-height:245px;max-width:100%;padding:28px;border:1px solid #bdb8af;border-radius:7px;background:#e7e4de;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 8px 24px rgba(23,21,19,.035);transition:transform .15s ease,box-shadow .15s ease}.collection-card:hover{transform:translateY(-2px);box-shadow:0 12px 28px rgba(23,21,19,.06)}.collection-card h2{margin:12px 0 0;font:500 30px/1.08 Georgia,serif;letter-spacing:-.025em;overflow-wrap:break-word}.collection-card p:not(.eyebrow){margin:16px 0 0;color:#5f5a53;font:14px/1.6 Inter,system-ui,sans-serif;overflow-wrap:break-word}.collection-link{margin-top:auto;padding-top:24px;color:#765843;font:750 10px Inter,system-ui,sans-serif;letter-spacing:.09em;text-transform:uppercase;overflow-wrap:anywhere}@media(max-width:900px){.collections-hero{grid-template-columns:1fr;gap:32px;padding-top:58px}.collections-visual{max-width:680px}.collection-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:560px){.collections-page{overflow-x:hidden}.collections-wrap{width:calc(100% - 28px);margin:0 14px}.collections-header{padding:20px 0;align-items:flex-start;gap:15px;flex-direction:column}.collections-brand{font-size:21px}.collections-nav{width:100%;justify-content:flex-start;gap:10px 18px;font-size:11px}.collections-hero{padding:42px 0 36px;gap:24px}.collections-hero h1{font-size:clamp(38px,12vw,54px);line-height:1;letter-spacing:-.04em}.collections-hero p:not(.eyebrow){margin-top:18px;font-size:14px;line-height:1.6}.collections-visual{border-radius:6px}.collection-grid{grid-template-columns:minmax(0,1fr);gap:12px;padding-bottom:48px}.collection-card{width:100%;min-height:190px;padding:22px 20px}.collection-card h2{font-size:25px}.collection-card p:not(.eyebrow){font-size:13px;line-height:1.55}}
    `}</style>
    <div className="collections-wrap">
      <header className="collections-header"><a href="/" className="collections-brand">MAYALINES</a><nav className="collections-nav" aria-label="Collections navigation"><a href="/">Quotes</a><a href="/authors">Authors</a><a href="/poems">Poems</a></nav></header>
      <section className="collections-hero"><div><p className="eyebrow">MAYALINES · CURATED COLLECTIONS</p><h1>Quotes worth returning to.</h1><p>Explore focused collections of famous quotes, love quotes, hope quotes, pain quotes, healing quotes, strength quotes, positive quotes and timeless words by author or topic.</p></div><figure className="collections-visual"><Image src="/mayalines-poetry.svg" alt="Minimal paper and ink illustration for MAYALINES quote collections" width={1200} height={675} sizes="(max-width: 900px) 100vw, 360px" /></figure></section>
      <section className="collection-grid" aria-label="Quote collections">{collections.map((collection) => <article className="collection-card" key={collection.slug}><p className="eyebrow">COLLECTION</p><h2>{collection.title}</h2><p>{collection.description}</p><a className="collection-link" href={`/collections/${collection.slug}`}>Explore collection →</a></article>)}</section>
    </div>
  </main>;
}
