"use client";
import { useState } from "react";

export default function SaveQuoteButton({ quoteId }: { quoteId: string }) {
  const [message, setMessage] = useState("");
  async function save(collection: string) {
    try {
      const response = await fetch("/api/library", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "save", quoteId, collection }) });
      if (!response.ok) throw new Error();
      setMessage(`Saved to ${collection}`);
    } catch { setMessage("Saving is unavailable"); }
  }
  return <span className="quote-save"><button className="copy-button" type="button" onClick={() => void save("Favorites")}>SAVE</button><details><summary className="copy-button">LIST</summary><div className="quote-save-menu"><button type="button" onClick={() => void save("Read later")}>Read later</button><button type="button" onClick={() => { const name = window.prompt("Name your list (max. 60 characters)"); if (name) void save(name); }}>New list</button></div></details>{message && <span className="sr-only" role="status">{message}</span>}<style>{`.quote-save{display:inline-flex;gap:5px;align-items:center;position:relative}.quote-save details{position:relative}.quote-save summary{list-style:none;cursor:pointer}.quote-save summary::-webkit-details-marker{display:none}.quote-save-menu{position:absolute;z-index:20;right:0;bottom:calc(100% + 5px);min-width:110px;padding:6px;background:var(--surface,#fff);border:1px solid var(--border);box-shadow:0 8px 20px rgba(0,0,0,.12)}.quote-save-menu button{display:block;width:100%;padding:7px;text-align:left;background:transparent;border:0;color:var(--foreground);font:inherit;cursor:pointer}.quote-save-menu button:hover{background:var(--brown-wash,#eee)}`}</style></span>;
}
