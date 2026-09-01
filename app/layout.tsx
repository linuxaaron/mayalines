import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./quote-overrides.css";
import "./submit/submit-overrides.css";
import "./admin/admin-overrides.css";
import StructuredData from "../components/StructuredData";
import SiteFooter from "../components/SiteFooter";
import GoogleTranslateLink from "../components/GoogleTranslateLink";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mayalines.com";
const siteTitle = "Famous Quotes, Inspirational Quotes & Poems | Mayalines";
const siteDescription = "Discover sourced famous quotes, inspirational quotes, suffering quotes, aphorisms and public-domain poetry. Browse a large multilingual quote library by topic and author on Mayalines.";
const socialImage = `${siteUrl}/mayalines-og.svg`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteTitle, template: "%s | Mayalines" },
  description: siteDescription,
  applicationName: "Mayalines",
  authors: [{ name: "Mayalines" }],
  creator: "Mayalines",
  publisher: "Mayalines",
  category: "quotes, aphorisms and poetry",
  keywords: [
    "quotes",
    "famous quotes",
    "inspirational quotes",
    "life quotes",
    "love quotes",
    "suffering quotes",
    "pain quotes",
    "wisdom quotes",
    "motivational quotes",
    "deep quotes",
    "aphorisms",
    "poems",
    "quotes by authors",
    "multilingual quotes",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Mayalines",
    locale: "en_US",
    title: siteTitle,
    description: siteDescription,
    images: [{ url: socialImage, width: 1200, height: 630, alt: "MAYALINES — famous quotes, inspirational quotes and poetry" }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [socialImage],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
  themeColor: "#f4f3f0",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Mayalines",
    url: siteUrl,
    inLanguage: ["en", "de", "fr", "es", "it", "nl"],
    description: siteDescription,
    image: socialImage,
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Mayalines",
    url: siteUrl,
    logo: `${siteUrl}/mayalines-mark.svg`,
  };

  return (
    <html lang="en-US">
      <head>
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2162793628214003" crossOrigin="anonymous" />
      </head>
      <body translate="yes">
        <StructuredData data={websiteSchema} />
        <StructuredData data={organizationSchema} />
        {children}
        <SiteFooter />
        <GoogleTranslateLink />
      </body>
    </html>
  );
}
