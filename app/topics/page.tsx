import Link from "next/link";
import { quoteTopics } from "../../lib/quote-topics";

export const metadata = {
  title: "Quote Topics — Love, Life, Wisdom, Success & More",
  description: "Browse famous quotes by topic, including love, life, wisdom, success, motivation, courage, happiness and more.",
  alternates: { canonical: "https://mayalines.com/topics" },
};

export default function TopicsPage() {
  return <main className="site-shell"><header className="header"><a className="brand" href="/"><span className="brand-name">MAYALINES</span></a><div className="header-rule"/><nav className="nav"><a href="/">Quotes</a><a href="/popular">Popular</a><a href="/trending">Trending</a><a href="/topics" aria-current="page">Topics</a><a href="/authors">Authors</a><a href="/poems">Poems</a></nav></header><section className="hero"><p className="eyebrow">MAYALINES · QUOTE TOPICS</p><h1>Explore Quotes by Topic</h1><p className="hero-copy">Find memorable words by subject and search intent. Browse quotes about love, life, wisdom, success, motivation, courage, happiness, friendship, freedom, philosophy and truth.</p></section><section className="library"><div className="topic-grid">{quoteTopics.map((topic) => <Link className="topic-card" key={topic.slug} href={`/topics/${topic.slug}`}><span className="eyebrow">TOPIC</span><strong>{topic.label} Quotes</strong><p>{topic.description}</p><span className="topic-arrow">Explore →</span></Link>)}</div></section><footer className="footer">© 2026 Mayalines</footer></main>;
}
