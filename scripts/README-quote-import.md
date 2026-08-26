# Import der Zitate

Der produktive Zitatimport erfolgt über `scripts/build-wikisource-quotes.mjs`.

Das Skript ruft die öffentliche Wikisource-Ausgabe zur Build-Zeit ab und schreibt genau 2.000 Datensätze nach `data/quotes.json`.

Die verwendete Ausgabe enthält rund 3.000 ausgewählte Zitate und wird von Wikisource als weltweit gemeinfrei gekennzeichnet.
