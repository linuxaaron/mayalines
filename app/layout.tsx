import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://quotes-git-main-aaron-727f.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Quote Archive — Words Worth Keeping",
    template: "%s | Quote Archive",
  },
  description: "Explore memorable quotes by author and topic. Search a carefully organized archive of words, ideas, wisdom, motivation, love, success and more.",
  applicationName: "Quote Archive",
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Quote Archive",
    title: "Quote Archive — Words Worth Keeping",
    description: "A fast, readable and searchable collection of memorable quotes, authors and ideas.",
    url: siteUrl,
  },
  twitter: {
    card: "summary",
    title: "Quote Archive — Words Worth Keeping",
    description: "A fast, readable and searchable collection of memorable quotes, authors and ideas.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
