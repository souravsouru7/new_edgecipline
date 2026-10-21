import "server-only";

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

/**
 * Firestore admin client.
 *
 * Credentials come from FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL /
 * FIREBASE_PRIVATE_KEY — the same service account the previous site used. The
 * private key is stored with literal `\n` sequences in the env file, as env
 * files cannot hold real newlines, so it is unescaped here.
 *
 * Two deliberate differences from the previous implementation:
 *
 *   * `import "server-only"` makes it a build error for any client component
 *     to pull this module in. A service-account key reaching a client bundle
 *     is the worst outcome available here, so it is worth a hard guard rather
 *     than a convention.
 *   * It returns `null` when unconfigured instead of casting null to a
 *     Firestore. The old version did the cast, which turned a missing
 *     environment variable into "cannot read property 'collection' of null"
 *     deep inside a request. The routes check for null and answer with a clear
 *     503 instead.
 */
let cached: Firestore | null | undefined;

export function getDb(): Firestore | null {
  if (cached !== undefined) return cached;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    cached = null;
    return cached;
  }

  try {
    if (!getApps().length) {
      initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
    }
    cached = getFirestore();
  } catch (error) {
    // A malformed key throws here rather than on first query. Log it once and
    // let the routes report the outage; never surface the reason to a caller.
    console.error("[firebase] admin init failed:", error);
    cached = null;
  }

  return cached;
}

/** True when the service account is present and usable. */
export function isConfigured() {
  return getDb() !== null;
}
