import type { MetadataRoute } from "next";
import quotesData from "../data/quotes";
import { quoteTopics } from "../lib/quote-topics";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mayalines.com";
const PRIMARY_QUOTE_LIMIT = 30000;

function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function isIndexable(quote: (typeof quotesData)[number]) {
  return quote.indexable === true;
}

const highIntentCollections = new Set([
  "quotes-about-love",
  "quotes-about-hope",
  "quotes-about-suffering",
  "pain-quotes",
  "healing-quotes",
  "sad-quotes",
  "strength-quotes",
  "positive-quotes",
  "maya-angelou-quotes",
]);

const collectionSlugs = [
  "quotes-about-life",
  "quotes-about-love",
  "quotes-about-hope",
  "quotes-about-suffering",
  "pain-quotes",
  "healing-quotes",
  "sad-quotes",
  "strength-quotes",
  "positive-quotes",
  "maya-angelou-quotes",
  "quotes-about-success",
  "quotes-about-motivation",
  "quotes-about-wisdom",
  "short-inspirational-quotes",
  "quotes-about-friendship",
  "quotes-about-courage",
  "quotes-about-happiness",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const indexableQuotes = quotesData.filter(isIndexable);
  const categories = [...new Set(indexableQuotes.map((quote) => quote.category))];
  const authors = [...new Set(indexableQuotes.map((quote) => quote.author))];
  const primaryQuotes = indexableQuotes.slice(0, PRIMARY_QUOTE_LIMIT);

  return [
    { url: siteUrl, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/popular`, changeFrequency: "daily", priority: 0.95 },
    { url: `${siteUrl}/trending`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/topics`, changeFrequency: "weekly", priority: 0.95 },
    ...quoteTopics.map((topic) => ({ url: `${siteUrl}/topics/${topic.slug}`, changeFrequency: "weekly" as const, priority: 0.85 })),
    { url: `${siteUrl}/poems`, changeFrequency: "weekly", priority: 0.95 },
    { url: `${siteUrl}/collections`, changeFrequency: "weekly", priority: 0.95 },
    { url: `${siteUrl}/community`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/most-copied`, changeFrequency: "daily", priority: 0.8 },
    ...collectionSlugs.map((slug) => ({ url: `${siteUrl}/collections/${slug}`, changeFrequency: "weekly" as const, priority: highIntentCollections.has(slug) ? 0.95 : 0.9 })),
    { url: `${siteUrl}/categories`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/authors`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/imprint`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/copyright`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${siteUrl}/accessibility`, changeFrequency: "yearly", priority: 0.2 },
    ...categories.map((category) => ({ url: `${siteUrl}/categories/${slugify(category)}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...authors.map((author) => ({ url: `${siteUrl}/authors/${slugify(author)}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...primaryQuotes.map((quote) => ({ url: `${siteUrl}/quotes/${quote.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
