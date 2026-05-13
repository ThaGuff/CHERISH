"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'DM Sans', sans-serif",
          background: "#fffaf7",
          color: "#2c1a0a",
          padding: "2rem",
        }}
      >
        <span style={{ fontSize: "4rem", marginBottom: "1rem" }}>😔</span>
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            marginBottom: "0.5rem",
            fontFamily: "'Playfair Display', serif",
          }}
        >
          Something went wrong
        </h1>
        <p
          style={{
            fontSize: "0.875rem",
            opacity: 0.5,
            marginBottom: "1.5rem",
            textAlign: "center",
            maxWidth: "20rem",
          }}
        >
          We hit an unexpected error. Try refreshing the page.
        </p>
        <button
          onClick={() => reset()}
          style={{
            background: "#c84820",
            color: "white",
            border: "none",
            borderRadius: "1rem",
            padding: "0.75rem 2rem",
            fontSize: "0.875rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
