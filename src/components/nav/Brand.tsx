import Image from "next/image";
import Link from "next/link";

import { BRAND_NAME } from "@/data/brand";

/**
 * The brand mark.
 *
 * The supplied logo is a stacked lockup — the angular "E" above the
 * EDGECIPLINE wordmark and the "Discipline over emotion" line. Stacked, it is
 * very nearly square, and a square mark in a 68px navigation bar can only be
 * about 44px tall, which leaves the wordmark too small to read. So the two
 * pieces of the supplied artwork are set side by side here instead: the real
 * mark and the real wordmark, at the sizes each is legible at, rather than a
 * shrunken lockup or a wordmark re-typed in a different font.
 *
 * Both files are the original artwork with its black plate lifted off (see
 * scripts/build-brand-assets.py). Nothing is redrawn.
 *
 * `variant="stacked"` renders the supplied lockup as supplied, for the places
 * with room for it — the footer and the closing sign-off.
 */
export function Brand({
  className = "",
  variant = "row",
}: {
  className?: string;
  variant?: "row" | "stacked";
}) {
  if (variant === "stacked") {
    return (
      <Link className={`brand brand-stacked ${className}`.trim()} href="/" aria-label={`${BRAND_NAME} home`}>
        <Image src="/brand/logo.webp" alt={BRAND_NAME} width={1200} height={1377} sizes="220px" />
      </Link>
    );
  }

  return (
    <Link className={`brand ${className}`.trim()} href="/" aria-label={`${BRAND_NAME} home`}>
      {/* The mark carries the alt text; the wordmark beside it is the same
          word again, so it is decorative and must not be announced twice. */}
      <Image
        className="brand-mark"
        src="/brand/mark.webp"
        alt={BRAND_NAME}
        width={406}
        height={600}
        priority
        sizes="34px"
      />
      <Image
        className="brand-word"
        src="/brand/wordmark.webp"
        alt=""
        aria-hidden="true"
        width={900}
        height={97}
        priority
        sizes="132px"
      />
    </Link>
  );
}
