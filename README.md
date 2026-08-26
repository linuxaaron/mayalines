# MAYALINES

**Words Worth Keeping.**

MAYALINES is a fast, minimal and searchable collection of memorable quotes, authors and ideas.

## Stack

- Next.js
- React
- TypeScript
- Vercel

## Quote data

The production build deterministically generates 2,000 quote records from a pinned Quotable dataset commit. Each record is deduplicated, categorized, attributed to the source dataset and marked `review-required` for copyright review before indexing.

The generated `data/quotes.json` is a build artifact and is recreated during `prebuild`.

## Development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm start
```

## Repository

The repository is currently being migrated from the original `quotes` project name to the MAYALINES brand.
