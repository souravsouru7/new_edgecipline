/**
 * The three How It Works steps, as plain text.
 *
 * Read by the homepage cards (ReferenceLanding), the HowItWorks component and
 * the homepage `HowTo` schema, so the on-screen wording and the
 * machine-readable wording cannot drift apart. Kept out of HowItWorks.tsx
 * because CSS modules are not scoped in this project: importing that file
 * from the homepage would pull its stylesheet in with it.
 */
export const stepCopy = [
  { number: "01", title: "Upload Your Trades", description: "Screenshot a trade. The AI fills in the journal entry." },
  { number: "02", title: "AI Analysis", description: "Our AI analyses your behavior, patterns and emotional triggers." },
  { number: "03", title: "Learn & Improve", description: "Get personalized insights to build better habits and consistency." },
] as const;
