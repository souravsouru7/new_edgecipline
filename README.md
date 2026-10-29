# Edgecipline

Marketing site for **Edgecipline** — an AI trading journal and discipline coach
that helps traders understand their behaviour, break bad habits and build
lasting consistency.

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Firebase Admin

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

| Script           | What it does                          |
| ---------------- | ------------------------------------- |
| `npm run dev`    | Dev server (Turbopack)                |
| `npm run build`  | Production build                      |
| `npm run start`  | Serve the production build            |
| `npm run lint`   | ESLint                                |
| `npx tsc --noEmit` | Type-check without emitting         |

### Environment

Create `.env.local`:

```ini
# Optional preview marker. Production canonicals stay on www.edgecipline.com.
# Set this to the preview origin on non-Vercel preview deployments so all pages
# emit noindex. Vercel previews are detected automatically via VERCEL_ENV.
# NEXT_PUBLIC_SITE_URL=https://preview.example.com

# Firebase service account — required only by the two form endpoints below.
# Without it they return 503 and the forms show a fallback contact address.
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# Search-engine ownership tokens. Optional: each meta tag is omitted entirely
# when its variable is unset, so an unverified property never ships an empty
# one. Take the value only — the token, not the whole <meta> tag.
# Google:  Search Console → Add property → HTML tag → content="..."
# Bing:    Webmaster Tools → Add site → Option 2 (HTML meta tag) → content="..."
# NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
# NEXT_PUBLIC_BING_SITE_VERIFICATION=
```

| Variable | Required | What it does |
| -------- | -------- | ------------ |
| `NEXT_PUBLIC_SITE_URL` | no | Marks a non-Vercel preview so every page emits `noindex`. |
| `FIREBASE_PROJECT_ID` / `FIREBASE_CLIENT_EMAIL` / `FIREBASE_PRIVATE_KEY` | for the forms | Waitlist and contact submissions. Absent → both endpoints return 503. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | no | `google-site-verification` meta tag for Search Console. |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION` | no | `msvalidate.01` meta tag for Bing Webmaster Tools. |

### SEO launch checklist

Things outside the code that brand recognition depends on:

- [x] Google Search Console property verified.
- [ ] Vercel → Domains: `edgecipline.com` 301-redirects to `https://www.edgecipline.com`.
- [ ] Production env: `NEXT_PUBLIC_SITE_URL` is unset or exactly `https://www.edgecipline.com`. Any other value makes the whole site `noindex`.
- [ ] Search Console: submit `/sitemap.xml`, then request indexing of `/`.
- [ ] Every social profile in `src/data/brand.ts` (`SOCIAL_PROFILES`) links back to the site and spells the name "Edgecipline".
- [ ] When the Android app is on Google Play, uncomment `sameAs: ["PLAY_STORE_URL_HERE"]` in the SoftwareApplication node in `src/app/layout.tsx` and put the real URL in.

## Layout

```
src/
  app/              routes, and the four global stylesheets
    globals.css       base + Tailwind
    motion.css        the motion layer (see docs/MOTION.md)
    backdrop.css      the continuous page background
    stage.css         the pinned scroll stage
    api/              waitlist + contact endpoints
  components/
    landing/ sections/ hero/ chart/ story/   home page
    about/ blog/ contact/ faq/ features/ founders/ pricing/ legal/
    motion/           reveal, count-up, spotlight, scroll driver
    nav/ waitlist/    shared
  data/             all site copy and content — one module per domain
  lib/              Firebase Admin + submission handling
public/             images actually referenced by the site
scripts/            one-off generators for committed output (see below)
docs/MOTION.md      how the motion system is assembled
```

### Content lives in `src/data`

Copy is **not** inlined in components. Each module in `src/data` is the single
source of truth for its domain, and `src/data/brand.ts` holds the brand entity —
name, URLs, logo, social profiles — that every page's metadata and JSON-LD graph
references by `@id`. Change a fact there and it changes everywhere.

Two deliberate gaps, both documented at their definitions: monthly pricing is
`null` on every plan, and two FAQ answers are `null`. Nothing renders until the
real value is filled in, rather than inventing a price or a release date.

### `scripts/`

Not wired into `package.json` — one-off generators whose output is committed:

- `extract-chart-geometry.mjs` → `src/components/chart/chart-geometry.ts`
- `verify-feature-copy.mts` — audits `src/data/features.ts` against the source
  document, so the /features page stays verbatim:
  ```bash
  node --experimental-strip-types scripts/verify-feature-copy.mts
  ```

`extract-chart-geometry.mjs` reads an asset package that is not in this repo, so
it documents provenance rather than being re-runnable. Kept for that reason.

## Conventions

- **No animation library.** The motion system is CSS plus one shared
  `requestAnimationFrame` driver (`src/components/motion/scroll-driver.ts`).
  Everything honours `prefers-reduced-motion`.
- **No invented facts.** No ratings, no testimonials, no metrics that are not
  measured. Illustrative product previews are labelled as such on the page.
- **`public/` holds only referenced files.** Design sources and 4K originals
  are not kept here — it is a deploy directory, not an asset archive.
