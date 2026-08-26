import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessibility | Mayalines",
  description: "Accessibility statement and contact options for Mayalines.",
  robots: { index: true, follow: true },
};

export default function AccessibilityPage() {
  return (
    <main className="legal-page">
      <a className="skip-link" href="#content">Skip to content</a>
      <nav className="legal-nav" aria-label="Accessibility navigation"><a href="/">← Mayalines</a></nav>
      <article id="content">
        <p className="eyebrow">ACCESSIBILITY</p>
        <h1>Accessibility statement</h1>
        <p>Mayalines is designed to support keyboard navigation, screen readers, zoom, touch devices and reduced-motion preferences. The implementation targets WCAG 2.2 principles and the accessibility requirements applicable to the service.</p>

        <h2>Current measures</h2>
        <ul>
          <li>Semantic headings, landmarks and navigation.</li>
          <li>Skip-to-content navigation and visible keyboard focus.</li>
          <li>Accessible names and states for interactive controls.</li>
          <li>Responsive layouts for phones, tablets and desktop displays.</li>
          <li>Reduced-motion support.</li>
          <li>Readable contrast and restrained decorative elements.</li>
          <li>Copy functions that do not require pointer input alone.</li>
        </ul>

        <h2>Known limitations</h2>
        <p>Automated checks cannot establish full accessibility conformance. Manual keyboard, screen-reader, zoom, contrast and mobile testing remains required before making a formal legal conformance claim.</p>

        <h2>Report an accessibility barrier</h2>
        <p>Email <a href="mailto:[ACCESSIBILITY EMAIL]">[ACCESSIBILITY EMAIL]</a> with the page URL, a description of the barrier and, where possible, the device and assistive technology used.</p>

        <h2>Legal scope</h2>
        <p>Whether a particular accessibility law applies depends on the operator, business model, service, company status and jurisdiction. The operator must complete a jurisdiction-specific review before launch and must not treat this statement as a worldwide legal certification.</p>
      </article>
    </main>
  );
}
