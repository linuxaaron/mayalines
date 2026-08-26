import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Quote Archive",
  description: "Privacy information for Quote Archive.",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <nav className="legal-nav" aria-label="Legal navigation"><a href="/">← Quote Archive</a></nav>
      <article>
        <p className="eyebrow">LEGAL</p>
        <h1>Privacy Policy</h1>
        <p><strong>Important:</strong> This policy must be completed with the actual operator identity, contact details and the final list of services before launch. It intentionally does not claim that third-party advertising, analytics or cookies are active when they have not been configured.</p>
        <h2>1. Controller</h2>
        <p>[LEGAL NAME / COMPANY], [POSTAL ADDRESS], [COUNTRY], email: [CONTACT EMAIL].</p>
        <h2>2. Website access</h2>
        <p>When you access this website, technical information may be processed by the hosting infrastructure to deliver the requested pages, maintain security and detect abuse. The exact categories, retention periods and recipients depend on the hosting configuration and must be documented before launch.</p>
        <h2>3. Search and copy functions</h2>
        <p>The quote search and copy-to-clipboard functions are designed to work locally in the browser. The site should not send the text entered into the search field to a third party unless a future feature explicitly requires it.</p>
        <h2>4. Cookies, analytics and advertising</h2>
        <p>No non-essential analytics, advertising or tracking service should be enabled before the relevant privacy information and consent mechanism are configured. If Google AdSense or another advertising provider is added, the privacy policy must identify the relevant providers, purposes, legal bases, recipients, transfers, retention and user choices.</p>
        <h2>5. Consent</h2>
        <p>Where consent is required, it must be freely given, specific, informed and unambiguous, and users must be able to withdraw it. Consent choices should be recorded and remain accessible for later changes.</p>
        <h2>6. User rights</h2>
        <p>Depending on applicable law, users may have rights including access, rectification, erasure, restriction, objection, portability and withdrawal of consent. Requests can be sent to [CONTACT EMAIL].</p>
        <h2>7. International visitors</h2>
        <p>Data protection obligations differ by jurisdiction. The final implementation should document applicable regional requirements for the countries actually targeted and the services actually used. This page does not purport to provide worldwide legal compliance by itself.</p>
        <h2>8. Changes</h2>
        <p>This policy should be reviewed whenever the operator, hosting, analytics, advertising, consent management, contact forms or other data processing changes.</p>
      </article>
    </main>
  );
}
