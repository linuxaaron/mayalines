import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quote Archive",
  description: "A fast, minimal and searchable collection of memorable quotes.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
