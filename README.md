# MAYALINES

**Worte, die bleiben.**

MAYALINES ist eine schnelle, minimalistische und durchsuchbare Sammlung bemerkenswerter Zitate, Autoren und Gedanken.

**Website:** https://mayalines.com

## Eine besondere Widmung

MAYALINES wurde in Anerkennung eines ganz besonderen Menschen geschaffen.

Diese Website ist diesem Menschen gewidmet und soll einen Ort schaffen, an dem bedeutende Worte, Gedanken und Erinnerungen dauerhaft bewahrt werden können.

## Technologie

- Next.js
- React
- TypeScript
- Vercel
- Upstash Redis für persistente Likes und Community-Rankings

## Zitatdaten

Der Produktionsdatensatz enthält 2.000 Zitate aus einer festgelegten öffentlichen Quelle. Jeder Datensatz ist dedupliziert, kategorisiert, mit seiner Quelle verknüpft und wird vor der Indexierung durch das Indexierungs-Gate geprüft.

Die erzeugte Datei `data/quotes.json` enthält die produktiven Zitatdaten. Das Indexierungs-Gate berücksichtigt ausschließlich Datensätze mit verifizierter Zuordnung, geklärtem Veröffentlichungsstatus und aktivierter Indexierung.

## Likes und Rankings

Likes werden serverseitig in Upstash Redis gespeichert. Ein langlebiges, HTTP-only Cookie identifiziert den Besucher, sodass ein Like nach einem Reload erhalten bleibt und pro Besucher nicht mehrfach gezählt wird.

Die Seite `/popular` zeigt die meistgelikten Zitate als Community-Ranking. `/trending` verwendet ein separates Redis-Sorted-Set für die zuletzt gelikten Zitate.

Für Vercel Production müssen diese Variablen gesetzt sein:

```text
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```

Eine Vorlage befindet sich in `.env.example`.

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

Die Website ist als schnelle, übersichtliche und suchmaschinenfreundliche Anlaufstelle für Zitate, Autoren und Themen konzipiert. Zitate können sofort kopiert, nach Autoren durchsucht und nach Kategorien gefiltert werden.
