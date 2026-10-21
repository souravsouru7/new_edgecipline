"use client";

import { useId, useRef, useState } from "react";
import { ArrowRight, Check, LoaderCircle, Mail, TriangleAlert } from "lucide-react";

import styles from "./Waitlist.module.css";

const css = (name: string) => styles[name] || name;

/**
 * The waitlist form.
 *
 * Posts to /api/waitlist, which writes to the same Firestore `waitlist`
 * collection the previous site used. The fields are exactly the ones the
 * privacy policy says are collected — email, phone and trading experience,
 * plus a name — so the page and the policy agree.
 *
 * Four states, each with its own message: idle, submitting, done (new or
 * already-on-the-list), and failed. "Already on the list" is deliberately a
 * success, not an error — the person asked to be on the waitlist and they are.
 *
 * The honeypot is a real input, positioned off-screen and marked
 * `aria-hidden` + `tabIndex={-1}`, so no person reaches it and anything that
 * fills it is automated. `autoComplete="off"` keeps browsers from filling it
 * on a visitor's behalf.
 */
type State = "idle" | "sending" | "done" | "duplicate" | "error";

const EXPERIENCE = [
  "Less than 1 year",
  "1–3 years",
  "3–5 years",
  "More than 5 years",
] as const;

export function WaitlistForm() {
  const base = useId();
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const field = (name: string) => `${base}-${name}`;

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state === "sending") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim();

    if (!email) {
      setError("Add your email — it’s how we let you know.");
      form.querySelector<HTMLElement>('[name="email"]')?.focus();
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("That email address doesn’t look right.");
      form.querySelector<HTMLElement>('[name="email"]')?.focus();
      return;
    }

    setError(null);
    setState("sending");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(data)),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.ok) {
        setState("error");
        setError(
          response.status === 503
            ? "The waitlist is temporarily unavailable. Email support@edgecipline.com and we’ll add you."
            : "That didn’t go through. Try again, or email support@edgecipline.com.",
        );
        return;
      }

      setState(result.duplicate ? "duplicate" : "done");
      form.reset();
    } catch {
      setState("error");
      setError("That didn’t go through — check your connection, or email support@edgecipline.com.");
    }
  };

  // Once someone is on the list, the form is replaced by the confirmation
  // rather than sitting there inviting a second identical submission.
  if (state === "done" || state === "duplicate") {
    return (
      <div className={css("wlDone")} role="status">
        <span className={css("wlDoneMark")} aria-hidden="true">
          <Check size={20} strokeWidth={3} />
        </span>
        <div>
          <b>{state === "duplicate" ? "You’re already on the list." : "You’re on the list."}</b>
          <p>
            {state === "duplicate"
              ? "That email is already registered — nothing more to do. We’ll be in touch before launch."
              : "We’ll email you when early access opens. Priority goes to the people who joined first."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <form className={css("wlForm")} ref={formRef} onSubmit={onSubmit} noValidate>
      <div className={css("wlRow")}>
        <div className={css("wlField")}>
          <label htmlFor={field("name")}>Name</label>
          <input id={field("name")} name="name" type="text" placeholder="Your name" autoComplete="name" />
        </div>
        <div className={css("wlField")}>
          <label htmlFor={field("email")}>
            Email <span className={css("wlReq")} aria-hidden="true">*</span>
          </label>
          <input
            id={field("email")}
            name="email"
            type="email"
            placeholder="your@email.com"
            autoComplete="email"
            required
            aria-describedby={error ? `${base}-error` : undefined}
          />
        </div>
      </div>

      <div className={css("wlRow")}>
        <div className={css("wlField")}>
          <label htmlFor={field("phone")}>Phone</label>
          <input id={field("phone")} name="phone" type="tel" placeholder="Optional" autoComplete="tel" />
        </div>
        <div className={css("wlField")}>
          <label htmlFor={field("experience")}>Trading experience</label>
          <select id={field("experience")} name="experience" defaultValue="">
            <option value="">Select</option>
            {EXPERIENCE.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Honeypot: never shown, never focusable, never announced. */}
      <div className={css("wlTrap")} aria-hidden="true">
        <label htmlFor={field("company_website")}>Company website</label>
        <input
          id={field("company_website")}
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {error && (
        <p className={css("wlError")} id={`${base}-error`} role="alert">
          <TriangleAlert aria-hidden="true" size={14} />
          {error}
        </p>
      )}

      <button className={css("wlSubmit")} type="submit" disabled={state === "sending"}>
        {state === "sending" ? (
          <>
            <LoaderCircle className={css("wlSpin")} aria-hidden="true" size={17} />
            Joining…
          </>
        ) : (
          <>
            Join the waitlist
            <ArrowRight aria-hidden="true" size={17} />
          </>
        )}
      </button>

      <p className={css("wlNote")}>
        <Mail aria-hidden="true" size={13} />
        Free to join, no card required. We email you about launch and early access — nothing else.
      </p>
    </form>
  );
}
