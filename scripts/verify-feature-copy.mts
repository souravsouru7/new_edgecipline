/**
 * Audits `src/data/features.ts` against the supplied source document.
 *
 * The /features page renders source copy verbatim, so the only way to know it
 * is still verbatim is to diff it. Run after any edit to either side:
 *
 *   node --experimental-strip-types scripts/verify-feature-copy.mts
 *
 * It checks all 14 features for: index, title, tagline, Problem paragraph,
 * Solution paragraph, every "What you get" bullet, and the anchor id implied
 * by the source's own deep links.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { features } from "../src/data/features.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = join(
  root,
  "Edgecipline_Premium_Features_Page_Prompt_Assets",
  "Edgecipline_Premium_Features_Page_Kit",
  "docs",
  "SOURCE_FEATURE_CONTENT.md",
);

const raw = readFileSync(SOURCE, "utf8");

/**
 * Collapse the markdown's soft wrapping and emphasis to compare plain text.
 *
 * Quote glyphs are folded to their straight forms: the page renders the source
 * copy with typographic apostrophes and quotes, which is a typesetting choice
 * rather than an edit to the words. Everything else must match character for
 * character.
 */
const normalise = (value: string) =>
  value
    .replace(/\*\*?/g, "")
    .replace(/\\/g, "")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, " ")
    .trim();

type Parsed = {
  number: string;
  title: string;
  tagline: string;
  problem: string;
  solution: string;
  benefits: string[];
};

/** The anchor each index is published under, taken from the source's own links. */
const anchors = new Map<string, string>();
for (const [, index, anchor] of raw.matchAll(
  /\[(\d\d)\]\(https:\/\/www\.edgecipline\.com\/features#([a-z-]+)\)/g,
)) {
  anchors.set(index, anchor);
}

/**
 * The document repeats a fixed shape per feature:
 *
 *   NN / "Feature" / "## Title" / tagline / "The Problem" / p /
 *   "The Solution" / p / CTA / "What you get" / bullets
 */
function parseSource(): Parsed[] {
  const lines = raw.split("\n").map((line) => line.trim());
  const out: Parsed[] = [];

  for (let i = 0; i < lines.length; i += 1) {
    if (!/^\d\d$/.test(lines[i]) || lines.slice(i + 1, i + 4).join(" ").indexOf("Feature") === -1) {
      continue;
    }
    const heading = lines.findIndex((line, at) => at > i && line.startsWith("## "));
    if (heading === -1) continue;

    const block: string[] = [];
    for (let j = heading; j < lines.length; j += 1) {
      if (j > heading && /^\d\d$/.test(lines[j])) break;
      if (lines[j]) block.push(lines[j]);
    }

    const at = (label: string) => block.findIndex((line) => line === label);
    const problemAt = at("The Problem");
    const solutionAt = at("The Solution");
    const getAt = at("What you get");
    if (problemAt === -1 || solutionAt === -1 || getAt === -1) continue;

    out.push({
      number: lines[i],
      title: normalise(block[0].slice(3)),
      tagline: normalise(block.slice(1, problemAt).join(" ")),
      problem: normalise(block.slice(problemAt + 1, solutionAt).join(" ")),
      solution: normalise(
        block
          .slice(solutionAt + 1, getAt)
          .filter((line) => !line.startsWith("[") && !line.includes("Join Waitlist"))
          .join(" "),
      ),
      benefits: block
        .slice(getAt + 1)
        .filter((line) => line.startsWith("- "))
        .map((line) => normalise(line.slice(2))),
    });
    i = heading;
  }

  return out;
}

const parsed = parseSource();
const problems: string[] = [];

if (parsed.length !== 14) problems.push(`parsed ${parsed.length} features from the source, expected 14`);
if (features.length !== 14) problems.push(`features.ts has ${features.length} features, expected 14`);

for (const source of parsed) {
  const mine = features.find((feature) => feature.number === source.number);
  if (!mine) {
    problems.push(`${source.number}: missing from features.ts`);
    continue;
  }

  const anchor = anchors.get(source.number);
  if (anchor && anchor !== mine.id) {
    problems.push(`${source.number}: anchor is "${mine.id}", source publishes "#${anchor}"`);
  }

  const compare = (field: string, a: string, b: string) => {
    if (normalise(a) !== normalise(b)) {
      problems.push(`${source.number} ${field}:\n    source: ${b}\n    ours:   ${a}`);
    }
  };

  compare("title", mine.title, source.title);
  compare("tagline", mine.tagline, source.tagline);
  compare("problem", mine.problem, source.problem);
  compare("solution", mine.solution, source.solution);

  if (mine.benefits.length !== source.benefits.length) {
    problems.push(
      `${source.number} benefits: ${mine.benefits.length} bullets, source has ${source.benefits.length}`,
    );
  }
  source.benefits.forEach((benefit, index) => {
    compare(`benefit ${index + 1}`, mine.benefits[index] ?? "", benefit);
  });
}

if (problems.length) {
  console.error(`✗ ${problems.length} mismatch(es) against the source document:\n`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}

console.log(`✓ all ${features.length} features match the source document verbatim`);
console.log(`  anchors: ${features.map((feature) => `#${feature.id}`).join(" ")}`);
