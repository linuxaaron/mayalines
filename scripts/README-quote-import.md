# Import der Zitate

Der produktive Zitatimport erfolgt über `scripts/build-wikisource-quotes.mjs`.

Das Build-Skript ruft die öffentlichen Wikisource- und Project-Gutenberg-Quellen zur Build-Zeit ab und schreibt genau 5.000 Datensätze nach `data/quotes.json`.

Die Wikisource-Ausgabe enthält rund 3.000 ausgewählte Zitate und wird von Wikisource als weltweit gemeinfrei gekennzeichnet. Der Korpus wird durch verifizierte gemeinfreie Zitate aus Project Gutenberg ergänzt.
