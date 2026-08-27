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

Der Produktionsdatensatz enthält 2.000 Zitate aus einer festgelegten öffentlichen Quelle. Jeder Datensatz ist dedupliziert, kategorisiert, mit seiner Quelle verknüpft und wird vor der Indexierung durch das Indexierungs-Gate geprüft.

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

## Ziel

MAYALINES ist als schnelle, übersichtliche und suchmaschinenfreundliche Anlaufstelle für Zitate, Autoren, Themen und Gedichte konzipiert. Besucher können Inhalte entdecken, Zitate kopieren, teilen, liken und neue Zitate zur redaktionellen Prüfung einreichen.
