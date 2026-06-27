"use client";
// app/global-error.js
//
// Catches errors thrown by the root layout (app/layout.js) itself —
// those escape app/error.js because error.js only wraps the layout's
// *children*, not the layout component. global-error.js must render its
// own <html> and <body> since the normal layout is unavailable.

import { RotateCcw } from "lucide-react";

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily: "monospace",
          background: "#0d1117",
          color: "#e6edf3",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 400, padding: "2rem" }}>
          <p
            style={{
              fontSize: "0.7rem",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "#f85149",
              marginBottom: "1rem",
            }}
          >
            critical error
          </p>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 900,
              marginBottom: "0.75rem",
            }}
          >
            Failed to render layout
          </h2>
          <p
            style={{
              fontSize: "0.875rem",
              color: "#8b949e",
              marginBottom: "1.5rem",
            }}
          >
            A fatal error occurred in the application shell. Click retry to
            attempt recovery.
          </p>
          {process.env.NODE_ENV === "development" && (
            <pre
              style={{
                fontSize: "0.75rem",
                color: "#f85149",
                background: "rgba(248,81,73,0.1)",
                border: "1px solid rgba(248,81,73,0.2)",
                borderRadius: 8,
                padding: "0.75rem",
                textAlign: "left",
                overflow: "auto",
                maxHeight: 120,
                marginBottom: "1.5rem",
              }}
            >
              {error?.message}
            </pre>
          )}
          <button
            onClick={reset}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "0.625rem 1.25rem",
              background: "#0d8a9e",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontFamily: "monospace",
              fontSize: "0.875rem",
              cursor: "pointer",
            }}
          >
            ↺ retry
          </button>
        </div>
      </body>
    </html>
  );
}
