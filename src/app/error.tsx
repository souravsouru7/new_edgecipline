"use client";

import Link from "next/link";
import { useEffect } from "react";

import { StatusPage, statusStyles } from "@/components/status/StatusPage";

/**
 * The route-level error boundary.
 *
 * Note the prop: Next 16 passes `retry`, not `reset`. It re-fetches and
 * re-renders this boundary's children, so the recovery is a genuine retry of
 * the segment rather than a page reload.
 *
 * `error` is typed `unknown` on purpose — a value thrown inside a Client
 * Component is forwarded as-is and need not be an `Error` at all, so the
 * digest is read only after narrowing. In production the message from a Server
 * Component is replaced by a generic one, which is why the digest is the thing
 * worth showing: it is what matches this page to a line in the server log.
 *
 * Error boundaries must be Client Components, which means no `metadata`
 * export is possible here. The sitewide title stands, which is acceptable —
 * unlike a 404, this is a transient state and not an address anyone shares.
 */
export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    // Nothing is wired to an error reporting service yet, so the console is
    // the honest destination. When one is added, this is the one place to send
    // from.
    console.error(error);
  }, [error]);

  const digest =
    error instanceof Error && "digest" in error && typeof error.digest === "string"
      ? error.digest
      : undefined;

  return (
    <StatusPage
      code="Error"
      title="Something went wrong on our side."
      lede="This one is on us, not on you. Trying again often clears it — the page re-fetches rather than reloading."
    >
      <button className={statusStyles.stPrimary} onClick={() => retry()} type="button">
        Try again
      </button>
      <Link className={statusStyles.stGhost} href="/">
        Back to home
      </Link>
      {digest ? (
        <p className={statusStyles.stDigest}>
          Reference: <strong>{digest}</strong> — quote this if you report it.
        </p>
      ) : null}
    </StatusPage>
  );
}
