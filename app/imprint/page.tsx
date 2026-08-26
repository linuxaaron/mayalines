import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Imprint — Quote Archive",
  description: "Legal information and publisher details for Quote Archive.",
  robots: { index: true, follow: true },
};

export default function ImprintPage() {
  return (
    <main className="legal-page">
      <a className="skip-link" href="#content">Skip to content</a>
      <nav className="legal-nav" aria-label="Legal navigation"><a href="/">← Quote Archive</a></nav>
      <article id="content">
        <p className="eyebrow">LEGAL</p>
        <h1>Imprint</h1>
        <p className="legal-warning"><strong>Before production:</strong> Replace the marked operator fields below with the actual legal entity, postal address and contact details. A legal notice cannot be made complete without the real publisher information.</p>
        <h2>Service provider / publisher</h2>
        <address>
          <strong>[LEGAL NAME / COMPANY]</strong><br />
          [STREET AND HOUSE NUMBER]<br />
          [POSTAL CODE] [CITY]<br />
          [COUNTRY]
        </address>
        <h2>Contact</h2>
        <p>Email: <a href="mailto:[CONTACT EMAIL]">[CONTACT EMAIL]</a></p>
        <h2>Responsible for content</h2>
        <p>[NAME OF PERSON RESPONSIBLE FOR CONTENT]</p>
        <p>[ADDRESS OF RESPONSIBLE PERSON]</p>
        <h2>Copyright and quotation sources</h2>
        <p>Quote Archive aims to identify authorship and source information for quotations. Attribution is reviewed where possible. Inclusion in this archive does not by itself establish that a quotation is in the public domain.</p>
        <h2>External links</h2>
        <p>External links are provided for reference. Quote Archive does not control third-party content or privacy practices.</p>
        <h2>Notice</h2>
        <p>This page is a website implementation template and is not a substitute for legal advice. The applicable legal requirements depend on the operator, business model, target markets and services used.</p>
      </article>
    </main>
  );
}
