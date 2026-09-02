import type { Metadata } from "next";
import Link from "next/link";
import QuoteCopyButton from "@/components/QuoteCopyButton";

export const metadata: Metadata = {
  title: "Quotes About Life",
  description: "Discover thoughtful quotes about life, purpose, change and the moments that shape us. Read and copy timeless words from notable authors.",
  alternates: { canonical: "https://mayalines.com/collections/quotes-about-life" },
  openGraph: { title: "Quotes About Life | MAYALINES", description: "Thoughtful and timeless quotes about life, purpose and change." },
};

const quotes = [
  { text: "The unexamined life is not worth living.", author: "Socrates" },
  { text: "Life must be understood backward. But it must be lived forward.", author: "Søren Kierkegaard" },
  { text: "He who has a why to live can bear almost any how.", author: "Friedrich Nietzsche" },
  { text: "The privilege of a lifetime is to become who you truly are.", author: "C. G. Jung" },
];

export default function LifeQuotesPage() {
  return <main className="collection-page"><style>{`main.collection-page{min-height:100vh;background:#d8d5cf;color:#171513}.collection-wrap{width:min(980px,calc(100% - 36px));margin:auto}.collection-header{padding:42px 0 28px;border-bottom:1px solid #bdb8af}.collection-header a{font:11px Inter,system-ui,sans-serif;color:#674934;text-transform:uppercase;letter-spacing:.1em}.eyebrow{margin:28px 0 12px;color:#674934;font:750 10px Inter,system-ui,sans-serif;letter-spacing:.18em}.collection-header h1{margin:0;font:500 clamp(48px,8vw,84px)/.94 Georgia,serif;letter-spacing:-.05em}.intro{max-width:700px;color:#4d4842;font:16px/1.7 Inter,system-ui,sans-serif;margin:22px 0 0}.quote-list{display:grid;gap:18px;padding:54px 0}.quote-card{background:#e7e4de;border:1px solid #bdb8af;border-radius:7px;padding:28px 30px}.quote-card blockquote{margin:0;font:400 clamp(24px,3.2vw,38px)/1.18 Georgia,serif;letter-spacing:-.025em}.quote-author{margin:18px 0 0;color:#514b45;font:700 12px Inter,system-ui,sans-serif}.quote-actions{display:flex;justify-content:space-between;align-items:center;margin-top:20px;padding-top:14px;border-top:1px solid #c9c4bc}.author-link{color:#674934;font:750 10px Inter,system-ui,sans-serif;text-transform:uppercase;letter-spacing:.08em}.related{padding:34px 0 70px;border-top:1px solid #bdb8af}.related h2{font:500 36px Georgia,serif}.related a{color:#674934;margin-right:18px;font:12px Inter,system-ui,sans-serif}@media(max-width:560px){.quote-card{padding:22px}.collection-header h1{font-size:54px}}`}</style><div className="collection-wrap"><header className="collection-header"><Link href="/">← MAYALINES</Link><p className="eyebrow">CURATED COLLECTION</p><h1>Quotes About Life</h1><p className="intro">Thoughtful words about living, purpose, change and the experiences that shape a life. Explore timeless quotations and copy the ones worth keeping.</p></header><section className="quote-list" aria-label="Quotes about life">{quotes.map((q)=><article className="quote-card" key={q.text}><blockquote>“{q.text}”</blockquote><p className="quote-author">— {q.author}</p><div className="quote-actions"><Link className="author-link" href={`/authors/${q.author.toLowerCase().replaceAll(" ","-").replaceAll("ø","o").replaceAll("ü","u").replaceAll(".","")}`}>Author</Link><QuoteCopyButton quote={q.text} author={q.author}/></div></article>)}</section><section className="related"><h2>Explore more</h2><Link href="/collections/quotes-about-love">Love Quotes</Link><Link href="/collections/quotes-about-success">Success Quotes</Link><Link href="/collections/quotes-about-motivation">Motivation Quotes</Link><Link href="/collections/quotes-about-wisdom">Wisdom Quotes</Link></section></div></main>;
}
