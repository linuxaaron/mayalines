# Quote quality and publication policy

## Goal

The project targets 2,000 English quote records, but quantity is not sufficient for publication or SEO indexing.

## Source staging

The current build pipeline stages records from the public Quotable data repository. The upstream project describes its API and data as open source, but the repository page does not by itself establish that every individual quotation is public domain or commercially reusable in every jurisdiction.

Therefore imported records remain:

- `attributionStatus: source-dataset-attributed`
- `copyrightStatus: review-required`
- `indexable: false`

No record should be changed to `indexable: true` until attribution and rights have been reviewed for the intended publication use.

## Review requirements

For each quote intended for public indexing:

1. Verify the wording against a reliable primary or authoritative source.
2. Verify the attribution to the named author.
3. Record the source title, date or edition where available, and a source URL where appropriate.
4. Determine whether the text is public domain, licensed for the intended use, or requires permission.
5. Reject disputed or unsupported attributions unless the page clearly presents them as disputed and the editorial value justifies publication.
6. Check for exact and near-duplicate wording.
7. Assign one primary category and retain source tags separately.
8. Add useful editorial context where the page is intended for search traffic.

## SEO / AdSense rule

Do not mass-index automatically generated quote pages merely because the dataset contains them. Google Publisher Policies prohibit Google-served ads on screens containing copied or automatically generated content without additional commentary, curation, or other value. The site therefore uses `indexable` as an explicit publication gate.

Category and author pages should contain meaningful editorial information before indexing. Quote pages should be indexed only after the underlying quote is cleared and the page provides more than a bare copied quotation.

## Audit

Run:

```bash
npm run audit:quotes
```

The audit fails the build-quality check when records are missing required fields, duplicate author/quote pairs exist, the expected count is wrong, or an uncleared record has been marked indexable.
