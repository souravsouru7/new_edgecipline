import { ImageResponse } from "next/og";

import { BRAND_NAME, SITE_URL } from "@/data/brand";

/**
 * The one Open Graph card design, parameterised.
 *
 * Before this, the site had a single card and every page shared it: a link to
 * an article, to the pricing page and to the home page all previewed as the
 * same picture. That is a wasted signal — the card is the only part of a page
 * most people see before deciding whether to click, and on a platform that
 * strips the description it is the only part they see at all.
 *
 * So: one design, one implementation, a different headline per route. Every
 * card still carries the wordmark, because for a coined brand name the social
 * card is one of the few places the name is read as an image rather than as
 * text, and it needs to be legible every time.
 *
 * Drawn with plain shapes and a system font stack: no font is fetched at
 * render time, so a card can never fail to generate because a font host is
 * slow. `ImageResponse` supports a subset of CSS — flex and absolute
 * positioning, no grid — and every element with more than one child needs an
 * explicit `display`, which is why they are all spelled out below.
 */

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

export type OgCard = {
  /** The small uppercase line above the title. */
  eyebrow: string;
  /** The headline. Kept to roughly 60 characters by the callers. */
  title: string;
  /** One supporting line. Optional — a long title can stand alone. */
  lede?: string;
  /** Replaces the host in the footer, e.g. a publication date. */
  foot?: string;
};

export function ogCard({ eyebrow, title, lede, foot }: OgCard) {
  const host = SITE_URL.replace(/^https?:\/\//, "");

  // The headline shrinks in two steps rather than wrapping off the card. The
  // thresholds are character counts because the font is not measurable here.
  const titleSize = title.length > 78 ? 58 : title.length > 46 ? 70 : 84;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "68px 80px",
          background: "#03060d",
          backgroundImage:
            "radial-gradient(900px 480px at 18% -10%, rgba(0,239,104,0.22), transparent 60%), radial-gradient(760px 420px at 92% 108%, rgba(35,185,255,0.16), transparent 60%)",
          fontFamily: "Helvetica, Arial, sans-serif",
        }}
      >
        {/* Eyebrow: the dot, then the section this card came from. */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 12, height: 12, borderRadius: 999, background: "#00ef68" }} />
          <div
            style={{
              color: "#9dcde4",
              fontSize: 23,
              fontWeight: 700,
              letterSpacing: 6,
              textTransform: "uppercase",
            }}
          >
            {eyebrow}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              color: "#ffffff",
              fontSize: titleSize,
              fontWeight: 800,
              letterSpacing: -2.5,
              lineHeight: 1.05,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>

          {lede ? (
            <div
              style={{
                display: "flex",
                marginTop: 24,
                maxWidth: 940,
                color: "#a8bec8",
                fontSize: 27,
                lineHeight: 1.45,
              }}
            >
              {lede}
            </div>
          ) : null}
        </div>

        {/* Foot: the brand rule, the wordmark, and the host or the date. */}
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div
            style={{
              width: 120,
              height: 5,
              borderRadius: 999,
              background: "linear-gradient(90deg, #00ef68, #23b9ff)",
            }}
          />
          <div style={{ display: "flex", color: "#ffffff", fontSize: 30, fontWeight: 800, letterSpacing: -0.8 }}>
            {BRAND_NAME}
          </div>
          <div style={{ display: "flex", color: "#7e949f", fontSize: 24, fontWeight: 600 }}>
            {foot ?? host}
          </div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
