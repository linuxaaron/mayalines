import type { Metadata, Viewport } from "next";
import "./globals.css";
import StructuredData from "../components/StructuredData";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mayalines.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Mayalines – Zitate, Gedanken und Worte, die bleiben",
    template: "%s | Mayalines",
  },
  description: "Entdecke bemerkenswerte Zitate, bekannte Worte, inspirierende Gedanken und Autoren auf Mayalines. Lesen, entdecken und Zitate direkt kopieren.",
  applicationName: "Mayalines",
  keywords: [
    "Zitate",
    "Zitatesammlung",
    "bekannte Zitate",
    "berühmte Zitate",
    "beste Zitate",
    "inspirierende Zitate",
    "Motivationszitate",
    "Lebenszitate",
    "Weisheiten",
    "Zitate von Autoren",
    "Mayalines",
  ],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Mayalines",
    title: "Mayalines – Zitate, Gedanken und Worte, die bleiben",
    description: "Entdecke bemerkenswerte Zitate, bekannte Worte und inspirierende Gedanken. Lesen, entdecken und Zitate direkt kopieren.",
  },
  twitter: {
    card: "summary",
    title: "Mayalines – Zitate, Gedanken und Worte, die bleiben",
    description: "Entdecke bemerkenswerte Zitate, bekannte Worte und inspirierende Gedanken.",
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
    description: "Eine kuratierte Sammlung bemerkenswerter Zitate, bekannter Autoren und Gedanken.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="de">
      <body>
        <StructuredData data={websiteSchema} />
        {children}
      </body>
    </html>
  );
}
