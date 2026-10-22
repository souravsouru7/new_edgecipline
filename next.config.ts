import type { NextConfig } from "next";

/**
 * Response headers.
 *
 * Applied to every path. None of them change what the pages render — they
 * constrain what a browser will do with the response, which is the part a
 * static marketing site can still get wrong.
 *
 *   Strict-Transport-Security  the canonical origin is https-only. Two years,
 *                              subdomains included, and `preload` so the first
 *                              request on a new device is never plaintext.
 *                              Note this is a commitment: every current and
 *                              future subdomain must serve valid TLS.
 *   X-Content-Type-Options     stop content-type sniffing. The site serves
 *                              generated text/plain (llms.txt) and generated
 *                              images, and neither should ever be re-guessed.
 *   Referrer-Policy            send the origin cross-site, the full path
 *                              same-site. Enough for analytics, nothing leaked
 *                              about which page someone came from.
 *   X-Frame-Options            nothing here is meant to be embedded, and a
 *                              marketing site in someone else's frame is
 *                              usually a phishing shell.
 *   Permissions-Policy         the site asks for no camera, microphone,
 *                              geolocation or payment APIs; saying so denies
 *                              them to any third-party script that appears
 *                              later without a review.
 *
 * Deliberately absent: Content-Security-Policy. See the note at the bottom of
 * this file — it is a decision, not an oversight.
 */
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,

  /**
   * AVIF first, WebP second.
   *
   * Every source image in `/public` is already WebP, but the optimiser
   * re-encodes on the way out and AVIF is materially smaller at the same
   * quality — worth it for the one heavy photograph on the landing page.
   * WebP stays as the fallback; the browser picks by `Accept`.
   *
   * `minimumCacheTTL` is a year: these are content-addressed by the `w` and
   * `q` query, so a changed image is a changed URL and there is nothing to
   * invalidate.
   */
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31_536_000,
  },

  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      /**
       * The two generated text files for AI retrieval. They are rebuilt on
       * every deploy and cost nothing to fetch, so a short shared cache with
       * a long stale window keeps a crawler fast without ever serving a
       * version that is a deploy behind for long.
       */
      {
        source: "/:file(llms.txt|llms-full.txt)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=300, stale-while-revalidate=86400" },
        ],
      },
    ];
  },

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  // Hide the Next.js dev build-activity badge (the "N" circle at the bottom-left
  // in development) so it does not sit over the paper landing surface.
  devIndicators: false,
};

export default nextConfig;

/* ─────────────────────────────────────────────────────────────────────────────
   ON THE ABSENCE OF A CONTENT-SECURITY-POLICY

   A CSP was considered and deliberately not added, because on this site the
   two ways of doing it each cost something real:

   • Nonce-based. The nonce has to be generated per request, which means
     reading a request header, which makes every page dynamic. This site is
     thirty statically prerendered routes with `cacheComponents` on; a nonce
     would turn all of them into server renders. That is a large, permanent
     performance cost to mitigate a risk this site does not carry — there is
     no user input rendered anywhere, no authentication, and no third-party
     script.

   • Hash-based. Workable in principle, but every page emits its own inline
     JSON-LD block, so the policy would need a hash per page and would break
     silently the next time any schema field changes.

   The honest position: add a CSP when the site gains a third-party script
   (analytics, a chat widget, an embedded video), because that is the point at
   which it starts protecting something. Until then it would be ceremony with
   a measurable cost. This is an owner decision, documented here rather than
   quietly made.
   ──────────────────────────────────────────────────────────────────────────── */
