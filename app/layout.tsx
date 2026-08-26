import type { Metadata, Viewport } from "next";
import "./globals.css";
import StructuredData from "../components/StructuredData";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mayalines.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Mayalines — Words Worth Keeping",
    template: "%s | Mayalines",
  },
  description: "Mayalines is a carefully curated collection of memorable quotes, authors and ideas — made to read, remember and share.",
  applicationName: "Mayalines",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Mayalines",
    title: "Mayalines — Words Worth Keeping",
    description: "A carefully curated collection of memorable quotes, authors and ideas.",
  },
  twitter: {
    card: "summary",
    title: "Mayalines — Words Worth Keeping",
    description: "A carefully curated collection of memorable quotes, authors and ideas.",
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
    name: "Mayalines",
    url: siteUrl,
    description: "A carefully curated collection of memorable quotes, authors and ideas.",
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
