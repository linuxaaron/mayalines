import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Imprint | Mayalines",
  description: "Publisher and legal information for Mayalines.",
  robots: { index: true, follow: true },
};

export default function ImprintPage() {
  return (
    <main className="legal-page">
      <a className="skip-link" href="#content">Skip to content</a>
      <nav className="legal-nav" aria-label="Legal navigation"><a href="/">← Mayalines</a></nav>
      <article id="content">
        <p className="eyebrow">LEGAL</p>
        <h1>Imprint</h1>
        <p className="legal-warning"><strong>Launch requirement:</strong> The operator information below must be completed before Mayalines is operated commercially. Do not publish placeholder identity or address data.</p>

        <h2>Service provider / publisher</h2>
        <address>
          <strong>[LEGAL NAME / COMPANY]</strong><br />
          [STREET AND HOUSE NUMBER]<br />
          [POSTAL CODE] [CITY]<br />
          [COUNTRY]
        </address>

        <h2>Contact</h2>
        <p>Email: <a href="mailto:[CONTACT EMAIL]">[CONTACT EMAIL]</a></p>
        <p>For legal notices and copyright matters, use the contact address above.</p>

        <h2>Responsible for editorial content</h2>
        <p>[NAME OF RESPONSIBLE PERSON]</p>
        <p>[ADDRESS OF RESPONSIBLE PERSON]</p>

        <h2>Copyright and quotation sources</h2>
        <p>Mayalines attempts to identify authorship and source information for quotations. A quotation is not treated as public-domain material merely because it appears in a public dataset. Publication, attribution and copyright status are reviewed separately.</p>
        <p>If you believe a quotation is incorrectly attributed, unlawfully reproduced, or otherwise infringes your rights, contact us with the URL, the relevant text, your rights basis and supporting information. We will review substantiated notices and, where appropriate, restrict or remove the material while the matter is investigated.</p>

        <h2>External services</h2>
        <p>Hosting, analytics, advertising, consent-management and other third-party services will only be listed here and in the privacy policy when they are actually enabled. Their legal and technical configuration must be reviewed before activation.</p>

        <h2>Legal information</h2>
        <p>This page is part of the website implementation and does not replace individual legal advice. The final obligations depend on the operator, business model, target markets and services used.</p>
      </article>
    </main>
  );
}
