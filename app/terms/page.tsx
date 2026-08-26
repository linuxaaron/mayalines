import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use | Mayalines",
  description: "Terms of use for Mayalines.",
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <main className="legal-page">
      <a className="skip-link" href="#content">Skip to content</a>
      <nav className="legal-nav" aria-label="Legal navigation"><a href="/">← Mayalines</a></nav>
      <article id="content">
        <p className="eyebrow">LEGAL</p>
        <h1>Terms of Use</h1>
        <p>Mayalines provides a searchable collection of quotations and related editorial information. Use of the website is subject to applicable law and these terms.</p>

        <h2>1. Informational service</h2>
        <p>Content is provided for informational and inspirational purposes. Mayalines does not guarantee that every attribution, translation, quotation or historical statement is error-free.</p>

        <h2>2. Intellectual property</h2>
        <p>Rights in quotation text, names, photographs, trademarks and other third-party material remain with their respective rights holders unless otherwise stated. Users must independently verify whether copying, redistribution or commercial use is permitted.</p>

        <h2>3. Acceptable use</h2>
        <p>Users must not use the service unlawfully, attempt to interfere with its operation, circumvent security controls, or infringe the rights of others.</p>

        <h2>4. Third-party services</h2>
        <p>Mayalines may link to or later use third-party services. Their own terms and privacy notices apply to their services. The active third-party services will be documented in the privacy policy.</p>

        <h2>5. Availability and changes</h2>
        <p>The operator may change, suspend or remove content or functionality where necessary for maintenance, security, legal compliance or editorial correction.</p>

        <h2>6. Legal limitations</h2>
        <p>Nothing on this page excludes liability or statutory rights that cannot lawfully be excluded. The final version must be reviewed against the law applicable to the operator and the actual service.</p>
      </article>
    </main>
  );
}
