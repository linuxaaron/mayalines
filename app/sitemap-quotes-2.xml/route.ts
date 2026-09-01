import quotesData from "../../data/quotes";
import { isSeoIndexable, PRIMARY_SITEMAP_QUOTE_LIMIT } from "../../lib/seo";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mayalines.com";
const END_INDEX = 59000;

function escapeXml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

export async function GET() {
  const quotes = quotesData
    .filter(isSeoIndexable)
    .slice(PRIMARY_SITEMAP_QUOTE_LIMIT, END_INDEX);

  const urls = quotes.map((quote) => `<url><loc>${escapeXml(`${siteUrl}/quotes/${quote.slug}`)}</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
    },
  });
}
