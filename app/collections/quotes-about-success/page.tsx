import type { Metadata } from "next";
import Link from "next/link";
import QuoteCopyButton from "@/components/QuoteCopyButton";

export const metadata: Metadata = {
  title: "Success Quotes",
  description: "Thoughtful quotes about success, achievement, ambition and perseverance from notable authors.",
  alternates: { canonical: "https://mayalines.com/collections/quotes-about-success" },
};

const quotes = [
  { text: "Success is to be measured not so much by the position that one has reached in life as by the obstacles which he has overcome.", author: "Booker T. Washington" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas Edison" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
];

export default function SuccessQuotesPage() {
  return (
    <main className="page">
      <style>{`.page{min-height:100vh;background:#d8d5cf;color:#171513}.wrap{width:min(980px,calc(100% - 36px));margin:auto}.head{padding:42px 0 28px;border-bottom:1px solid #bdb8af}.head a,.eyebrow,.author,.related a{color:#674934;font:750 10px Inter,system-ui,sans-serif;text-transform:uppercase;letter-spacing:.09em}.eyebrow{margin:28px 0 12px;font-size:10px;letter-spacing:.18em}.head h1{margin:0;font:500 clamp(48px,8vw,84px)/.94 Georgia,serif;letter-spacing:-.05em}.intro{max-width:700px;color:#4d4842;font:16px/1.7 Inter,system-ui,sans-serif}.list{display:grid;gap:18px;padding:54px 0}.card{background:#e7e4de;border:1px solid #bdb8af;border-radius:7px;padding:28px 30px}.card blockquote{margin:0;font:400 clamp(24px,3.2vw,38px)/1.18 Georgia,serif}.by{margin:18px 0 0;font:700 12px Inter,system-ui,sans-serif}.actions{display:flex;justify-content:space-between;align-items:center;margin-top:20px;padding-top:14px;border-top:1px solid #c9c4bc}.related{padding:34px 0 70px;border-top:1px solid #bdb8af}.related h2{font:500 36px Georgia,serif}.related a{margin-right:18px}@media(max-width:560px){.card{padding:22px}}`}</style>
      <div className="wrap">
        <header className="head"><Link href="/">← MAYALINES</Link><p className="eyebrow">CURATED COLLECTION</p><h1>Success Quotes</h1><p className="intro">Words about achievement, ambition, discipline and perseverance for moments when progress matters more than perfection.</p></header>
        <section className="list">{quotes.map((q) => <article className="card" key={q.text}><blockquote>“{q.text}”</blockquote><p className="by">— {q.author}</p><div className="actions"><Link className="author" href={`/authors/${q.author.toLowerCase().replaceAll(" ", "-")}`}>Author</Link><QuoteCopyButton quote={q.text} author={q.author} /></div></article>)}</section>
        <section className="related"><h2>Explore more</h2><Link href="/collections/quotes-about-life">Life Quotes</Link><Link href="/collections/quotes-about-love">Love Quotes</Link><Link href="/collections/quotes-about-motivation">Motivation Quotes</Link></section>
      </div>
    </main>
  );
}
