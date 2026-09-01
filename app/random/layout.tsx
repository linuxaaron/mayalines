import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Random Quote",
  description: "Discover a random sourced quote from the Mayalines library.",
  alternates: { canonical: "/random" },
  robots: { index: false, follow: true },
};

export default function RandomLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
