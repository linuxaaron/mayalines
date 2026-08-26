# Qualität und Veröffentlichungsrichtlinie für Zitate

## Ziel

Das Projekt enthält 2.000 englischsprachige Zitatdatensätze. Die Anzahl allein reicht jedoch nicht für eine Veröffentlichung oder Suchmaschinenindexierung aus.

## Quellenbasis

Die aktuelle Importpipeline verwendet das Werk *Three Thousand Selected Quotations from Brilliant Writers* über Wikisource. Die Datensätze werden mit der Quelle verknüpft, dedupliziert und mit einem Veröffentlichungsstatus versehen.

Die Angabe einer offenen Quelle bedeutet nicht automatisch, dass jede einzelne Zuordnung oder jede Nutzung in jeder Rechtsordnung abschließend geklärt ist.

## Anforderungen an die Prüfung

Für jedes Zitat, das für die öffentliche Indexierung vorgesehen ist:

1. Wortlaut mit einer zuverlässigen Primär- oder maßgeblichen Quelle abgleichen.
2. Zuordnung zum genannten Autor prüfen.
3. Titel, Erscheinungsjahr oder Ausgabe und eine geeignete Quellen-URL dokumentieren, soweit verfügbar.
4. Prüfen, ob der Text gemeinfrei ist, für den vorgesehenen Zweck lizenziert wurde oder eine Genehmigung benötigt.
5. Strittige oder unbelegte Zuordnungen nicht als eindeutig verifiziert veröffentlichen.
6. Exakte und nahezu identische Duplikate prüfen.
7. Eine primäre Kategorie vergeben und Quellenangaben getrennt erhalten.
8. Für Seiten mit Suchmaschinenziel einen echten redaktionellen Mehrwert ergänzen.

## SEO- und Werberegel

Zitatseiten nicht allein deshalb massenhaft indexieren, weil sie in einem Datensatz vorhanden sind. Automatisch erzeugte oder kopierte Inhalte benötigen zusätzlichen redaktionellen, kuratorischen oder sonstigen eigenständigen Mehrwert.

Das Projekt verwendet `indexable` deshalb als ausdrückliches Veröffentlichungs-Gate. Kategorien- und Autorenseiten benötigen sinnvolle redaktionelle Informationen, bevor sie indexiert werden sollten. Einzelne Zitatseiten sollen erst nach abgeschlossener Prüfung und mit zusätzlichem Seitenwert indexiert werden.

## Prüfung

Ausführen:

```bash
npm run audit:quotes
```

Die Prüfung schlägt fehl, wenn Pflichtfelder fehlen, doppelte Autor-/Zitat-Paare existieren, die erwartete Anzahl nicht stimmt oder ein nicht ausreichend geklärter Datensatz als indexierbar markiert wurde.
