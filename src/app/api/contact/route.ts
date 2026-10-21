import { NextResponse, type NextRequest } from "next/server";
import { FieldValue } from "firebase-admin/firestore";

import { getDb } from "@/lib/firebase-admin";
import {
  EMAIL_SHAPE,
  LIMITS,
  badRequest,
  clean,
  cleanMultiline,
  looksAutomated,
  notConfigured,
  requestContext,
  serverError,
} from "@/lib/submissions";

/**
 * POST /api/contact
 *
 * Writes to the `contacts` collection. Field names follow the previous site's
 * contact route — name, email, subject, message — so the two deployments can
 * share a collection if that is ever wanted.
 *
 * Unlike the waitlist there is no de-duplication: someone may legitimately
 * send two messages, and silently dropping the second would lose a real one.
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

  if (looksAutomated(body)) return NextResponse.json({ ok: true });

  const name = clean(body.name, LIMITS.name);
  const email = clean(body.email, LIMITS.email);
  const subject = clean(body.subject ?? body.topic, LIMITS.subject);
  const message = cleanMultiline(body.message, LIMITS.message);

  if (!name) return badRequest("name_required");
  if (!email) return badRequest("email_required");
  if (!EMAIL_SHAPE.test(email)) return badRequest("invalid_email");
  if (!subject) return badRequest("subject_required");
  if (!message) return badRequest("message_required");

  const db = getDb();
  if (!db) return notConfigured();

  try {
    await db.collection("contacts").add({
      name,
      email: email.toLowerCase(),
      subject,
      message,
      submittedAt: new Date().toISOString(),
      createdAt: FieldValue.serverTimestamp(),
      handled: false,
      source: "edgecipline.com",
      ...requestContext(request),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return serverError("contact", error);
  }
}
