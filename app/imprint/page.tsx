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

        <h2>Service provider / publisher</h2>
        <address>
          <strong>Joscha Aaron Schmidt</strong><br />
          Im Sinnighofen 8b<br />
          79189 Bad Krozingen<br />
          Germany
        </address>

        <h2>Contact</h2>
        <p>For legal notices, copyright matters and corrections, please use the contact details provided on this website.</p>

        <h2>Responsible for editorial content</h2>
        <p>Joscha Aaron Schmidt</p>
        <address>
          Im Sinnighofen 8b<br />
          79189 Bad Krozingen<br />
          Germany
        </address>

        <h2>Copyright and quotation sources</h2>
        <p>Mayalines aims to provide accurate authorship and source information for quotations. A quotation being available online or in an open dataset does not, by itself, establish that it is in the public domain or licensed for commercial republication.</p>
        <p>If you believe a quotation is incorrectly attributed, unlawfully reproduced, or otherwise infringes your rights, please contact the operator with the URL, the relevant material, your rights basis and supporting information.</p>

        <h2>External services</h2>
        <p>Hosting, analytics, advertising, consent-management and other third-party services are disclosed in the privacy policy when they are enabled.</p>

        <h2>Legal information</h2>
        <p>This imprint provides the operator information currently supplied for Mayalines. It does not constitute individual legal advice. Additional requirements may apply depending on the services, advertising providers and markets targeted by the website.</p>
      </article>
    </main>
  );
}
