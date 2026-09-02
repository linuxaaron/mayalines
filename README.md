# MAYALINES

**Worte, die bleiben.**

MAYALINES ist eine schnelle, minimalistische und durchsuchbare Sammlung bemerkenswerter Zitate, Autoren, Themen und Gedichte.

**Website:** https://mayalines.com

## Technologie

- Next.js
- React
- TypeScript
- Vercel
- Neon PostgreSQL für persistente Likes, Kopien, Shares und Quote-Submissions
- Upstash Redis ausschließlich für verteiltes Rate-Limiting

## Engagement und Rankings

Likes werden serverseitig in PostgreSQL gespeichert. Ein langlebiges, HTTP-only Cookie identifiziert den Besucher, sodass ein Like nach einem Reload erhalten bleibt und pro Besucher nur einmal pro Zitat gezählt wird.

Kopien und Shares werden ebenfalls serverseitig erfasst. `/popular` verwendet die Lifetime-Likes als Ranking; `/trending` wertet Likes der letzten sieben Tage aus.

Die Datenbankstruktur liegt unter `db/schema.sql` und muss einmal in der Neon SQL Console ausgeführt werden.

Für Vercel Production wird benötigt:

```text
DATABASE_URL
```

## Quote Submissions

Besucher können Zitate über `/submit` einreichen. Einsendungen werden mit dem Status `pending` gespeichert und müssen vor einer Veröffentlichung redaktionell geprüft werden.

## Zitatdaten

Der Produktionsdatensatz enthält 49.000 öffentlich durchsuchbare Datensätze aus festgelegten Quellen sowie wenige separat geprüfte Ergänzungen. Jeder Datensatz ist kategorisiert und mit seiner Quelle verknüpft. Die öffentliche Bibliothek und interne Suche enthalten den gesamten freigegebenen Bestand.

Die Freigabe für Besucher und die Freigabe für Suchmaschinen sind bewusst getrennt: Datensätze mit `indexable: true` sind auf Mayalines öffentlich auffindbar. Nur Datensätze mit zusätzlich verifizierter Attribution und geklärtem Copyright werden in XML-Sitemaps aufgenommen und erhalten indexierbare Detailseiten. So bleiben noch zu prüfende Quellen sichtbar, ohne ihren Rechteprüfungsstatus falsch darzustellen.

Die erzeugte Datei `data/quotes.json` enthält die produktiven Zitatdaten. Das Indexierungs-Gate berücksichtigt ausschließlich Datensätze mit verifizierter Zuordnung, geklärtem Veröffentlichungsstatus und aktivierter Indexierung.

## Entwicklung

```bash
npm install
npm run dev
```

## Produktions-Build

```bash
npm run build
npm start
```

## Qualitätssicherung

```bash
npm run lint
npm run typecheck
npm run audit:quotes
npm run audit:licensed
npm run build
npm run test:smoke
```

Die GitHub-Actions-Pipeline führt diese Prüfungen sowie einen Dependency-Audit bei Pull Requests und Änderungen auf `main` aus. Der Smoke-Test startet den Produktionsserver und prüft Kernrouten, Security-Header, den Same-Origin-Schutz, die Footer-Semantik und eine feste Obergrenze für Client-Chunks.

Die Anwendung folgt Progressive Enhancement: Kerninhalte werden serverseitig gerendert, und das Einsendeformular funktioniert als Server Action auch ohne clientseitiges JavaScript. Interaktive Ergänzungen wie Likes und persönliche Sammlungen werden clientseitig aufgewertet.

## Ziel

MAYALINES ist als schnelle, übersichtliche und suchmaschinenfreundliche Anlaufstelle für Zitate, Autoren, Themen und Gedichte konzipiert. Besucher können Inhalte entdecken, Zitate kopieren, teilen, liken und neue Zitate zur redaktionellen Prüfung einreichen.
