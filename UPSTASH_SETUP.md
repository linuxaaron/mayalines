# Dauerhafte Zitatbewertungen

Mayalines verwendet Upstash Redis für gemeinsam gespeicherte Bewertungszähler
und Rate Limits für öffentliche Schreib-APIs.

Füge diese Umgebungsvariablen in den Vercel-Projekteinstellungen unter **Umgebungsvariablen** hinzu:

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

Verwende die Umgebung **Production** und bei Bedarf zusätzlich **Preview**, wenn Bewertungen auch in Vorschauversionen funktionieren sollen.

Ohne diese Variablen liefert die API bewusst eine nicht dauerhaft gespeicherte Antwort, anstatt den Website-Build fehlschlagen zu lassen.

Ohne Redis greift für Entwicklung nur ein speicherlokales Rate Limit. In
Production sind die Variablen erforderlich, damit Limits über alle
Serverless-Instanzen hinweg wirksam sind.

## Sicherheit

- Redis-Tokens niemals in Git committen.
- Zugangsdaten ausschließlich als Vercel-Umgebungsvariablen speichern.
- Die API validiert Zitat-IDs und akzeptiert ausschließlich die Aktionen `like` und `unlike`.
- Öffentliche Schreibzugriffe sind pro anonymisierter IP begrenzt; Quote-Submissions
  zusätzlich auf fünf Anfragen in zehn Minuten.
