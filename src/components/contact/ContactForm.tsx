"use client";

import { useId, useState } from "react";
import { ArrowRight, Check, Copy, LoaderCircle, Mail, TriangleAlert } from "lucide-react";

import { CONTACT_EMAIL, topics } from "@/data/contact";
import styles from "./Contact.module.css";

const css = (name: string) => styles[name] || name;

/**
 * The contact form.
 *
 * Posts to /api/contact, which writes to the Firestore `contacts` collection.
 * (It used to compose a mailto draft, because the project had no backend; that
 * is no longer true.) The address stays on the page beside it, because some
 * people would rather mail than fill anything in — and because it is the
 * fallback every error state points at.
 *
 * Everything else behaves like a real form: native `<input>`, `<select>` and
 * `<textarea>` with labels, required fields, `aria-describedby` on the error,
 * validation that reports the first offending field and focuses it, and a
 * live-region confirmation once the draft is handed over.
 */
export function ContactForm() {
  const base = useId();
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const field = (name: string) => `${base}-${name}`;

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;
    const form = event.currentTarget;
    const data = new FormData(form);

    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const topic = String(data.get("topic") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    // Report the first problem and put the cursor on it, rather than listing
    // everything that is wrong at once.
    const problem =
      (!name && ["name", "Add your name so we know who we’re replying to."]) ||
      (!email && ["email", "Add your email address — it’s how we reply."]) ||
      (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && [
        "email",
        "That email address doesn’t look right.",
      ]) ||
      (!topic && ["topic", "Pick a topic so your message reaches the right person."]) ||
      (!message && ["message", "Add a message — even a line or two is fine."]) ||
      null;

    if (problem) {
      const [which, text] = problem as [string, string];
      setError(text);
      setSent(false);
      form.querySelector<HTMLElement>(`[name="${which}"]`)?.focus();
      return;
    }

    setError(null);
    setSending(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...Object.fromEntries(data), name, email, subject: topic, message }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.ok) {
        // Every failure points at the address, which always works.
        setError(
          response.status === 503
            ? `Messages are temporarily unavailable. Email ${CONTACT_EMAIL} and we will pick it up.`
            : `That did not send. Try again, or email ${CONTACT_EMAIL}.`,
        );
        return;
      }

      setSent(true);
      form.reset();
    } catch {
      setError(`That did not send — check your connection, or email ${CONTACT_EMAIL}.`);
    } finally {
      setSending(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be refused; the address is visible either way.
      setCopied(false);
    }
  };

  return (
    <div className={css("ctFormCard")}>
      <header className={css("ctFormHead")}>
        <h2 id="contact-form-title">Send us a message</h2>
        <p>
          We read every message and reply within 24–48 hours on business days.
        </p>
      </header>

      <form onSubmit={onSubmit} noValidate aria-labelledby="contact-form-title">
        <div className={css("ctFields")}>
          <div className={css("ctRow")}>
            <div className={css("ctField")}>
              <label htmlFor={field("name")}>
                Name <span className={css("ctRequired")} aria-hidden="true">*</span>
              </label>
              <input
                id={field("name")}
                name="name"
                type="text"
                placeholder="Your name"
                autoComplete="name"
                required
              />
            </div>

            <div className={css("ctField")}>
              <label htmlFor={field("email")}>
                Email <span className={css("ctRequired")} aria-hidden="true">*</span>
              </label>
              <input
                id={field("email")}
                name="email"
                type="email"
                placeholder="your@email.com"
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className={css("ctField")}>
            <label htmlFor={field("topic")}>
              Subject <span className={css("ctRequired")} aria-hidden="true">*</span>
            </label>
            <select id={field("topic")} name="topic" defaultValue="" required>
              <option value="" disabled>
                Select a topic
              </option>
              {topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>

          <div className={css("ctField")}>
            <label htmlFor={field("message")}>
              Message <span className={css("ctRequired")} aria-hidden="true">*</span>
            </label>
            <textarea
              id={field("message")}
              name="message"
              placeholder="Tell us what’s on your mind..."
              aria-describedby={error ? `${base}-error` : undefined}
              required
            />
          </div>

          {/* Honeypot: off-screen, unfocusable, never announced. */}
          <div className={css("ctTrap")} aria-hidden="true">
            <label htmlFor={field("company_website")}>Company website</label>
            <input id={field("company_website")} name="company_website" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          {error && (
            <p className={css("ctError")} id={`${base}-error`} role="alert">
              <TriangleAlert aria-hidden="true" size={14} />
              {error}
            </p>
          )}
        </div>

        <div className={css("ctFormFoot")}>
          <button className={css("ctSubmit")} type="submit" disabled={sending}>
            {sending ? (
              <>
                <LoaderCircle className={css("ctSpin")} aria-hidden="true" size={17} />
                Sending…
              </>
            ) : (
              <>
                <Mail aria-hidden="true" size={17} />
                Send message
                <ArrowRight aria-hidden="true" size={15} />
              </>
            )}
          </button>

          <p className={css("ctFormNote")}>
            No mail app? Copy the address instead —{" "}
            <button className={css("ctCopy")} type="button" data-done={copied ? "" : undefined} onClick={copy}>
              {copied ? <Check aria-hidden="true" size={13} /> : <Copy aria-hidden="true" size={13} />}
              {copied ? "Copied" : CONTACT_EMAIL}
            </button>
          </p>
        </div>

        {/* The live region is always present so the confirmation is announced
            when it arrives; the panel itself only renders once there is
            something to show, so no empty box sits under the button. */}
        <p className="sr-only" role="status">
          {sent ? "Message sent. We will reply within 24 to 48 hours." : ""}
        </p>
        {sent && (
          <p className={css("ctOpened")}>
            <Check aria-hidden="true" size={15} />
            Message sent — we’ll get back to you within 24–48 hours.
          </p>
        )}
      </form>
    </div>
  );
}
