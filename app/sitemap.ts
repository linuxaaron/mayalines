import type { MetadataRoute } from "next";
import quotesData from "../data/quotes.json";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://quotes-git-main-aaron-727f.vercel.app";

function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function sitemap(): MetadataRoute.Sitemap {
  const categories = [...new Set(quotesData.map((quote) => quote.category))];
  const authors = [...new Set(quotesData.map((quote) => quote.author))];
  const indexableQuotes = quotesData.filter((quote) => quote.indexable !== false);

  return [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    ...categories.map((category) => ({
      url: `${siteUrl}/categories/${slugify(category)}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...authors.map((author) => ({
      url: `${siteUrl}/authors/${slugify(author)}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...indexableQuotes.map((quote) => ({
      url: `${siteUrl}/quotes/${quote.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
