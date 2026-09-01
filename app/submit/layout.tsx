import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit a Quote",
  description: "Submit a quote to the Mayalines editorial team for review.",
  alternates: { canonical: "/submit" },
  robots: { index: false, follow: true },
};

export default function SubmitLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
