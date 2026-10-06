# Quote source policy

This document defines the provenance standard for public quote records.

## Accepted discovery sources

- Wikisource public-domain editions with an explicit public-domain statement.
- Project Gutenberg works explicitly identified as public domain in the relevant jurisdiction, with jurisdiction recorded per dataset.

## Indexability rule

A quote is indexable only when all of the following are true:

1. The quote text is matched to a concrete source work/page.
2. The attributed author is supported by the source or a reliable primary/secondary reference.
3. The relevant quotation/work is cleared for the target jurisdiction.
4. The exact source URL is stored.
5. The record passes `scripts/audit-quotes.mjs`.

Discovery datasets may be used to locate candidate quotations, but their dataset license does not itself grant rights to the underlying quotation text.

## Verified sources currently reviewed

- [Three Thousand Selected Quotations from Brilliant Writers](https://en.wikisource.org/wiki/Three_Thousand_Selected_Quotations_from_Brilliant_Writers) — Wikisource marks the work public domain worldwide.
- [A Dictionary of Thoughts — Tryon Edwards](https://en.wikisource.org/wiki/Author:Tryon_Edwards) — Wikisource identifies the 1906 work and marks relevant works by Edwards public domain worldwide.
- [Dictionary of Quotations (Classical)](https://en.wikisource.org/wiki/Dictionary_of_Quotations_(Classical)) — Wikisource marks the work public domain worldwide, but the transcription is incomplete, so records require exact-source verification.
- [John Bartlett — Familiar Quotations](https://en.wikisource.org/wiki/Author:John_Bartlett) — Wikisource lists early editions and marks relevant works public domain worldwide.
- [Dictionary of Quotations — Project Gutenberg](https://www.gutenberg.org/ebooks/48105) — public domain in the USA; do not treat this alone as worldwide clearance.

## Editorial rule

Never invent an author, source, quotation wording, publication date, or copyright status. Uncertain attribution must remain explicitly marked and non-indexable until verified.
