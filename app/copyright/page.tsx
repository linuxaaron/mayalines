import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Copyright & Quote Corrections | Mayalines",
  description: "Copyright, attribution and quote correction information for Mayalines.",
  robots: { index: true, follow: true },
};

export default function CopyrightPage() {
  return (
    <main className="legal-page">
      <a className="skip-link" href="#content">Skip to content</a>
      <nav className="legal-nav" aria-label="Legal navigation"><a href="/">← Mayalines</a></nav>
      <article id="content">
        <p className="eyebrow">RIGHTS</p>
        <h1>Copyright & quote corrections</h1>
        <p>Mayalines aims to publish quotations with accurate authorship and source information. A quotation being available online or in an open dataset does not, by itself, establish that the quotation is in the public domain or licensed for commercial republication.</p>

        <h2>Report a copyright concern</h2>
        <p>If you believe material on Mayalines infringes your copyright or another enforceable right, contact [LEGAL NAME / COMPANY] at <a href="mailto:[CONTACT EMAIL]">[CONTACT EMAIL]</a>.</p>
        <p>Please provide the URL, identify the material, explain your rights or authority, provide contact information and include any evidence needed to evaluate the request. We will review substantiated notices and may restrict or remove material while investigating.</p>

        <h2>Attribution corrections</h2>
        <p>If a quote is incorrectly attributed, provide the quote URL, the claimed correct attribution and reliable source evidence. Attribution corrections are reviewed separately from copyright claims.</p>

        <h2>Counter-notices and disputes</h2>
        <p>Where applicable law provides a formal notice-and-counter-notice procedure, the operator will follow the procedure required for the relevant jurisdiction. This page does not waive any statutory rights or remedies.</p>

        <h2>Important limitation</h2>
        <p>This page is an operational rights-contact mechanism, not legal advice and not a representation that every quotation currently available on Mayalines is cleared for commercial use.</p>
      </article>
    </main>
  );
}
