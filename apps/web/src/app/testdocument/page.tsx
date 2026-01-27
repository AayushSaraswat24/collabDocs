"use client";

import { useState } from "react";

export default function TestCreateDocumentPage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function handleCreate() {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/createDocument", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Backend-controlled errors
        setResult(data.message || "Something went wrong");
        return;
      }

      setResult("✅ Document created successfully");
      setName("");
    } catch (error) {
      console.error(error);
      setResult("❌ Network or server error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Create Document (Test)</h2>

      <input
        type="text"
        placeholder="Document name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ marginRight: 8 }}
      />

      <button onClick={handleCreate} disabled={loading || !name}>
        {loading ? "Creating..." : "Create"}
      </button>

      {result && (
        <p style={{ marginTop: 12 }}>
          {result}
        </p>
      )}
    </div>
  );
}
