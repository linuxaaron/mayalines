import { notFound } from "next/navigation";
import Link from "next/link";
import QuoteResults from "../../../components/QuoteResults";
import quotesData from "../../../data/quotes";
import { quoteTopics, topicForQuote } from "../../../lib/quote-topics";
import FollowButton from "../../../components/FollowButton";
import StructuredData from "../../../components/StructuredData";

export const dynamicParams = false;

export function generateStaticParams() {
  return quoteTopics.map((topic) => ({ topic: topic.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }) {
  const { topic: slug } = await params;
  const topic = quoteTopics.find((item) => item.slug === slug);
  if (!topic) return {};
  return {
    title: `${topic.label} Quotes — Famous & Inspirational`,
    description: topic.description,
    alternates: { canonical: `https://mayalines.com/topics/${topic.slug}` },
    openGraph: { type: "website", title: `${topic.label} Quotes | MAYALINES`, description: topic.description, url: `https://mayalines.com/topics/${topic.slug}` },
  };
}

export default async function TopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic: slug } = await params;
  const topic = quoteTopics.find((item) => item.slug === slug);
  if (!topic) notFound();
  const quotes = quotesData.filter((quote) => quote.indexable !== false && topicForQuote(quote).includes(topic.slug)).slice(0, 120);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mayalines.com";
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${topic.label} Quotes`,
    description: topic.description,
    url: `${siteUrl}/topics/${topic.slug}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: quotes.length,
      itemListElement: quotes.map((quote, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteUrl}/quotes/${quote.slug}`,
        name: `${quote.author} quote`,
      })),
    },
  };

  return <main className="site-shell"><StructuredData data={itemListSchema} /><header className="header"><Link className="brand" href="/"><span className="brand-name">MAYALINES</span></Link><div className="header-rule"/><nav className="nav"><Link href="/">Quotes</Link><Link href="/popular">Popular</Link><Link href="/trending">Trending</Link><Link href="/topics">Topics</Link><Link href="/authors">Authors</Link><Link href="/poems">Poems</Link></nav></header><section className="hero"><p className="eyebrow">MAYALINES · TOPIC</p><h1>{topic.label} Quotes</h1><p className="hero-copy">{topic.description} Discover sourced words from notable writers and thinkers, then copy the quotes you want to keep.</p><FollowButton targetType="topic" target={topic.label} /></section><section className="library"><div className="section-heading">{topic.label} quotes</div><p className="library-meta">{quotes.length.toLocaleString("en-US")} selected quotes</p><QuoteResults quotes={quotes}/></section><footer className="footer">© 2026 Mayalines</footer></main>;
}
