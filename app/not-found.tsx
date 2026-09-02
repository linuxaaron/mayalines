import Link from "next/link";

export default function NotFound() {
  return (
    <main className="status-page">
      <p className="status-page__eyebrow">404 · PAGE NOT FOUND</p>
      <h1>This line ends here.</h1>
      <p>The page may have moved, but thousands of verified quotations are still waiting.</p>
      <Link className="status-page__link" href="/">
        Return to Mayalines
      </Link>
    </main>
  );
}
