# MAYALINES

**Words that last.**

MAYALINES is a fast, minimalist and searchable collection of remarkable quotes, authors and thoughts.

## Technology

- Next.js
- React
- TypeScript
- Vercel

## Quote Data

The production dataset contains 2,000 quote records from a fixed public source. Each record is deduplicated, categorized, linked to its source and checked by the indexing gate before search engine indexing.

The generated `data/quotes.json` contains the production quote data. The indexing gate only considers records with verified attribution, cleared publication status and indexing enabled.

## Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm start
```

## Repository

MAYALINES is the current brand of the former `quotes` project.

## Goal

The website is designed to be a fast, clean and search-friendly destination for quotes, authors and topics. Quotes can be copied instantly, browsed by author and filtered by category.
