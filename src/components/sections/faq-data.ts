/**
 * FAQ content for Section 09.
 *
 * The five questions are transcribed from the reference screenshot. The
 * answers are NOT in the screenshot — every row there is collapsed — so each
 * answer below is assembled only from copy that already exists on this site
 * (the hero summary, the How It Works steps, the Built by Traders paragraph).
 *
 * ──────────────────────────────────────────────────────────────────────────
 * TWO ANSWERS ARE MISSING ON PURPOSE.
 *
 * "Is my trading data secure?" and "When will it be available?" cannot be
 * answered from anything the project already states, and both would mean
 * inventing a security guarantee or a release date. They are left null, and
 * the accordion simply does not render a question until it has an answer.
 *
 * Write the two answers in and they appear — nothing else to change.
 * ──────────────────────────────────────────────────────────────────────────
 */

export type FaqItem = {
  id: string;
  question: string;
  answer: string | null;
};

export const FAQ_ITEMS: readonly FaqItem[] = [
  {
    id: "what",
    question: "What is Edgecipline?",
    answer:
      "Edgecipline is an AI trading journal and discipline coach that helps traders understand their behavior, break bad habits, and build lasting consistency.",
  },
  {
    id: "ai",
    question: "How does the AI analysis work?",
    answer:
      "You import your trading history in seconds. The AI analyses your behavior, patterns and emotional triggers, then turns that into personalized insights you can use to build better habits and consistency.",
  },
  {
    id: "security",
    question: "Is my trading data secure?",
    answer: null,
  },
  {
    id: "audience",
    question: "Who is this for?",
    answer:
      "Edgecipline was born from real trading struggles — the overtrading, the impulsive decisions, the frustration. It is built for traders who want to gain self-awareness, understand their behavior, and trade with a calmer, clearer mind.",
  },
  {
    id: "availability",
    question: "When will it be available?",
    answer: null,
  },
];

/** Only questions that have an approved answer are shown. */
export const answeredFaqItems = () =>
  FAQ_ITEMS.filter((item): item is FaqItem & { answer: string } => item.answer !== null);
