# Compliance- und Launch-Checkliste

Diese Checkliste ist eine technische Grundlage und keine Rechtsberatung. Welche rechtlichen Anforderungen gelten, hängt vom Betreiber, Geschäftsmodell, Zielmarkt und den tatsächlich eingesetzten Drittanbieterdiensten ab.

## Blocker vor dem Launch

- [ ] Rechtliche Platzhalter in `/imprint`, `/privacy` und `/accessibility` prüfen und vervollständigen.
- [ ] Rechtlichen Betreiber und eine gültige Postanschrift bestätigen.
- [ ] Kontaktadresse und E-Mail für Meldungen zur Barrierefreiheit bestätigen.
- [ ] Endgültige Domain bestätigen und `NEXT_PUBLIC_SITE_URL` in Vercel setzen.
- [ ] Finale Hosting-Konfiguration prüfen und relevante technische Protokolle bzw. Datenverarbeitungen dokumentieren.
- [ ] Vor Werbung oder Analyse: jeden Anbieter, Zweck, Rechtsgrundlage, Empfänger, Übermittlung, Speicherdauer und jede erforderliche Einwilligung dokumentieren.
- [ ] Vor personalisierter Google-Werbung: eine von Google zertifizierte CMP mit IAB TCF konfigurieren, sofern dies nach den Google-Richtlinien erforderlich ist.
- [ ] Urheberrechte, Zuordnung und Quellenbelege für jedes indexierbare Zitat prüfen.
- [ ] Manuelle Tests mit Tastatur, Screenreader, Vergrößerung, Kontrast und mobilen Geräten durchführen.
- [ ] Barrierefreiheit anhand des für den tatsächlichen Dienst und Betreiber geltenden Standards prüfen.

## Aktuelle technische Grundlage

- Semantische Orientierungspunkte und Überschriften.
- Sichtbare Fokuszustände für Tastaturnavigation.
- Sprunglink zur Navigation zum Inhalt.
- Barrierefreie Bezeichnungen für Such- und Kopierfunktionen.
- `aria-live`-Rückmeldungen für Suchergebnisse.
- Unterstützung für reduzierte Bewegungen.
- Responsive Layouts für kleine Bildschirme.
- Von Next.js erzeugte `robots.txt` und Sitemap.
- Canonical-Metadaten für indexierbare Inhalte.
- BreadcrumbList als JSON-LD auf Zitat- und Kategorieseiten.
- Nicht indexierbare Zitate bleiben aus der Sitemap ausgeschlossen.
- Autorenseiten bleiben `noindex`, solange nicht ausreichend eigener redaktioneller Wert sowie verifizierte biografische bzw. quellenbezogene Informationen vorliegen.

## Regel für Werbung und Datenschutz

Google AdSense, Analysewerkzeuge, Tracking-Pixel oder andere nicht erforderliche Drittanbieter-Skripte erst aktivieren, wenn Datenschutzerklärung und Einwilligungsmechanismus den tatsächlich eingesetzten Diensten entsprechen. Für personalisierte Werbung im EWR, Vereinigten Königreich und der Schweiz verlangt Google unter seiner EU-Nutzereinwilligungsrichtlinie eine zertifizierte CMP mit IAB TCF, sofern die Richtlinie anwendbar ist.

## Internationaler Umfang

Es gibt keine einzelne Implementierung, die automatisch die rechtliche Konformität in jedem Land garantiert. Die Website sollte nur für Rechtsordnungen und Dienste als geprüft betrachtet werden, die für das konkrete Geschäftsmodell ausdrücklich bewertet wurden.
