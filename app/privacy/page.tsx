import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Information about data processing, hosting and functional storage on Mayalines.",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <a className="skip-link" href="#content">Skip to content</a>
      <nav className="legal-nav"><a href="/">← Mayalines</a></nav>
      <article id="content">
        <p className="eyebrow">LEGAL · LAST UPDATED 5 SEPTEMBER 2026</p>
        <h1>Privacy Policy</h1>

        <h2>1. Controller</h2>
        <address>
          <strong>Aaron</strong><br />
          Im Sinnighofen 8b<br />
          79189 Bad Krozingen<br />
          Germany<br />
          <a href="mailto:joschaschmidt@mail.de">joschaschmidt@mail.de</a>
        </address>

        <h2>2. Website delivery and security</h2>
        <p>Mayalines is hosted on Vercel. When a page is requested, Vercel processes technical connection data such as the IP address, request time, requested URL, browser information and security events to deliver the website, maintain availability and prevent abuse. This processing is necessary for secure website operation and is based on Article 6(1)(f) GDPR. Technical logs are retained according to the hosting configuration and Vercel&apos;s applicable service terms.</p>

        <h2>3. Quote search and clipboard functions</h2>
        <p>Quote filtering is handled by the Mayalines application. Search terms are sent only to Mayalines when additional results are requested and are not intentionally forwarded to an external search engine. Copying uses the browser clipboard API. Clipboard contents are not stored by Mayalines.</p>

        <h2>4. Likes, copies, shares and personal collections</h2>
        <p>Mayalines records the quote identifier and the requested interaction when a visitor likes, copies, shares or saves a quote. A randomly generated visitor identifier is stored in the technically necessary <code>mayalines_visitor</code> cookie so repeated likes and personal collections can be assigned without requiring an account. The cookie is HTTP-only, Secure, SameSite=Lax and expires after two years.</p>
        <p>Interaction and collection data may be stored with Neon and, for likes and abuse protection, Upstash. These services act as infrastructure providers. The processing supports requested functionality, integrity of counters and abuse prevention under Article 6(1)(f) GDPR. Interaction records remain stored while the corresponding feature is offered or until they are deleted during maintenance or following a valid deletion request.</p>

        <h2>5. Quote submissions</h2>
        <p>When a quote is submitted, Mayalines processes the submitted quote, author, source, category and moderation status. Optional contact details are used only to review the submission or contact the submitter about it. Rejected submissions may be deleted during editorial maintenance; approved submissions may remain published until withdrawn or removed for editorial or legal reasons.</p>

        <h2>6. Advertising, analytics and non-essential tracking</h2>
        <p>The current Mayalines application does not load Google AdSense, Google Analytics or another non-essential advertising or analytics script. Such services will not be enabled for visitors who require consent unless the service is documented here and an appropriate consent mechanism, including a Google-certified consent management platform where required, has been configured.</p>

        <h2>7. Infrastructure providers and international transfers</h2>
        <p>Mayalines uses Vercel for hosting, Neon for the application database and Upstash for selected interaction data and rate limiting. Depending on the selected service region and provider operations, data may be processed outside the European Economic Area. Where required, transfers are governed by the providers&apos; applicable data-processing terms and recognized transfer safeguards.</p>

        <h2>8. Your rights</h2>
        <p>Subject to the statutory requirements, users may request access, rectification, erasure, restriction, data portability or object to processing. Consent can be withdrawn at any time for the future. Requests can be sent to <a href="mailto:joschaschmidt@mail.de">joschaschmidt@mail.de</a>. Users may also lodge a complaint with a competent data-protection supervisory authority.</p>

        <h2>9. Changes</h2>
        <p>This policy is updated when the services, purposes or legal requirements relevant to Mayalines change. The current version is identified by the date at the top of this page.</p>
      </article>
    </main>
  );
}
