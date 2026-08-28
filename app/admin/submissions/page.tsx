"use client";

import { FormEvent, useState } from "react";

type Submission = { id: number; quote: string; author: string; source: string | null; category: string; submitter_name: string | null; status: "pending" | "approved" | "rejected"; created_at: string };

export default function SubmissionReviewPage() {
  const [token, setToken] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function api(path: string, init: RequestInit = {}) {
    return fetch(path, { ...init, headers: { ...(init.headers || {}), Authorization: `Bearer ${token.trim()}` }, cache: "no-store" });
  }

  async function login(event?: FormEvent) {
    event?.preventDefault();
    if (!token.trim()) return;
    setLoading(true); setMessage("");
    try {
      const response = await api("/api/admin/quote-submissions");
      if (!response.ok) throw new Error(response.status === 401 ? "Invalid review token." : "The submission service is currently unavailable.");
      const data = await response.json() as { submissions: Submission[] };
      setSubmissions(data.submissions); setAuthenticated(true);
    } catch (error) { setAuthenticated(false); setMessage(error instanceof Error ? error.message : "Could not connect to the review service."); }
    finally { setLoading(false); }
  }

  async function updateSubmission(id: number, status: "approved" | "rejected") {
    setMessage("");
    const response = await api("/api/admin/quote-submissions", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ id: String(id), status }).toString() });
    if (response.status === 401) { setAuthenticated(false); setMessage("Your review session is no longer authorized."); return; }
    if (!response.ok) { setMessage("The submission could not be updated."); return; }
    setSubmissions((current) => current.map((item) => item.id === id ? { ...item, status } : item));
  }

  return <main className="admin-shell">
    <header className="admin-header"><a href="/" className="admin-brand">MAYALINES</a><span>Submission review</span></header>
    <section className="admin-content">
      <div className="admin-intro"><p className="admin-eyebrow">PRIVATE EDITORIAL AREA</p><h1>Quote submissions</h1><p>Review community submissions before they are added to the public library.</p></div>
      {!authenticated ? <form className="admin-auth-box" onSubmit={login}>
        <label htmlFor="review-token">Admin review token</label>
        <div className="admin-auth-row"><input id="review-token" type="password" value={token} onChange={(event) => setToken(event.target.value)} placeholder="Enter your private token" autoComplete="off" /><button type="submit" disabled={loading || !token.trim()}>{loading ? "CHECKING…" : "SIGN IN"}</button></div>
        <p className="admin-auth-help">The token is checked server-side and is never stored in the database.</p>
        {message && <p className="admin-message" role="alert">{message}</p>}
      </form> : <>
        <div className="admin-toolbar"><span>{submissions.filter((item) => item.status === "pending").length} pending · {submissions.length} total</span><div><button type="button" onClick={() => void login()}>REFRESH</button><button type="button" onClick={() => { setAuthenticated(false); setToken(""); setSubmissions([]); }}>SIGN OUT</button></div></div>
        {message && <p className="admin-message" role="alert">{message}</p>}
        <div className="admin-list">
          {submissions.map((submission) => <article className="admin-card" key={submission.id}>
            <div className="admin-card-meta"><span>#{submission.id}</span><span>{submission.category}</span><span className={`admin-status admin-status-${submission.status}`}>{submission.status}</span><span>{new Date(submission.created_at).toLocaleString()}</span></div>
            <blockquote>“{submission.quote}”</blockquote><p className="admin-author">— {submission.author}</p>
            {submission.source && <p className="admin-source">Source: {submission.source}</p>}{submission.submitter_name && <p className="admin-source">Submitted by: {submission.submitter_name}</p>}
            <div className="admin-actions"><button type="button" onClick={() => void updateSubmission(submission.id, "approved")} disabled={submission.status === "approved"}>Approve</button><button type="button" onClick={() => void updateSubmission(submission.id, "rejected")} disabled={submission.status === "rejected"}>Reject</button></div>
          </article>)}
          {submissions.length === 0 && <p className="admin-empty">No submissions found.</p>}
        </div>
      </>}
    </section>
  </main>;
}
