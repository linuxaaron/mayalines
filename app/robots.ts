import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mayalines.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // API endpoints and the editorial review area have no search value and
      // must not be crawled. Public quote, author and collection pages remain
      // available for discovery.
      disallow: ["/api/", "/admin/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
