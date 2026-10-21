import "server-only";

import { NextResponse } from "next/server";

/**
 * Shared helpers for the two form endpoints.
 *
 * Both routes take untrusted input from an open internet form and write it to
 * Firestore, so everything here is about keeping that write bounded and the
 * responses uninformative to a prober.
 */

/** Deliberately loose: the browser validates properly, this rejects junk. */
export const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Field caps. Without these a single request can write a document of whatever
 * size the attacker chooses, which costs money and makes the collection
 * unusable. Generous enough that no real message is affected.
 */
export const LIMITS = {
  name: 120,
  email: 254, // the practical maximum length of an address
  phone: 32,
  experience: 60,
  topic: 60,
  subject: 160,
  message: 5000,
} as const;

/** Trim, collapse whitespace and cap. Non-strings become "". */
export function clean(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}

/** Keep newlines (a message needs them) but still trim and cap. */
export function cleanMultiline(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.replace(/\r\n/g, "\n").replace(/[ \t]+/g, " ").trim().slice(0, max);
}

export function badRequest(error: string) {
  return NextResponse.json({ ok: false, error }, { status: 400 });
}

/**
 * The service account is missing or broken. 503 rather than 500: the request
 * was fine, the destination is not, and the UI can tell people to email
 * instead rather than implying they did something wrong.
 */
export function notConfigured() {
  return NextResponse.json(
    { ok: false, error: "storage_unavailable" },
    { status: 503 },
  );
}

/**
 * Something threw. The real reason goes to the server log; the caller gets a
 * generic failure, because error text from a database is reconnaissance.
 */
export function serverError(scope: string, error: unknown) {
  console.error(`[${scope}]`, error);
  return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
}

/**
 * A honeypot field. The form renders an input that is hidden from people and
 * from assistive technology; anything that fills it is automated. We answer
 * `ok` so the bot records a success and does not retry, but write nothing.
 */
export const HONEYPOT_FIELD = "company_website";

export function looksAutomated(body: Record<string, unknown>) {
  return clean(body[HONEYPOT_FIELD], 200).length > 0;
}

/** Request metadata worth storing for abuse triage. No full IP is kept. */
export function requestContext(request: Request) {
  const ua = request.headers.get("user-agent") ?? "";
  return {
    userAgent: ua.slice(0, 300),
    // Country from the CDN when present. The address itself is not stored:
    // it is personal data the privacy policy does not claim to collect.
    country: request.headers.get("x-vercel-ip-country") ?? "",
  };
}
