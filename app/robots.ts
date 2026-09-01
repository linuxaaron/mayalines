import type { MetadataRoute } from "next";
import quotesData from "../data/quotes";
import { isSeoIndexable, PRIMARY_SITEMAP_QUOTE_LIMIT } from "../lib/seo";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mayalines.com";

export default function robots(): MetadataRoute.Robots {
  const hasSitemapOverflow = quotesData.filter(isSeoIndexable).length > PRIMARY_SITEMAP_QUOTE_LIMIT;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/"],
    },
    sitemap: [
      `${siteUrl}/sitemap.xml`,
      ...(hasSitemapOverflow ? [`${siteUrl}/sitemap-quotes-2.xml`] : []),
    ],
  };
}
