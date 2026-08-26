import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Mayalines",
  description: "Privacy information for Mayalines.",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <a className="skip-link" href="#content">Skip to content</a>
      <nav className="legal-nav" aria-label="Legal navigation"><a href="/">← Mayalines</a></nav>
      <article id="content">
        <p className="eyebrow">LEGAL</p>
        <h1>Privacy Policy</h1>
        <p><strong>Launch requirement:</strong> Complete the controller identity, contact details, hosting details and actual third-party services before publication. This policy must describe the real processing performed by Mayalines; it must never claim that a service is inactive when it is enabled.</p>

        <h2>1. Controller</h2>
        <p>[LEGAL NAME / COMPANY], [POSTAL ADDRESS], [COUNTRY], email: [CONTACT EMAIL].</p>

        <h2>2. Website delivery and security</h2>
        <p>When you request a page, technical data can be processed by the hosting and security infrastructure required to deliver the service, prevent abuse and maintain availability. Before launch, the operator must document the actual provider, categories of data, purposes, legal basis, recipients, international transfers and retention periods.</p>

        <h2>3. Search and copy functions</h2>
        <p>Mayalines performs quote filtering and copy-to-clipboard actions in the browser. Search input is not intentionally transmitted to an external search provider by the application unless a future feature explicitly introduces such processing.</p>

        <h2>4. Cookies and local storage</h2>
        <p>Only technically necessary storage may be used without consent where the applicable law permits it. Non-essential analytics, advertising and tracking technologies must not be activated before the applicable consent mechanism and privacy disclosures are in place.</p>

        <h2>5. Analytics and advertising</h2>
        <p>Mayalines does not describe a future advertising or analytics provider as active until it is actually configured. If Google AdSense, Google Analytics or another provider is introduced, this policy must be updated with the actual provider, purposes, legal bases, recipients, international transfers, retention information and user choices. Where consent is required, processing must not begin before valid consent.</p>

        <h2>6. Consent and withdrawal</h2>
        <p>Where consent is the legal basis, it must be freely given, specific, informed and unambiguous. Users must be able to withdraw consent as easily as they gave it. A consent-management mechanism must provide an accessible way to review or change choices.</p>

        <h2>7. User rights</h2>
        <p>Depending on the applicable law, users may have rights including access, rectification, erasure, restriction, objection, portability and withdrawal of consent. Requests can be sent to [CONTACT EMAIL]. Complaints may be submitted to the competent data-protection supervisory authority.</p>

        <h2>8. International visitors</h2>
        <p>Mayalines may be accessible worldwide, but the applicable legal obligations depend on the operator, users, activities and services involved. The operator must document applicable regional requirements rather than treating one privacy notice as a universal guarantee of compliance.</p>

        <h2>9. Data retention and processors</h2>
        <p>The final version of this policy must state the actual retention periods or criteria and identify the processors and other recipients that are actually used. Data must be limited to what is necessary for the stated purposes.</p>

        <h2>10. Changes</h2>
        <p>This policy must be reviewed whenever hosting, analytics, advertising, consent management, forms, authentication or another processing activity changes.</p>
      </article>
    </main>
  );
}
