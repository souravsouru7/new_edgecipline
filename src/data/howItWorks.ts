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
  { number: "01", label: "AI Screenshot Capture", title: "Capture Your Trades", description: "Screenshot a trade. The AI fills in the journal entry for you to review." },
  { number: "02", label: "Behavior Analysis", title: "Discover Your Patterns", description: "As your history grows, Edgecipline identifies the behavioral and psychological patterns in your own trades." },
  { number: "03", label: "Practical Insights", title: "Improve Your Discipline", description: "Get practical insights to improve your discipline and execution." },
] as const;
