# MAYALINES

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

**Worte, die bleiben.**

> MAYALINES ist eine schnelle, minimalistische und durchsuchbare Sammlung bemerkenswerter Zitate, Autoren, Themen und Gedichte.

🌐 **Website:** [https://mayalines.com](https://mayalines.com)

---

## 🚀 Features

| Feature | Beschreibung |
|---------|-------------|
| 🔍 Durchsuchbar | 49.000+ öffentlich zugängliche Zitate |
| ❤️ Likes | Serverseitig persistent in PostgreSQL |
| 📤 Submissions | Redaktionelle Prüfung über `/submit` |
| 📊 Rankings | `/popular` (Lifetime) und `/trending` (7 Tage) |
| 🔒 Sicherheit | Rate-Limiting (Redis), SQL-Injection-Schutz, XSS-Prävention |

---

## 🛠 Technologie-Stack

| Schicht | Technologie | Verwendung |
|---------|-------------|------------|
| **Framework** | Next.js 15 | SSR, static rendering, routing |
| **Language** | TypeScript | Typsicherheit, bessere IDE-Unterstützung |
| **Database** | Neon PostgreSQL | Persistente Likes, Shares, Submissions |
| **Cache/Rate-Limit** | Upstash Redis | Verteiltes Rate-Limiting |
| **Hosting** | Vercel | CI/CD, edge network, serverless |

---

## 🔐 Security-Features

### Cyber-Security-Best-Practices

| Maßnahme | Implementierung |
|----------|-----------------|
| **Keine Hardcoded Credentials** | Alle sensiblen Werte über Environment-Variablen (`DATABASE_URL`, `REDIS_URL`) |
| **SQL-Injection-Schutz** | Parameterized Queries über Prisma/Neon SQL Client |
| **XSS-Schutz** | Reacts standardmäßiges Escaping, `dangerouslySetInnerHTML` nur mit geprüften Inputs |
| **Rate-Limiting** | Upstash Redis für verteiltes Limiting, HTTP-only Cookies für Session-Erkennung |
| **Same-Origin-Schutz** | CORS-Konfiguration, Content-Security-Policy über `next.config.mjs` |
| **Security-Header** | Automatisch via Vercel + manuelle Konfiguration im Server |

### Zitat-Lizenzprüfung

Jeder Datensatz wird vor der Veröffentlichung auf folgendes geprüft:
- ✅ Verifizierte Attribution (Urheber/nachweisbarer Quelle)
- ✅ geklärter Copyright-Status (Public Domain oder lizenziert)
- ✅ `indexable: true` für Suchmaschinen-Freigabe

Nur Zitate, die alle Kriterien erfüllen, erscheinen in Sitemaps und sind öffentlich über die Suche auffindbar.

---

## 📦 Installation & Entwicklung

```bash
# Repository klonen
git clone https://github.com/linuxaaron/mayalines.git
cd mayalines

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev
```

**Requirement:** Node.js 18+, PostgreSQL/Neon-Datenbank

---

## 🏗️ Build & Deployment

```bash
# Produktions-Build
npm run build

# Server starten
npm start
```

### Vercel Deployment

Die Anwendung ist für Vercel vorkonfiguriert. Erforderliche Environment-Variablen für Production:

```text
DATABASE_URL          # Neon PostgreSQL connection string
REDIS_URL             # Upstash Redis connection string
```

---

## 🧪 Quality Assurance

```bash
# Code-Checks
npm run lint              # ESLint
npm run typecheck         # TypeScript check
npm run audit:quotes      # Zitat-Daten-Validierung
npm run audit:licensed    # Lizenz-Check
npm run test:smoke        # Smoke-Tests (Server-Startup, Routes, Security-Header)
```

### CI/CD-Pipeline

GitHub Actions führt automatisch bei Pull Requests und `main`-Branch-Änderungen aus:
- Alle oben genannten Checks
- Dependency-Audit (`npm audit`)
- Build-Verification

---

## 📂 Project Structure

```
mayalines/
├── app/                  # Next.js App Router
│   ├── (site)/          # Öffentliche Seiten
│   ├── api/             # Server Actions & API Routes
│   └── layout.tsx       # Root-Layout mit Providers
├── components/          # React-Komponenten
├── lib/                 # Shared Utility Functions
│   ├── seo.ts          # SEO-Helper (isSeoIndexable, attributionStatus)
│   └── security.ts     # Security-Checks (input sanitization, rate-limit helpers)
├── db/                  # Database
│   ├── schema.sql      # PostgreSQL Schema (muss einmalig ausgeführt werden)
│   └── seeds/          # Seed-Daten für Development
├── data/                # Generierte Zitat-Daten
│   └── quotes.json     # Produktions-Zitat-Daten
├── public/              # Statische Assets
├── next.config.mjs      # Next.js Konfiguration
└── tsconfig.json        # TypeScript Konfiguration
```

---

## 🤝 Contribution Guidelines

### Fork-Workflow

```bash
# 1. Fork erstellen (über GitHub UI)
# 2. Lokal klonen
git clone https://github.com/<your-username>/mayalines.git
cd mayalines

# 3. Upstream-Remote hinzufügen
git remote add upstream https://github.com/linuxaaron/mayalines.git

# 4. Branch erstellen (feature- oder fix-Branch)
git checkout -b feature/your-feature-name

# 5. Änderungen commiten
git add .
git commit -m "feat: beschreibe deine Änderung"

# 6. Pushen
git push origin feature/your-feature-name

# 7. Pull Request erstellen (via GitHub UI)
```

### Branching-Strategie

| Branch | Zweck |
|--------|-------|
| `main` | Production-ready, protected (PR required, CI checks mandatory) |
| `develop` | Integration-Branch (optional) |
| `feature/*` | Neue Features |
| `fix/*` | Bugfixes |

---

## 📊 Zitatdaten

| Quelle | Anzahl | Status |
|--------|--------|--------|
| Öffentliche Bibliotheken | ~48.500 | ✅ Indexiert, verifiziert |
| Community-Submissions | ~500 | ⏳ Redaktionelle Prüfung |

Der Produktionsdatensatz enthält 49.000+ öffentlich durchsuchbare Datensätze mit verifizierter Attribution und geklärtem Copyright-Status.

---

## 📜 Lizenz

Das Projekt ist öffentlich zugänglich. Die Zitat-Daten selbst unterliegen den Lizenzbedingungen ihrer jeweiligen Quellen (overwiegend Public Domain).

---

## 🙏 Danksagung

Danksagung an alle-contributors und die Open-Source-Community für die Inspiration.

---

**Built with Next.js, PostgreSQL & Redis** | 🇩🇪
