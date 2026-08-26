import { notFound } from "next/navigation";
import QuoteResults from "../../../components/QuoteResults";
import quotesData from "../../../data/quotes";
import { quoteTopics, topicForQuote } from "../../../lib/quote-topics";

export const dynamicParams = false;

export function generateStaticParams() {
  return quoteTopics.map((topic) => ({ topic: topic.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }) {
  const { topic: slug } = await params;
  const topic = quoteTopics.find((item) => item.slug === slug);
  if (!topic) return {};
  return { title: `${topic.label} Quotes — Famous & Inspirational | MAYALINES`, description: topic.description, alternates: { canonical: `https://mayalines.com/topics/${topic.slug}` } };
}

export default async function TopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic: slug } = await params;
  const topic = quoteTopics.find((item) => item.slug === slug);
  if (!topic) notFound();
  const quotes = quotesData.filter((quote) => quote.indexable !== false && topicForQuote(quote).includes(topic.slug)).slice(0, 120);

  return <main className="site-shell"><header className="header"><a className="brand" href="/"><span className="brand-name">MAYALINES</span></a><div className="header-rule"/><nav className="nav"><a href="/">Quotes</a><a href="/popular">Popular</a><a href="/trending">Trending</a><a href="/topics">Topics</a><a href="/authors">Authors</a><a href="/poems">Poems</a></nav></header><section className="hero"><p className="eyebrow">MAYALINES · TOPIC</p><h1>{topic.label} Quotes</h1><p className="hero-copy">{topic.description} Discover sourced words from notable writers and thinkers, then copy the quotes you want to keep.</p></section><section className="library"><div className="section-heading">{topic.label} quotes</div><p className="library-meta">{quotes.length.toLocaleString("en-US")} selected quotes</p><QuoteResults quotes={quotes}/></section><footer className="footer">© 2026 Mayalines</footer></main>;
}
