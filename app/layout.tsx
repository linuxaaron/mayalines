import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./quote-overrides.css";
import StructuredData from "../components/StructuredData";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mayalines.com";
const siteTitle = "Famous Quotes, Inspirational & Motivational Quotes | Mayalines";
const siteDescription = "Discover famous quotes, inspirational quotes, motivational quotes, life quotes and timeless wisdom from notable authors. Search, read and copy sourced quotes on Mayalines.";
const socialImage = `${siteUrl}/mayalines-og.svg`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteTitle, template: "%s | Mayalines" },
  description: siteDescription,
  applicationName: "Mayalines",
  authors: [{ name: "Mayalines" }],
  creator: "Mayalines",
  publisher: "Mayalines",
  category: "quotes",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  openGraph: { type: "website", url: siteUrl, siteName: "Mayalines", locale: "en_US", title: siteTitle, description: siteDescription, images: [{ url: socialImage, width: 1200, height: 630, alt: "MAYALINES — Famous Quotes and timeless wisdom" }] },
  twitter: { card: "summary_large_image", title: siteTitle, description: siteDescription, images: [socialImage] },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, colorScheme: "light", themeColor: "#f4f3f0" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const websiteSchema = { "@context": "https://schema.org", "@type": "WebSite", name: "Mayalines", url: siteUrl, inLanguage: "en-US", description: siteDescription, image: socialImage };
  return (
    <html lang="en">
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2162793628214003" crossOrigin="anonymous" />
      </head>
      <body><StructuredData data={websiteSchema} />{children}</body>
    </html>
  );
}
