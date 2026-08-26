import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessibility — Quote Archive",
  description: "Accessibility information and contact options for Quote Archive.",
  robots: { index: true, follow: true },
};

export default function AccessibilityPage() {
  return (
    <main className="legal-page">
      <nav className="legal-nav" aria-label="Accessibility navigation"><a href="/">← Quote Archive</a></nav>
      <article>
        <p className="eyebrow">ACCESSIBILITY</p>
        <h1>Accessibility statement</h1>
        <p>Quote Archive is designed to be usable with keyboards, screen readers, zoom and touch devices. We aim to follow WCAG 2.2 principles and applicable accessibility requirements.</p>
        <h2>Current accessibility measures</h2>
        <ul>
          <li>Semantic headings, landmarks and navigation.</li>
          <li>Visible keyboard focus states and a skip-to-content link.</li>
          <li>Controls with accessible names and states.</li>
          <li>Responsive layouts for small screens and zoomed text.</li>
          <li>Reduced-motion support for users who request it.</li>
          <li>High-contrast text and restrained decorative elements.</li>
          <li>Copy actions that do not depend on pointer input alone.</li>
        </ul>
        <h2>Known limitations</h2>
        <p>Automated checks do not prove full accessibility. Real assistive-technology testing and manual keyboard, zoom, contrast and mobile testing are still required before claiming conformance to a specific legal standard.</p>
        <h2>Report an accessibility barrier</h2>
        <p>Email <a href="mailto:[ACCESSIBILITY EMAIL]">[ACCESSIBILITY EMAIL]</a> with the page URL, a description of the barrier and, if possible, the device or assistive technology used.</p>
        <h2>Legal scope</h2>
        <p>Whether a specific accessibility law applies depends on the operator, business model, company size, service and jurisdiction. The site will be reviewed against the requirements applicable to its actual operation before launch.</p>
      </article>
    </main>
  );
}
