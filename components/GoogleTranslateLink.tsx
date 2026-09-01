"use client";

export default function GoogleTranslateLink() {
  function openTranslation() {
    const currentUrl = window.location.href;
    const browserLanguage = (navigator.language || "en").split("-")[0].toLowerCase();
    const targetLanguage = /^[a-z]{2,3}$/.test(browserLanguage) ? browserLanguage : "en";
    const translateUrl = new URL("https://translate.google.com/translate");
    translateUrl.searchParams.set("sl", "auto");
    translateUrl.searchParams.set("tl", targetLanguage);
    translateUrl.searchParams.set("u", currentUrl);
    window.open(translateUrl.toString(), "_blank", "noopener,noreferrer");
  }

  return (
    <button
      type="button"
      className="google-translate-shortcut"
      onClick={openTranslation}
      aria-label="Translate this page with Google Translate"
      title="Translate this page with Google Translate"
    >
      <span aria-hidden="true">文A</span>
      <span>Translate</span>
      <style>{`
        .google-translate-shortcut{
          position:fixed;
          right:18px;
          bottom:18px;
          z-index:150;
          display:inline-flex;
          align-items:center;
          gap:7px;
          min-height:38px;
          padding:8px 12px;
          border:1px solid rgba(31,77,58,.24);
          border-radius:999px;
          background:rgba(251,250,248,.94);
          color:#1f4d3a;
          box-shadow:0 8px 24px rgba(23,21,19,.10);
          backdrop-filter:blur(12px);
          font:700 10px/1 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
          letter-spacing:.05em;
          cursor:pointer;
          transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease;
        }
        .google-translate-shortcut:hover{
          transform:translateY(-1px);
          border-color:rgba(31,77,58,.42);
          box-shadow:0 11px 28px rgba(23,21,19,.14);
        }
        .google-translate-shortcut:focus-visible{
          outline:2px solid #1f4d3a;
          outline-offset:3px;
        }
        .google-translate-shortcut span:first-child{
          font-family:Georgia,"Times New Roman",serif;
          font-size:13px;
          letter-spacing:-.08em;
        }
        @media(max-width:560px){
          .google-translate-shortcut{
            right:12px;
            bottom:12px;
            min-height:34px;
            padding:7px 10px;
            font-size:9px;
          }
        }
        @media(prefers-reduced-motion:reduce){
          .google-translate-shortcut{transition:none}
        }
      `}</style>
    </button>
  );
}
