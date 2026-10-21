import { ImageResponse } from "next/og";

import { BRAND_NAME, BRAND_SLOGAN, SITE_URL } from "@/data/brand";

/**
 * The site's Open Graph card, generated rather than shipped as a file.
 *
 * It replaces what every page was pointing at before: `/hero/landscape.webp`,
 * a 2560×1441 photograph with no brand mark on it. A social card is one of the
 * few places the brand name is read as an image rather than as text, so for a
 * coined name it is worth getting right — this one puts the wordmark and the
 * positioning line on it at the exact 1200×630 the platforms crop to.
 *
 * Drawn with plain shapes and system-stacked type: no font is fetched at
 * request time, so the card cannot fail to render because a font host is slow.
 */
export const alt = `${BRAND_NAME} — ${BRAND_SLOGAN}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const host = SITE_URL.replace(/^https?:\/\//, "");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#02080e",
          backgroundImage:
            "radial-gradient(900px 480px at 18% -10%, rgba(0,239,181,0.22), transparent 60%), radial-gradient(760px 420px at 92% 108%, rgba(35,216,255,0.16), transparent 60%)",
          fontFamily: "Helvetica, Arial, sans-serif",
        }}
      >
        {/* Eyebrow */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              background: "#00efb5",
            }}
          />
          <div
            style={{
              color: "#9fd9e2",
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: 6,
              textTransform: "uppercase",
            }}
          >
            AI Trading Journal
          </div>
        </div>

        {/* Wordmark and the positioning line */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              color: "#ffffff",
              fontSize: 104,
              fontWeight: 800,
              letterSpacing: -4,
              lineHeight: 1,
            }}
          >
            {BRAND_NAME}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 26,
              color: "#00efb5",
              fontSize: 42,
              fontWeight: 700,
              letterSpacing: -1.4,
              lineHeight: 1.2,
            }}
          >
            {BRAND_SLOGAN}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 22,
              maxWidth: 940,
              color: "#a9c0c7",
              fontSize: 27,
              lineHeight: 1.45,
            }}
          >
            Understand your trading behaviour — built for Forex and Indian market traders.
          </div>
        </div>

        {/* Foot: the brand rule and the host */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 180,
              height: 5,
              borderRadius: 999,
              background: "linear-gradient(90deg, #00efb5, #23d8ff)",
            }}
          />
          <div style={{ color: "#7f979e", fontSize: 25, fontWeight: 600 }}>{host}</div>
        </div>
      </div>
    ),
    size,
  );
}
