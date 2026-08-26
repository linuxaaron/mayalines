import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nutzungsbedingungen | Mayalines",
  description: "Nutzungsbedingungen für Mayalines.",
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <main className="legal-page">
      <a className="skip-link" href="#content">Zum Inhalt springen</a>
      <nav className="legal-nav" aria-label="Navigation zu rechtlichen Informationen"><a href="/">← Mayalines</a></nav>
      <article id="content">
        <p className="eyebrow">RECHTLICHES</p>
        <h1>Nutzungsbedingungen</h1>
        <p>Mayalines stellt eine durchsuchbare Sammlung von Zitaten und zugehörigen redaktionellen Informationen bereit. Die Nutzung der Website unterliegt dem anwendbaren Recht und diesen Bedingungen.</p>

        <h2>1. Informationsangebot</h2>
        <p>Die Inhalte dienen der Information und Inspiration. Mayalines garantiert nicht, dass jede Zuordnung, Übersetzung, jedes Zitat oder jede historische Angabe fehlerfrei ist.</p>

        <h2>2. Geistiges Eigentum</h2>
        <p>Rechte an Zitattexten, Namen, Fotos, Marken und sonstigen Inhalten Dritter verbleiben bei den jeweiligen Rechteinhabern, sofern nichts anderes angegeben ist. Nutzer müssen selbst prüfen, ob Kopieren, Weiterverbreitung oder kommerzielle Nutzung zulässig sind.</p>

        <h2>3. Zulässige Nutzung</h2>
        <p>Nutzer dürfen den Dienst nicht rechtswidrig verwenden, seinen Betrieb nicht absichtlich stören, keine Sicherheitsmaßnahmen umgehen und keine Rechte Dritter verletzen.</p>

        <h2>4. Dienste Dritter</h2>
        <p>Mayalines kann auf Dienste Dritter verlinken oder solche künftig einsetzen. Für diese Dienste gelten deren eigene Nutzungs- und Datenschutzhinweise. Die tatsächlich aktiven Drittanbieterdienste werden in der Datenschutzerklärung dokumentiert.</p>

        <h2>5. Verfügbarkeit und Änderungen</h2>
        <p>Der Betreiber kann Inhalte oder Funktionen ändern, vorübergehend aussetzen oder entfernen, wenn dies für Wartung, Sicherheit, rechtliche Anforderungen oder redaktionelle Korrekturen erforderlich ist.</p>

        <h2>6. Rechtliche Grenzen</h2>
        <p>Diese Seite schließt keine Haftung oder gesetzlichen Rechte aus, die rechtlich nicht ausgeschlossen werden können. Die endgültige Fassung sollte anhand des für den Betreiber und den tatsächlichen Dienst geltenden Rechts geprüft werden.</p>
      </article>
    </main>
  );
}
