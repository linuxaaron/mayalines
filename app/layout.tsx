import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quotes — Words Worth Keeping",
  description: "A fast, readable and searchable collection of memorable quotes, authors and ideas.",
  metadataBase: new URL("https://example.com"),
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
