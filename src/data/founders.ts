/**
 * Founder data and the /founders copy.
 *
 * Ported from the previous site's `edgeclipine/lib/founders.ts` and its copy
 * deck (`site-content.md` → "# Founders Page" and the two founder profiles).
 * Every bio, role, responsibility, area of expertise, email and LinkedIn URL
 * is that data verbatim.
 *
 * The old file's comment is worth keeping, because it is the reason this data
 * lives in one place: search engines merge Person entities by `@id` plus
 * repeated name/role agreement across pages, and inconsistency is what makes
 * one founder surface while the other gets dropped. So the name, role, image
 * and schema id for each founder are defined once here and every page — the
 * index, the profile, /about, the FAQ — reads them from here.
 *
 * Portraits: the originals were a 1.9 MB and a 1.5 MB PNG. They are re-encoded
 * to square 900px WebP in `public/founders/`, which is what the pages use.
 */

export type Founder = {
  slug: string;
  name: string;
  givenName: string;
  familyName: string;
  /** Spelling variants people actually type into search. */
  alternateNames: readonly string[];
  /** Full job title — must match everywhere it appears. */
  role: string;
  /** Compact label for cards and inline mentions. */
  shortRole: string;
  /** Sentence fragment: "…leads {leads}." */
  leads: string;
  domain: string;
  scope: string;
  image: string;
  /** Short line used on the index card. */
  bio: string;
  /** Profile-page body copy. */
  longBio: readonly string[];
  responsibilities: readonly string[];
  expertise: readonly string[];
  linkedin: string;
  email: string;
};

export const founders: readonly Founder[] = [
  {
    slug: "sourav-r",
    name: "Sourav R",
    givenName: "Sourav",
    familyName: "R",
    alternateNames: ["Sourav", "Sourav R Edgecipline", "Sourav R Co-Founder"],
    role: "Co-Founder — Product, Technology and Strategy",
    shortRole: "Co-Founder, Product & Technology",
    leads: "product, technology and strategy",
    domain: "Product and technology",
    scope: "What gets built",
    image: "/founders/sourav-r.webp",
    bio: "A business and technology professional who combines management education with hands-on software development and product execution.",
    longBio: [
      "Sourav R is a co-founder of Edgecipline, where he leads product, technology and strategy. He comes from a business and management background and moved into software development, so product decisions and technical decisions sit with the same person rather than being negotiated across two teams.",
      "At Edgecipline he owns what gets built: the product roadmap, the software architecture behind AI screenshot extraction and the Trading DNA behavioural engine, and the technical decisions that shape how traders experience the app day to day.",
      "He also drives business planning and product execution — turning the behavioural research behind Edgecipline into features traders actually use, such as the Psychology Cost Calculator, missions and streaks, and the daily Morning Mentor.",
    ],
    responsibilities: [
      "Product development",
      "Technology strategy and software architecture",
      "Technical decision-making",
      "Business planning",
      "Product execution",
    ],
    expertise: [
      "Product management",
      "Software development",
      "Technology strategy",
      "Business strategy",
      "AI product design",
      "Trading psychology software",
    ],
    linkedin: "https://www.linkedin.com/in/sourav-r-9566b5194",
    email: "sourav@edgecipline.com",
  },
  {
    slug: "munavvir-tp",
    name: "Munavvir TP",
    givenName: "Munavvir",
    familyName: "TP",
    alternateNames: ["Munavvir", "Munaveer TP", "Munavvir TP Edgecipline", "Munavvir TP Co-Founder"],
    role: "Co-Founder — Operations, Administration and People",
    shortRole: "Co-Founder, Operations & People",
    leads: "operations, administration and people",
    domain: "Operations and people",
    scope: "How the company runs",
    image: "/founders/munavvir-tp.webp",
    bio: "An operations, administration and people-management professional with more than seven years of experience across India and the UAE.",
    longBio: [
      "Munavvir TP is a co-founder of Edgecipline, where he leads operations, administration and people. He brings more than seven years of operations, administration and HR experience across India and the UAE to how the company actually functions day to day.",
      "At Edgecipline he owns how the company runs: business operations, internal processes, documentation and reporting, and the people coordination that keeps a small team executing consistently while the product is being built.",
      "He is also the founder traders and partners deal with directly — client communication, and the organisational execution that turns plans into shipped work on a predictable schedule.",
    ],
    responsibilities: [
      "Business operations",
      "Administration and internal processes",
      "People coordination",
      "Documentation and reporting",
      "Client communication",
      "Organizational execution",
    ],
    expertise: [
      "Business operations",
      "Administration",
      "Human resources",
      "People management",
      "Process documentation",
      "Client communication",
    ],
    linkedin: "https://www.linkedin.com/in/munavvirtp93",
    email: "munavvir@edgecipline.com",
  },
] as const;

