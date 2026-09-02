import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessibility",
  description: "Accessibility statement and contact information for Mayalines.",
  robots: { index: true, follow: true },
};

export default function AccessibilityPage() {
  return <main className="legal-page">
    <a className="skip-link" href="#content">Skip to content</a>
    <nav className="legal-nav"><a href="/">← Mayalines</a></nav>
    <article id="content">
      <p className="eyebrow">ACCESSIBILITY</p>
      <h1>Accessibility Statement</h1>
      <p>Mayalines is designed for keyboard navigation, screen readers, zoom, touch devices and reduced motion. The implementation follows WCAG principles; this statement is not a legal certification of compliance.</p>
      <h2>Current Measures</h2>
      <ul>
        <li>Semantic headings, landmarks and navigation.</li>
        <li>Skip links and visible keyboard focus.</li>
        <li>Accessible names and states for interactive controls.</li>
        <li>Responsive layouts for phones, tablets and desktop screens.</li>
        <li>Support for reduced motion.</li>
        <li>Readable contrast and restrained decorative elements.</li>
      </ul>
      <h2>Known Limitations</h2>
      <p>Automated checks cannot establish complete accessibility. Manual testing with keyboard navigation, screen readers, zoom, contrast tools and mobile devices remains necessary.</p>
      <h2>Report an Accessibility Issue</h2>
      <p>Email <a href="mailto:joschaschmidt@mail.de">joschaschmidt@mail.de</a> with the page URL, a description of the issue and, where possible, the device and assistive technology used.</p>
    </article>
  </main>;
}
