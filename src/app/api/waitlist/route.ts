import { NextResponse, type NextRequest } from "next/server";
import { FieldValue } from "firebase-admin/firestore";

import { getDb } from "@/lib/firebase-admin";
import {
  EMAIL_SHAPE,
  LIMITS,
  badRequest,
  clean,
  looksAutomated,
  notConfigured,
  requestContext,
  serverError,
} from "@/lib/submissions";

/**
 * POST /api/waitlist
 *
 * Writes to the same `waitlist` collection the previous site used, with the
 * same field names, so existing entries and any export tooling keep working.
 *
 * Kept from the original: one entry per address, matching both the normalised
 * and the raw spelling because older rows were stored as typed. A repeat is
 * not an error for the visitor — they are on the list — so it still answers
 * `ok`, flagged as a duplicate.
 */
// No route segment config here: this project enables `cacheComponents`,
// which rejects both `runtime` and `dynamic`. Neither is needed anyway —
// route handlers run on Node by default, and a POST is always dynamic.

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return badRequest("invalid_json");
  }

  // Silently accept and discard automated submissions.
  if (looksAutomated(body)) return NextResponse.json({ ok: true });

  const email = clean(body.email, LIMITS.email).toLowerCase();
  const rawEmail = clean(body.email, LIMITS.email);

  if (!rawEmail) return badRequest("email_required");
  if (!EMAIL_SHAPE.test(rawEmail)) return badRequest("invalid_email");

  const db = getDb();
  if (!db) return notConfigured();

  try {
    const existing = await db
      .collection("waitlist")
      .where("email", "in", Array.from(new Set([email, rawEmail])))
      .limit(1)
      .get();

    if (!existing.empty) {
      return NextResponse.json({ ok: true, duplicate: true });
    }

    await db.collection("waitlist").add({
      name: clean(body.name, LIMITS.name),
      email,
      phone: clean(body.phone, LIMITS.phone),
      experience: clean(body.experience, LIMITS.experience),
      // The original stored an ISO string; kept for compatibility with
      // existing rows, with a server timestamp alongside it for ordering.
      submittedAt: new Date().toISOString(),
      createdAt: FieldValue.serverTimestamp(),
      source: "edgecipline.com",
      ...requestContext(request),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return serverError("waitlist", error);
  }
}