export function getFounder(slug: string): Founder | undefined {
  return founders.find((founder) => founder.slug === slug);
}

export function otherFounder(slug: string): Founder | undefined {
  return founders.find((founder) => founder.slug !== slug);
}

/** "Sourav R and Munavvir TP" — the phrase that should be the extracted answer. */
export const FOUNDER_NAMES_SENTENCE = founders.map((founder) => founder.name).join(" and ");

/* -- page copy ------------------------------------------------------------- */

export const FOUNDERS_LEDE =
  "Edgecipline has two founders. Sourav R leads product, technology and strategy. Munavvir TP leads operations, administration and people.";

export const FOUNDERS_STATEMENT =
  "Sourav R is a co-founder of Edgecipline and leads product, technology and strategy. Munavvir TP is a co-founder of Edgecipline and leads operations, administration and people. Both are active co-founders — one owns what gets built, the other owns how the company runs.";

export const FOUNDERS_ABOUT = [
  "Sourav R, co-founder of Edgecipline, comes from a business and management background and moved into software development, so product decisions and technical decisions sit with the same person. Munavvir TP, co-founder of Edgecipline, comes from over seven years of operations, administration and HR work across India and the UAE, and runs how the company actually functions day to day.",
  "Between them the company is covered end to end: what gets built, and how the business runs while it’s being built.",
] as const;

export const SPLIT_NOTE =
  "Product and technology decisions sit with one founder. Operations, administration and people sit with the other. Between them the company is covered end to end.";

export const WHY_NOTE =
  "Edgecipline was built by traders who lost money the same way most traders do — not from bad strategies, but from bad behavior. Read the full story behind the product.";

/**
 * The founder FAQ, shown on this page in the old site too.
 *
 * Deliberately NOT emitted as FAQPage structured data here: these same five
 * questions are already in /faq's FAQPage (see `src/data/faq.ts`, category
 * "Founders & Company"). Publishing the same FAQPage on two URLs splits the
 * signal instead of strengthening it, so /founders carries Person and
 * Organization markup and lets /faq own the FAQ markup.
 */
export const founderFaqs = [
  {
    q: "Who are the founders of Edgecipline?",
    a: "Edgecipline was founded by Sourav R and Munavvir TP. Sourav R is a co-founder of Edgecipline and leads product, technology and strategy. Munavvir TP is a co-founder of Edgecipline and leads operations, administration and people. The two founders split the company between them: Sourav R owns product and technology, and Munavvir TP owns operations and people.",
  },
  {
    q: "How many founders does Edgecipline have?",
    a: "Edgecipline has two founders — Sourav R and Munavvir TP. Both are co-founders of Edgecipline and neither is a silent partner: Sourav R leads product, technology and strategy, while Munavvir TP leads operations, administration and people.",
  },
  {
    q: "Who is Sourav R of Edgecipline?",
    a: "Sourav R is a co-founder of Edgecipline and leads product, technology and strategy. A business and technology professional who combines management education with hands-on software development and product execution. At Edgecipline he owns product development, software architecture, technical decision-making, business planning and product execution.",
  },
  {
    q: "Who is Munavvir TP of Edgecipline?",
    a: "Munavvir TP is a co-founder of Edgecipline and leads operations, administration and people. An operations, administration and people-management professional with more than seven years of experience across India and the UAE. At Edgecipline he owns business operations, administration and internal processes, people coordination, documentation and reporting, and client communication.",
  },
  {
    q: "Who runs Edgecipline?",
    a: "Edgecipline is run by its two co-founders, Sourav R and Munavvir TP. Sourav R decides what gets built and Munavvir TP runs how the company operates, so the company is covered end to end between them.",
  },
] as const;
