import type { Metadata, Viewport } from "next";
import "./globals.css";
import StructuredData from "../components/StructuredData";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mayalines.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Mayalines – Quotes, Thoughts and Words That Last",
    template: "%s | Mayalines",
  },
  description: "Discover remarkable quotes, famous words, inspiring thoughts and authors on Mayalines. Read, explore and copy quotes instantly.",
  applicationName: "Mayalines",
  keywords: [
    "quotes", "quote collection", "famous quotes", "best quotes", "inspirational quotes",
    "motivational quotes", "life quotes", "wisdom quotes", "quotes by authors", "Mayalines",
  ],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website", url: "/", siteName: "Mayalines",
    title: "Mayalines – Quotes, Thoughts and Words That Last",
    description: "Discover remarkable quotes, famous words and inspiring thoughts. Read, explore and copy quotes instantly.",
  },
  twitter: {
    card: "summary",
    title: "Mayalines – Quotes, Thoughts and Words That Last",
    description: "Discover remarkable quotes, famous words and inspiring thoughts.",
  },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, colorScheme: "light", themeColor: "#d8d5cf" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Mayalines",
    url: siteUrl,
    description: "A curated collection of remarkable quotes, authors and thoughts.",
    potentialAction: { "@type": "SearchAction", target: `${siteUrl}/?q={search_term_string}`, "query-input": "required name=search_term_string" },
  };

  return <html lang="en"><body><StructuredData data={websiteSchema} />{children}</body></html>;
}
