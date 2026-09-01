import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import Script from "next/script";
import "./globals.css";
import "./accessibility-overrides.css";
import "./quote-overrides.css";
import "./submit/submit-overrides.css";
import "./admin/admin-overrides.css";
import StructuredData from "../components/StructuredData";
import SiteFooter from "../components/SiteFooter";
import GoogleTranslateLink from "../components/GoogleTranslateLink";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mayalines.com";
const siteTitle = "Famous Quotes, Love Quotes, Hope Quotes & Poems | Mayalines";
const siteDescription = "Discover famous quotes, love quotes, hope quotes, life quotes, inspirational quotes, suffering quotes, Maya Angelou quotes, wisdom and poems. Browse thousands of quotes by topic and author on Mayalines.";
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
    "best quotes",
    "quotes about life",
    "life quotes",
    "love quotes",
    "quotes about love",
    "hope quotes",
    "quotes about hope",
    "inspirational quotes",
    "motivational quotes",
    "positive quotes",
    "deep quotes",
    "meaningful quotes",
    "short quotes",
    "short inspirational quotes",
    "suffering quotes",
    "quotes about suffering",
    "pain quotes",
    "sad quotes",
    "healing quotes",
    "grief quotes",
    "strength quotes",
    "courage quotes",
    "happiness quotes",
    "friendship quotes",
    "success quotes",
    "wisdom quotes",
    "philosophy quotes",
    "Maya Angelou quotes",
    "Maya quotes",
    "quotes by famous people",
    "quotes by authors",
    "daily quotes",
    "quote of the day",
    "beautiful quotes",
    "timeless quotes",
    "Liebeszitate",
    "Zitate über Liebe",
    "Hoffnung Zitate",
    "Lebenszitate",
    "inspirierende Zitate",
    "aphorisms",
    "famous poems",
    "poems",
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
    images: [{ url: socialImage, width: 1200, height: 630, alt: "MAYALINES — famous quotes, love quotes, hope quotes and poetry" }],
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

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
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
      </head>
      <body translate="yes">
        <StructuredData data={websiteSchema} nonce={nonce} />
        <StructuredData data={organizationSchema} nonce={nonce} />
        {children}
        <SiteFooter />
        <GoogleTranslateLink />
        <Script nonce={nonce} async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2162793628214003" crossOrigin="anonymous" strategy="afterInteractive" />
      </body>
    </html>
  );
}
