# MAYALINES

**Worte, die bleiben.**

MAYALINES ist eine schnelle, minimalistische und durchsuchbare Sammlung bemerkenswerter Zitate, Autoren und Gedanken.

## Technologie

- Next.js
- React
- TypeScript
- Vercel

## Zitatdaten

Die Produktionsversion enthält 2.000 Zitatdatensätze aus einer festgelegten öffentlichen Quelle. Jeder Datensatz wird dedupliziert, kategorisiert, mit seiner Quelle verknüpft und vor der Suchmaschinenindexierung durch das Indexierungs-Gate geprüft.

Die generierte `data/quotes.json` enthält die produktiven Zitatdaten. Das Indexierungs-Gate berücksichtigt nur Datensätze mit bestätigter Zuordnung, geklärtem Veröffentlichungsstatus und aktivierter Indexierung.

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

## Repository

MAYALINES ist die aktuelle Marke des früheren Projekts `quotes`.

## Ziel

Die Website soll eine schnelle, übersichtliche und suchmaschinenfreundliche Anlaufstelle für Zitate, Autoren und Themen sein. Zitate können direkt kopiert, nach Autoren durchsucht und nach Kategorien gefiltert werden.
