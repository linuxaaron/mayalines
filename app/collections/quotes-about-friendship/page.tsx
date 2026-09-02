import type { Metadata } from "next";
import Link from "next/link";
import QuoteCopyButton from "@/components/QuoteCopyButton";

export const metadata: Metadata = {
  title: "Friendship Quotes",
  description: "Timeless friendship quotes about loyalty, companionship, trust and the people who make life richer.",
  alternates: { canonical: "https://mayalines.com/collections/quotes-about-friendship" },
};

const quotes = [
  { text: "A friend is one that knows you as you are, understands where you have been, accepts what you have become, and still, gently allows you to grow.", author: "William Shakespeare" },
  { text: "Walking with a friend in the dark is better than walking alone in the light.", author: "Helen Keller" },
  { text: "A real friend is one who walks in when the rest of the world walks out.", author: "Walter Winchell" },
  { text: "The only way to have a friend is to be one.", author: "Ralph Waldo Emerson" },
];

export default function FriendshipQuotesPage() {
  return (
    <main className="page">
      <style>{`.page{min-height:100vh;background:#d8d5cf;color:#171513}.wrap{width:min(980px,calc(100% - 36px));margin:auto}.head{padding:42px 0 28px;border-bottom:1px solid #bdb8af}.head a,.eyebrow,.author,.related a{color:#765843;font:750 10px Inter,system-ui,sans-serif;text-transform:uppercase;letter-spacing:.09em}.eyebrow{margin:28px 0 12px;font-size:9px;letter-spacing:.18em}.head h1{margin:0;font:500 clamp(48px,8vw,84px)/.94 Georgia,serif;letter-spacing:-.05em}.intro{max-width:700px;color:#4d4842;font:16px/1.7 Inter,system-ui,sans-serif}.list{display:grid;gap:18px;padding:54px 0}.card{background:#e7e4de;border:1px solid #bdb8af;border-radius:7px;padding:28px 30px}.card blockquote{margin:0;font:400 clamp(24px,3.2vw,38px)/1.18 Georgia,serif}.by{margin:18px 0 0;font:700 12px Inter,system-ui,sans-serif}.actions{display:flex;justify-content:space-between;align-items:center;margin-top:20px;padding-top:14px;border-top:1px solid #c9c4bc}.related{padding:34px 0 70px;border-top:1px solid #bdb8af}.related h2{font:500 36px Georgia,serif}.related a{margin-right:18px}@media(max-width:560px){.card{padding:22px}}`}</style>
      <div className="wrap">
        <header className="head"><Link href="/">← MAYALINES</Link><p className="eyebrow">CURATED COLLECTION</p><h1>Friendship Quotes</h1><p className="intro">Timeless words about loyalty, companionship, trust and the people who make life richer.</p></header>
        <section className="list">{quotes.map((q) => <article className="card" key={q.text}><blockquote>“{q.text}”</blockquote><p className="by">— {q.author}</p><div className="actions"><Link className="author" href={`/authors/${q.author.toLowerCase().replaceAll(" ", "-")}`}>Author</Link><QuoteCopyButton quote={q.text} author={q.author} /></div></article>)}</section>
        <section className="related"><h2>Explore more</h2><Link href="/collections/quotes-about-life">Life Quotes</Link><Link href="/collections/quotes-about-love">Love Quotes</Link><Link href="/collections/short-inspirational-quotes">Short Inspirational Quotes</Link></section>
      </div>
    </main>
  );
}
