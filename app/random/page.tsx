import quotesData from "../../data/quotes";
import RandomQuoteCard from "../../components/RandomQuoteCard";
import { isPublicQuote } from "../../lib/seo";

export default function RandomPage() {
  const quote = quotesData.find(isPublicQuote);
  if (!quote) return <main className="site-shell"><p className="legal-warning">No verified quotes are currently available.</p></main>;

  return <main className="site-shell"><header className="header"><a className="brand" href="/"><span className="brand-name">MAYALINES</span></a><div className="header-rule"/><nav className="nav" aria-label="Primary navigation"><a href="/">Quotes</a><a href="/popular">Popular</a><a href="/trending">Trending</a><a href="/topics">Topics</a><a href="/random" aria-current="page">Random</a></nav></header><RandomQuoteCard initialQuote={{ id: quote.id, quote: quote.quote, author: quote.author }} /></main>;
}
