import type { Metadata, Viewport } from "next";
import "./globals.css";
import StructuredData from "../components/StructuredData";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://quotes-git-main-aaron-727f.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Quotes — Words Worth Keeping",
    template: "%s | Quote Archive",
  },
  description: "A fast, readable and searchable collection of memorable quotes, authors and ideas.",
  applicationName: "Quote Archive",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Quote Archive",
    title: "Quotes — Words Worth Keeping",
    description: "A fast, readable and searchable collection of memorable quotes, authors and ideas.",
  },
  twitter: {
    card: "summary",
    title: "Quotes — Words Worth Keeping",
    description: "A fast, readable and searchable collection of memorable quotes, authors and ideas.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
  themeColor: "#d8d5cf",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Quote Archive",
    url: siteUrl,
    description: "A fast, readable and searchable collection of memorable quotes, authors and ideas.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en">
      <body>
        <StructuredData data={websiteSchema} />
        {children}
      </body>
    </html>
  );
}
