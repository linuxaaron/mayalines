import type { Metadata } from "next";
import importedPoems from "../../data/poems.imported.json";
import generatedPoems from "../../data/poems.generated.json";

export const metadata: Metadata = {
  title: "Famous Poems in English, German, French, Spanish & Italian",
  description: "Read a growing multilingual collection of public-domain poems by Emily Dickinson, William Blake, Friedrich Schiller, Charles Baudelaire, Gustavo Adolfo Bécquer, Giacomo Leopardi and more.",
  alternates: { canonical: "https://mayalines.com/poems" },
  openGraph: {
    title: "Famous Poems in Multiple Languages | MAYALINES",
    description: "Public-domain poetry in English, German, French, Spanish, Italian and more.",
    images: [{ url: "/mayalines-poetry.svg", width: 1200, height: 675, alt: "MAYALINES multilingual poetry collection" }],
  },
};

type Poem = {
  id: string;
  title: string;
  author: string;
  period?: string;
  language?: string;
  text: string;
  source?: string;
  sourceName?: string;
  attributionStatus?: string;
  copyrightStatus?: string;
  indexable?: boolean;
};

const languageNames: Record<string, string> = {
  en: "English", de: "Deutsch", fr: "Français", es: "Español", it: "Italiano", pt: "Português",
};

const allPoems: Poem[] = [...(generatedPoems as Poem[]), ...(importedPoems as Poem[])];
const seen = new Set<string>();
const poems = allPoems.filter((poem) => {
  const key = `${poem.author.toLowerCase()}|${poem.title.toLowerCase()}`;
  if (seen.has(key)) return false;
  seen.add(key);
  return poem.indexable !== false && poem.copyrightStatus !== "needs-review";
});
const visiblePoems = poems.slice(0, 120);
const languages = [...new Set(poems.map((poem) => poem.language ?? "en"))];

function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function PoemsPage() {
  return <main className="poems-page">
    <style>{`
      .poems-page{min-height:100vh;background:#d8d5cf;color:#171513}
      .poems-header,.poems-hero,.poem-grid,.poems-stats{width:min(1180px,calc(100% - 36px));margin-left:auto;margin-right:auto}
      .poems-header{padding:28px 0;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #bdb8af}
      .poems-brand{font:500 25px Georgia,serif;letter-spacing:.13em}.poems-header nav{display:flex;gap:22px;font:12px system-ui,sans-serif;color:#5f5a53}
      .poems-hero{padding:66px 0 36px}.poems-hero h1{max-width:880px;margin:0;font:500 clamp(45px,7vw,78px)/.98 Georgia,serif;letter-spacing:-.045em}
      .poems-hero p:not(.eyebrow){max-width:760px;margin:22px 0 0;color:#48433d;font:15px/1.65 system-ui,sans-serif}
      .eyebrow{margin:0 0 14px;color:#674934;font:750 10px/1 system-ui,sans-serif;letter-spacing:.19em}
      .poems-stats{display:flex;flex-wrap:wrap;gap:8px;padding:0 0 38px}.poems-stats span{padding:7px 10px;border:1px solid #bdb8af;border-radius:999px;font: 700 10px system-ui,sans-serif;color:#625b54;background:#e7e4de}
      .poem-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;padding-bottom:70px}
      .poem-card{padding:28px;border:1px solid #bdb8af;border-radius:8px;background:#e7e4de;box-shadow:0 8px 24px rgba(23,21,19,.04)}
      .poem-label{display:flex;justify-content:space-between;gap:10px;color:#674934;font:750 10px/1 system-ui,sans-serif;letter-spacing:.13em;text-transform:uppercase}
      .poem-card h2{margin:13px 0 0;font:500 29px/1.08 Georgia,serif;letter-spacing:-.025em}.poem-author{margin:10px 0 0;color:#514b45;font:700 11px system-ui,sans-serif}
      .poem-divider{height:1px;background:#c6c0b8;margin:20px 0}.poem-text{margin:0;white-space:pre-line;font:17px/1.62 Georgia,serif;color:#11100f;display:-webkit-box;-webkit-line-clamp:18;-webkit-box-orient:vertical;overflow:hidden}
      .poem-author-link{display:inline-block;margin-top:22px;color:#674934;font:750 10px system-ui,sans-serif;letter-spacing:.07em;text-transform:uppercase}
      @media(max-width:760px){.poems-header{align-items:flex-start;gap:16px;flex-direction:column}.poems-header nav{width:100%;justify-content:space-between}.poem-grid{grid-template-columns:1fr}.poem-card{padding:24px 20px}.poem-text{font-size:16px}}
    `}</style>
    <header className="poems-header"><a href="/" className="poems-brand">MAYALINES</a><nav aria-label="Poems navigation"><a href="/">Quotes</a><a href="/authors">Authors</a><a href="/categories">Categories</a><a href="/collections">Collections</a></nav></header>
    <section className="poems-hero"><p className="eyebrow">MAYALINES · MULTILINGUAL POETRY</p><h1>Poems from different languages and centuries.</h1><p>A growing collection of verified public-domain poetry. Sources and language metadata are stored with every generated record so the library can expand without sacrificing attribution quality.</p></section>
    <div className="poems-stats" aria-label="Poetry collection statistics"><span>{poems.length.toLocaleString("en-US")} poems</span>{languages.map((language) => <span key={language}>{languageNames[language] ?? language.toUpperCase()}</span>)}</div>
    <section className="poem-grid" aria-label="Poems">{visiblePoems.map((poem) => <article className="poem-card" key={poem.id} lang={poem.language ?? "en"}><p className="poem-label"><span>POEM</span><span>{languageNames[poem.language ?? "en"] ?? (poem.language ?? "en").toUpperCase()}</span></p><h2>{poem.title}</h2><p className="poem-author">— {poem.author}{poem.period ? ` · ${poem.period}` : ""}</p><div className="poem-divider" aria-hidden="true"/><p className="poem-text">{poem.text}</p><a className="poem-author-link" href={`/authors/${slugify(poem.author)}`}>Explore author →</a></article>)}</section>
  </main>;
}
