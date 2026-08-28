"use client";

import { useCallback, useEffect, useState } from "react";

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
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadSubmissions = useCallback(async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/quote-submissions", { cache: "no-store" });
      const data = await response.json().catch(() => ({})) as { submissions?: Submission[]; error?: string };
      if (!response.ok) throw new Error(data.error || "Could not load submissions.");
      setSubmissions(data.submissions ?? []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load submissions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadSubmissions(); }, [loadSubmissions]);

  async function updateSubmission(id: number, status: "approved" | "rejected") {
    setMessage("");
    const response = await fetch("/api/admin/quote-submissions", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ id: String(id), status }).toString(),
    });
    const data = await response.json().catch(() => ({})) as { error?: string };
    if (!response.ok) {
      setMessage(data.error || "The submission could not be updated.");
      return;
    }
    setSubmissions((current) => current.map((item) => item.id === id ? { ...item, status } : item));
  }

  return <main className="admin-shell">
    <header className="admin-header">
      <a href="/" className="admin-brand">MAYALINES</a>
      <span>Submission review</span>
    </header>

    <section className="admin-content">
      <div className="admin-intro">
        <p className="admin-eyebrow">PRIVATE EDITORIAL AREA</p>
        <h1>Quote submissions</h1>
        <p>Review community submissions before they are added to the public library.</p>
      </div>

      <div className="admin-toolbar">
        <span>{submissions.filter((item) => item.status === "pending").length} pending · {submissions.length} total</span>
        <button type="button" onClick={() => void loadSubmissions()} disabled={loading}>REFRESH</button>
      </div>

      {message && <p className="admin-message" role="alert">{message}</p>}

      <div className="admin-list">
        {submissions.map((submission) => <article className="admin-card" key={submission.id}>
          <div className="admin-card-meta">
            <span>#{submission.id}</span>
            <span>{submission.category}</span>
            <span className={`admin-status admin-status-${submission.status}`}>{submission.status}</span>
            <span>{new Date(submission.created_at).toLocaleString()}</span>
          </div>
          <blockquote>“{submission.quote}”</blockquote>
          <p className="admin-author">— {submission.author}</p>
          {submission.source && <p className="admin-source">Source: {submission.source}</p>}
          {submission.submitter_name && <p className="admin-source">Submitted by: {submission.submitter_name}</p>}
          <div className="admin-actions">
            <button type="button" onClick={() => void updateSubmission(submission.id, "approved")} disabled={submission.status === "approved"}>Approve</button>
            <button type="button" onClick={() => void updateSubmission(submission.id, "rejected")} disabled={submission.status === "rejected"}>Reject</button>
          </div>
        </article>)}
        {!loading && submissions.length === 0 && !message && <p className="admin-empty">No submissions found.</p>}
      </div>
    </section>
  </main>;
}
