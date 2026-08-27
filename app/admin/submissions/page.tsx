"use client";

import { useState } from "react";

type Submission = {
  id: number;
  quote: string;
  author: string;
  source: string | null;
  category: string;
  submitter_name: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

export default function SubmissionReviewPage() {
  const [token, setToken] = useState("");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function loadSubmissions() {
    if (!token.trim()) return;
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/quote-submissions", {
        headers: { Authorization: `Bearer ${token.trim()}` },
        cache: "no-store",
      });
      if (!response.ok) throw new Error(response.status === 401 ? "Invalid review token." : "Could not load submissions.");
      const data = await response.json() as { submissions: Submission[] };
      setSubmissions(data.submissions);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load submissions.");
    } finally {
      setLoading(false);
    }
  }

  async function updateSubmission(id: number, status: "approved" | "rejected") {
    setMessage("");
    const response = await fetch("/api/admin/quote-submissions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.trim()}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ id: String(id), status }).toString(),
    });

    if (!response.ok) {
      setMessage("The submission could not be updated.");
      return;
    }

    setSubmissions((current) => current.map((submission) => submission.id === id ? { ...submission, status } : submission));
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <a href="/" className="admin-brand">MAYALINES</a>
        <span>Submission review</span>
      </header>

      <section className="admin-content">
        <div className="admin-intro">
          <p className="admin-eyebrow">PRIVATE EDITORIAL AREA</p>
          <h1>Quote submissions</h1>
          <p>Review incoming quotes before they are added to the public library.</p>
        </div>

        <div className="admin-auth-box">
          <label htmlFor="review-token">Review token</label>
          <div className="admin-auth-row">
            <input
              id="review-token"
              type="password"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              onKeyDown={(event) => { if (event.key === "Enter") void loadSubmissions(); }}
              placeholder="Enter ADMIN_REVIEW_TOKEN"
              autoComplete="off"
            />
            <button type="button" onClick={() => void loadSubmissions()} disabled={loading || !token.trim()}>
              {loading ? "LOADING…" : "OPEN SUBMISSIONS"}
            </button>
          </div>
          {message && <p className="admin-message" role="alert">{message}</p>}
        </div>

        {submissions.length > 0 && (
          <div className="admin-list">
            {submissions.map((submission) => (
              <article className="admin-card" key={submission.id}>
                <div className="admin-card-meta">
                  <span>#{submission.id}</span>
                  <span>{submission.category}</span>
                  <span className={`admin-status admin-status-${submission.status}`}>{submission.status}</span>
                </div>
                <blockquote>“{submission.quote}”</blockquote>
                <p className="admin-author">— {submission.author}</p>
                {submission.source && <p className="admin-source">Source: {submission.source}</p>}
                {submission.submitter_name && <p className="admin-source">Submitted by: {submission.submitter_name}</p>}
                <div className="admin-actions">
                  <button type="button" onClick={() => void updateSubmission(submission.id, "approved")} disabled={submission.status === "approved"}>Approve</button>
                  <button type="button" onClick={() => void updateSubmission(submission.id, "rejected")} disabled={submission.status === "rejected"}>Reject</button>
                </div>
              </article>
            ))}
          </div>
        )}

        {submissions.length === 0 && token && !loading && !message && <p className="admin-empty">No submissions found.</p>}
      </section>
    </main>
  );
}
