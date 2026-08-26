import type { MetadataRoute } from "next";
import quotesData from "../data/quotes.json";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mayalines.com";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function sitemap(): MetadataRoute.Sitemap {
  const categories = [...new Set(quotesData.map((quote) => quote.category))];

  // Individual quote pages currently emit noindex until attribution and
  // publication-rights review is complete, so they must not be in the sitemap.
  return [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/imprint`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/accessibility`, changeFrequency: "yearly", priority: 0.2 },
    ...categories.map((category) => ({
      url: `${siteUrl}/categories/${slugify(category)}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
