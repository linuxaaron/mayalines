import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Imprint",
  description: "Provider and legal information for Mayalines.",
  robots: { index: true, follow: true },
};

export default function ImprintPage() {
  return <main className="legal-page">
    <a className="skip-link" href="#content">Skip to content</a>
    <nav className="legal-nav"><a href="/">← Mayalines</a></nav>
    <article id="content">
      <p className="eyebrow">LEGAL</p>
      <h1>Imprint</h1>
      <h2>Service Provider / Publisher</h2>
      <address><strong>Joscha Aaron Schmidt</strong><br />Im Sinnighofen 8b<br />79189 Bad Krozingen<br />Germany</address>
      <h2>Contact</h2>
      <p>Email: <a href="mailto:joschaschmidt@mail.de">joschaschmidt@mail.de</a></p>
      <h2>Responsible for Content</h2>
      <address>Joscha Aaron Schmidt<br />Im Sinnighofen 8b<br />79189 Bad Krozingen<br />Germany</address>
      <h2>Copyright and Quote Corrections</h2>
      <p>Where available, Mayalines provides attribution and source information. The availability of content online or its inclusion in an open dataset does not by itself establish public-domain status or permission for commercial use. For copyright, attribution or removal requests, send the affected URL and relevant information to the operator.</p>
    </article>
  </main>;
}
