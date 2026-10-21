"use client";

/**
 * The last resort: an error thrown by the root layout itself.
 *
 * This file *replaces* the root layout when it renders, which has two
 * consequences worth stating, because both are easy to get wrong:
 *
 *   1. It must ship its own `<html>` and `<body>`. There is no layout above
 *      it to provide them.
 *   2. None of the seven stylesheets the layout imports reach it, and neither
 *      do the three self-hosted fonts. So every style here is inline and every
 *      font is a system stack. That is not laziness — a stylesheet that may be
 *      the thing that failed is not a dependency this page can take.
 *
 * `metadata` is not supported in a Client Component, so the tab title comes
 * from React's own `<title>` element.
 *
 * The colours are the sitewide tokens written out literally, for the same
 * reason: `var(--bg)` is defined in a stylesheet that is not loaded here.
 */
export default function GlobalError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  const digest =
    error instanceof Error && "digest" in error && typeof error.digest === "string"
      ? error.digest
      : undefined;

  return (
    // global-error must render the whole document.
    <html lang="en-IN">
      <head>
        <title>Something went wrong — Edgecipline</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* The default 500 document follows the OS colour scheme; the site is
            dark, so say so here rather than flashing white. */}
        <meta name="color-scheme" content="dark" />
      </head>
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          padding: "32px",
          background: "#050914",
          color: "#f5f7fa",
          fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
          lineHeight: 1.6,
        }}
      >
        <main style={{ maxWidth: "34rem", textAlign: "center" }}>
          <p
            style={{
              margin: 0,
              fontFamily: "ui-monospace, 'SFMono-Regular', monospace",
              fontSize: ".8rem",
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: "#758397",
            }}
          >
            Edgecipline
          </p>

          <h1
            style={{
              margin: "18px 0 0",
              fontSize: "clamp(1.8rem, 1.3rem + 2.4vw, 2.75rem)",
              lineHeight: 1.1,
              letterSpacing: "-.02em",
            }}
          >
            Something went wrong.
          </h1>

          <p style={{ margin: "16px 0 0", color: "#a5b4c3" }}>
            The site failed to load rather than the page you asked for. Trying again is worth a
            shot; if it keeps happening, the address below reaches a person.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              justifyContent: "center",
              marginTop: "28px",
            }}
          >
            <button
              onClick={() => retry()}
              type="button"
              style={{
                padding: "13px 22px",
                border: "1px solid transparent",
                borderRadius: "999px",
                background: "linear-gradient(135deg, #39ff88, #38bdf8)",
                color: "#04210f",
                font: "inherit",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            {/* A plain anchor, not next/link: this file replaces the root
                layout, so the router is exactly what may have failed. The
                recovery has to be a full document request, which is the one
                thing next/link will not do. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                padding: "13px 22px",
                border: "1px solid #566e85",
                borderRadius: "999px",
                color: "#f5f7fa",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Reload the site
            </a>
          </div>

          <p style={{ marginTop: "28px", fontSize: ".9rem", color: "#758397" }}>
            <a href="mailto:support@edgecipline.com" style={{ color: "#39ff88" }}>
              support@edgecipline.com
            </a>
            {digest ? (
              <>
                {" · reference "}
                <span style={{ fontFamily: "ui-monospace, monospace" }}>{digest}</span>
              </>
            ) : null}
          </p>
        </main>
      </body>
    </html>
  );
}
