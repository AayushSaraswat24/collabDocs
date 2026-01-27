"use client";

import { useEffect, useState } from "react";

type DocumentItem = {
  id: string;
  name: string;
  isOwner: boolean;
};

export default function TestDocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const res = await fetch("/api/fetchDocument");

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to fetch documents");
          return;
        }

        setDocuments(data.documents);
      } catch (err) {
        console.error(err);
        setError("Network or server error");
      } finally {
        setLoading(false);
      }
    }

    fetchDocuments();
  }, []);

  if (loading) {
    return <p>Loading documents...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>My Documents (Test)</h2>

      {documents.length === 0 && <p>No documents found.</p>}

      <ul>
        {documents.map((doc) => (
          <li key={doc.id}>
            {doc.name}{" "}
            {doc.isOwner && <strong>(Owner)</strong>}
          </li>
        ))}
      </ul>
    </div>
  );
}
