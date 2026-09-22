"use client";

import { useEffect, useState } from "react";

type HealthStatus = {
  status: "ok" | "degraded";
  database: "connected" | "error";
  redis: "connected" | "error";
};

export default function HomePage() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

    fetch(`${apiUrl}/health`)
      .then((res) => {
        if (!res.ok) throw new Error(`Backend responded with ${res.status}`);
        return res.json();
      })
      .then((data: HealthStatus) => setHealth(data))
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <main style={{ maxWidth: 560, margin: "80px auto", padding: "0 20px" }}>
      <h1 style={{ color: "#B4451F" }}>SeatQ</h1>
      <p>Module 0 skeleton — frontend and backend wired together.</p>

      {error && (
        <p style={{ color: "#B4451F" }}>
          Could not reach backend: {error}. Is it running on port 4000?
        </p>
      )}

      {!error && !health && <p>Checking backend connection…</p>}

      {health && (
        <div
          style={{
            border: "1px solid #D9CFC7",
            borderRadius: 8,
            padding: 16,
            marginTop: 16,
          }}
        >
          <p>
            <strong>Overall:</strong> {health.status}
          </p>
          <p>
            <strong>Database:</strong> {health.database}
          </p>
          <p>
            <strong>Redis:</strong> {health.redis}
          </p>
        </div>
      )}
    </main>
  );
}
